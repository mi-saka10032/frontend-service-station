---
title: 下载功能实现
order: 17

tag:
  - Rust下载功能
  - 流式下载
  - 多线程下载
---

使用 Rust 实现了类似浏览器的下载功能：根据可下载 URL 链接，执行流式下载保存到本地 .tmp 临时文件，下载完成后更新为完整文件。

用 3 种方法分别进行了实现。

## 版本与依赖

rust 版本：rustc 1.80.0 (051478957 2024-07-21)

```toml
[dependencies]
reqwest = { version = "0.11", features = ["json", "stream"] }  # 必须启用 stream 特性
bytes = "1.3.0"                   # 新增 bytes 依赖
tokio = { version = "1.0", features = ["full", "rt-multi-thread"] }
futures-util = "0.3.28"
humansize = "2.1.3"
```

## 方案 1:普通流式下载

这是最简单最直接的方案，通过字节流持续写入临时文件，字节流响应完成后将临时文件更名为最终文件。

### 实现代码

```rust
use futures_util::StreamExt;
use reqwest::Client;
use std::sync::{Arc, Mutex};
use std::time::Duration;
use tokio::fs::File;
use tokio::io::AsyncWriteExt;
use tokio::time::{self, Instant};

const URL: &str = "https://autopatchcn.yuanshen.com/client_app/update/hk4e_cn/audio_zh-cn_5.3.0_5.4.0_hdiff_KVKBwMMBdSYZfIUS.zip";
const FINAL_FILE: &str = "audio_zh-cn_5.3.0_5.4.0_hdiff_KVKBwMMBdSYZfIUS.zip";

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // 共享下载进度计数器
    let counter = Arc::new(Mutex::new(0u64));

    let temp_file = String::from(FINAL_FILE) + ".tmp";
    let timer = Instant::now();

    // 启动进度显示任务
    let progress_counter = counter.clone();
    let progress_task = tokio::spawn(async move {
        let mut interval = time::interval(Duration::from_secs(1));
        loop {
            interval.tick().await;
            let downloaded = *progress_counter.lock().unwrap();
            println!(
                "已下载: {}",
                humansize::format_size(downloaded, humansize::DECIMAL)
            );
        }
    });

    // 创建 HTTP 客户端
    let client = Client::new();
    let response = client.get(URL).send().await?;

    // 创建临时文件
    let mut file = File::create(&temp_file).await?;

    // 重点：流式下载
    let mut stream = response.bytes_stream();
    while let Some(chunk) = stream.next().await {
        let chunk = chunk?;
        file.write_all(&chunk).await?;

        // 更新下载计数器
        let mut counter = counter.lock().unwrap();
        *counter += chunk.len() as u64;
    }

    // 关闭文件确保所有内容写入磁盘
    file.sync_all().await?;

    // 重命名文件
    tokio::fs::rename(temp_file, FINAL_FILE).await?;

    progress_task.abort();

    println!("下载完成！总耗时:{:.2}s", timer.elapsed().as_secs_f64());
    Ok(())
}
```

## 方案 2:流式下载+分块写入

在流式下载方案的基础上增加了一个缓冲线程，当缓存的字节流达到一定体积时再执行写入，直到最后下载完成将剩余的字节流写入。相较于传统方案，降低了磁盘文件的写入频率，对机械硬盘更加友好，而固态硬盘的 IO 效率提升则不会太明显。

整体功能进一步解耦，分为四线程执行任务：网络下载任务、缓冲处理任务、文件写入任务、进度显示任务，因此引入两条 Channel 用于线程间通信

### 方案流程

```txt
# 简易版时序
[网络流] --> buffer_task --(分块)--> write_task --> 文件
       ↑                    |
       |                    |
       +--[控制信号]---------+
```

