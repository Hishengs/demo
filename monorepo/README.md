# 多包管理 / 单代码仓库解决方案比较

什么是 Monorepo，就是把多个项目放在一个仓库里面，相对立的是传统的 MultiRepo 模式，即每个项目对应一个单独的仓库来分散管理。

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

因为 `node_modules` 下的依赖与 `package.json` 声明的依赖不再一一对应，被平铺到根目录下安装的 `依赖的依赖`，很可能被我们的代码引用到，却没在 `package.json` 显式声明。
### yarn > 1.x

TODO

### pnpm

TODO

## 参考文章

[现代前端工程为什么越来越离不开 Monorepo?](https://juejin.cn/post/6944877410827370504)

[平铺的结构不是 node_modules 的唯一实现方式](https://pnpm.io/zh/blog/2020/05/27/flat-node-modules-is-not-the-only-way)

[基于符号链接的 node_modules 结构](https://pnpm.io/zh/symlinked-node-modules-structure)

[npm - workspaces](https://docs.npmjs.com/cli/v8/using-npm/workspaces)

[Monorepo 的这些坑，我们帮你踩过了！](https://juejin.cn/post/6972139870231724045)