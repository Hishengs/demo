# 多包管理 / 单代码仓库解决方案比较

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

### npm v3+ , yarn 1.x

TODO

### yarn > 1.x

TODO

### pnpm

TODO