```txt
# 完整版
┌──────────────────────────────┐
│          网络下载任务           │
│      (network_task)          │
└──────────────┬───────────────┘
               │ 通过network_tx通道
               ▼ 发送Bytes类型数据块
┌──────────────────────────────┐
│          缓冲处理任务           │
│       (buffer_task)          │
├──────────────────────────────┤
│ 1. 接收网络数据块              │
│ 2. 累积到BytesMut缓冲区        │
│ 3. 当达到CHUNK_SIZE(16MB)时    │
│    执行split_to().freeze()    │
│ 4. 通过buffer_tx发送压缩数据块  │
│ 5. 发送剩余数据(buffer.into()) │
└──────────────┬───────────────┘
               │ 通过buffer_tx通道
               ▼ 发送冻结后的Bytes数据
┌──────────────────────────────┐
│          文件写入任务           │
│       (write_task)           │
├──────────────────────────────┤
│ 1. 持续接收数据块写入临时文件     │
│ 2. 执行fsync确保数据落盘         │
│ 3. 原子重命名为最终文件          │
└──────────────┬───────────────┘
               │ 触发最终校验
               ▼
┌──────────────────────────────┐
│         文件校验逻辑           │
│ 比对下载大小与文件实际大小       │
└──────────────────────────────┘

┌──────────────────────────────┐
│        进度显示任务            │
│     (progress_task)          │
├──────────────────────────────┤
│ 定时读取原子变量：              │
│  - total_size (总大小)         │
│  - downloaded (已下载量)       │
│ 计算下载速度和百分比            │
└──────────────────────────────┘

数据共享关系：
      ▲           ▲
      │           │
      └───┬───┬───┘
          │   │
  ┌───────▼───▼───────┐
  │  原子变量共享区     │
  │ - total_size      │
  │ - downloaded      │
  └───────────────────┘
```

### 实现代码

