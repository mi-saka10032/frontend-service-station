---
title: Midway框架模板详解
order: 2
tag:
  - MidwayJS
  - 后端框架模板
  - 面向对象开发
  - ORM模型
  - Redis缓存
  - JWT鉴权
  - Swagger文档
---

## 框架介绍

midway 是阿里巴巴开源的，基于 TypeScript 语言开发的 Nodejs 后端框架。
本教程指导大家从 0 开始搭建一个 midway 项目。

### 编程范式

**其遵循两种编程范式**

- 面向对象（OOP + Class + IoC）。

```ts
// src/controller/home.ts
import { Controller, Get } from "@midwayjs/core";
import { Context } from "@midwayjs/koa";

@Controller("/")
export class HomeController {
  @Inject()
  ctx: Context;

  @Get("/")
  async home() {
    return {
      message: "Hello Midwayjs!",
      query: this.ctx.ip,
    };
  }
}
```

- 函数式（FP + Function + Hooks）。

```ts
// src/api/index.ts

import { useContext } from "@midwayjs/hooks";
import { Context } from "@midwayjs/koa";

export default async function home() {
  const ctx = useContext<Context>();

  return {
    message: "Hello Midwayjs!",
    query: ctx.ip,
  };
}
```

### 谁较容易上手学习

- 懂 Nodejs 技术的前端开发；
- 会 TypeScript 的后端开发；

### 可掌握的知识

- 面向对象的开发体验；
- 增删改查及基类封装；
- 数据库操作；
- 缓存操作；
- 用户安全认证及访问安全控制；
- JWT 访问凭证；
- 分布式访问状态管理；
- 密码加解密；
- 统一返回结果封装；
- 统一异常管理；
- Snowflake 主键生成；
- Swagger 集成及支持访问认证；
- 环境变量的使用；
- Docker 镜像构建；
- Serverless 发布；

文档仓库链接：<https://github.com/mi-saka10032/jay-music-manage-system>

参考文档链接：<https://github.com/bestaone/midway-boot/blob/main/Tutorials.md>

## 环境准备

- Nodejs v16+
- Npm v9+
- Mysql v8+
- Redis v7+

建议安装 mysql v8.0 以上的版本，Redis 安装启动后维持后台运行即可。

上面的应用安装步骤略。

## 项目初始化

### 初始化创建

```shell
npm init midway
```

执行命令后，需要选择模板，标准项目需要选择：koa-v3；

项目名可以自定义。

### 启动

```shell
npm run dev
```

启动后浏览器访问：`http://127.0.0.1:7001`

### 调整 prettier 配置

为了保证代码风格统一，我们调整下 prettier 配置

```js
// 这是项目模板默认配置
module.exports = {
  ...require("mwts/.prettierrc.json"),
  endOfLine: "lf", // 换行符使用 lf
  printWidth: 120, // 一行最多 120 字符
  proseWrap: "preserve", // 使用默认的折行标准
  semi: true, // 行尾需要有分号
};
```

**midway 默认使用 mwts 库作为格式化依据，也可以根据自己的其他书写需要自定义覆盖规则**

**在 windows 中代码的首行、尾行不能有空行，否则 ESLint 提示格式错误，可能是 bug**

## 增删改查

midway 使用 TypeORM 来实现 Object Relation Mapping，提供数据库操作能力。

### 安装依赖

```shell
npm i @midwayjs/typeorm@3 typeorm --save
```

安装完后 package.json 文件中会多出如下配置

```json
{
  "dependencies": {
    "@midwayjs/typeorm": "^3.4.4",
    "typeorm": "^0.3.7"
  }
}
```

### 引入组件

在 `src/configuration.ts` 中引入 orm 组件

```ts
// configuration.ts
import { Configuration, App } from "@midwayjs/decorator";
import * as koa from "@midwayjs/koa";
import * as validate from "@midwayjs/validate";
import * as info from "@midwayjs/info";
import { join } from "path";
import { ReportMiddleware } from "./middleware/report.middleware";
import * as orm from "@midwayjs/typeorm";

@Configuration({
  imports: [
    orm, // 引入orm组件
    koa,
    validate,
    {
      component: info,
      enabledEnvironment: ["local"],
    },
  ],
  importConfigs: [join(__dirname, "./config")],
})
export class ContainerLifeCycle {
  @App()
  app: koa.Application;

  async onReady() {
    this.app.useMiddleware([ReportMiddleware]);
  }
}
```

### 添加数据库配置

修改配置 `src/config/config.default.ts`

```ts
// src/config/config.default.ts
import { MidwayConfig } from "@midwayjs/core";

export default {
  keys: "1657707214114_9253",
  koa: {
    port: 7001,
  },
  // 添加orm配置
  typeorm: {
    dataSource: {
      default: {
        type: "mysql",
        host: "127.0.0.1", // 改成你的mysql数据库IP
        port: 3306, // 改成你的mysql数据库端口
        username: "root", // 改成你的mysql数据库用户名（需要有创建表结构权限）
        password: "123456", // 改成你的mysql数据库密码
        database: "jay_music_manage_system", // 改成你的mysql数据库IP
        synchronize: true, // 如果第一次使用，不存在表，有同步的需求可以写 true
        logging: true,
        entities: ["**/entity/*{.ts,.js}"],
      },
    },
  },
} as MidwayConfig;
```

**注意：首次启动没有创建表结构的，需要设置自动创建表接口 synchronize: true。**

**synchronize 这个属性需慎用，一旦相关的 Entity 实体类发生变化，都会影响到数据库表结构修改，建议正式环境只启用一次。后续表结构的变更调整建议走 mysql 脚本**

### 安装 MySql 驱动

```shell
npm install mysql2 --save
```

安装完后 package.json 文件中会多出如下配置

```json
{
  "dependencies": {
    "mysql2": "^2.3.3"
  }
}
```

orm 的详细文档见：

http://www.midwayjs.org/docs/extensions/orm

### MVC

#### 创建 Entity 实体类

1. 创建目录 `src/entity`;
2. 在该目录下创建实体类 `user.ts`;

```ts
// src/entity/user.ts
import { Entity } from "@midwayjs/typeorm";
import {
  Column,
  CreateDateColumn,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("user")
export class User {
  @PrimaryColumn({ type: "bigint" })
  id: number;

  @Column({ length: 100, nullable: true })
  avatarUrl: string;

  @Column({ length: 20, unique: true })
  username: string;

  @Column({ length: 200 })
  password: string;

  @Column({ length: 20 })
  phoneNum: string;

  @Column()
  regtime: Date;

  @Column({ type: "bigint" })
  updaterId: number;

  @Column({ type: "bigint" })
  createrId: number;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;

  @Column({ type: "int", default: 1 })
  status: number;
}
```

- `@EntityModel` 用来定义一个实体类；
- `@Column` 用来描述类的一个熟悉，对应数据库就是一个数据列；
- `@PrimaryColumn` 用来定义一个主键，每个实体类必须要要主键；
- `@PrimaryGeneratedColumn` 用来定义一个自增主键；
- `@CreateDateColumn` 定义创建时，自动设置日期；
- `@UpdateDateColumn` 定义更新时，自动设置日期；

对应的数据库结构

```sql
CREATE TABLE `user` (
  `id` bigint NOT NULL,
  `avatarUrl` varchar(100) DEFAULT NULL,
  `username` varchar(20) NOT NULL,
  `password` varchar(200) NOT NULL,
  `phoneNum` varchar(20) NOT NULL,
  `regtime` datetime NOT NULL,
  `updaterId` bigint NOT NULL,
  `createrId` bigint NOT NULL,
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `status` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_78a916df40e02a9deb1c4b75ed` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

#### 创建 UserService

创建或者修改 `src/service/user.service.ts` 文件。

```ts
// src/service/user.service.ts
import { Provide } from "@midwayjs/decorator";
import { User } from "../eneity/user";
import { InjectEntityModel } from "@midwayjs/typeorm";
import { Repository } from "typeorm";
import { DeleteResult } from "typeorm/query-builder/result/DeleteResult";

@Provide()
export class UserService {
  @InjectEntityModel(User)
  userModel: Repository<User>;

  async create(user: User): Promise<User> {
    return this.userModel.save(user);
  }

  async findById(id: number): Promise<User> {
    return this.userModel.findOneBy({ id });
  }

  async delete(id: number): Promise<DeleteResult> {
    return this.userModel.delete(id);
  }
}
```

