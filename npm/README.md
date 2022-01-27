# npm 小书

npm 原本是服务于 nodejs 的 [CommonJS](http://wiki.commonjs.org/wiki/CommonJS) module 的包管理器，但目前已成为 Javascript 生态的包管理器，提供了包括但不限于包的注册、存储、管理、发布、依赖解析与安装等功能。我们将在此小书中一一展开介绍。

广义上讲，只要目录下包含了 [package.json](https://docs.npmjs.com/cli/v8/configuring-npm/package-json) 文件，该目录就会被当作是一个 npm 的包，能够被索引和依赖。

## 安装 npm

建议安装 [Node](https://nodejs.org/en/download/)，会自带一个 `npm` 的 CLI 工具，在后续介绍中，我们都会使用到

> 安装完，在命令行输入 `npm --version` 测试下是否已安装

## 创建一个 npm 包（package）

在已有代码目录下，或者新建目录

```sh
mkdir my-package && cd my-package
```

手动创建 `package.json` 或者使用 `npm` 命令创建（建议）

```sh
npm init --yes // or npm init -y
```

会出现一个 `package.json` 文件：

```json
{
  "name": "my-package",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

此文件描述了当前包的基本信息，包括名称、版本、描述等。其他的字段我们后续在专门的章节去了解。

在上述字段中，有一个 `main` 字段用于定义当前包的代码入口文件，现在没有，我们创建一个

```js
module.exports = {};
```

先简单暴露一个空对象。这样，一个最简单的包就完成了，甚至可以直接发布到 [npm](https://www.npmjs.com/) 上给别人用（虽然没什么实际用处）

## 安装依赖

一个完整应用实现，需要借助他人的智慧，这也是开源的精神。因此

- npm 包需要依赖别的 npm 包的能力
- 一个应用需要依赖一系列 npm 包的能力

`npm` 允许通过 `dependecies` 声明当前包的依赖项，并通过执行 `npm install` 安装这些依赖：

```json
{
  "name": "my-package",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependecies": {
    "koa": "2.13.4"
  }
}
```

> 也可执行 `npm add koa@2.13.4` 安装依赖

上述 `dependecies` 声明了一个 `2.13.4` 版本的 `koa` 依赖，执行 `npm install` 安装，会出现一个 `node_modules` 目录，所有的依赖都会被 `npm` 安装在此。我们暂时不去关心 `node_modules` 里面有什么。

回到我们的代码文件，即可直接引用依赖

```js
const koa = require('koa');

// then do something with koa below

module.exports = {};
```

> 可以把我们包含了 `package.json` 的应用，当成一个不需要发布的 npm 包；却可以借助 `dependecies` 方式使用 `npm` 的生态

## node_modules

`node_modules` 是 npm 安装依赖的目录，`npm v3+` 所有不冲突的依赖都会直接被平铺安装在 `node_modules` 下，即使是 `依赖的依赖`；如果出现版本冲突，则相关依赖会被安装在自己的 `node_modules` 下，因此 `node_modules` 是一个嵌套的目录结构（仅示意）：

```js
|-- /my-package
  |-- /node_modules
    |-- /accepts
    |-- /cache-content-type
    |-- /co
    |-- /content-disposition
    |-- /content-type
    |-- /cookies
    |-- /...
    |-- /koa
      |-- /node_modules // <===
        |-- /koa-compose
```

## package.json 字段

TODO

## npm commands

TODO