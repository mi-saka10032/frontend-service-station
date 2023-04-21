import{_ as l}from"./_plugin-vue_export-helper.cdc0426e.js";import{o as d,c as r,a as n,b as i,e as a,d as e,r as c}from"./app.5f8837b7.js";const t={},v=e('<h2 id="介绍" tabindex="-1"><a class="header-anchor" href="#介绍" aria-hidden="true">#</a> 介绍</h2><p>来自官方介绍：</p><p>Nginx 是一款轻量级的 HTTP 服务器，采用事件驱动的异步非阻塞处理方式框架，这让其具有极好的 IO 性能，时常用于服务端的反向代理和负载均衡</p><p>Nginx 的优点：</p><ol><li>支持海量高并发：采用 IO 多路复用。官方测试 Nginx 能够支持 5 万并发链接，实际生产环境中可以支撑 2-4 万并发连接数</li><li>内存消耗少</li><li>可商业化</li><li>配置文件简单</li></ol><p>除了这些优点还有很多，比如反向代理功能，灰度发布，负载均衡功能等</p>',6),o={href:"https://blog.csdn.net/sinat_17775997/article/details/127506978",target:"_blank",rel:"noopener noreferrer"},u=e(`<h2 id="文件介绍" tabindex="-1"><a class="header-anchor" href="#文件介绍" aria-hidden="true">#</a> 文件介绍</h2><p>nginx 我们最常用到的文件，其实就是 nginx 的配置文件，其他的文件我们就带过了，当你能熟练编写 nginx 文件，其实就等于熟练使用 nginx 了</p><div class="language-conf line-numbers-mode" data-ext="conf"><pre class="language-conf"><code>[wujianrong@localhost ~]# tree /usr/local/nginx
/usr/local/nginx
├── client_body_temp
├── conf                             # Nginx所有配置文件的目录
│   ├── fastcgi.conf                 # fastcgi相关参数的配置文件
│   ├── fastcgi.conf.default         # fastcgi.conf的原始备份文件
│   ├── fastcgi_params               # fastcgi的参数文件
│   ├── fastcgi_params.default
│   ├── koi-utf
│   ├── koi-win
│   ├── mime.types                   # 媒体类型
│   ├── mime.types.default
│   ├── nginx.conf                   # Nginx主配置文件
│   ├── nginx.conf.default
│   ├── scgi_params                  # scgi相关参数文件
│   ├── scgi_params.default
│   ├── uwsgi_params                 # uwsgi相关参数文件
│   ├── uwsgi_params.default
│   └── win-utf
├── fastcgi_temp                     # fastcgi临时数据目录
├── html                             # Nginx默认站点目录
│   ├── 50x.html                     # 错误页面优雅替代显示文件，例如当出现502错误时会调用此页面
│   └── index.html                   # 默认的首页文件
├── logs                             # Nginx日志目录
│   ├── access.log                   # 访问日志文件
│   ├── error.log                    # 错误日志文件
│   └── nginx.pid                    # pid文件，Nginx进程启动后，会把所有进程的ID号写到此文件
├── proxy_temp                       # 临时目录
├── sbin                             # Nginx命令目录
│   └── nginx                        # Nginx的启动命令
├── scgi_temp                        # 临时目录
└── uwsgi_temp                       # 临时目录
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="配置文件-重点" tabindex="-1"><a class="header-anchor" href="#配置文件-重点" aria-hidden="true">#</a> 配置文件（重点）</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>conf //nginx所有配置文件目录
nginx.conf //这个是Nginx的核心配置文件，这个文件非常重要，也是我们即将要学习的重点
nginx.conf.default //nginx.conf的备份文件
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="日志" tabindex="-1"><a class="header-anchor" href="#日志" aria-hidden="true">#</a> 日志</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>logs: 记录入门的文件，当nginx服务器启动后
这里面会有 access.log error.log 和nginx.pid三个文件出现。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="资源目录" tabindex="-1"><a class="header-anchor" href="#资源目录" aria-hidden="true">#</a> 资源目录</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>html //存放nginx自带的两个静态的html页面
50x.html //访问失败后的失败页面
index.html //成功访问的默认首页
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="备份文件" tabindex="-1"><a class="header-anchor" href="#备份文件" aria-hidden="true">#</a> 备份文件</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>fastcgi.conf:fastcgi  //相关配置文件
fastcgi.conf.default //fastcgi.conf的备份文件
fastcgi_params //fastcgi的参数文件
fastcgi_params.default //fastcgi的参数备份文件
scgi_params //scgi的参数文件
scgi_params.default //scgi的参数备份文件
uwsgi_params //uwsgi的参数文件
uwsgi_params.default //uwsgi的参数备份文件
mime.types //记录的是HTTP协议中的Content-Type的值和文件后缀名的对应关系
mime.types.default //mime.types的备份文件
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="编码文件" tabindex="-1"><a class="header-anchor" href="#编码文件" aria-hidden="true">#</a> 编码文件</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>koi-utf、koi-win、win-utf这三个文件都是与编码转换映射相关的配置文件，
用来将一种编码转换成另一种编码
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="执行文件" tabindex="-1"><a class="header-anchor" href="#执行文件" aria-hidden="true">#</a> 执行文件</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>sbin: 是存放执行程序文件nginx
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="常见命令" tabindex="-1"><a class="header-anchor" href="#常见命令" aria-hidden="true">#</a> 常见命令</h2><h3 id="启动命令" tabindex="-1"><a class="header-anchor" href="#启动命令" aria-hidden="true">#</a> 启动命令</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token operator">&gt;</span> nginx <span class="token comment">#直接nginx启动，前提是配好nginx环境变量</span>
<span class="token operator">&gt;</span> systemctl start nginx.service <span class="token comment">#使用systemctl命令启动</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="停止命令" tabindex="-1"><a class="header-anchor" href="#停止命令" aria-hidden="true">#</a> 停止命令</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token operator">&gt;</span> nginx  <span class="token parameter variable">-s</span> stop <span class="token comment">#立即停止服务</span>
<span class="token operator">&gt;</span> nginx <span class="token parameter variable">-s</span> quit <span class="token comment">#从容停止服务 需要进程完成当前工作后再停止</span>
<span class="token operator">&gt;</span> <span class="token function">killall</span> nginx <span class="token comment">#直接杀死nginx进程</span>
<span class="token operator">&gt;</span> systemctl stop nginx.service <span class="token comment">#systemctl停止</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="重启命令" tabindex="-1"><a class="header-anchor" href="#重启命令" aria-hidden="true">#</a> 重启命令</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token operator">&gt;</span> nginx <span class="token parameter variable">-s</span> reload <span class="token comment">#重启nginx</span>
<span class="token operator">&gt;</span> systemctl reload nginx.service <span class="token comment">#systemctl重启nginx</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="验证配置文件正确性" tabindex="-1"><a class="header-anchor" href="#验证配置文件正确性" aria-hidden="true">#</a> 验证配置文件正确性</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token operator">&gt;</span> nginx <span class="token parameter variable">-t</span> //输出nginx.conf syntax is ok即表示nginx的配置文件正确
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="配置详细介绍" tabindex="-1"><a class="header-anchor" href="#配置详细介绍" aria-hidden="true">#</a> 配置详细介绍</h2><h3 id="配置主结构" tabindex="-1"><a class="header-anchor" href="#配置主结构" aria-hidden="true">#</a> 配置主结构</h3><div class="language-conf line-numbers-mode" data-ext="conf"><pre class="language-conf"><code>worker_processes  1；                			# worker进程的数量
events {                              			# 事件区块开始
    worker_connections  1024；          		# 每个worker进程支持的最大连接数
}                               			# 事件区块结束
http {                           			# HTTP区块开始
    include       mime.types；         			# Nginx支持的媒体类型库文件
    default_type  application/octet-stream；            # 默认的媒体类型
    sendfile        on；       				# 开启高效传输模式
    keepalive_timeout  65；       			# 连接超时
    server {            		                # 第一个Server区块开始，表示一个独立的虚拟主机站点
        listen       80；      			        # 提供服务的端口，默认80
        server_name  localhost；    			# 提供服务的域名主机名
        location / {            	        	# 第一个location区块开始
            root   html；       			# 站点的根目录，相当于Nginx的安装目录
            index  index.html index.htm；       	# 默认的首页文件，多个用空格分开
        }          				        # 第一个location区块结果
        error_page   500502503504  /50x.html；          # 出现对应的http状态码时，使用50x.html回应客户
        location = /50x.html {          	        # location区块开始，访问50x.html
            root   html；      		      	        # 指定对应的站点目录为html
        }
    }
    ......
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>nginx.conf 相当于是入口文件，nginx 启动后会先从 nginx.conf 里面读取基础配置</li><li>conf 目录下面的各种 xxx.conf 文件，一般就是每一个应用的配置，比如 a 网站的 nginx 配置叫 a.conf，b 网站的叫 b.conf，可以方便我们去便于管理</li><li>加载 conf 目录下的配置，在主配置文件 nginx.conf 中，一般会有这么一行代码</li></ul><h3 id="主配置文件" tabindex="-1"><a class="header-anchor" href="#主配置文件" aria-hidden="true">#</a> 主配置文件</h3><div class="language-conf line-numbers-mode" data-ext="conf"><pre class="language-conf"><code># 运行用户，默认即是nginx，可以不进行设置
user nginx;
# nginx进程，一般设置为和CPU核数一样
worker_processes  1;
# 错误日志存放目录
error_log logs/nginx/error.log warn;
# 进程pid存放目录
pid       logs/nginx.pid;

events {
  worker_connections  1024; # 单个后台进程最大并发数
}

http {
  include       mime.types; # 文件扩展名与类型映射表
  default_type  application/octet-stream; # 默认文件类型
  # 设置日志模式
  log_format main &#39;$remote_addr?C$remote_user [$time_local] $request $status $body_bytes_sent $http_referer $http_user_agent $http_x_forwarded_for&#39;;

  access_log    logs/access.log main; # nginx访问日志存放位置

  sendfile      on; # 开启高效传输模式
  #tcp_nopush   on; # 减少网络报文段的数量

  keepalive_timeout 65; # 保持连接的时间，也称超时时间

  #gzip on; # 开启gzip压缩

  include children/*.conf;  # 在根目录的children文件夹下的所有.conf文件
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="子配置文件" tabindex="-1"><a class="header-anchor" href="#子配置文件" aria-hidden="true">#</a> 子配置文件</h3><p>我们最常改动 nginx 的，就是子配置文件</p><p>修改完子文件注意调用<code>nginx -t</code>验证配置文件正确性</p><div class="language-conf line-numbers-mode" data-ext="conf"><pre class="language-conf"><code>server {
  listen        80;   # 监听端口
  server_name   localhost;  # 域名

  #charset  koi8-r;
  #access_log logs/host.access.log  main;

  location / {
    root  html/dist;  # 服务默认启动目录
    index index.html  index.htm;  # 默认访问文件
  }

  #error_page 404         /404.html;  # 404页面

  # redirect server error pages to the static page /50.html
  #
  error_page  500 502 503 504   /50x.html;  # 错误状态码的显示页面，配置后需要重启
  location = /50x.html {
    root  html/dist;
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="location-匹配" tabindex="-1"><a class="header-anchor" href="#location-匹配" aria-hidden="true">#</a> location 匹配</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>    #优先级1,精确匹配，根路径
    location =/ {
        return 400;
    }

    #优先级2,以某个字符串开头,以av开头的，优先匹配这里，区分大小写
    location ^~ /av {
       root /data/av/;
    }

    #优先级3，区分大小写的正则匹配，匹配/media*****路径
    location ~ /media {
          alias /data/static/;
    }

    #优先级4 ，不区分大小写的正则匹配，所有的****.jpg|gif|png 都走这里
    location ~* .*\\.(jpg|gif|png|js|css)$ {
       root  /data/av/;
    }

    #优先7，通用匹配
    location / {
        return 403;
    }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="反向代理" tabindex="-1"><a class="header-anchor" href="#反向代理" aria-hidden="true">#</a> 反向代理</h2><p>在聊反向代理之前，我们先看看正向代理，正向代理也是大家最常接触的到的代理模式</p><h3 id="正向代理" tabindex="-1"><a class="header-anchor" href="#正向代理" aria-hidden="true">#</a> 正向代理</h3><p>&quot;正向代理代理的是客户端&quot;，是一个位于客户端和原始服务器(origin server)之间的服务器，为了从原始服务器取得内容，客户端向代理发送一个请求并指定目标(原始服务器)，然后代理向原始服务器转交请求并将获得的内容返回给客户端。客户端必须要进行一些特别的设置才能使用正向代理</p><p><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/performance/forward-proxy.webp" alt="正向代理图例" loading="lazy"></p><p>正向代理的用途：</p><ul><li>访问原来无法访问的资源，如 Google</li><li>可以做缓存，加速访问资源</li><li>对客户端访问授权，上网进行认证</li><li>代理可以记录用户访问记录（上网行为管理），对外隐藏用户信息</li></ul><h3 id="反向代理-1" tabindex="-1"><a class="header-anchor" href="#反向代理-1" aria-hidden="true">#</a> 反向代理</h3><p>&quot;反向代理代理的是服务端&quot;，主要用于服务器集群分布式部署的情况下，反向代理隐藏了服务器的信息</p><p><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/performance/reverser-proxy.webp" alt="反向代理图例" loading="lazy"></p><p>反向代理的作用：</p><ul><li>保证内网的安全，通常将反向代理作为公网访问地址，Web 服务器是内网</li><li>负载均衡，通过反向代理服务器来优化网站的负载</li></ul><div class="language-conf line-numbers-mode" data-ext="conf"><pre class="language-conf"><code>server {
		#此处省略一些基本配置
		#默认指向product的server
		location / {
			proxy_pass http://product_server;
		}

		location /product/{
			proxy_pass http://product_server;
		}

		location /admin/ {
			proxy_pass http://admin_server;
		}

		location /finance/ {
			proxy_pass http://finance_server;
		}
	}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="负载均衡" tabindex="-1"><a class="header-anchor" href="#负载均衡" aria-hidden="true">#</a> 负载均衡</h2><p>服务器接收不同客户端发送的、Nginx 反向代理服务器接收到的请求数量，就是我们说的负载量。 这些请求数量按照一定的规则进行分发到不同的服务器处理的规则，就是一种均衡规则。 所以，将服务器接收到的请求按照规则分发的过程，称为负载均衡</p><p>负载均衡也分硬件负载均衡和软件负载均衡两种，我们来讲的是软件负载均衡，关于硬件负载均衡的有兴趣的靓仔可以去了解下 负载均衡的算法</p><ul><li>轮询（默认、加权轮询、ip_hash）</li><li>插件（fair、url_hash），url_hash 和 ip_hash 大同小异，一个基于 ip 一个基于 url</li></ul><h3 id="默认轮询" tabindex="-1"><a class="header-anchor" href="#默认轮询" aria-hidden="true">#</a> 默认轮询</h3><p>每个请求按时间顺序逐一分配到不同的后端服务器，如果后端某个服务器宕机，能自动剔除故障系统</p><div class="language-conf line-numbers-mode" data-ext="conf"><pre class="language-conf"><code># constPolling 作为存放负载均衡的变量
upstream constPolling {
    server localhost:10001;
    server localhost:10002;
}
server {
    listen 10000;
    server_name localhost;
    location / {
    proxy_pass http://constPolling; # 反向代理接入constPolling
    proxy_redirect default;
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="加权轮询" tabindex="-1"><a class="header-anchor" href="#加权轮询" aria-hidden="true">#</a> 加权轮询</h3><p>通过设置 weight，值越大分配率越大 到的访问概率越高，主要用于后端每台服务器性能不均衡的情况下。其次是为在主从的情况下设置不同的权值，达到合理有效的地利用主机资源</p><div class="language-conf line-numbers-mode" data-ext="conf"><pre class="language-conf"><code># constPolling 作为存放负载均衡的变量
upstream constPolling {
    server localhost:10001 weight=1;
    server localhost:10002 weight=2;
}
server {
    listen 10000;
    server_name localhost;
    location / {
    proxy_pass http://constPolling; # 反向代理接入constPolling
    proxy_redirect default;
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>权重越大，被访问的概率越大，比如上面就是 33.33%和百分 66.66%的访问概率 访问的效果： localhost:10001、localhost:10002、localhost:10002、localhost:10001、localhost:10002、localhost:10002</p><h3 id="ip-hash" tabindex="-1"><a class="header-anchor" href="#ip-hash" aria-hidden="true">#</a> ip_hash</h3><p>每个请求都根据访问 ip 的 hash 结果分配，经过这样的处理，每个访客固定访问一个后端服务，如下配置（ip_hash 可以和 weight 配合使用），并且可以有效解决动态网页存在的 session 共享问题</p><div class="language-conf line-numbers-mode" data-ext="conf"><pre class="language-conf"><code>upstream constPolling {
       ip_hash;
       server    localhost:10001 weight=1;
       server    localhost:10002 weight=2;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="fair" tabindex="-1"><a class="header-anchor" href="#fair" aria-hidden="true">#</a> fair</h3><p>fair 算法可以根据页面大小和加载时间长短智能地进行负载均衡，响应时间短的优先分配</p>`,65),m={href:"https://www.cnblogs.com/xiaohanlin/p/9904487.html",target:"_blank",rel:"noopener noreferrer"},h=e(`<p>哪个服务器响应速度快，就将请求分配到那个服务器上</p><div class="language-conf line-numbers-mode" data-ext="conf"><pre class="language-conf"><code>
upstream constPolling {
 server    localhost:10001;
 server    localhost:10002;
 fair;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="gzip" tabindex="-1"><a class="header-anchor" href="#gzip" aria-hidden="true">#</a> Gzip</h2><p>Gzip 是网页的一种网页压缩技术，经过 gzip 压缩后，页面大小可以变为原来的 30%甚至更小。更小的网页会让用户浏览的体验更好，速度更快。gzip 网页压缩的实现需要浏览器和服务器的支持</p><p>gzip 是需要服务器和浏览器同时支持的。当浏览器支持 gzip 压缩时，会在请求消息中包含 Accept-Encoding:gzip,这样 Nginx 就会向浏览器发送听过 gzip 后的内容，同时在相应信息头中加入 Content-Encoding:gzip，声明这是 gzip 后的内容，告知浏览器要先解压后才能解析输出</p><div class="language-conf line-numbers-mode" data-ext="conf"><pre class="language-conf"><code>server {

    listen 12089;

    index index.php index.html;

    error_log /var/log/nginx/error.log;

    access_log /var/log/nginx/access.log;

    root /var/www/html/gzip;
    # 开启gzip压缩

    gzip on;

    # http请求版本

    gzip_http_version 1.0;

    # 设置什么类型的文件需要压缩

    gzip_types text/css text/javascript application/javascript image/png image/jpeg image/gif;

    location / {

    index index.html index.htm index.php;

    autoindex off;

    }

}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>注意：当前大部分前端构建工具均支持生产环境直接打包 Gzip，nginx 可以不必配置！</p><h2 id="实际场景" tabindex="-1"><a class="header-anchor" href="#实际场景" aria-hidden="true">#</a> 实际场景</h2><h3 id="同一域名不同项目" tabindex="-1"><a class="header-anchor" href="#同一域名不同项目" aria-hidden="true">#</a> 同一域名不同项目</h3><p>通过同一域名的不同目录，来指定不同项目目录。微前端、多项目系统中都有使用</p><p><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/performance/nginx-all-one.png" alt="nginx同一域名不同项目" loading="lazy"></p><h3 id="自动适配-pc-移动端页面" tabindex="-1"><a class="header-anchor" href="#自动适配-pc-移动端页面" aria-hidden="true">#</a> 自动适配 PC/移动端页面</h3><p><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/performance/nginx-mobile.png" alt="nginx适配移动端" loading="lazy"></p><h3 id="限制谷歌浏览器访问" tabindex="-1"><a class="header-anchor" href="#限制谷歌浏览器访问" aria-hidden="true">#</a> 限制谷歌浏览器访问</h3><p><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/performance/nginx-chrome.png" alt="nginx限制谷歌访问" loading="lazy"></p><h3 id="spa-刷新-404" tabindex="-1"><a class="header-anchor" href="#spa-刷新-404" aria-hidden="true">#</a> SPA 刷新 404</h3><p><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/performance/nginx-404.png" alt="nginx限制谷歌访问" loading="lazy"></p><p><strong>注意：这个场景对于前端 SPA 应用路由模式为 history 时，为必须配置项！！！</strong></p><p><code>try_files $uri #uri/ /index.html;</code>这行字的意思为</p><ol><li><p>当 url 跳转链接找不到有效路径时，返回到 index.html 文件中让 html 自行处理逻辑</p></li><li><p>跳转回 index.html 中后，前端框架的 router 路由依赖劫持 url 监听器事件，触发无刷新页面渲染</p></li></ol>`,20);function b(p,g){const s=c("ExternalLinkIcon");return d(),r("div",null,[v,n("p",null,[i("参考链接："),n("a",o,[i("https://blog.csdn.net/sinat_17775997/article/details/127506978"),a(s)])]),u,n("p",null,[i("注意：需要安装 upstream_fair 模块，"),n("a",m,[i("安装教程"),a(s)])]),h])}const _=l(t,[["render",b],["__file","6-nginx.html.vue"]]);export{_ as default};