- `@Provide` 表示这个类将会由系统自动实例化，在使用的时候，只需要使用 `@Inject` 注入就可以了；
- `@InjectEntityModel` 注入实体模型数据库操作工具；

注意：由于调整了 UserService，`src/controller/api.controller.ts`、`test/controller/api.test.ts`会报错，直接删掉即可（这部分是 midway 原始项目模板中的老文件）

#### 创建 UserController

创建或者修改 `src/controller/user.controller.ts` 文件。

```ts
// src/controller/user.controller.ts
import { Inject, Controller, Query, Post, Body } from "@midwayjs/decorator";
import { User } from "../eneity/user";
import { UserService } from "../service/user.service";
import { DeleteResult } from "typeorm/query-builder/result/DeleteResult";

@Controller("/api/user")
export class UserController {
  @Inject()
  userService: UserService;

  @Post("/create", { description: "创建" })
  async create(@Body() user: User): Promise<User> {
    Object.assign(user, {
      id: new Date().getTime(),
      regtime: new Date(),
      updaterId: 1,
      createrId: 1,
    });
    return this.userService.save(user);
  }

  @Post("/findById", { description: "通过主键查找" })
  async findById(@Query("id") id: number): Promise<User> {
    return this.userService.findById(id);
  }

  @Post("/delete", { description: "删除" })
  async delete(@Query("id") id: number): Promise<DeleteResult> {
    return this.userService.delete(id);
  }
}
```

`@Inject()` 装饰类指定该对象会被自动注入。

### 单元测试

#### 添加单元测试类

添加文件 `test/controller/user.test.ts`

```ts
// test/controller/user.test.ts
import { close, createApp, createHttpRequest } from "@midwayjs/mock";
import { Application, Framework } from "@midwayjs/koa";
import { User } from "../../src/eneity/user";

describe("test/controller/user.test.ts", () => {
  let app: Application;
  let o: User;

  beforeAll(async () => {
    try {
      app = await createApp<Framework>();
    } catch (err) {
      console.error("test beforeAll error", err);
      throw err;
    }
  });

  afterAll(async () => {
    await close(app);
  });

  // create
  it("should POST /api/user/create", async () => {
    o = new User();
    Object.assign(o, {
      username: new Date().getTime().toString(),
      password: new Date().getTime().toString(),
      phoneNum: new Date().getTime().toString(),
    });
    const result = await createHttpRequest(app)
      .post("/api/user/create")
      .send(o);
    expect(result.status).toBe(200);
    // 将创建好的数据存起来，以供后面测试使用（返回的数据会有id）
    o = result.body;
  });

  // findById
  it("should POST /api/user/findById", async () => {
    const result = await createHttpRequest(app).post(
      "/api/user/findById?id=" + o.id
    );
    expect(result.status).toBe(200);
  });

  // delete
  it("should POST /api/user/delete", async () => {
    const result = await createHttpRequest(app).post(
      "/api/user/delete?id=" + o.id
    );
    expect(result.status).toBe(200);
  });
});
```

- beforeAll、afterAll 分别会在测试开始前、后执行；
- `createApp<Framework>()` BeforeAll 阶段的 error 会忽略，需要手动处理异常；

单元测试的详细文档，见：

http://www.midwayjs.org/docs/testing

#### 执行单元测试

```shell
npm run test
```

如果测试时间过长，会导致测试失败，我们需要修改超时时间

#### 修改超时时间

在根目录添加文件 `jest.setup.js`;

```js
// jest.setup.js
// 只需要一行代码
// 设置单元测试超时时间
jest.setTimeout(60000);
```

修改 jest 配置文件 `jest.config.js`

```js
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testPathIgnorePatterns: ["<rootDir>/test/fixtures"],
  coveragePathIgnorePatterns: ["<rootDir>/test/"],
  // 添加如下一行代码，引入jest初始化文件
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};
```

## 封装增删改查

### 问题

1. 大多数情况，所有实体类都有统一字段，需要抽取实体模型的基类；
2. 需要将 Service 的基本操作封装起来；
3. 需要将 Controller 的基本操作封装起来。

### 抽取 Entity 基类

1. 创建目录 `common`;
2. 创建基类 `src/common/BaseEntity.ts`;

```ts
// src/common/BaseEntity.ts
import {
  Column,
  CreateDateColumn,
  PrimaryColumn,
  UpdateDateColumn,
  ValueTransformer,
} from "typeorm";
import { ApiProperty } from "@midwayjs/swagger";

// 用于处理和转换typeORM在返回主键数据时自动将bigint类型转换为string类型，导致前端总是获取string类型而非number类型数据的问题
class BigIntTransformer implements ValueTransformer {
  to(value: bigint | null): string | null {
    return value != null ? value.toString() : null;
  }
  from(value: string | null): number | null {
    return value != null ? parseInt(value) : null;
  }
}

// 所有使用Base封装MVC的Entity实体类都需要继承BaseEntity
export class BaseEntity {
  @PrimaryColumn({ type: "bigint", transformer: new BigIntTransformer() })
  id: number;

  @ApiProperty({ description: "更新人ID" })
  @Column({ type: "bigint" })
  updaterId: number;

  @ApiProperty({ description: "创建人ID" })
  @Column({ type: "bigint" })
  createrId: number;

  @ApiProperty({ description: "创建时间" })
  @CreateDateColumn()
  createTime: Date;

  @ApiProperty({ description: "更新时间" })
  @UpdateDateColumn()
  updateTime: Date;
}
```

- 调整实体类 `src/entity/user.ts`，继承 `BaseEntity`，并删除`user.ts`中的通用字段。
- 增加主键 id 的类型转换。

```ts
// src/entity/user.ts
import { Entity, Column } from "typeorm";
import { BaseEntity } from "../common/BaseEntity";
import { ApiProperty } from "@midwayjs/swagger";

// 系统用户实体类
@Entity("user")
export class User extends BaseEntity {
  @ApiProperty({ description: "头像" })
  @Column({ length: 100, nullable: true })
  avatarUrl: string;

  @ApiProperty({ description: "用户名" })
  @Column({ length: 20, unique: true })
  username: string;

  @ApiProperty({ description: "密码" })
  @Column({ length: 200 })
  password: string;

  @ApiProperty({ description: "注册时间" })
  @Column()
  regTime: Date;

  @ApiProperty({ description: "状态 0：不可用，1：正常" })
  @Column({ type: "int", default: 1 })
  status: number;
}
```

### 抽取 Service 基类

创建基类 `src/common/BaseService.ts`