```rust
use bytes::{Bytes, BytesMut};
use futures_util::StreamExt;
use reqwest::Client;
use std::{
    path::Path,
    sync::{
        atomic::{AtomicU64, Ordering},
        Arc,
    },
};
use tokio::{
    fs::{self, File},
    io::AsyncWriteExt,
    sync::mpsc,
    time::{interval, Duration, Instant},
};

// 定义统一错误类型
#[derive(Debug)]
enum AppError {
    Io(std::io::Error),
    Reqwest(reqwest::Error),
    Channel(tokio::sync::mpsc::error::SendError<Bytes>),
    Join(tokio::task::JoinError),
}

// 实现From trait
impl From<std::io::Error> for AppError {
    fn from(err: std::io::Error) -> Self {
        AppError::Io(err)
    }
}

impl From<reqwest::Error> for AppError {
    fn from(err: reqwest::Error) -> Self {
        AppError::Reqwest(err)
    }
}

impl From<tokio::sync::mpsc::error::SendError<Bytes>> for AppError {
    fn from(err: tokio::sync::mpsc::error::SendError<Bytes>) -> Self {
        AppError::Channel(err)
    }
}

impl From<tokio::task::JoinError> for AppError {
    fn from(err: tokio::task::JoinError) -> Self {
        AppError::Join(err)
    }
}

impl std::fmt::Display for AppError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            AppError::Io(e) => write!(f, "IO错误: {}", e),
            AppError::Reqwest(e) => write!(f, "网络错误: {}", e),
            AppError::Channel(e) => write!(f, "通道错误: {}", e),
            AppError::Join(e) => write!(f, "任务错误: {}", e),
        }
    }
}

impl std::error::Error for AppError {}

// 常量定义
const URL: &str = "https://autopatchcn.yuanshen.com/client_app/update/hk4e_cn/audio_zh-cn_5.3.0_5.4.0_hdiff_KVKBwMMBdSYZfIUS.zip";
const FINAL_FILE: &str = "audio_zh-cn_5.3.0_5.4.0_hdiff_KVKBwMMBdSYZfIUS.zip";
const CHUNK_SIZE: usize = 16 * 1024 * 1024;

/// 跨平台原子重命名
async fn atomic_rename(temp: &str, final_path: &str) -> Result<(), AppError> {
    #[cfg(target_os = "windows")]
    {
        if fs::try_exists(final_path).await? {
            fs::remove_file(final_path).await?;
        }
    }
    fs::rename(temp, final_path).await?;
    Ok(())
}

#[tokio::main]
async fn main() -> Result<(), AppError> {
    let temp_file = String::from(FINAL_FILE) + ".tmp";

    // 清理旧临时文件
    if Path::new(&temp_file).exists() {
        fs::remove_file(&temp_file).await?;
    }

    // 初始化文件系统
    let mut file = File::create(&temp_file).await?;

    // 创建网络线程与缓冲线程通道
    let (network_tx, mut network_rx) = mpsc::channel::<Bytes>(16);

    // 创建缓冲线程与写入线程通道
    let (buffer_tx, mut buffer_rx) = mpsc::channel::<Bytes>(16);

    // 进度监控
    let total_size = Arc::new(AtomicU64::new(0));
    let downloaded = Arc::new(AtomicU64::new(0));
    let start_time = Instant::now();
    let timer = Instant::now();

    // 网络任务（增加显式关闭）
    let network_task: tokio::task::JoinHandle<Result<(), AppError>> = tokio::spawn({
        let client = Client::builder().build()?;
        let total_size = total_size.clone();

        async move {
            let response = client.get(URL).send().await?;

            // 更新文件总大小计数
            if let Some(size) = response.content_length() {
                total_size.store(size, Ordering::Relaxed);
            }

            let mut stream = response.bytes_stream();
            while let Some(chunk) = stream.next().await {
                let chunk = chunk?;
                network_tx.send(chunk).await?;
            }

            // 字节流响应完成后 显式关闭网络通道
            drop(network_tx);
            println!("1.网络下载任务完成");

            Ok::<_, AppError>(())
        }
    });

    // 缓冲任务（优化退出逻辑）
    let buffer_task = tokio::spawn({
        let downloaded = downloaded.clone();

        async move {
            let mut buffer = BytesMut::with_capacity(CHUNK_SIZE);

            // 明确退出条件：下载任务完成 网络通道关闭recv接收 退出循环
            while let Some(chunk) = network_rx.recv().await {
                // 追加新chunk数据到buffer
                buffer.extend_from_slice(&chunk);

                // 计算已下载chunk总体积
                downloaded.fetch_add(chunk.len() as u64, Ordering::Relaxed);

                // 缓冲区数据量达到分块大小时发送数据块
                let cur_len = buffer.len();
                if cur_len >= CHUNK_SIZE {
                    let data = buffer.split_to(cur_len).freeze();
                    buffer_tx.send(data).await?;
                }
            }

            // 发送剩余数据
            if !buffer.is_empty() {
                buffer_tx.send(buffer.into()).await?;
            }

            // 关闭缓冲通道
            drop(buffer_tx);
            println!("2.缓冲处理任务完成");

            Ok::<_, AppError>(())
        }
    });

    // 写入任务（确保后续执行）
    let write_task = tokio::spawn(async move {
        // 直到缓冲通道关闭前，持续接收数据流写入文件
        while let Some(data) = buffer_rx.recv().await {
            file.write_all(&data).await?;
        }

        file.sync_all().await?;
        drop(file);

        // 正式重命名文件
        atomic_rename(&temp_file, FINAL_FILE).await?;

        println!("3.文件写入任务完成");
        Ok::<_, AppError>(())
    });

    // 进度显示任务
    let progress_task = tokio::spawn({
        let total_size = total_size.clone();
        let downloaded = downloaded.clone();
        let start_time = start_time.clone();

        async move {
            let mut interval = interval(Duration::from_secs(1));
            loop {
                interval.tick().await;

                let downloaded = downloaded.load(Ordering::Relaxed);
                let total = total_size.load(Ordering::Relaxed);

                if total == 0 {
                    println!("下载中: 等待服务器响应...");
                    continue;
                }

                let percent = (downloaded as f64 / total as f64) * 100.0;
                let speed = downloaded as f64 / start_time.elapsed().as_secs_f64() / 1024.0;

                println!(
                    "进度: {:.2}% | 速度: {:.2} KB/s | 已下载: {}/{}",
                    percent,
                    speed,
                    humansize::format_size(downloaded, humansize::BINARY),
                    humansize::format_size(total, humansize::BINARY),
                );

                // 退出条件 下载体积 >= 总体积
                if downloaded >= total {
                    break;
                }
            }
            println!("extra.进度显示任务完成");
        }
    });

    // 任务等待顺序调整
    let (net_thread, buffer_thread, write_thread, progress_thread) =
        tokio::join!(network_task, buffer_task, write_task, progress_task);

    // 按依赖顺序处理错误
    net_thread??; // 先处理网络错误
    buffer_thread??; // 再处理缓冲错误
    write_thread??; // 最后处理写入错误
    progress_thread?;

    // 最终校验
    let final_size = fs::metadata(FINAL_FILE).await?.len();
    if final_size != total_size.load(Ordering::Relaxed) {
        return Err(AppError::Io(std::io::Error::new(
            std::io::ErrorKind::InvalidData,
            format!(
                "文件大小不匹配: 预期 {}，实际 {}",
                total_size.load(Ordering::Relaxed),
                final_size
            ),
        )));
    }

    println!("下载完成，文件已安全保存为: {}", FINAL_FILE);
    println!("总耗时:{:.2}s", timer.elapsed().as_secs_f64());
    Ok(())
}
```

