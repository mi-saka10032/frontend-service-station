---
title: TypeORM
order: 4

tag:
  - ORM库
  - SQL持久化
---

## TypeORM 简介

TypeORM 是一个开源的 ORM（Object-Relational Mapping）框架，它是用 TypeScript 编写的，支持多种数据库（如 MySQL，PostgreSQL，SQLite，Microsoft SQL Server 等），并且可以在 Node.js，浏览器和 React Native 中使用。

TypeORM 提供了一种将关系型数据库中的数据映射到对象（类）中的方式，从而让开发人员能够以面向对象的方式进行数据库操作。它支持实体（Entity），关联关系（Relationship），查询构建器（Query Builder）和迁移（Migration）等功能。

实体（Entity）是 TypeORM 中的核心概念，它是一个 JavaScript 类，表示数据库中的表。实体类中的属性对应表中的列，而实体类的实例对应表中的行。TypeORM 提供了一些装饰器（Decorator）来标记实体类的属性，例如@Column，@PrimaryColumn，@ManyToOne 等。

关联关系（Relationship）是实体之间的关系，例如一对多，多对多等。TypeORM 支持多种关联关系，并提供了一些装饰器来标记关联关系，例如@OneToMany，@ManyToMany 等。

查询构建器（Query Builder）是 TypeORM 提供的一种查询数据库的方式，它以面向对象的方式构建查询语句，使得查询语句更加清晰易懂。Query Builder 支持链式调用，可以在查询中使用各种条件，例如 where，orderBy，groupBy 等。

迁移（Migration）是 TypeORM 提供的一种数据库迁移工具，它可以帮助开发人员在不影响数据的情况下修改数据库结构。迁移可以创建，修改和删除表，列和索引等。TypeORM 会自动跟踪数据库结构的变化，并生成相应的 SQL 语句。

总之，TypeORM 是一个功能强大，易于使用的 ORM 框架，它可以帮助开发人员更快地开发应用程序，并提高代码的可维护性。

注意：**下面的 TypeORM 使用模板与解析均基于 mysql 和 MidwayJS 进行。**

## 目录结构