```ts
// src/common/BaseService.ts
import {
  Between,
  FindOptionsSelect,
  ILike,
  In,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
  SelectQueryBuilder,
} from "typeorm";
import { Inject } from "@midwayjs/decorator";
import { SnowflakeIdGenerate } from "../utils/Snowflake";
import { BaseEntity } from "./BaseEntity";
import { BaseVO } from "../music-api/vo/BaseVO";
import { Page } from "./Page";
import { FindOptionsWhere } from "typeorm/find-options/FindOptionsWhere";
import { ILogger } from "@midwayjs/core";
import { Context } from "@midwayjs/koa";
import { defaultPageNo, defaultPageSize } from "../decorator/page.decorator";

export interface BatchWhereOption {
  table: string;
  column: string;
  key: string;
  value: any | null;
  condition:
    | "equal"
    | "like"
    | "moreThan"
    | "lessThan"
    | "moreThanOrEqual"
    | "lessThanOrEqual";
}

/**
 * SERVICE的基类
 */
export abstract class BaseService<T extends BaseEntity, V extends BaseVO> {
  @Inject()
  idGenerate: SnowflakeIdGenerate;

  @Inject()
  logger: ILogger;

  @Inject()
  ctx: Context;

  // 获取实体库
  abstract getModel(): Repository<T>;

  // 获取VO对象
  abstract getVO(): V;

  // 获取VO对象指定查询列字段 不提供Array 默认为where提供undefined全量查询
  abstract getColumns(): Array<keyof V>;

  /**
   * @description 字符串全模糊匹配查询 为typeORM的快捷API(find系列)补全where对象
   * @param where typeORM的条件对象
   */
  public fuzzyWhere(where: FindOptionsWhere<T>) {
    for (const whereKey in where) {
      const option = where[whereKey];
      if (typeof option === "string") {
        where[String(whereKey)] = ILike(`%${option}%`);
      }
    }
  }

  /**
   * @description 日期范围条件匹配查询 为typeORM的快捷API(find系列)补全where对象
   * @param where
   * @param whereKey Entity的键值名
   * @param startDate 起始日期
   * @param endDate 结束日期
   */
  public dateRangeWhere(
    where: FindOptionsWhere<T>,
    whereKey: keyof T,
    startDate: Date | null,
    endDate: Date | null
  ) {
    const left: number = startDate ? 0b0010 : 0b0000;
    const right: number = endDate ? 0b0001 : 0b0000;
    const range: number = left | right;
    // range的结果有4种(3|2|1|0)，分别代表不同的SQL语句
    switch (range) {
      case 3: {
        where[String(whereKey)] = Between(startDate, endDate);
        break;
      }
      case 2: {
        where[String(whereKey)] = MoreThanOrEqual(startDate);
        break;
      }
      case 1: {
        where[String(whereKey)] = LessThanOrEqual(endDate);
        break;
      }
      default: {
        where[String(whereKey)] = undefined;
      }
    }
  }

  /**
   * @description createQueryBuilder模式下批量where条件的插值方法 typeORM的createQueryBuilder模式专用
   * @param builder createQueryBuilder返回值
   * @param whereOptions Array<{ table:表名, column:列名, value:列值(可能为空), condition:多条件判断 }>
   */
  public builderBatchWhere(
    builder: SelectQueryBuilder<T>,
    whereOptions: Array<BatchWhereOption>
  ) {
    for (const option of whereOptions) {
      const { table, column, key, value, condition } = option;
      if (value != null) {
        switch (condition) {
          case "equal": {
            builder.andWhere(`${table}.${column} = :${key}`, { [key]: value });
            break;
          }
          case "like": {
            builder.andWhere(`${table}.${column} LIKE :${key}`, {
              [key]: `%${value}%`,
            });
            break;
          }
          case "lessThan": {
            builder.andWhere(`${table}.${column} < :${key}`, { [key]: value });
            break;
          }
          case "lessThanOrEqual": {
            builder.andWhere(`${table}.${column} <= :${key}`, { [key]: value });
            break;
          }
          case "moreThan": {
            builder.andWhere(`${table}.${column} > :${key}`, { [key]: value });
            break;
          }
          case "moreThanOrEqual": {
            builder.andWhere(`${table}.${column} >= :${key}`, { [key]: value });
            break;
          }
        }
      }
    }
  }

  /**
   * @description 新增或更新指定对象数据 private内部使用
   * @param o 待新增or更新的对象 model统一使用save执行
   */
  private async save(o: T): Promise<V> {
    o.updaterId = this.ctx.userContext.userId;
    const result: T = await this.getModel().save(o);
    const resultVO: V = this.getVO();
    return Object.assign(resultVO, result);
  }

  /**
   * @description 新建数据
   * @param o o.id必须为空
   */
  public async create(o: T): Promise<V> {
    o.id = this.idGenerate.generate();
    o.createrId = this.ctx.userContext.userId;
    return this.save(o);
  }

  /**
   * @description 更新数据
   * @param o o.id不能为空
   */
  public async update(o: T): Promise<V> {
    return this.save(o);
  }

  // 根据id删除指定对象
  public async delete(id: number): Promise<void> {
    await this.getModel().delete(id);
  }

  /**
   * @description 根据id查询指定对象
   * @param id
   */
  public async findById(id: number): Promise<V> {
    const select = this.getColumns() as unknown as FindOptionsSelect<T>;
    const where = { id } as FindOptionsWhere<T>;
    const result: T = await this.getModel().findOne({ select, where });
    const resultVO: V = this.getVO();
    return Object.assign(resultVO, result);
  }

  /**
   * @description 根据多个id查询对象列表
   * @param ids
   */
  public async findByIds(ids: number[]): Promise<V[]> {
    // 指定VO字段查询列
    const select = this.getColumns() as unknown as FindOptionsSelect<T>;
    const where = { id: In(ids) } as FindOptionsWhere<T>;
    const list: T[] = await this.getModel().find({ select, where });
    const listVO: V[] = new Array<V>();
    return Object.assign(listVO, list);
  }

  /**
   * @description 分页模糊查询
   * @param where 筛选条件，string类型默认全模糊(%s%)匹配
   * @param pageNo 去除非空校验，默认取1
   * @param pageSize 去除非空校验，默认取10
   */
  public async page(
    where: FindOptionsWhere<T>,
    @defaultPageNo() pageNo: number,
    @defaultPageSize() pageSize: number
  ): Promise<Page<V>> {
    const skip = (pageNo - 1) * pageSize;
    const take = pageSize;
    // 字符串模糊匹配
    this.fuzzyWhere(where);
    // 指定VO字段查询列
    const select = this.getColumns() as unknown as FindOptionsSelect<T>;
    const [list, total]: [T[], number] = await this.getModel().findAndCount({
      select,
      where,
      skip,
      take,
    });
    const listVO: V[] = new Array<V>();
    Object.assign(listVO, list);
    return Page.build(listVO, total, pageNo, pageSize);
  }

  /**
   * @description 根据部分对象内部属性查询指定对象
   * @param where 筛选条件，string类型默认全模糊(%s%)匹配
   */
  public async findOne(where: FindOptionsWhere<T>): Promise<V> {
    // 字符串模糊匹配
    this.fuzzyWhere(where);
    // 指定VO字段查询列
    const select = this.getColumns() as unknown as FindOptionsSelect<T>;
    const result: T = await this.getModel().findOne({ select, where });
    const resultVO: V = this.getVO();
    return Object.assign(resultVO, result);
  }
}
```

- `<T extends BaseEntity>` 泛型用法，定义 `T` 为 `BaseEntity` 的子类
- `<V extends BaseVO>` 泛型用法，定义 `V` 为 `BaseVO`的子类，也就是继承了`id`属性的 VO 类
- 基类定义为抽象类 `abstract`,并添加三个抽象接口
  1. `abstract getModel()`：向其实现类提供外部实体类，用于 ORM 操作
  2. `getVO()`：实现类提供指定 VO 泛型的返回类实例，返回 VO 对象而不是原生的 Entity 对象
  3. `getColumns()`：每个实现类都必填的指定列字段数组，目的是执行查询的时候指定字段（如指定 id、username、password）查询返回而不是`SELECT *`全量返回
- 提供三个自定义的 ORM 操作方法
  1. `fuzzyWhere`：指定 ORM 查询的对象参数 WhereOption，属性值符合字符串类型的全部转化为全模糊匹配，如：`{ username: '三' }`,转化后执行 ORM 查询等价于`select * from user where username LIKE '%三%';`；
  2. `dateRangeWhere`：指定 ORM 查询的对象参数 WhereOption，指定属性值 key，为其赋予起始日期或截止日期的查询参数，如：`{ startDate: new Date('2022-1-1'), endDate: new Date('2023-1-1') }`，指定 key 为`publishTime`，转化后执行 ORM 查询等价于`select * from user where publishTime` >= '2022-1-1' and publishTime <= '2023-1-1';`；
  3. `builderBatchWhere`：为 ORM 创建的 queryBuilder 提供批量 where 查询参数的插入，集成了上面两个方法的功能，但是不同的是上面两个方法适用于快捷 ORM 查询（`this.model.find({ where })`），而这个方法只适用于了通过 model 创建的 queryBuilder。
- 其他方法都是基于 typeORM 的方法封装，最终返回 VO 类实例。需要注意的是 create 和 update 方法会插入 createrId 和 updaterId，这两者从登录成功后赋予到服务上下文的操作中获取，因此涉及新增和更新操作的要求必须先执行登录操作。

调整 `src/service/user.service.ts`

```ts
import { Inject, Provide } from "@midwayjs/decorator";
import { InjectEntityModel } from "@midwayjs/typeorm";
import { User } from "../entity/user";
import { Repository } from "typeorm";
import { BaseService } from "../common/BaseService";
import { Context } from "@midwayjs/koa";
import { UserVO } from "../music-api/vo/LoginVO";