## 方案 3:多线程分块流式下载

方案 3 的实现强依赖于目标下载链接的服务器响应头是否支持分块下载，也就是 `Response.Header` 需要开启 `Accept-Ranges: Bytes` 支持

### 方案流程

```txt
┌───────────────────┐        ┌───────────────────┐        ┌───────────────────┐
│  分块下载任务       │        │  缓冲排序任务      │        │  文件写入任务      │
│ (download_task)  │        │  (buffer_task)   │        │  (write_task)    │
└───────┬───────────┘        └───────┬───────────┘        └───────┬───────────┘
        │ 发送 (offset, Bytes)       │ 发送排序后的 (offset, Bytes) │
        │ 通过 dl_tx 通道 (容量32)    │ 通过 writer_tx 通道 (容量32) │
        ▼                            ▼                            ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                               通道数据流示意图                                │
├─────────────────────────────────────────────────────────────────────────────┤
│ 下载任务1 → (0-16MB, data1) → dl_tx → buffer_task → 排序 → writer_tx → 写入   │
│ 下载任务2 → (16-32MB, data2) → │       │ BTreeMap 维护顺序      │ 按offset写入 │
│ ...                          │       │ next_expected 控制     │             │
│ 下载任务8 → (112-128MB, data8) → │       └───────────────────────┘             │
└─────────────────────────────────────────────────────────────────────────────┘

┌───────────────────┐
│  进度监控任务      │
│ (progress_task)  │
└───────┬───────────┘
        │ 读取原子变量
        ▼
┌───────────────────┐
│  原子变量共享区    │
│  downloaded       │
└───────────────────┘

文件处理流程：
1. 预分配文件空间 (set_len)
2. 多线程分块下载 (8个并行任务)
3. 缓冲层排序重组数据块
4. 按offset顺序写入磁盘
5. 最终原子重命名文件
```

### 实现代码