以 MidwayJS 的项目目录为例（项目模板创建步骤：[初始化 Midway](../midway/2-midway-init#初始化创建)），构成 typeORM 文件目录结构如下：

```text
MyProject
├── src                                             // TS 根目录
│   ├── config
│   │   └── config.default.ts           // 应用配置文件
│   ├── entity                                      // 实体（数据库 Model) 目录
│   │   ├── album.ts                       // 实体文件
│   │   ├── singer.ts                      // 实体文件
│   │   └── song.ts                        // 实体文件
│   ├── configuration.ts                    // Midway 配置文件
│   └── service                                     // 其他的服务目录
├── .gitignore
├── package.json
├── README.md
└── tsconfig.json
```

数据库配置步骤：[mysql 和 typeORM 配置](../midway/2-midway-init#增删改查)。

## 实体

我们通过模型和数据库关联，在应用中的模型就是数据库表，在 TypeORM 中，模型是和实体绑定的，每一个实体文件，既是 Model，也是实体(Entity)。

以一个专辑 Album 实体举例。新建 entity 目录，在其中添加实体文件 album.ts。

```ts
// entity/album.ts
import { Entity, Column } from "typeorm";
import { BaseEntity } from "../common/BaseEntity";
import { ApiProperty } from "@midwayjs/swagger";

// 专辑表实体类
@Entity("album")
export class Album extends BaseEntity {
  @ApiProperty({ description: "专辑名称" })
  @Column({ length: 100, unique: true })
  albumName: string;

  @ApiProperty({ description: "发行日期" })
  @Column({ nullable: true })
  publishTime: Date;

  @ApiProperty({ description: "封面图片链接" })
  @Column({ length: 100, nullable: true })
  coverUrl: string;
}
```

考虑到有很多实体列是可复用属性，创建 BaseEntity 向 entity 目录下的各个 entity 提供可继承父类

**注意**

1. TypeORM 为了兼容多个数据库系统，对主键的处理为：按照主键指定格式向数据库填充格式化数据，对外查询结果转化为字符串类型；
2. 在 node 环境下，为了确保 response 能返回期望类型格式的主键数据，需要使用 transformer 来实现 to（insert）和 from（select）方法；
3. 如果对主键类型限制不严，可以不执行 transformer；
4. 这里的主键是外部提供的算法生成，如果需要自增主键列，可以将 `@PrimaryColumn` 装饰器更改为 `@PrimaryGeneratedColumn` 装饰器。

```ts
// common/BaseEntity.ts
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

## 新增数据

1. 创建 Entity 对象
2. 执行`save()`

```ts
import { Provide } from "@midwayjs/core";
import { Repository } from "typeorm";
import { InjectEntityModel } from "@midwayjs/typeorm";
import { Album } from "../entity/album";
import { SnowflakeIdGenerate } from "../utils/Snowflake";

@Provide()
export class AlbumService {
  @Inject()
  idGenerate: SnowflakeIdGenerate;

  @InjectEntityModel(Album)
  albumModel: Repository<Album>;

  // save
  async createAlbum() {
    // create a entity object
    let album = new Album();
    // 雪花算法生成id 这里假定为id = 1
    album.id = this.idGenerate.generate();
    // 从已登录的context上下文中获取userId
    album.createrId = this.ctx.userContext.userId;
    album.updaterId = this.ctx.userContext.userId;
    album.albumName = "qi li xiang";
    album.publishTime = new Date();
    album.coverUrl = "https://www.misaka10032.com/coverUrl";

    // save entity
    const albumResult: Album = await this.albumModel.save(album);

    // save success
    console.log("album id = ", albumResult.id);
  }
}
```

## 查询数据

更多的查询参数，详见[官方文档](https://github.com/typeorm/typeorm/blob/master/docs/zh_CN/find-options.md)

```ts
import { Provide } from "@midwayjs/core";
import { InjectEntityModel } from "@midwayjs/typeorm";
import { Album } from "../entity/album";
import { Repository, MoreThanOrEqual, ILike } from "typeorm";

@Provide()
export class AlbumService {
  @InjectEntityModel(Album)
  albumModel: Repository<Album>;

  // find
  async findAlbums() {
    // find All
    let allAlbums = await this.albumModel.find({});
    console.log("All albums from the db: ", allAlbums);

    // find first
    let firstAlbum = await this.albumModel.findOne({
      where: {
        id: 1,
      },
    });
    console.log("First album from the db: ", firstAlbum);

    // find one by name
    let albumByName = await this.albumModel.findOne({
      where: { albumName: "qi li xiang" },
    });
    console.log("qi li xiang album from the db: ", albumByName);

    // find by publishTime
    let publishAlbums = await this.albumModel.find({
      // 查询发布时间大于2023-1-1的专辑
      where: { publishTime: MoreThanOrEqual(new Date('2023-1-1)) },
    });
    console.log("MoreThan 2023-1-1 Albums: ", publishAlbums);

    // find by coverUrl
    let coverUrlAlbums = await this.albumModel.find({
      // 左右全模糊查询封面链接包含'misaka10032'的专辑
      where: { coverUrl: ILike('%misaka10032%') },
    });
    console.log("fuzzyUrl albums: ", coverUrlAlbums);

    // find all and get count
    let [allAlbums, albumsCount] = await this.albumModel.findAndCount({});
    console.log("All albums: ", allAlbums);
    console.log("Albums count: ", albumsCount);
  }
}
```

基于 where 实例对象，这里封装了两个用于修饰 where 内部字符串模糊查询和日期范围条件查询的方法

```ts
import { ILike, Between, MoreThanOrEqual, LessThanOrEqual } from "typeorm";
import { FindOptionsWhere } from "typeorm/find-options/FindOptionsWhere";

/**
 * @description 字符串全模糊匹配查询 为typeORM的快捷API(find系列)补全where对象
 * @param where typeORM的条件对象
 */
function fuzzyWhere(where: FindOptionsWhere<T>) {
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
 * @param whereKey Entity E的键值名
 * @param startDate 起始日期
 * @param endDate 结束日期
 */
function dateRangeWhere<E>(
  where: FindOptionsWhere<E>,
  whereKey: keyof E,
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
```

## 更新数据

更新数据与新增数据共用同一个`save()`方法，TypeORM 会在执行时自动判断该 id 是否存在于表中，如果不存在则新增，如果存在则更新。

```ts
import { Provide } from "@midwayjs/core";
import { InjectEntityModel } from "@midwayjs/typeorm";
import { Album } from "../entity/album";
import { Repository } from "typeorm";

@Provide()
export class AlbumService {
  @InjectEntityModel(Album)
  albumModel: Repository<Album>;

  async updateAlbum() {
    let albumToUpdate = await this.albumModel.findOne({
      where: {
        id: 1,
      },
    });
    albumToUpdate.albumName = "new qi li xiang";

    await this.albumModel.save(albumToUpdate);
  }
}
```

## 删除数据

remove 用于删除给定的实体或实体数组。delete 用于按给定的 ID 或者条件删除。

```ts
import { Provide } from "@midwayjs/core";
import { InjectEntityModel } from "@midwayjs/typeorm";
import { Album } from "../entity/album";
import { Repository } from "typeorm";

@Provide()
export class AlbumService {
  @InjectEntityModel(Album)
  albumModel: Repository<Album>;

  async deleteAlbum() {
    /*...*/
    const album = await this.albumModel.findOne({
      where: {
        id: 1,
      },
    });

    // 删除单个
    await this.albumModel.remove(album);
    // 删除多个
    await this.albumModel.remove([album1, album2, album3]);

    // 按 id 删除
    await this.albumModel.delete(1);
    await this.albumModel.delete([1, 2, 3]);
    await this.albumModel.delete({ albumName: "qi li xiang" });
  }
}
```

软删除手段需要在 Entity 中使用`@DeleteDateColumn`修饰列，会在调用 soft-delete（软删除）时自动设置实体的删除时间。

Entity 声明软删除列之后，可以使用软删除专属方法。

```ts
await this.albumModel.softDelete(1);
// 使用 restore 方法恢复;
await this.albumModel.restore(1);
```

## 一对一关联

在 entity/albumMetadata.ts 中创建一个新类。这个类包含 album 的其他元信息。

```ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Album } from "./Album";

@Entity()
export class AlbumMetadata {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orientation: string;

  @Column()
  compressed: boolean;

  @Column()
  comment: string;

  @OneToOne((type) => Album)
  @JoinColumn()
  album: Album;
}
```

在这里，我们使用一个名为 `@OneToOne` 的新装饰器。它允许我们在两个实体之间创建一对一的关系。`type => Album`是一个函数，它返回我们要与其建立关系的实体的类。

由于语言的特殊性，我们被迫使用一个返回类的函数，而不是直接使用该类。我们也可以将其写为 `() => Album` ，但是我们使用 `type => Album` 作为惯例来提高代码的可读性。类型变量本身不包含任何内容。

我们还添加了一个 `@JoinColumn` 装饰器，它指示关系的这一侧将拥有该关系。关系可以是单向或双向的。关系只有一方可以拥有。关系的所有者端需要使用 `@JoinColumn` 装饰器。 如果您运行该应用程序，则会看到一个新生成的表，该表将包含一列，其中包含用于 Album 关系的外键。

```ts
import { Provide, Inject } from "@midwayjs/core";
import { InjectEntityModel } from "@midwayjs/typeorm";
import { Album } from "./entity/album.entity";
import { AlbumMetadata } from "./entity/albumMetadata";
import { Repository } from "typeorm";
import { SnowflakeIdGenerate } from "../utils/Snowflake";

@Provide()
export class AlbumService {
  @Inject()
  idGenerate: SnowflakeIdGenerate;

  @InjectEntityModel(Album)
  albumModel: Repository<Album>;

  @InjectEntityModel(AlbumMetadata)
  albumMetadataModel: Repository<AlbumMetadata>;

  async updateAlbum() {
    // create a album
    let album = new Album();
    // 雪花算法生成id 这里假定为id = 1
    album.id = this.idGenerate.generate();
    // 从已登录的context上下文中获取userId
    album.createrId = this.ctx.userContext.userId;
    album.updaterId = this.ctx.userContext.userId;
    album.albumName = "qi li xiang";
    album.publishTime = new Date();
    album.coverUrl = "https://www.misaka10032.com/coverUrl";

    // create a album metadata
    let metadata = new AlbumMetadata();
    metadata.compressed = true;
    metadata.comment = "cybershoot";
    metadata.orientation = "portrait";
    metadata.album = album; // this way we connect them

    // first we should save a album
    await this.albumModel.save(album);

    // album is saved. Now we need to save a album metadata
    await this.albumMetadataModel.save(metadata);

    // done
    console.log("done");
  }
}
```

### 双向关系映射

对于两表间的关系，建议应该总是将它们设置为双向映射关系。

```ts
import { Entity } from "typeorm";
import { Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { Album } from "./album";

@Entity()
export class AlbumMetadata {
  /* ... other columns */

  @OneToOne((type) => Album, (album) => album.metadata)
  @JoinColumn() // 声明Album作为一对一关系的主表
  album: Album;
}
```

```ts
import { Entity } from "typeorm";
import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from "typeorm";
import { AlbumMetadata } from "./albumMetadata";

@Entity()
export class Album {
  /* ... other columns */

  @OneToOne((type) => AlbumMetadata, (albumMetadata) => albumMetadata.album)
  metadata: AlbumMetadata;
}
```

请注意，只会在关系映射的一侧使用 `@JoinColumn` 装饰器。无论您放置此装饰器的哪一侧，都是关系的所有者。关系的拥有方在数据库中包含带有外键的列。

### 加载对象及依赖关系

使用关键字 `relations`

```ts
import { Provide, Inject } from "@midwayjs/core";
import { InjectEntityModel } from "@midwayjs/typeorm";
import { Album } from "./entity/album";
import { Repository } from "typeorm";

@Provide()
export class AlbumService {
  @InjectEntityModel(Album)
  albumModel: Repository<Album>;

  // find
  async findAlbum() {
    /*...*/
    let albums = await this.albumModel.find({ relations: ["metadata"] }); // typeorm@0.2.x
  }
}
```

这里的 `albums.metdata` 如果一对一关系存在，则会表现为一个包含完整 albumMetadata 属性的对象。

### 其他关联属性

关联关系还有其他可配置属性，比如删除 albumMetadata 并不希望对应的 album 实体一并被删除，则需要在 `@OneToOne`的第二个参数位设置关联属性`onDelete: 'SET NULL'`

```ts
import { Entity } from "typeorm";
import { Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { Album } from "./album";

@Entity()
export class AlbumMetadata {
  /* ... other columns */

  @OneToOne((type) => Album, (album) => album.metadata, {
    onDelete: "SET NULL",
  })
  @JoinColumn()
  album: Album;
}
```

## 一对多/多对多关联

创建 Song 类，Album 与 Song 为一对多关系。同时创建 Singer 类，Singer 与 Song 为多对多关系。

```ts
import { Entity, Column, ManyToMany, JoinTable } from "typeorm";
import { BaseEntity } from "../common/BaseEntity";
import { ApiProperty } from "@midwayjs/swagger";
import { Song } from "./song";

// 歌手表实体类
@Entity("singer")
export class Singer extends BaseEntity {
  @ApiProperty({ description: "歌手名" })
  @Column({ length: 100, unique: true })
  singerName: string;

  @ApiProperty({ description: "封面图片链接" })
  @Column({ length: 100, nullable: true })
  coverUrl: string;

  // 歌手与歌曲多对多关系，且歌手为关系拥有者
  @ManyToMany(() => Song, (song: Song) => song.singers)
  @JoinTable()
  songs: Array<Song>;
}
```

```ts
import { Entity, Column, ManyToOne, ManyToMany } from "typeorm";
import { BaseEntity } from "../common/BaseEntity";
import { ApiProperty } from "@midwayjs/swagger";
import { Album } from "./album";
import { Singer } from "./singer";

// 歌曲表实体类
@Entity("song")
export class Song extends BaseEntity {
  @ApiProperty({ description: "歌曲名称" })
  @Column({ length: 100 })
  songName: string;

  @ApiProperty({ description: "歌曲时长" })
  @Column({ type: "int" })
  duration: number;

  @ApiProperty({ description: "歌词" })
  @Column({ type: "text", nullable: true })
  lyric: string;

  @ApiProperty({ description: "播放/下载链接" })
  @Column({ length: 100 })
  musicUrl: string;

  @ApiProperty({ description: "发行日期" })
  @Column({ nullable: true })
  publishTime: Date;

  // 多首歌曲可收录于一张专辑内，歌曲与专辑为多对一关系 SET NULL 表示Album删除不会影响关联Song的删除
  @ManyToOne(() => Album, (album: Album) => album.songs, {
    onDelete: "SET NULL",
  })
  album: Album;

  // 歌曲与歌手多对多关系
  @ManyToMany(() => Singer, (singer: Singer) => singer.songs)
  singers: Array<Singer>;
}
```

在多对一/一对多关系中，所有者方始终是多对一。这意味着使用 `@ManyToOne` 的类将存储相关对象的 ID。

多对多关系将会创建新的关系表 `singer_songs_song`

```text
+----------+--------+------+-----+---------+-------+
| Field    | Type   | Null | Key | Default | Extra |
+----------+--------+------+-----+---------+-------+
| singerId | bigint | NO   | PRI | NULL    |       |
| songId   | bigint | NO   | PRI | NULL    |       |
+----------+--------+------+-----+---------+-------+
```

一对多/多对一关系的新增查询同样可使用`relations`关键字来实现联合查询。

## 关联属性配置

其他 RelationOptions 配置如下：

```ts
export interface RelationOptions {
  /**
   * Sets cascades options for the given relation.
   * If set to true then it means that related object can be allowed to be inserted or updated in the database.
   * You can separately restrict cascades to insertion or updation using following syntax:
   *
   * cascade: ["insert", "update", "remove", "soft-remove", "recover"] // include or exclude one of them
   */
  cascade?:
    | boolean
    | ("insert" | "update" | "remove" | "soft-remove" | "recover")[];
  /**
   * Indicates if relation column value can be nullable or not.
   */
  nullable?: boolean;
  /**
   * Database cascade action on delete.
   */
  onDelete?: "RESTRICT" | "CASCADE" | "SET NULL" | "DEFAULT" | "NO ACTION";
  /**
   * Database cascade action on update.
   */
  onUpdate?: "RESTRICT" | "CASCADE" | "SET NULL" | "DEFAULT" | "NO ACTION";
  /**
   * Indicate if foreign key constraints can be deferred.
   */
  deferrable?: "INITIALLY IMMEDIATE" | "INITIALLY DEFERRED";
  /**
   * Indicates whether foreign key constraints will be created for join columns.
   * Can be used only for many-to-one and owner one-to-one relations.
   * Defaults to true.
   */
  createForeignKeyConstraints?: boolean;
  /**
   * Set this relation to be lazy. Note: lazy relations are promises. When you call them they return promise
   * which resolve relation result then. If your property's type is Promise then this relation is set to lazy automatically.
   */
  lazy?: boolean;
  /**
   * Set this relation to be eager.
   * Eager relations are always loaded automatically when relation's owner entity is loaded using find* methods.
   * Only using QueryBuilder prevents loading eager relations.
   * Eager flag cannot be set from both sides of relation - you can eager load only one side of the relationship.
   */
  eager?: boolean;
  /**
   * Indicates if persistence is enabled for the relation.
   * By default its enabled, but if you want to avoid any changes in the relation to be reflected in the database you can disable it.
   * If its disabled you can only change a relation from inverse side of a relation or using relation query builder functionality.
   * This is useful for performance optimization since its disabling avoid multiple extra queries during entity save.
   */
  persistence?: boolean;
  /**
   * When a parent is saved (with cascading but) without a child row that still exists in database, this will control what shall happen to them.
   * delete will remove these rows from database.
   * nullify will remove the relation key.
   * disable will keep the relation intact. Removal of related item is only possible through its own repo.
   */
  orphanedRowAction?: "nullify" | "delete" | "soft-delete" | "disable";
}
```

- cascade：用于定义级联操作。当执行主实体的相应操作时，TypeORM 会自动执行相应的级联操作，从而简化了代码编写和维护。cascade 属性可以包含"insert"，"update"，"remove"，"soft-remove"和"recover"中的任意一个或多个。cascade 属性可以在 `@OneToMany` 和 `@ManyToOne` 装饰器中使用。
  - insert: 在插入主实体时，自动插入关联实体。例如，如果一个用户（User）有多个订单（Order），那么在插入用户时，可以自动插入订单。
  - update: 在更新主实体时，自动更新关联实体。例如，如果一个用户（User）有多个地址（Address），那么在更新用户时，可以自动更新地址。
  - remove: 在删除主实体时，自动删除关联实体。例如，如果一个用户（User）有多个订单（Order），那么在删除用户时，可以自动删除订单。
  - soft-remove: 在软删除主实体时，自动软删除关联实体。例如，如果一个用户（User）有多个订单（Order），那么在软删除用户时，可以自动软删除订单。
  - recover: 在恢复软删除的主实体时，自动恢复软删除的关联实体。例如，如果一个用户（User）有多个订单（Order），那么在恢复软删除的用户时，可以自动恢复软删除的订单。
- nullable：用于定义关联实体是否可以为空。nullable 属性可以在 `@ManyToOne` 和 `@OneToOne` 装饰器中使用。
  - 如果设置为 true，那么关联实体可以为空。
  - 如果设置为 false，那么关联实体不能为空。
- onDelete：用于定义在删除关联实体时的行为。onDelete 属性可以在 `@ManyToOne` 和 `@OneToOne` 装饰器中使用。
  - "CASCADE"：当删除关联实体时，自动删除主实体。例如，在一个订单（Order）中，如果定义了一个必选的用户（User），那么可以将 onDelete 属性设置为"CASCADE"，表示当删除用户时，自动删除用户的所有订单。
  - "SET NULL"：当删除关联实体时，将主实体的关联属性设置为 NULL。例如，在一个订单（Order）中，如果定义了一个可选的用户（User），那么可以将 onDelete 属性设置为"SET NULL"，表示当删除用户时，将订单的用户属性设置为 NULL。
  - "RESTRICT"：如果存在关联实体，那么不允许删除主实体。例如，在一个订单（Order）中，如果定义了一个必选的用户（User），那么可以将 onDelete 属性设置为"RESTRICT"，表示当存在订单关联的用户时，不允许删除用户。
  - "NO ACTION"：不执行任何操作。例如，在一个订单（Order）中，如果定义了一个可选的用户（User），那么可以将 onDelete 属性设置为"NO ACTION"，表示不执行任何操作。
  - "SET DEFAULT"：当删除关联实体时，将主实体的关联属性设置为默认值。例如，在一个订单（Order）中，如果定义了一个可选的用户（User），那么可以将 onDelete 属性设置为"SET DEFAULT"，表示当删除用户时，将订单的用户属性设置为默认值。
- onUpdate：用于定义在更新关联实体时的行为。onUpdate 属性可以在`@ManyToOne`和`@OneToOne`装饰器中使用。可选值的用法与 onDelete 相同。
- deferrable：用于定义约束的延迟检查方式。deferrable 属性可以在`@ManyToOne`、`@OneToOne`、`@OneToMany`和 `@ManyToMany`装饰器中使用。
  - "INITIALLY IMMEDIATE"：表示立即检查约束。这是默认值。
  - "INITIALLY DEFERRED"：表示延迟检查约束。在事务提交之前，不会检查约束。这样可以在事务中先插入数据，再插入关联数据，避免因为约束检查失败而导致事务回滚。
- createForeignKeyConstraints：用于定义是否创建外键约束。createForeignKeyConstraints 属性可以在 `@Entity` 装饰器中使用。
  - 如果设置为 true，那么在创建表时，TypeORM 会自动创建外键约束。
  - 如果设置为 false，那么在创建表时，TypeORM 不会创建外键约束，而是使用普通的索引（Index）查询。
- lazy：用于定义关联实体的加载方式。lazy 属性可以在`@ManyToOne`、`@OneToOne`、`@OneToMany`和`@ManyToMany`装饰器中使用。
  - 如果设置为 true，那么在查询主实体时，不会立即加载关联实体，而是在第一次访问关联实体时才会加载。这种方式称为"延迟加载"（Lazy Load）。
  - 如果设置为 false，那么在查询主实体时，会立即加载关联实体。这种方式称为"立即加载"（Eager Load）。
- eager：用于定义关联实体的加载方式。eager 属性可以在`@ManyToOne`、`@OneToOne`、`@OneToMany`和`@ManyToMany`装饰器中使用。
  - 如果设置为 true，那么在查询主实体时，会立即加载关联实体。这种方式称为"立即加载"（Eager Load）。
  - 如果设置为 false，那么在查询主实体时，不会立即加载关联实体，而是在第一次访问关联实体时才会加载。这种方式称为"延迟加载"（Lazy Load）。
  - 注意**eager 和 lazy 属性互斥，只需要声明其中一个即可。如果同时声明了 eager 和 lazy 属性，那么会抛出一个错误。**
- persistence：用于定义关联实体的持久化方式。persistence 属性可以在`@ManyToOne`、`@OneToOne`、`@OneToMany`和`@ManyToMany`装饰器中使用。
  - 如果设置为 true，那么在保存主实体时，TypeORM 会自动保存关联实体。这种方式称为"级联保存"（Cascade Persist）。
  - 如果设置为 false，那么在保存主实体时，TypeORM 不会保存关联实体。
- orphanedRowAction：用于定义当关联实体被删除时，对于孤立的行（Orphaned Row）的处理方式。orphanedRowAction 属性可以在`@OneToMany`和`@ManyToMany`装饰器中使用。
  - "nullify"：表示将孤立的行的外键设置为 null。
  - "delete"：表示将孤立的行删除。
  - "soft-delete"：表示将孤立的行执行软删除。
  - "disable"：表示孤立的行保持不变。

## 高级查询(重要)

QueryBuilder 是 TypeORM 最强大的功能之一 ，它允许你使用优雅便捷的语法构建 SQL 查询，执行并获得自动转换的实体。QueryBuilder 可以用来构建几乎任何复杂的 SQL 查询。

```ts
let photos = await this.albumModel
  .createQueryBuilder("album") // first argument is an alias. Alias is what you are selecting - albums. You must specify it.
  .innerJoinAndSelect("album.metadata", "metadata")
  .leftJoinAndSelect("album.songs", "song")
  .andWhere("album.albumName LIKE :name", { name: "%qi li xiang%" })
  .orderBy("song.id", "DESC")
  .skip(0)
  .take(10)
  .getMany();
```

这里封装了一个用于批量执行 Where 查询的方法，满足常用条件查询语句

```ts
interface BatchWhereOption {
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
 * @description createQueryBuilder模式下批量where条件的插值方法 typeORM的createQueryBuilder模式专用
 * @param builder createQueryBuilder返回值
 * @param whereOptions Array<{ table:表名, column:列名, value:列值(可能为空), condition:多条件判断 }>
 */
function builderBatchWhere(
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
```

这里是 SongService 的一个高级分页查询的示例

```ts
export class SongService {
  /**
   * @description 建立查询连接池，指定查询列字段，注入查询条件
   * @param whereOptions BatchWhereOption格式的查询条件，依赖父类的builderBatchWhere方法遍历注入
   */
  private createBuilderWithWhereOptions(
    whereOptions: Array<BatchWhereOption>
  ): SelectQueryBuilder<Song> {
    // 建立查询池
    const builder: SelectQueryBuilder<Song> = this.model
      .createQueryBuilder("song")
      .leftJoinAndSelect("song.album", "album")
      .leftJoinAndSelect("song.singers", "singer");
    // 指定列查询
    const songSelect: Array<string> = this.getColumns().map(
      (column: string) => `song.${column}`
    );
    const albumSelect: Array<string> = this.albumService
      .getColumns()
      .map((column: string) => `album.${column}`);
    const singerSelect: Array<string> = this.singerService
      .getColumns()
      .map((column: string) => `singer.${column}`);
    const selectOptions: Array<string> = [
      ...songSelect,
      ...albumSelect,
      ...singerSelect,
    ];
    builder.select(selectOptions);
    // 条件注入
    this.builderBatchWhere(builder, whereOptions);
    return builder;
  }

  /**
   * @description 歌曲分页查询 涉及到联表操作
   * @param songDTO SongDTO
   * @param pageNo number
   * @param pageSize number
   */
  async querySongs(
    songDTO: SongDTO,
    @defaultPageNo() pageNo: number,
    @defaultPageSize() pageSize: number
  ): Promise<Page<SongVO>> {
    const {
      songName,
      lyric,
      albumName,
      singerName,
      startPublishTime,
      endPublishTime,
    } = songDTO;
    // 设置查询条件
    const whereOptions: Array<BatchWhereOption> = [
      {
        table: "song",
        column: "songName",
        key: "songName",
        value: songName,
        condition: "like",
      },
      {
        table: "song",
        column: "lyric",
        key: "lyric",
        value: lyric,
        condition: "like",
      },
      {
        table: "song",
        column: "publishTime",
        key: "startPublishTime",
        value: startPublishTime,
        condition: "moreThanOrEqual",
      },
      {
        table: "song",
        column: "publishTime",
        key: "endPublishTime",
        value: endPublishTime,
        condition: "lessThanOrEqual",
      },
      {
        table: "album",
        column: "albumName",
        key: "albumName",
        value: albumName,
        condition: "like",
      },
      {
        table: "singer",
        column: "singerName",
        key: "singerName",
        value: singerName,
        condition: "like",
      },
    ];
    // 建立查询池、指定列查询、where条件注入
    const builder: SelectQueryBuilder<Song> =
      this.createBuilderWithWhereOptions(whereOptions);
    // offset limit
    builder.skip((pageNo - 1) * pageSize);
    builder.take(pageSize);
    // 查询结果转换
    const result = await builder.getManyAndCount();
    return this.transformPageVO(result, pageNo, pageSize);
  }
}
```