@Provide()
export class UserService extends BaseService<User, UserVO> {
  @InjectEntityModel(User)
  model: Repository<User>;

  getModel(): Repository<User> {
    return this.model;
  }

  getVO() {
    return new UserVO();
  }

  getColumns(): Array<keyof UserVO> {
    return ["id", "username", "regTime", "status"];
  }

  @Inject()
  ctx: Context;

  async findByUsername(username: string): Promise<User> {
    return this.model.findOne({ where: { username } });
  }
}
```

- 添加继承 `UserService extends BaseService<User>`
- 实现接口 `getModel()`，并返回 `Repository`
- 指定查询列字段数组 `getColumns()`
- 实现一个指定 username 查询的方法

### 抽取 Controller 基类

创建基类 `src/common/BaseController.ts`

```ts
// src/common/BaseController.ts
import { BaseService } from "./BaseService";
import { BaseEntity } from "./BaseEntity";
import { BaseVO } from "../music-api/vo/BaseVO";
import { Body, Post, Query } from "@midwayjs/decorator";
import { ApiResponse } from "@midwayjs/swagger";
import { Page } from "./Page";
import { Assert } from "./Assert";

/**
 * Controller基础类，由于类继承不支持装饰类@Post、@Query、@Body等，
 * 所以这里的装饰类不生效，否则实现类就不需要再写多余代码了，
 * 这里保留在这里，以备以后可能会支持继承的装饰类
 */
export abstract class BaseController<T extends BaseEntity, V extends BaseVO> {
  abstract getService(): BaseService<T, V>;

  @Post("/create")
  async create(@Body() body: T): Promise<V> {
    Assert.baseAssert_CreateObj(body);
    Assert.baseAssert_CreateId(body.id);
    return this.getService().create(body);
  }

  @Post("/delete")
  async delete(@Query("id") id: number): Promise<boolean> {
    Assert.baseAssert_DeleteId(id);
    await this.getService().delete(id);
    return true;
  }

  @Post("/update")
  async update(@Body() body: T): Promise<V> {
    Assert.baseAssert_UpdateObj(body);
    Assert.baseAssert_UpdateId(body.id);
    return this.getService().update(body);
  }

  @Post("/findById")
  async findById(@Query("id") id: number): Promise<V> {
    Assert.baseAssert_FindId(id);
    return this.getService().findById(id);
  }

  @ApiResponse({ description: "通过一批主键查找" })
  @Post("/findByIds")
  async findByIds(@Query("ids") ids: number[]): Promise<V[]> {
    Assert.baseAssert_FindIds(ids);
    return this.getService().findByIds(ids);
  }

  @ApiResponse({ description: "分页查询" })
  @Post("/page")
  async page(@Body() map: Map<string, any>): Promise<Page<V>> {
    Assert.baseAssert_QueryPage(map);
    const pageNo = map.get("pageNo");
    const pageSize = map.get("pageSize");
    map.delete("pageNo");
    map.delete("pageSize");
    const where = {};
    map.forEach((value, key) => (where[key] = value));
    return this.getService().page(where, pageNo, pageSize);
  }

  @Post("/findOne")
  async findOne(@Body() body: T): Promise<V> {
    Assert.baseAssert_QueryOne(body);
    const where = {};
    Object.keys(body).forEach((key) => {
      where[key] = body[key];
    });
    return this.getService().findOne(where);
  }
}
```

- 基类定义为抽象类 `abstract`,并添加抽象接口 `abstract getService()`
- `<T extends BaseEntity>` 泛型用法，定义 `T` 为 `BaseEntity` 的子类
- `<V extends BaseVO>` 泛型用法，定义 `V`为`BaseVO`的子类，同时也是各方法的返回值

调整 `src/controller/user.controller.ts`

```ts
// src/controller/user.controller.ts
import { Body, Controller, Inject, Post, Query } from "@midwayjs/decorator";
import { Context } from "@midwayjs/koa";
import { UserService } from "../service/user.service";
import { User } from "../entity/user";
import { BaseController } from "../common/BaseController";
import { BaseService } from "../common/BaseService";
import { RedisService } from "@midwayjs/redis";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@midwayjs/swagger";
import { encrypt } from "../utils/PasswordEncoder";
import { Assert } from "../common/Assert";
import { ErrorCode } from "../music-api/code/ErrorCode";
import { Page } from "../common/Page";
import { UserVO } from "../music-api/vo/LoginVO";

@ApiTags(["user"])
@ApiBearerAuth()
@Controller("/api/user")
export class UserController extends BaseController<User, UserVO> {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @Inject()
  cacheUtil: RedisService;

  getService(): BaseService<User, UserVO> {
    return this.userService;
  }

  @ApiResponse({ type: UserVO })
  @Post("/create", { description: "创建" })
  async create(@Body() user: User): Promise<UserVO> {
    Assert.notNull(user.username, ErrorCode.UN_ERROR, "username不能为空");
    Assert.notNull(user.password, ErrorCode.UN_ERROR, "password不能为空");
    Object.assign(user, {
      regTime: new Date(),
      password: encrypt(user.password),
    });
    const newUser = super.create(user);
    return Object.assign(newUser, { password: null });
  }

  @Post("/delete", { description: "删除" })
  async delete(@Query("id") id: number): Promise<boolean> {
    return super.delete(id);
  }

  @ApiResponse({ type: UserVO })
  @Post("/update", { description: "更新" })
  async update(@Body() user: User): Promise<UserVO> {
    return super.update(user);
  }

  @ApiResponse({ type: UserVO })
  @Post("/findById", { description: "通过主键查找" })
  async findById(@Query("id") id: number): Promise<UserVO> {
    return super.findById(id);
  }

  @ApiResponse({ type: UserVO })
  @Post("/findByIds", { description: "通过一批主键查找" })
  async findByIds(@Body("ids") ids: number[]): Promise<UserVO[]> {
    return super.findByIds(ids);
  }

  @ApiResponse({ type: UserVO })
  @Post("/page", { description: "分页查询" })
  async page(@Body() map: Map<string, any>): Promise<Page<UserVO>> {
    return super.page(map);
  }
}
```

- 添加继承 `UserController extends BaseController`
- 实现抽象接口 `getService()`
- 调用基类方法，使用 `super.xxx()`

### 运行单元测试

```shell
>npm run test

Test Suites: 2 passed, 2 total
Tests:       4 passed, 4 total
Snapshots:   0 total
Time:        10.686 s
```

## 统一返回结果处理

### Middleware

midway 提供了 web 中间件，是在控制器调用之前和之后都能触发调用的函数方法，我们可以利用中间件在接口执行前或执行后，加一些逻辑，比如：统一返回格式（执行后）、接口鉴权（执行前）。

### 统一接口状态、异常码

添加 `src/music-api/code/ErrorCode.ts`。错误码可以自行定义

```ts
// src/music-api/code/ErrorCode.ts
export class ErrorCode {
  static OK = 1000;
  /**
   * 4000 未知异常
   */
  static UN_ERROR = 4000;
  /**
   * 5000 平台异常
   */
  static SYS_ERROR = 5000;
  /**
   * 6000 基本的业务异常
   */
  static BIZ_ERROR = 6000;
  /**
   * 8000 TOKEN异常
   */
  static LOGIN_ERROR = 8000;
}
```

添加通用异常类 `src/common/CommonException.ts`

```ts
// src/common/CommonException.ts
import { MidwayError } from "@midwayjs/core";

export class CommonException extends MidwayError {
  code: number;
  msg: string;
  data: any;
  constructor(code: number, msg: string) {
    super(msg, code.toString());
    this.code = code;
    this.msg = msg;
  }
}
```

### 处理出参数据格式

添加中间件 `src/middleware/format.middleware.ts`

```ts
// src/middleware/format.middleware.ts
import { IMiddleware } from "@midwayjs/core";
import { Middleware } from "@midwayjs/decorator";
import { NextFunction, Context } from "@midwayjs/koa";
import { ErrorCode } from "../common/ErrorCode";