```rust
use bytes::Bytes;
use futures_util::StreamExt;
use reqwest::Client;
use std::{
    collections::BTreeMap,
    io::SeekFrom,
    sync::{
        atomic::{AtomicU64, Ordering},
        Arc,
    },
    time::{Duration, Instant},
};
use tokio::{
    fs::File,
    io::{AsyncSeekExt, AsyncWriteExt},
    sync::mpsc,
    time,
};

// 定义统一错误类型
#[derive(Debug)]
enum AppError {
    Io(std::io::Error),
    Reqwest(reqwest::Error),
    Channel(tokio::sync::mpsc::error::SendError<(u64, Bytes)>), // 统一使用元组类型
    Join(tokio::task::JoinError),
}

// 实现From trait
impl From<std::io::Error> for AppError {
    fn from(err: std::io::Error) -> Self {
        AppError::Io(err)
    }
}

impl From<reqwest::Error> for AppError {
    fn from(err: reqwest::Error) -> Self {
        AppError::Reqwest(err)
    }
}

impl From<tokio::sync::mpsc::error::SendError<(u64, Bytes)>> for AppError {
    fn from(e: tokio::sync::mpsc::error::SendError<(u64, Bytes)>) -> Self {
        AppError::Channel(e)
    }
}

impl From<tokio::task::JoinError> for AppError {
    fn from(err: tokio::task::JoinError) -> Self {
        AppError::Join(err)
    }
}

impl std::fmt::Display for AppError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            AppError::Io(e) => write!(f, "IO错误: {}", e),
            AppError::Reqwest(e) => write!(f, "网络错误: {}", e),
            AppError::Channel(e) => write!(f, "通道错误: {}", e),
            AppError::Join(e) => write!(f, "任务错误: {}", e),
        }
    }
}

impl std::error::Error for AppError {}

// 进度监控结构
#[derive(Clone)]
struct ProgressMonitor {
    total: u64,
    downloaded: Arc<AtomicU64>,
}

impl ProgressMonitor {
    fn new(total: u64) -> Self {
        Self {
            total,
            downloaded: Arc::new(AtomicU64::new(0)),
        }
    }

    fn get_progress(&self) -> f64 {
        let d = self.downloaded.load(Ordering::Relaxed) as f64;
        d / self.total as f64 * 100.0
    }
}

// 分块下载核心逻辑
async fn download_task(
    url: String,
    range: (u64, u64),
    sender: mpsc::Sender<(u64, Bytes)>,
    progress: Arc<AtomicU64>,
) -> Result<(), AppError> {
    let client = Client::new();
    let response = client
        .get(&url)
        // 指定分块下载的起点和终点字节位
        .header("Range", format!("bytes={}-{}", range.0, range.1))
        .send()
        .await?;

    let mut current = range.0;
    let mut stream = response.bytes_stream();

    while let Some(chunk) = stream.next().await {
        let chunk = chunk?;
        let len = chunk.len() as u64;

        // 发送 起点位置 和 数据块 到缓冲通道
        sender.send((current, chunk.into())).await?;

        // 更新 全局进度 和 起点位置
        progress.fetch_add(len, Ordering::Relaxed);
        current += len;
    }

    println!("Download task completed normally");

    drop(sender);
    Ok(())
}

// 缓冲排序处理器
async fn buffer_task(
    mut receiver: mpsc::Receiver<(u64, Bytes)>,
    writer_tx: mpsc::Sender<(u64, Bytes)>,
) {
    // 构建基于 写入位置 和 写入数据块 的 BTreeMap
    let mut buffer = BTreeMap::new();
    // 从0开始声明写入offset
    let mut next_expected = 0u64;

    while let Some((offset, data)) = receiver.recv().await {
        buffer.insert(offset, data);

        loop {
            // 迭代获取 BufferMap 的key值
            let first_key = buffer.keys().next().cloned();

            // 持续循环迭代直到key值与当前写入offset相同，方才发送可写入数据块。为的是确保文件写入的连贯性
            match first_key {
                Some(key) if key == next_expected => {
                    let data_len = buffer.get(&key).unwrap().len() as u64;
                    let data = buffer.remove(&key).unwrap();

                    // 错误处理改进点
                    if let Err(e) = writer_tx.send((key, data)).await {
                        eprintln!("Writer channel closed unexpectedly: {}", e);
                        return; // 通道关闭时直接返回
                    }

                    // 写入offset增加相应数据块的长度
                    next_expected += data_len;
                }
                Some(_) => break,
                None => break,
            }
        }
    }

    // 正常关闭通道
    drop(writer_tx);
    println!("Buffer task completed normally");
}

// 文件写入任务
async fn write_task(
    mut receiver: mpsc::Receiver<(u64, Bytes)>,
    mut file: File,
) -> Result<(), AppError> {
    while let Some((offset, data)) = receiver.recv().await {
        // 使用带偏移量的写入
        file.seek(SeekFrom::Start(offset)).await?;
        // 写入最新数据块
        file.write_all(&data).await?;
    }

    // 确保所有数据落盘
    file.sync_all().await?;
    println!("Write task completed normally");
    Ok(())
}

// 进度显示任务
async fn progress_task(monitor: ProgressMonitor) {
    let mut interval = time::interval(Duration::from_secs(1));
    loop {
        interval.tick().await;
        let progress = monitor.get_progress();
        println!(
            "\rDownload Progress: {:.2}% [{}]",
            progress,
            "#".repeat((progress / 2.0) as usize)
        );
    }
}

const CHUNK_CORE: u32 = 8;
const URL: &str = "https://autopatchcn.yuanshen.com/client_app/update/hk4e_cn/audio_zh-cn_5.3.0_5.4.0_hdiff_KVKBwMMBdSYZfIUS.zip";
const TEMP_FILE: &str = "audio_zh-cn_5.3.0_5.4.0_hdiff_KVKBwMMBdSYZfIUS.zip.tmp";
const FINAL_FILE: &str = "audio_zh-cn_5.3.0_5.4.0_hdiff_KVKBwMMBdSYZfIUS.zip";

#[tokio::main]
async fn main() -> Result<(), AppError> {
    let time_count = Instant::now();

    let url = URL;
    let save_path = TEMP_FILE;

    // 1. 获取文件元数据
    let client = Client::new();
    let head_resp = client.head(url).send().await?;
    let content_length = head_resp
        .headers()
        .get("content-length")
        .and_then(|v| v.to_str().ok())
        .and_then(|v| v.parse().ok())
        .unwrap_or(0);

    // 2. 创建文件并预分配空间
    let file = tokio::fs::File::create(save_path).await?;
    file.set_len(content_length).await?;

    // 3. 初始化通道
    let (dl_tx, dl_rx) = mpsc::channel(32);
    let (writer_tx, writer_rx) = mpsc::channel(32);

    // 4. 启动核心任务
    let monitor = ProgressMonitor::new(content_length);

    // 进度显示线程
    let progress_handle = tokio::spawn(progress_task(monitor.clone()));

    // 缓冲处理线程
    let buffer_handle = tokio::spawn(buffer_task(dl_rx, writer_tx));

    // 文件写入线程
    let writer_handle = tokio::spawn(write_task(writer_rx, file));

    // 5. 分块下载线程
    let num_workers = CHUNK_CORE; // 可根据CPU核心数调整
    let chunk_size = content_length / num_workers as u64;
    let mut handles = vec![];

    // 根据线程数和文件体积进行下载任务拆分
    for i in 0..num_workers {
        let start = i as u64 * chunk_size;
        let end = if i == num_workers - 1 {
            content_length - 1
        } else {
            start + chunk_size - 1
        };

        let task = download_task(
            url.to_string(),
            (start, end),
            dl_tx.clone(),
            monitor.downloaded.clone(),
        );

        handles.push(tokio::spawn(task));
    }

    // 6. 等待所有下载完成
    for handle in handles {
        handle.await??;
    }

    // 7. 清理关闭通道
    drop(dl_tx);
    buffer_handle.await?;
    writer_handle.await??;

    // 8. 停止进度显示
    progress_handle.abort();

    // 9. 完整文件重命名
    tokio::fs::rename(&save_path, FINAL_FILE).await?;

    println!(
        "\nDownload completed successfully!, timeCount:{:.2}",
        time_count.elapsed().as_secs_f64()
    );
    Ok(())
}
```

