# 多包管理 / 单代码仓库解决方案比较

什么是 Monorepo，就是把多个项目放在一个仓库里面，相对应的是传统的 MultiRepo 模式，即每个项目对应一个单独的仓库来分散管理。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/75a56317bdf94794a8b29f6cd184c888~tplv-k3u1fbpfcp-watermark.awebp)

Monorepo 的出现，可以解决 MultiRepo 的一些痛点：

- 代码、模块复用
- 依赖版本更新与对齐
- 开发配置，测试，CI/CD（工作流）复用等
- 业务割裂

Monorepo 需要注意的问题

- 不同项目间开发规范对齐
- 不同项目间构建工具对齐
- 项目间依赖分析、依赖安装
- 不同项目间 lint, test 对齐
- 不同项目间 CI/CD 对齐
- 增量构建、测试、部署等
- 权限管理问题
- 分支管理 / Git log
- 需要有统一的 Monorepo 维护者

> 业务项目是否采用 Monorepo 仍需谨慎；如果是组件库/工具库则建议采用

目前比较知名的包管理器

- [npm](https://www.npmjs.com/)
- [yarn](https://yarnpkg.com/)
- [pnpm](https://pnpm.io/)

目前比较知名的 monorepo 解决方案

- [lerna](https://lerna.js.org/)
- [yarn workspaces](https://yarnpkg.com/features/workspaces) / [yarn 1.x workspaces](https://classic.yarnpkg.com/en/docs/workspaces)
- [npm workspaces](https://docs.npmjs.com/cli/v8/using-npm/workspaces)
- [pnpm workspace](https://pnpm.io/workspaces)
- [rush](https://rushjs.io/)
- [turborepo](https://turborepo.org/)

## 不同包管理器依赖处理方式

### npm < v3

npm 在 v3 之前，node_modules 下依赖安装与 package.json 声明的是一一对应的，而依赖的依赖，则单独安装在依赖自己下面的 node_modules，以此类推。这种方式，简单直接明了，但会造成依赖黑洞，依赖层次过深，存在大量冗余的重复依赖，导致磁盘浪费，安装缓慢。

```js
|-- node_modules
  |-- foo
    -- node_modules
      ｜-- koa^1.0.0
  |-- bar
    ｜-- node_modules
      ｜-- koa^2.0.0
  |-- dep
    ｜-- node_modules
      ｜-- koa^2.0.0
      ｜-- knife
        ｜-- node_modules
          ｜-- koa^1.0.0
            ｜-- node_modules
              ｜-- xxx
              ｜-- yyy
              ｜-- zzz
                ｜-- node_modules
                  |-- dep1
                  |-- dep2
                  |-- dep3
```

### npm v3+ , yarn 1.x

这两个版本，都会尽可能将所有依赖平铺到 node_modules 根上，解决层级过深、重复依赖等问题：

```js
|-- node_modules
  |-- foo // 依赖 koa^1.1.0
  |-- bar // 依赖 koa^1.2.0
  |-- koa // 1.2.4
```

如上，假如 `foo` 和 `bar` 两个包都依赖 `koa`，`koa` 会被提到 `node_modules` 根目录下安装。

如果遇到相同依赖版本冲突时，则会将冲突的版本安装在自身的 node_modules 下，类似于：

```js
|-- node_modules
  |-- foo // 依赖 koa^1.0.0
  |-- bar // 依赖 koa^2.0.0
    ｜-- node_modules
      ｜-- koa // 2.1.0
  |-- koa // 1.2.0
```

如上，假如 `foo` 和 `bar` 两个包都依赖 `koa`，但是依赖的版本不同；此时，在根目录下只会安装一个版本的 `koa`，另一个会被安装在自身的 node_modules 下。

npm 和 yarn 1.x 平铺的安装方式，仍然存在以下问题：

首先，**Phantom dependencies (幽灵依赖、隐式依赖)**。

因为 `node_modules` 下的依赖与 `package.json` 声明的依赖不再一一对应，被平铺到根目录下安装的 `依赖的依赖`，很可能被我们的代码引用到，却没在 `package.json` 显式声明。因此会带来一些潜在问题，例如在未来，某些依赖不再被使用，你的代码将会构建失败。
### yarn > 1.x

yarn 从 v2 开始，不再采用 npm 的 node_modules 安装方式，而是采取了更激进的 [`Plug'n'Play`](https://yarnpkg.com/features/pnp) 策略，详见 [yarn v2+ 的 Plug'n'Play](./pnp.md)

`yarn v2+` 的安装方式也发生了变化，`yarn 1.x` 可以全局安装：

```sh
npm i -g yarn
```

`yarn v2+` 不再支持全局安装，仅支持在 `项目内` 使用，但仍需借助全局的 `yarn 1.x`

首先，先将全局的 `yarn 1.x` 版本升级到最新：

```sh
npm i -g yarn@latest
```

如果是初始化新项目：

```sh
yarn init -2
```

如果是已有项目升级，在项目根目录下执行：

```sh
yarn set version berry
// 或者 yarn set version latest
```

> 可执行 `yarn set version --help` 查看其他版本设置

此命令会在项目内生成相应配置文件和目录，之后，每次执行 `yarn` 相关命令都会使用相应版本

然后重新执行 `yarn install` 安装依赖

`yarn v2+` 相关介绍详见 [What Yarn Modern Bring?](./yarn-modern.md)

### pnpm

`pnpm` 的依赖安装策略跟 `npm` 和 `yarn` 也大不相同，同时解决了后 2 者存在的问题，以官方的示意图为例：

![](./motivation.jpg)

假如你的项目依赖如下

```json
{
  "name": "pnpm-repo",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.17.2",
    "koa": "^2.13.4"
  }
}
```

执行 `pnpm install` 后，你的 `node_modules` 会变成这样

```js
|-- node_modules
  |-- .pnpm
  |-- express
  |-- koa
```

可以看到，除了 `.pnpm` 目录，其他的依赖和你 `package.json` 声明的一一对应。那 `依赖的依赖` 呢？难道又陷入了 `依赖地狱`？

其实，`.pnpm` 目录另有乾坤。

## 多包管理方案比较

比较之前，将统一使用如下项目作为示例

```js
|-- /my-workspaces
  |-- /packages
    |-- /logger
      |-- index.js
      |-- package.json
    |-- /monitor
      |-- index.js
      |-- package.json
  |-- package.json
```

包含 2 个包：`logger`, `monitor`，其中后者依赖前者

`logger/package.json`

```json
{
  "name": "logger",
  "private": true,
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "axios": "^0.24.0"
  }
}
```

`monitor/package.json`

```json
{
  "name": "monitor",
  "private": true,
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "logger": "~1.0.0"
  }
}
```

### lerna

全局安装 `lerna`

```sh
npm i -g lerna
```

在你的项目内执行

```sh
lerna init
```

将会出现一个 `lerna.json` 文件，在此文件中配置你的 `packages` 目录

```json
{
  "packages": [
    "packages/*"
  ],
  "version": "0.0.0"
}
```

接着，执行 `lerna bootstrap`，会做 2 件事

- `link` 工作区内所有的包，使得依赖可见，相当于执行 `lerna link`
- 安装工作区内所有的包的依赖，相当于执行 `lerna install`

之后，你会在 `monitor/node_modules` 下发现一个指向 `logger` 的软链接，也就是 `lerna` 帮你做的事：

发现你依赖了工作区内的包（`"logger": "~1.0.0"`），且符合指定的版本，会自动帮你创建软链接，让你可以直接引用

如果版本不符合，则会直接从 `registry` 获取安装

`lerna` 还能帮你做很多别的事，譬如统一执行 `script`，统一发布等等，详见[官方文档](https://lerna.js.org/)

但是，`lerna` 没有做 **`依赖提升`**，将多包重复的依赖提升到顶层的 `node_modules`，毕竟它不是一个包管理器，不会帮你做依赖分析，下载等；需要结合 `yarn` 等别的包管理器才能达到这样的效果

## 参考文章

[现代前端工程为什么越来越离不开 Monorepo?](https://juejin.cn/post/6944877410827370504)

[平铺的结构不是 node_modules 的唯一实现方式](https://pnpm.io/zh/blog/2020/05/27/flat-node-modules-is-not-the-only-way)

[基于符号链接的 node_modules 结构](https://pnpm.io/zh/symlinked-node-modules-structure)

[npm - workspaces](https://docs.npmjs.com/cli/v8/using-npm/workspaces)

[Monorepo 的这些坑，我们帮你踩过了！](https://juejin.cn/post/6972139870231724045)