/**
 * 对接口返回的数据统一包装
 */
@Middleware()
export class FormatMiddleware implements IMiddleware<Context, NextFunction> {
  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const result = await next();
      return { code: ErrorCode.OK, msg: "OK", data: result };
    };
  }

  match(ctx) {
    return ctx.path.indexOf("/api") === 0;
  }

  static getName(): string {
    return "API_RESPONSE_FORMAT";
  }
}
```

- `@Middleware()` 标识此类是一个中间件
- `match(ctx)` 方法确定哪些路径会被拦截

详细的中间件使用说明见：

http://www.midwayjs.org/docs/middleware

注册中间件，修改配置文件 `src/configuration.ts`

```ts
import { Configuration, App } from "@midwayjs/decorator";
import * as koa from "@midwayjs/koa";
import * as validate from "@midwayjs/validate";
import * as info from "@midwayjs/info";
import { join } from "path";
import { ReportMiddleware } from "./middleware/report.middleware";
import * as orm from "@midwayjs/typeorm";
import { FormatMiddleware } from "./middleware/format.middleware";

@Configuration({
  imports: [
    orm, // 引入orm组件
    koa,
    validate,
    {
      component: info,
      enabledEnvironment: ["local"],
    },
  ],
  importConfigs: [join(__dirname, "./config")],
})
export class ContainerLifeCycle {
  @App()
  app: koa.Application;

  async onReady() {
    // 注册中间件 FormatMiddleware
    this.app.useMiddleware([FormatMiddleware, ReportMiddleware]);
  }
}
```

### 异常处理

midway 提供全局的异常捕获与自动处理，因此统一的异常处理可以使用异常过滤器，可以在这里进行异常的封装处理

创建或者修改异常过滤器 `src/filter/default.filter.ts`

```ts
// src/filter/default.filter.ts
import { Catch } from "@midwayjs/decorator";
import { Context } from "@midwayjs/koa";
import { ErrorCode } from "../common/ErrorCode";

@Catch()
export class DefaultErrorFilter {
  async catch(err: Error, ctx: Context) {
    return { code: ErrorCode.UN_ERROR, msg: err.message };
  }
}
```

创建或者修改异常过滤器 `src/filter/notfound.filter.ts`

```ts
// src/filter/notfound.filter.ts
import { Catch } from "@midwayjs/decorator";
import { httpError, MidwayHttpError } from "@midwayjs/core";
import { Context } from "@midwayjs/koa";

@Catch(httpError.NotFoundError)
export class NotFoundFilter {
  async catch(err: MidwayHttpError, ctx: Context) {
    // 404 错误会到这里 也可以参考上面default的写法，返回404的错误信息
    ctx.redirect("/404.html");
  }
}
```

注册异常过滤器：

```ts
// src/configuration.ts
import { Configuration, App } from "@midwayjs/decorator";
import * as koa from "@midwayjs/koa";
import * as validate from "@midwayjs/validate";
import * as info from "@midwayjs/info";
import { join } from "path";
import { ReportMiddleware } from "./middleware/report.middleware";
import * as orm from "@midwayjs/typeorm";
import { FormatMiddleware } from "./middleware/format.middleware";
import { NotFoundFilter } from "./filter/notfound.filter";
import { DefaultErrorFilter } from "./filter/default.filter";

@Configuration({
  imports: [
    orm, // 引入orm组件
    koa,
    validate,
    {
      component: info,
      enabledEnvironment: ["local"],
    },
  ],
  importConfigs: [join(__dirname, "./config")],
})
export class ContainerLifeCycle {
  @App()
  app: koa.Application;

  async onReady() {
    this.app.useMiddleware([FormatMiddleware, ReportMiddleware]);
    // 注册异常过滤器
    this.app.useFilter([NotFoundFilter, DefaultErrorFilter]);
  }
}
```

### 单元测试

由于调整了返回值，此时单元测试会报错，我们需要调整下单元。修改 `test/controller/user.test.ts`

```js
o = result.body;
# 改为
o = result.body.data;
```

同时由于在`baseService`中对 create 和 update 操作增加了 userContext.userId 硬性需求，因此单元测试操作前必须执行登录操作注入登录信息到上下文。对此执行 controller 的生命周期封装，service 的单元测试生命周期同理。

```ts
import { Application, Framework } from "@midwayjs/koa";
import { close, createApp } from "@midwayjs/mock";
import { UserService } from "../../src/service/user.service";
import { User } from "../../src/entity/user";
import { SnowflakeIdGenerate } from "../../src/utils/Snowflake";
import { encrypt } from "../../src/utils/PasswordEncoder";
import { CommonController } from "../../src/controller/common.controller";

export interface ControllerContext {
  app: Application | null;
  token: string;
}

let globalUsername: string;

/**
 * @description 单元测试预处理函数-预登录与token注入-Controller专属
 * @param context 注意app与token必须以对象形式传入，个人试验如果以(app, token)单个参数传入，会构成无效拷贝，test.ts函数内部变量无法生效
 */
export async function beforeHandler(context: ControllerContext) {
  try {
    const id = new SnowflakeIdGenerate().generate();
    const username = id.toString();
    const password = id.toString();
    globalUsername = username;
    context.app = await createApp<Framework>();
    // 初始化一个账号
    const ctx = context.app.createAnonymousContext();
    ctx.userContext = { userId: id, username: username };
    const userService = await ctx.requestContext.getAsync(UserService);
    let user: User = await userService.findByUsername(username);
    if (user == null) {
      user = new User();
      user = Object.assign(user, {
        username,
        password: encrypt(password),
        updaterId: 1,
        createrId: 1,
        regTime: new Date(),
      });
      const o = await userService.create(user);
      console.log(o);
    }
    const commonController = await ctx.requestContext.getAsync(
      CommonController
    );
    // 获取验证码 不直接调用接口因为获取不了图片真正text 从源码可知 验证码id是 ${idPrefix}:${id}的格式 这里手动获取captchaCode
    const imageResult = await commonController.captchaService.image();
    const captchaPrefixId: string =
      commonController.captchaService.captcha.idPrefix;
    const captchaId: string = imageResult.id;
    const captchaCode: string =
      await commonController.captchaService.cacheManager.get(
        `${captchaPrefixId}:${captchaId}`
      );
    const loginVO = await commonController.login({
      username,
      password,
      captchaId,
      captchaCode,
    });
    // 获取一个访问凭证
    context.token = loginVO.accessToken;
  } catch (err) {
    console.error("test beforeAll error", err);
    throw err;
  }
}

/**
 * @description 单元测试后置处理函数-关闭应用-Controller专属
 * @param context 注意app必须以对象形式传入，个人试验如果以(app)单个参数传入，会构成无效拷贝，test.ts函数内部变量无法生效
 */
export async function afterHandler(context: ControllerContext) {
  // 删除beforeHandler阶段新增的账号
  const userService = await context.app
    .getApplicationContext()
    .getAsync<UserService>(UserService);
  const user: User = await userService.findByUsername(globalUsername);
  if (user != null) {
    await userService.delete(user.id);
  }
  await close(context.app);
}
```

```shell
>npm run test

Test Suites: 2 passed, 2 total
Tests:       4 passed, 4 total
Snapshots:   0 total
Time:        6.525 s, estimated 9 s
```

## 工具类

### 问题&需求

- 数据库主键需要是一个有序的、全局唯一的长整形；
- 用户的密码需要加密存储，能够验证密码；
- 业务异常需要需要返回给前端，这里使用断言工具；

### 主键生成器

Snowflake 主键生成算法是一种分布式唯一 ID 生成算法，它可以在分布式系统中生成唯一的 ID。Snowflake 算法的核心思想是将一个 64 位的二进制整数分成多个部分，每个部分代表不同的信息，从而生成唯一的 ID。

具体来说，Snowflake 算法将 64 位的二进制整数分成以下几个部分：

1. 时间戳部分：占用 42 位，精确到毫秒级别，可以使用 69 年。
2. 数据中心部分：占用 5 位，可以表示 32 个不同的数据中心。
3. 机器标识部分：占用 5 位，可以表示 32 个不同的机器。
4. 序列号部分：占用 12 位，可以表示 4096 个不同的序列号。

Snowflake 算法根据当前时间戳、数据中心、机器标识和序列号生成唯一的 ID。由于时间戳部分在高位，数据中心、机器标识和序列号在低位，因此 Snowflake 算法生成的 ID 是递增的，可以保证在分布式系统中生成的 ID 是唯一的。

Snowflake 算法的优点是生成的 ID 具有时间戳信息，可以根据 ID 反推出生成时间，同时具有足够的容量和性能。缺点是需要保证数据中心和机器标识的唯一性，同时需要保证系统时钟的同步性。

对于个人使用的单台云服务器而言，该算法仍然可以放心使用。

创建工具目录 `utils`

创建工具类 `src/utils/Snowflake.ts`

```ts
// src/utils/Snowflake.ts
import { Provide } from "@midwayjs/decorator";