### 潜在问题

多线程分块下载功能仅提供实现方案，实际上虽然拆分了大文件的下载任务，但下载速度仍然受限于网络带宽，甚至因为开启了多个 TCP 连接，反而会加大下载任务传输不稳定的可能性，使用时需优先考虑网络因素

## 小结

普通流式下载：

优点

1. 实现简单：无复杂逻辑，代码量最少
2. 内存友好：单次处理一个数据块（默认 64KB）
3. 顺序可靠：无需处理乱序问题
4. 低资源消耗：单线程运行，无额外通道/任务开销

缺点

1. 速度瓶颈：无法利用多核 CPU 和并行网络请求
2. 无断点续传：中断后需重新下载
3. 大文件性能差：单线程下载耗时线性增长
4. 进度不精确：依赖服务器返回的 content-length

适用场景

- 小文件下载（<100MB）
- 网络带宽受限环境
- 快速原型开发
- 对可靠性要求高于速度的场景

流式分块写入：

优点

1. 生产-消费解耦：下载与写入分离
2. 背压控制：通过通道容量限制内存使用
3. 适度并行：可利用 tokio 的 work-stealing 调度
4. 内存可控：固定大小的通道缓冲区

缺点

1. 仍为单线程下载：网络层未实现真正并行
2. 无乱序处理：需严格保持数据顺序
3. 中断恢复困难：无分块位置记录
4. 进度计算局限：只能基于已接收字节数

适用场景

- 中等文件下载（100MB-1GB）
- 需要控制内存使用的移动端应用
- 服务器端中等并发下载需求
- 需要基础流量控制的场景

多线程分块下载：

优点

1. 极致速度：充分利用多核 CPU 和网络带宽
2. 断点续传支持：通过记录分块状态可实现
3. 精确进度控制：基于原子计数器的全局进度
4. 大文件优化：分块下载减少单点故障影响

缺点

1. 实现复杂度高：需处理分块、排序、同步等问题
2. 内存消耗大：BTreeMap 缓冲可能积累大量数据
3. 错误处理复杂：单个分块失败影响整体
4. 服务器兼容性：需支持 Range 请求

适用场景

- 大文件下载（>1GB）
- 高带宽服务器环境
- CDN 分发等支持 Range 请求的场景
- 需要实现秒传/续传功能的专业下载工具
