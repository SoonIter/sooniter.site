---
title: 前端 monorepo 之殇
description: 前端 monorepo 存在哪些问题，怎么管理前端 monorepo ？
date: 2023-04-06
lang: zh
duration: 20min
image: frontend-monorepo/pnpm.png
---

在组里负责 monorepo 治理工具，来吐槽一下前端 monorepo 的现状

## 为什么使用 monorepo ?

[Why use a monorepo? - Youtube - Vercel](https://www.youtube.com/watch?v=flbz_5aMikw)

这个视频表现了现在大多数人用 monorepo 的爽点, 即可以不走 "发包" 流程 来以 "包" 为单位来复用代码

按之前的工作流, 同时开发多个包

1. 修改 `@hello/a@1.0.0` 的代码

2. 发布 `@hello/a@1.0.1` 新包

3. `@hello/b` 项目中安装新版本的 A

但为了这个爽点, 要付出多少代价?

## 连环构建 和 依赖拓扑

对比 Rust 一个 `cargo build` 解决一切, JavaScript 需要各种预编译手段, 比如处理 typescript, jsx, css 等, 各家都有各家的处理方法, 直接分发 ts 源码不再可能. 这导致, 每个包都有独立的构建手段, 生成个 `dist` 目录什么的, 通常写在 `npm run build`.

于是需要专门的工具来帮我们处理 多个包运行 `npm run build` 的顺序

> PS: 解释性语言需要编译, 编译型语言分发源码, 这是不是有一点双向奔赴了?

以该项目为 🌰

* 目录结构

```txt
├── apps
│   ├── web1
│   │   └── package.json
│   └── web2
│       └── package.json
├── package.json
├── packages
│   ├── component
│   │   └── package.json
│   └── util
│       └── package.json
├── pnpm-lock.yaml
├── .npmrc
└── pnpm-workspace.yaml
```

* 依赖关系

```txt
  web1 -> component -> util
  web2 ->
```

monorepo 工具比如 `pnpm run` 和 `moon run` 需通过分析 `package.json`, 算出一个有向无环图, 即拓朴依赖, 保证 task 运行顺序正确

<img w-300px src="/imgs/frontend-monorepo/project-topo-graph.png"/>

```txt
util:build --> component:build --> web1:build (--> web1:test,e2e...)
```

`pnpm run` 到这里就结束了, 这时若再启动 web2:build, monorepo 工具会复用缓存的结果

```txt
util:build(cached) -> component:build(cached) -> web2:build
```


## 产物引入 和 源码引入

build 拖着这条又臭又长的链路还算勉强可以接受, start 也要深受其累

```txt
  web1 -> component -> util
```

在 monorepo 下开发此项目, 你要经历如下

1. 多开 start, 需手动按顺序开启 util:start component:start web1:start

2. 资源处理, 把 css 等资源放进 js 中可以, 但中间哪个包放进去了, 想再拿出来就很难了

3. hmr 极慢, 若修改 util 的源码 -> util 构建新的产物 ->
component 监听到源码改变 -> component 构建新的产物 -> web1 监听到源码改变 -> web1 构建新的产物, 一顿连环下来, 极慢的 hmr 往往难以忍受

4. 复杂度高到挂

在 2 中的例子里, 增加一条依赖, 让 web1 又依赖 util

```txt
  web1 -> component -> util
       -> util
```

此时若更改 util 源码 --> web1 和 component 更新 --> web1 监听到 component 更新又该更新

并发多个 hmr 的速度会随着依赖拓朴的复杂程度增加, 螺旋下滑, 甚至会算不明白而无响应甚至挂掉

解决方案就是引入源码而不是上述的引入产物, 需要 web1 有一个强大的 bundler, 像 cargo 一样统一构建 web1, component, util 的所有 ts 源码

并且下游主动配合统一构建环境, 比如 jsx 语法, 不要一个使用 React 一个使用 Preact 及其他类似的编译魔法

引入源码, 修改 bundler 的 resolve 逻辑, 让 resolve 打到源码即可, 有很多方式

开启方式 1 用 dev field 开启

```js
module.exports = {
  // ...
  resolve: {
    mainFields: ['my-dev', 'jsnext:main', 'module', 'main'],
  },
}
```
```json
{
  "name": "util",
  "main": "dist/index.js",
  "my-dev": "src/index.ts"
  // 或用 "jsnext:main": "src/index.ts"
  // ...
}
```
exports 字段同上, 可见 [Vite 文档 resolve-conditions](https://vitejs.dev/config/shared-options.html#resolve-conditions)


开启方式 2 用 resolve.alias 调

```js
module.exports = {
  alias: {
    '@xxxx/util': path.resolve(__dirname, '../../packages/util/src/index.ts')
  },
}
```

注意框架可能由于性能, loader 默认忽略 node_modules, 比如 nextjs 需开启

```js
// next.config.js
/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  transpilePackages: ['@xxx/util', '包名'],
  // ...
}
```

之后开发只开启一个 start 即可, 缺点也很明显

1. 高度一致的构建环境

2. 收敛自定义构建行为, 中间包想在编译时做点事情, 比如替换掉 `process.env.NODE_ENV` 几乎不可能了

3. 开发生产的不一致, 发包后的产物挂掉浑然不知

4. 和不使用 monorepo 直接使用源码文件夹没有什么区别 ...

## 臭名昭著的 找不到包 -- Cannot found module "xxx"

### 幻影依赖

由于 npm 将所有依赖 hoist 到 node_modules,  node 逐级向上查找 node_modules 时可以找到未声明到 `package.json` 中的依赖, 造成开发可用但发包后报 `Cannot found module "xxx"`

解决方法是用 包管理器给的后门,比如 pnpm 的 `overrides` `packageExtensions` `hook.readPackage`, 修复三方包漏写的,写错的 `package.json`

且 pnpm 采用了 .pnpm + hardlink + symlink, 来限制顶层 hoist 的行为, 算是已经较好地解决, 对开发质量有追求的开发者已经着手使用 类 pnpm 的手段来治理 hoist

但造成 `Cannot found module` 的, 绝对不止 `shamefully-hoist` 一个

### devDependencies 造成的幻影依赖

`devDeps` 和 `deps` 会被无差别地下载到 `node_modules` 中, 开发时可以不报错地 import devDependencies, 而发包后由于不下载 devDependencies 依然可以造成 `Cannot found module`

monorepo 中无疑将这个问题放大了, 写 `"@xxx/util": "workspace:*"` 明明可用, 改成 `"@xxx/util": "1.1.0"` 就不可用了,

和上一条源码引入一样, monorepo 会放大开发,生产环境不一致的问题, 我们使用 monorepo 中的 "包", 但我们已经超过了 "包" 所能触碰到的范围, 这一问题在下一条更加明显

## 集中式依赖管理

pnpm, Cargo 中的 `overrides` 都要写在根目录.

究其原因, 是在 monorepo 中安装依赖和 单包 下安装依赖一样的, 给一整个 monorepo 安装依赖, 相当于给一整个大包安装依赖.

```json
// a/package.json
{
  "name": "a",
  "dependencies": {
    "react": "^18.2.0"
  }
}
```

安装后 `a>react@18.2.0>loose-envify@1.4.0>js-token@4.0.0`, 如果这个是个 monorepo, 再来一个 b 包, 它会复用 react@18.2.0

```json
// b/package.json
{
  "name": "b",
  "dependencies": {
    "react": "^18.1.0"
  }
}
```

```yaml
# pnpm-lock.yaml (简化后)
libs/a:
  specifiers:
    react: ^18.2.0
  dependencies:
    react: 18.2.0

libs/b:
  specifiers:
    react: ^18.1.0
  dependencies:
    react: 18.2.0

/js-tokens/4.0.0:
  dev: false

/loose-envify/1.4.0:
  dependencies:
    js-tokens: 4.0.0

/react/18.2.0:
  dependencies:
    loose-envify: 1.4.0
```

生成的结构

```txt
<!-- a 和 b 使用相同的 react@18.2.0 -->
a > react@18.2.0 > loose-envify@1.4.0 > js-tokens@4.0.0
b /
```

若 b 这条链路上但凡不同一点, 都不能叫做 "同一份 react"

```txt
<!-- a 和 b 实际使用的是两个 React -->
a > react@18.2.0 > loose-envify@1.4.0 > js-tokens@4.0.0
b > react@18.2.0 > loose-envify@1.4.0 > js-tokens@5.0.0
```

在这种情况下, 既可以减少需要安装的依赖, 又可以使用同一份 react,

所以给 a 和 b 形成的 monorepo 安装依赖,你可以近似理解为给以下的 c 单包安装依赖

```json
// c/package.json
{
  "name": "c",
  "dependencies": {
    "react": "^18.2.0" // 会取个 "^18.2.0" 和 "^18.1.0" 都满足的值
  }
}
```

### monorepo + semver === '寄'



### 多实例问题
#### 一包一版本 —— Cargo

#### 一包多版本 —— node_modules

### React 多实例, monorepo中的 dedupe，如何锁版本

## 连环发包

可能你会说, 我的发包可以严守 semver 规范, 每个大版本和小版本都按规矩提升版本号, 这样依赖就清晰很多了, 那你一定不知道在 monorepo 下管理版本号且发包有多费劲

### changeset

### fixed-packages linked-packages 和 bumpp

## CI

### build 下游，test 上游


由于以上问题, 我们重新思考, 以 "包" 为单位复用代码的 monorepo , 带来的这个复杂度是否值得

pnpm 作者所在的公司开发了 [Bit](https://bit.dev/) , 已经不以 "包" 为单位分发代码, 而是以 "组件" 为单位, 组织方式也是一个一个的源码文件夹,不过增加了文件结构的约束, 无需写繁重的 package.json


## 参考

- [1][现代前端工程为什么越来越离不开 Monorepo?](https://juejin.cn/post/6944877410827370504)
- []