/**
 * Snowflake主键生成算法
 * 完整的算法是生成的ID长度为20位
 * 但是由于js最大值9007199254740991，再多就会溢出，再多要特殊处理。
 * 所以这里设置长度为16位id。将数据中心位调小到1位，将服务器位调小到1位，将序列位调小到10位
 * 这意味着最多支持两个数据中心，每个数据中心最多支持两台服务器
 */
@Provide("idGenerate")
export class SnowflakeIdGenerate {
  private twepoch = 0;
  private workerIdBits = 1;
  private dataCenterIdBits = 1;
  private maxWrokerId = -1 ^ (-1 << this.workerIdBits); // 值为：1
  private maxDataCenterId = -1 ^ (-1 << this.dataCenterIdBits); // 值为：1
  private sequenceBits = 10;
  private workerIdShift = this.sequenceBits; // 值为：10
  private dataCenterIdShift = this.sequenceBits + this.workerIdBits; // 值为：11
  // private timestampLeftShift =
  //   this.sequenceBits + this.workerIdBits + this.dataCenterIdBits; // 值为：12
  private sequenceMask = -1 ^ (-1 << this.sequenceBits); // 值为：4095
  private lastTimestamp = -1;
  private workerId = 1; //设置默认值,从环境变量取
  private dataCenterId = 1;
  private sequence = 0;

  constructor(_workerId = 0, _dataCenterId = 0, _sequence = 0) {
    if (this.workerId > this.maxWrokerId || this.workerId < 0) {
      throw new Error(
        "config.worker_id must max than 0 and small than maxWrokerId-[" +
          this.maxWrokerId +
          "]"
      );
    }
    if (this.dataCenterId > this.maxDataCenterId || this.dataCenterId < 0) {
      throw new Error(
        "config.data_center_id must max than 0 and small than maxDataCenterId-[" +
          this.maxDataCenterId +
          "]"
      );
    }
    this.workerId = _workerId;
    this.dataCenterId = _dataCenterId;
    this.sequence = _sequence;
  }

  private timeGen = (): number => {
    return Date.now();
  };

  private tilNextMillis = (lastTimestamp): number => {
    let timestamp = this.timeGen();
    while (timestamp <= lastTimestamp) {
      timestamp = this.timeGen();
    }
    return timestamp;
  };

  private nextId = (): number => {
    let timestamp: number = this.timeGen();
    if (timestamp < this.lastTimestamp) {
      throw new Error(
        "Clock moved backwards. Refusing to generate id for " +
          (this.lastTimestamp - timestamp)
      );
    }
    if (this.lastTimestamp === timestamp) {
      this.sequence = (this.sequence + 1) & this.sequenceMask;
      if (this.sequence === 0) {
        timestamp = this.tilNextMillis(this.lastTimestamp);
      }
    } else {
      this.sequence = 0;
    }
    this.lastTimestamp = timestamp;
    // js 最大值 9007199254740991，再多就会溢出
    // 超过 32 位长度，做位运算会溢出，变成负数，所以这里直接做乘法，乘法会扩大存储
    const timestampPos = (timestamp - this.twepoch) * 4096;
    const dataCenterPos = this.dataCenterId << this.dataCenterIdShift;
    const workerPos = this.workerId << this.workerIdShift;
    return timestampPos + dataCenterPos + workerPos + this.sequence;
  };

  generate = (): number => {
    return this.nextId();
  };
}
```

### 密码工具

安装组件

```shell
npm i bcryptjs --save
```

添加工具类 `src/utils/PasswordEncoder.ts`

```ts
// src/utils/PasswordEncoder.ts
const bcrypt = require("bcryptjs");

/**
 * 加密。加上前缀{bcrypt}，为了兼容多种加密算法，这里暂时只实现bcrypt算法
 */
export function encrypt(password) {
  const salt = bcrypt.genSaltSync(5);
  const hash = bcrypt.hashSync(password, salt, 64);
  return "{bcrypt}" + hash;
}

/**
 * 解密
 */
export function decrypt(password, hash) {
  if (hash.indexOf("{bcrypt}") === 0) {
    hash = hash.slice(8);
  }
  return bcrypt.compareSync(password, hash);
}
```

### 断言工具

```ts
// src/common/Assert.ts
import { CommonException } from "./CommonException";

export class Assert {
  /**
   * 不为空断言
   */
  static notNull(obj: any, errorCode: number, errorMsg: string) {
    if (!obj) {
      throw new CommonException(errorCode, errorMsg);
    }
  }

  /**
   * 空字符串断言
   */
  static notEmpty(obj: any, errorCode: number, errorMsg: string) {
    if (!obj || "" === obj.trim()) {
      throw new CommonException(errorCode, errorMsg);
    }
  }

  /**
   * 布尔断言
   */
  static isTrue(expression: boolean, errorCode: number, errorMsg: string) {
    if (!expression) {
      throw new CommonException(errorCode, errorMsg);
    }
  }
}
```

## 接口安全认证

很多时候，后端接口需要登录后才能进行访问，甚至有的接口需要拥有相应的权限才能访问。这里实现 bearer 验证方式（bearerFormat 为 JWT）。

### 安装 JWT 组件

```shell
npm i @midwayjs/jwt@3 --save
npm i @types/jsonwebtoken --save-dev
```

安装完成后 package.json 文件中会多出如下配置

```json
{
  "dependencies": {
    "@midwayjs/jwt": "^3.3.11"
  },
  "devDependencies": {
    "@types/jsonwebtoken": "^8.5.8"
  }
}
```

### 添加 JWT 配置

修改 `src/config/config.default.ts`

```ts
// src/config/config.default.ts
jwt: {
  secret: 'setscrew',
  expiresIn: 60 * 60 * 24,
}
```

注册 JWT 组件

```ts
// src/configuration.ts
import * as jwt from "@midwayjs/jwt";

@Configuration({
  imports: [
    jwt,
    //...
  ],
})
export class ContainerLifeCycle {
  //...
}
```

关于 JWT 的详细使用文档，见：

http://www.midwayjs.org/docs/extensions/jwt

### 安装 Redis 组件

```shell
npm i @midwayjs/redis@3 --save
npm i @types/ioredis --save-dev
```

安装完后 package.json 文件中会多出如下配置

```json
{
  "dependencies": {
    "@midwayjs/redis": "^3.0.0"
  },
  "devDependencies": {
    "@types/ioredis": "^4.28.7"
  }
}
```

### 注册 Redis 组件

```ts
// src/configuration.ts
import * as redis from "@midwayjs/redis";

@Configuration({
  imports: [
    redis,
    // ...
  ],
})
export class ContainerLifeCycle {
  // ...
}
```

### 添加配置

修改 `src/config/config.default.ts`

#### 添加 Redis 配置

```ts
// src/config/config.default.ts
redis: {
  client: {
    host: 127.0.0.1,
    port: 6379,
    db: 0,
  },
}
```

关于 Redis 的详细使用文档，见：

http://www.midwayjs.org/docs/extensions/redis

#### 添加安全拦截配置

```ts
// src/config/config.default.ts
app: {
  security: {
    prefix: '/api',         // 指定已/api开头的接口地址需要拦截
    ignore: ['/api/login'], // 指定该接口地址，不需要拦截
  },
}
```

### 添加接口安全拦截中间件

#### 添加常量定义

```ts
// src/common/Constant.ts
export class Constant {
  // 登录验证时，缓存用户登录状态KEY的前缀
  static TOKEN = "TOKEN";
}
```

#### 添加用户访问上下文类

```ts
// src/common/UserContext.ts
/**
 * 登录后存储访问上下文的状态数据，同时也会存在redis缓存中
 */
