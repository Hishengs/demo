# What Yarn Modern Bring?

`yarn` 从 `v2` 开始，依赖安装策略完全不同，而且带来了很多新的特性；不过仍然保持对 `v1` 的兼容，以帮助使用 `yarn 1.x` 的项目顺利升级和过渡。

## 安装与使用

### 新项目

如果是新项目，参照以下步骤：

- cd your-project
- run `yarn init -2`
- run `yarn install`

### yarn 1.x 项目升级迁移

参照以下步骤迁移：

1. Run npm install -g yarn to update the global yarn version to latest v1
> 执行 `npm install -g yarn` 升级 `yarn` 到最新的 `1.x` 版本
2. Go into your project directory
> cd 进入你的项目目录
3. Run yarn set version berry to enable v2 (cf Install for more details)
> 执行 `yarn set version berry` 将项目 `yarn` 版本锁定到 `v2` 版本
4. If you used .npmrc or .yarnrc, you'll need to turn them into the new format (see also 1, 2)
> `.npmrc` 和 `.yarnrc` 配置文件已被废弃，需要升级到新的配置文件 [`.yarnrc.yml`](https://yarnpkg.com/configuration/yarnrc)
5. Add nodeLinker: node-modules in your .yarnrc.yml file
> 在 `.yarnrc.yml` 配置 [`nodeLinker: node-modules`](https://yarnpkg.com/configuration/yarnrc#nodeLinker) 以兼容旧的 `node_modules` 安装方式
6. Commit the changes so far (yarn-X.Y.Z.js, .yarnrc.yml, ...)
> git commit 提交上述产生的相关文件
7. Run yarn install to migrate the lockfile
> 执行 `yarn install` 生成新的 lock 文件
8. Take a look at this article to see what should be gitignored, Commit everything remaining
> 再次检查提交所有文件

基本上这样就行了

> 注意第 5 点，我们配置了 `nodeLinker: node-modules` 去兼容旧的 `node_modules` 安装方式；实际 yarn v2+ 模式使用 [`Plug'n'Play`](https://yarnpkg.com/features/pnp) 的安装策略，后面会做介绍