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

`my-package/index.js`

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

`node_modules` 是 npm 安装存储依赖的目录，`npm v3+` 所有不冲突的依赖都会直接被平铺安装在 `node_modules` 下，即使是 `依赖的依赖`；如果出现版本冲突，则相关依赖会被安装在自己的 `node_modules` 下，因此 `node_modules` 是一个嵌套的目录结构（仅示意）：

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
      |-- /node_modules // <=== 有冲突的依赖安装在自身的 node_modules 目录下（仅示意）
        |-- /koa-compose
```

## package.json 字段

接下来会按照装字段的**常用程度**和**重要性**排序进行介绍：

### name

描述当前包的名称，命名需符合一些规则

- 少于或等于 214 个字符
- **范围包**的名称可以以点或下划线开头 (**非范围包**不允许)
- 名称中不允许出现**大写字母**
- 不要使用与 Node 内置模块相同的名称（例如 `fs`）
- 如果一个包预计发布，最好先到 [npmjs.org](https://www.npmjs.com/) 查询下是否有相同名称的包

可以通过 [`validate-npm-package-name`](https://github.com/npm/validate-npm-package-name) 这个工具检验你的包名是否符合规范

### version

定义当前包的版本，以 `x.y.z` 的格式，即 `Major` 主版本, `Minor` 次版本, `Patch` 修正版本，也就是需符合 [semver](https://semver.org/) 版本规范

可以通过 [`semver`](https://github.com/npm/node-semver) 这个工具检验你的包版本是否符合规范

需要注意的是，发布时，需要升级你的 `version`，必须比上一次版本大

### description

当前包的描述信息，有助于别人查找和了解你的包

### keywords

包的关键词数组，也是用于别人查找你的包，例如

```json
{
  "keywords": [
    "web",
    "app",
    "http",
    "application",
    "framework",
    "middleware",
    "rack"
  ]
}
```

> `description` 和 `keywords` 都可以通过 `npm search` 被索引到

### homepage

项目主页，一般可以指到 github

```json
"homepage": "https://github.com/owner/project#readme"
```

### bugs

告诉别人，去哪里反馈 bug

```json
{
  "url" : "https://github.com/owner/project/issues",
  "email" : "project@hostname.com"
}
```

### license

版权声明，一般的如 `MIT`, `ISC` 等，更多可查看 [License List](https://spdx.org/licenses/)

常见声明方式

```json
{
  "license": "ISC"
}
```

多个声明协议

```json
{
  "license": "(MIT OR Apache-2.0)"
}
```

指到单独的声明文件

```json
{
  "license": "SEE LICENSE IN <filename>"
}
```

或者暂不声明

```json
{
  "license": "UNLICENSED"
}
```

### author

可以使用如下 `people` 单元，描述当前包的作者相关信息

```json
{
  "name" : "Barney Rubble",
  "email" : "b@rubble.com",
  "url" : "http://barnyrubble.tumblr.com/"
}
```

或者

```json
"Barney Rubble <b@rubble.com> (http://barnyrubble.tumblr.com/)"
```

则 author 可以是

```json

"author": {
  "name" : "Barney Rubble",
  "email" : "b@rubble.com",
  "url" : "http://barnyrubble.tumblr.com/"
}
```

或者

```json
{
  "author": "Barney Rubble <b@rubble.com> (http://barnyrubble.tumblr.com/)"
}
```

### contributors

描述当前包的参与贡献者，由一个 `people` 数组构成

```json
"contributors": [
  {
    "name" : "Barney Rubble",
    "email" : "b@rubble.com",
    "url" : "http://barnyrubble.tumblr.com/"
  },
  {
    "name" : "Harry Potter",
    "email" : "harry.potter@gmail.com",
    "url" : "http://harry-potter.com/"
  },
]
```

### files *

`files` 字段定义了当作为依赖被安装时，哪些文件会被包含。是一个由 `文件（夹）路径` 或者 `glob pattern (*, **/*, and such)` 构成的数组。

当发布时，指定的文件会被打包上传。

如果不指定此字段，则默认是 `["*"]`，也就是包含所有文件。

```json
{
  "files": [
    "src/**/*",
    "dist/
  ]
}
```

与此相反的，你可以提供一个 `.npmignore` 文件，用于指定那些文件应该被忽略

```.npmignore
.DS_Store
test
demo
```

> `.npmignore` 文件可出现在根目录，也可以出现在子目录

> 当 `.npmignore` 与 `files` 存在相同指定时，根目录的 `.npmignore` 会失效，以 `files` 为准；而子目录的 `.npmignore` 则相反，会覆盖 `files` 的声明。

需要注意的是，有一些特殊的文件，是不受上述两个规则（`files` 和 `.npmignore`）限制的：

以下文件是一定会被打包上传的：

- `package.json`
- `README`
- `LICENSE` / `LICENCE`
- `"main"` 字段指定的入口文件

> `README` 和 `LICENSE` 会忽略大小写

相反地，有些文件和目录一定会被忽略：

- `.git`
- `CVS`
- `.svn`
- `.hg`
- `.lock-wscript`
- `.wafpickle-N`
- `.*.swp`
- `.DS_Store`
- `._*`
- `npm-debug.log`
- `.npmrc`
- `node_modules`
- `config.gypi`
- `*.orig`
- `package-lock.json`


## npm commands

TODO