export class UserContext {
  userId: number;
  username: string;
  phoneNum: string;
  constructor(userId: number, username: string, phoneNum: string) {
    this.userId = userId;
    this.username = username;
    this.phoneNum = phoneNum;
  }
}
```

新增或者编辑 `src/interface.ts`

```ts
// src/interface.ts
import "@midwayjs/core";
import { UserContext } from "./common/UserContext";

declare module "@midwayjs/core" {
  interface Context {
    userContext: UserContext;
  }
}
```

新增中间件 `src/middleware/security.middleware.ts`

```ts
// src/middleware/security.middleware.ts
import { Config, Inject, Middleware } from "@midwayjs/decorator";
import { Context, NextFunction } from "@midwayjs/koa";
import { httpError } from "@midwayjs/core";
import { JwtService } from "@midwayjs/jwt";
import { UserContext } from "../common/UserContext";
import { RedisService } from "@midwayjs/redis";
import { Constant } from "../common/Constant";

/**
 * 安全验证
 */
@Middleware()
export class SecurityMiddleware {
  @Inject()
  jwtUtil: JwtService;

  @Inject()
  cacheUtil: RedisService;

  @Config("app.security")
  securityConfig;

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      if (!ctx.headers["authorization"]) {
        throw new httpError.UnauthorizedError("缺少凭证");
      }
      const parts = ctx.get("authorization").trim().split(" ");
      if (parts.length !== 2) {
        throw new httpError.UnauthorizedError("无效的凭证");
      }
      const [scheme, token] = parts;
      if (!/^Bearer$/i.test(scheme)) {
        throw new httpError.UnauthorizedError("缺少Bearer");
      }
      // 验证token，过期会抛出异常
      const jwt = await this.jwtUtil.verify(token, { complete: true });
      // jwt中存储的user信息
      const payload = jwt["payload"];
      const key = Constant.TOKEN + ":" + payload.userId + ":" + token;
      const ucStr = await this.cacheUtil.get(key);
      // 服务器端缓存中存储的user信息
      const uc: UserContext = JSON.parse(ucStr);
      if (payload.username !== uc.username) {
        throw new httpError.UnauthorizedError("无效的凭证");
      }
      // 存储到访问上下文中
      ctx.userContext = uc;
      return next();
    };
  }

  public match(ctx: Context): boolean {
    const { path } = ctx;
    const { prefix, ignore } = this.securityConfig;
    const exist = ignore.find((item) => {
      return item.match(path);
    });
    return path.indexOf(prefix) === 0 && !exist;
  }

  public static getName(): string {
    return "SECURITY";
  }
}
```

- `@Config('app.security')` 装饰类，指定加载配置文件 `src/config/config.**.ts` 中对应的配置信息
- 使用 JwtService 进行 JWT 编码校验

jwt token 将用户信息编码在 token 中，解码后可以获取对应用户数据，通常情况下，不需要存储到 redis 中； 但是有个缺点就是，不能人为控制分发出去的 token 失效。所以，有时人们会使用缓存中的用户信息；这里使用了 JWT+Redis 的方式，是为了演示两种做法

#### 注册使用 jwt 中间件

```ts
// src/configuration.ts
this.app.useMiddleware([
  SecurityMiddleware,
  FormatMiddleware,
  ReportMiddleware,
]);
```

添加登录接口

添加 DTO

```ts
// src/api/dto/CommonDTO.ts
export class LoginDTO {
  username: string;
  password: string;
}
```

添加 VO

```ts
// src/api/vo/CommonVO.ts
export class LoginVO {
  accessToken: string;
  expiresIn: number;
}
```

修改 `src/service/user.service.ts`，添加通过用户名查找用户接口

```ts
import { Provide } from "@midwayjs/decorator";
import { User } from "../eneity/user";
import { InjectEntityModel } from "@midwayjs/typeorm";
import { Repository } from "typeorm";
import { BaseService } from "../common/BaseService";

@Provide()
export class UserService extends BaseService<User> {
  @InjectEntityModel(User)
  model: Repository<User>;

  getModel(): Repository<User> {
    return this.model;
  }

  async findByUsername(username: string): Promise<User> {
    return this.model.findOne({ where: { username } });
  }
}
```

添加 Controller `src/controller/common.controller.ts`

```ts
// src/controller/common.controller.ts
import {
  Body,
  Config,
  Controller,
  Get,
  Inject,
  Post,
} from "@midwayjs/decorator";
import { Context } from "@midwayjs/koa";
import { UserService } from "../service/user.service";
import { RedisService } from "@midwayjs/redis";
import { LoginDTO } from "../music-api/dto/LoginDTO";
import { Captcha, LoginVO } from "../music-api/vo/LoginVO";
import { SnowflakeIdGenerate } from "../utils/Snowflake";
import { JwtService } from "@midwayjs/jwt";
import { Assert } from "../common/Assert";
import { ErrorCode } from "../music-api/code/ErrorCode";
import { UserContext } from "../common/UserContext";
import { Constant } from "../common/Constant";
import { ILogger } from "@midwayjs/core";
import { decrypt } from "../utils/PasswordEncoder";
import { Validate } from "@midwayjs/validate";
import { ApiResponse, ApiTags } from "@midwayjs/swagger";
import { CaptchaService } from "@midwayjs/captcha";

@ApiTags(["common"])
@Controller("/api")
export class CommonController {
  @Inject()
  logger: ILogger;

  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @Inject()
  cacheUtil: RedisService;

  @Inject()
  jwtUtil: JwtService;

  @Inject()
  idGenerate: SnowflakeIdGenerate;

  @Config("jwt")
  jwtConfig;

  @Inject()
  captchaService: CaptchaService;

  @ApiResponse({ type: LoginVO })
  @Validate()
  @Post("/login", { description: "公共网关登录" })
  async login(@Body() body: LoginDTO): Promise<LoginVO> {
    // 验证码优先校验
    const passed: boolean = await this.captchaService.check(
      body.captchaId,
      body.captchaCode
    );
    Assert.isTrue(passed, ErrorCode.UN_ERROR, "验证码错误");
    const user = await this.userService.findByUsername(body.username);
    // 登录空判
    Assert.notNull(user, ErrorCode.UN_ERROR, "用户不存在");
    const flag: boolean = decrypt(body.password, user.password);
    // 密码校验
    Assert.isTrue(flag, ErrorCode.UN_ERROR, "用户名或者密码错误");
    // 创建UserContext上下文类
    const { id, username } = user;
    const userContext: UserContext = new UserContext(id, username);
    // 设置token缓存
    const accessToken: string = await this.jwtUtil.sign({ ...userContext });
    const key: string = Constant.getKey(id, accessToken);
    const expiresInMinutes: number = this.jwtConfig.expiresIn;
    this.cacheUtil.set(
      key,
      JSON.stringify(userContext),
      "EX",
      expiresInMinutes
    );
    // 返回登录信息与token
    const loginVO = new LoginVO();
    loginVO.username = username;
    loginVO.roles = ["admin"];
    loginVO.accessToken = accessToken;
    const expiresMillMinutes = Date.now() + expiresInMinutes * 1000;
    loginVO.expires = new Date(expiresMillMinutes);
    return loginVO;
  }

  @ApiResponse({ type: Captcha })
  @Get("/captchaGet", { description: "获取验证码" })
  async getImageCaptcha(): Promise<Captcha> {
    const { id, imageBase64 } = await this.captchaService.image({
      width: 120,
      height: 40,
    });
    const captchaPrefixId: string = this.captchaService.captcha.idPrefix;
    const text = await this.captchaService.cacheManager.get(
      `${captchaPrefixId}:${id}`
    );
    this.logger.info("当前验证的文本信息是：%s", text);
    return {
      id, // 验证码 id
      imageBase64, // 验证码 SVG 图片的 base64 数据，可以直接放入前端的 img 标签内
    };
  }
}
```

## Swagger 集成

Swagger 是一个集成在系统内部，能够通过装饰类描述接口文档的工具，可以方便的测试接口。

### 安装 Swagger 组件

```shell
npm install @midwayjs/swagger@3 --save
npm install swagger-ui-dist --save
```

### 注册组件

```ts
// src/configuration.ts
import * as swagger from "@midwayjs/swagger";

@Configuration({
  imports: [
    swagger,
    // ...
  ],
})
export class ContainerLifeCycle {
  // ...
}
```

### 验证 Swagger

启动后访问：`http://127.0.0.1:7001/swagger-ui/index.html`

![Swagger验证图](https://misaka10032.oss-cn-chengdu.aliyuncs.com/midway/midway-swaggerImage.png)

### 测试接口

验证接口，提示 `缺少凭证`，需要 Swagger 支持 bearer 验证。

![Swagger缺少凭证](https://misaka10032.oss-cn-chengdu.aliyuncs.com/midway/swagger-needBearer.png)

### 添加 bearer 支持

添加配置

```ts
// src/config/config.default.ts
swagger: {
  auth: {
    authType: 'bearer',
  },
},
```

在对应 Controller 中添加注解 `@ApiBearerAuth()`

```ts
// src/controller/user.controller.ts
@ApiBearerAuth()
@Controller("/api/user")
export class UserController extends BaseController<User> {
  // ...
}
```

### Swagger 常用装饰类

- `@ApiTags()` 通常用于 Controller，将其分类标记；
- `@ApiResponse()` 用于标注 API 的返回值；
- `@ApiProperty()` 用于标注返回 DTO、VO，实体类的属性；

关于 Swagger 的详细使用文档，见：

http://www.midwayjs.org/docs/extensions/swagger

### 使用 Swagger Knife4j2

安装

```shell
npm install midwayjs-kinfe4j2 --save
```

依赖

```json
{
  "@midwayjs/swagger": "^3.3.14",
  "midwayjs-kinfe4j2": "^0.0.2"
}
```

修改导入

```ts
import ??? from '@midwayjs/swagger';
// 改为
import ??? from 'midwayjs-knife4j2';
```

## 环境变量

通常我们不希望将生产环境的相关配置写在项目代码中，而希望在不同的环境中启动时自动读取环境中设置的配置； 在本教程中，我也不希望将自己的数据库、缓存 IP 提交到代码仓库，所以可以使用环境变量+host；

### 安装 env 组件

```shell
npm install dotenv --save
```

### 初始化环境变量

```ts
// src/configuration.ts
import * as dotenv from "dotenv";

// 初始化环境变量 默认获取.env文件
// 如果要区分不同环境使用不同文件，在config中传入`.env.${process.env.NODE_ENV}`并在根目录创建对应文件即可
dotenv.config();

@Configuration({
  imports: [
    // ...
  ],
})
export class ContainerLifeCycle {
  // ...
}
```

### 配置变量

在根目录添加文件 `.env`

```text
// .env
MYSQL_HOST=devserver
MYSQL_USERNAME=dev
MYSQL_PASSWORD=123456
MYSQL_PORT=3306
REDIS_HOST=devserver
REDIS_PORT=6379
```

在 host 文件中添加域名映射

```text
// windows电脑
// C:\Windows\System32\drivers\etc\hosts
// xx.xx.xx.xx 为你自己mysql、redis的ip，如果在一台机器上的话
xx.xx.xx.xx devserver 如果部署目标服务器也在同一台机器，这一步可以省略，devServer直接选用127.0.0.1
```

### 使用变量

```ts
// src/config/config.default.ts
typeorm: {
  dataSource: {
    default: {
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: 'music_manage_system',
      synchronize: true, // 如果第一次使用，不存在表，有同步的需求可以写 true
      logging: true,
      entities: [User],
    }
  }
},
// redis配置
redis: {
  client: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    db: 0,
  },
},
```

在生产环境中使用，你可以将环境变量配置到系统中，如果你是 Docker 启动，可以指定环境变量文件。

## 部署

### 构建 Docker 镜像

Docker 是基于 Go 语言进行开发实现，一个开源的应用容器引擎。

为什么要用 Docker？

1. 可以使用镜像快速构建一套标准的开发环境，快速部署代码；
2. 高效的资源利用，可以实现更高的性能，同时对资源的额外需求很低；
3. 兼容性高，让用户可以在不同平台间轻松的迁移应用；
4. 可以实现自动化且高效的容器管理。

如何构建 Docker？

在项目根目录中添加 Dockerfile 构建配置文件

```dockerfile
FROM node:16.14.2-alpine
WORKDIR /app
ENV TZ="Asia/Shanghai"

COPY . .

RUN npm install --registry=https://registry.npm.taobao.org
RUN npm run build
# 移除开发环境的依赖
RUN npm prune --production

# 暴露端口（内部）
EXPOSE 7001

# 设定容器启动时第一个运行的命令及其参数
ENTRYPOINT ["npm", "run", "start"]
```

### 使用 Jenkins CI/CD

因为我的云服务器内存很小，Docker运行会OOM，所以使用node环境直接部署。

Docker环境的Jenkins流水线参考[Docker流水线脚本](../ecs/1-node-jenkins.html#创建-docker-脚本)

使用Jenkins前，注意在云服务器上预安装Java11、Jenkins、Node、npm、pm2等环境。

**创建 Jenkins 任务**

添加一个流水线风格的任务，编写流水线脚本如下

```groovy
pipeline {
    agent any

    // 初始化env文件所需环境变量，，如果私有git仓库上传了.env文件则不需要这些变量
    parameters {
        string(name: 'MYSQL_PASSWORD', defaultValue: 'your_mysql_password', description: 'MYSQL_PASSWORD')
        string(name: 'OSS_ACCESSKEY_ID', defaultValue: '阿里云OSS-ID', description: 'OSS_ACCESSKEY_ID')
        string(name: 'OSS_ACESSKEY_SECRET', defaultValue: '阿里云OSS-SECRET', description: 'OSS_ACESSKEY_SECRET')
        string(name: 'OSS_BUCKET_NAME', defaultValue: 'misaka10032', description: 'OSS_BUCKET_NAME')
        string(name: 'OSS_ENDPOINT', defaultValue: 'oss-cn-chengdu.aliyuncs.com', description: 'OSS_ENDPOINT')
        string(name: 'OSS_ROLEARN', defaultValue: '阿里云OSS-ROLEARN', description: 'OSS_ROLEARN')
        string(name: 'OSS_PREFIX', defaultValue: 'https://misaka10032.oss-cn-chengdu.aliyuncs.com', description: 'OSS_PREFIX')
    }

    stages {
        // 拉取github仓库代码
        stage('Checkout') {
            steps {
                git credentialsId: 'your_jenkins_securityId',
                    url: 'ssh_git_repository',
                    branch: 'main'
                // 初始化和更新 Git 子模块
                sh 'git submodule init'
                sh 'git submodule update --recursive'
            }
        }

        // 初始化env环境文件，如果私有git仓库上传了这个文件则不需要这个步骤
        stage('ENV') {
            steps {
            sh '''
            rm -f .env
cat>.env<<EOF
MYSQL_HOST=localhost
MYSQL_USERNAME=root
MYSQL_PASSWORD=$MYSQL_PASSWORD
MYSQL_PORT=3306
REDIS_HOST=localhost
REDIS_PORT=6379
OSS_ACCESSKEY_ID=$OSS_ACCESSKEY_ID
OSS_ACESSKEY_SECRET=$OSS_ACESSKEY_SECRET
OSS_BUCKET_NAME=$OSS_BUCKET_NAME
OSS_ENDPOINT=$OSS_ENDPOINT
OSS_ROLEARN=$OSS_ROLEARN
OSS_PREFIX=$OSS_PREFIX
EOF
            cat .env
            '''
            echo "create .env success"
            }
        }

        // 安装依赖
        stage('Install') {
            steps {
               sh "npm install"
            }
        }

        // 项目打包
        stage("Build") {
            steps {
                sh "npm run build"
            }
        }

        // 项目部署
        stage('Deploy') {
            steps {
                script {
                    try {
                        sh "pm2 stop all"
                    } catch (Exception e) {
                        echo "No pm2 start"
                    } finally {
                        sh "npm run pmstart"
                    }
                }
            }
        }
    }
}
```
