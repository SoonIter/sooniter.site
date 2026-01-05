---
title: 缓存、单例模式、异步单例模式与异步原子化
description: 单例模式你一定用过，但是加入异步，你很容易写错，不信可以点进来看
date: 2023-04-01
lang: zh
duration: 20min
image: typescript.webp
---

## 函数缓存，记忆化函数 或者 动态规划？

当一个函数用时较高的时候，可以选择如下方式来缓存函数结果

```typescript
function getCurrentUser() {
  const name = doExpensiveWork();
  return name;
}
```

```typescript
const cachedName: string | null = null;
function getCurrentUser() {
  if (!cachedName) {
    cachedName = doExpensiveWork();
  }
  return cachedName;
}

```
如果算法中做过记忆化搜索、动态规划等算法题目，就不难理解缓存，用空间来换时间。

这个缓存变量的位置可以有很多种选择，例如，上面的代码是 "模块作用域形成的闭包"、还可以选择"手动造一个函数作用域的闭包"、"函数对象的属性（自记忆化函数）" 等，具体可以看我之前在掘金写的 [【前端】函数递归优化，javascript中应该如何写递归？](https://juejin.cn/post/7086409555277512711)

当这个缓存放进类里的静态变量中，单例模式也因此产生

## 单例模式

Java 写类，ts 也可以写类，先写一个教科书般的单例模式实现

```typescript
// 单例模式实现
class Foo {
  public static getInstance() {
    if(!this.instance) {
      this.instance = new Foo();
    }
    return this.instance;
  }
  private static instance: Foo; // 私有静态属性
  private constructor() {}  // 私有方法，防止被调用
}

// new Foo(); // ❌ 类“Foo”的构造函数是私有的，仅可在类声明中访问。ts(2673)
const foo = Foo.getInstance();
const bar = Foo.getInstance();
console.log(foo === bar); // true
```
单例模式具有以下特点

1. 类只有一个实例

2. 全局可访问该实例

3. 可惰性初始化

4. 自带 cache

这种写法有很大的易用性:

比如我们有 Context 这一对象，很显然全局有且仅有一个 context，于是我们可以直接写`import`，也不用将 context 作为函数参数传来传去了

```typescript
// context.ts
export class Context {
  public static getInstance() {
    if(!this.instance) {
      this.instance = new Context();
    }
    return this.instance;
  }
  private static instance: Context;
  private constructor() {
    this.name = getCurrentUser(); // 'xiaoming'
  }

  // 一些全局变量
  name: string;
}
```
```typescript
// sayHello.ts
import { Context } from './context.ts';

function sayHello() {
  const context = Context.getInstance();
  console.log('hello, ', context.name);
}

sayHello();
sayHello();
```
由于 "自带 cache"， constructor 只会被调用一次，getCurrentUser 只会被调用一次。

由于 惰性初始化，使用时仅一次初始化，不使用就不会初始化。

然后也来一个函数式的实现

```typescript
interface Context {
  name: string
}
const cachedContext: Context | null = null;
export function getContext() {
  if (!cachedContext) {
    cachedContext = {
      name: getCurrentUser();
    }
  }
  return cachedContext;
}
```

## 有参单例模式

在构造函数中加入参数，从 cache 一个 instance，变为 cache 一个 instanceMap，

instanceMap 具体使用哪种数据结构，可以由参数的个数、类型来考虑。

```typescript
export class Context {
  public static getInstance(name: string) {
    if(!this.instanceMap[name]) {
      this.instanceMap[name] = new Context(name);
    }
    return this.instance;
  }
  private static instanceMap: Record<string, Context> = {};
  private constructor(name: string) {
    this.name = name;
  }

  name: string;
}

const a = Context.getInstance('a');  // -> Context {name: 'a'}
const aa = Context.getInstance('a'); // -> Context {name: 'a'}
const b = Context.getInstance('b');  // -> Context {name: 'b'}
```

函数实现

```typescript
interface Context {
  name: string,
  email: string
}
const cachedContextMap: Record<string, Context> = {};
export function getContext(name: string) {
  if (!cachedContextMap[name]) {
    cachedContextMap[name] = {
      name,
      email: getCurrentUserEmail(name)
    }
  }
  return cachedContextMap[name];
}
```

## 异步单例模式

在该实现中，假如 getCurrentUser 是一个异步函数，但略蛋疼的是，ts中不支持异步的构造函数，于是我们手动造一个 async create 的异步构造函数

```typescript
class Context {
  public static getInstance() {
    if(!this.instance) {
      this.instance = new Context();
    }
    return this.instance;
  }
  private static instance: Context;
  private constructor() {
    this.name = await getCurrentUser();
    // “async”修饰符不能出现在构造函数声明中。ts(1089)
  }

  name: string;
}
```

```typescript
// 正确实现
class Context {
  public static getInstance(): Promise<Context> {
    if(!this.instance) {
      this.instancePromise = this.create();
    }
    return this.instancePromise;
  }
  private static instancePromise: Promise<Context>;

  private async create(): Promise<Context> {
    const name = await getCurrentUser();
    const email = await getCurrentUserEmail(name);

    const context = new Context(name, email);
  }

  private constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }

  name: string;
  email: string;
}
```

## 如何 cache 一个异步函数，让一个异步函数只执行一次 ？

答案是 cache 这个 Promise 实例

特别注意一下上文这个结构

```diff
  private static instancePromise: Promise<Context>;
  public static getInstance(): Promise<Context> {
    if(!this.instance) {
      this.instancePromise = this.create();
    }
    return this.instancePromise;
  }
```

这里的 getInstance 其实 cache 的不是实例，而是实例的 promise，这一点很容易出错

为了便于理解，我将其换成一个函数，并对比两种写法


```typescript
// ✅正确写法
let cachedContextPromise: Promise<Context> | null = null;
function getContext(): Promise<Context>{
  if (!cachedContextPromise) {
    cachedContextPromise = create();
  }
  return cachedContextPromise;
}
```

```typescript
// ❌错误写法
let cachedContext: Context | null = null;
async function getContext(): Promise<Context>{
  if (!cachedContext) {
    cachedContext = await create();
  }
  return cachedContext;
}
```

在错误写法中，若连续调用两次 `getContext`，`create` 是会被执行两次的，原因是异步函数中的 await 让整个函数可中断执行。

并发多个 Promise 产生的竞态问题，可以看我这个视频中的例子 [[js + vitest]写一个小异步任务队列](https://www.bilibili.com/video/BV1BT411J7w9/?spm_id_from=333.999.0.0)

总之，你要缓存一个函数的运行结果，缓存返回值即可，返回 Context 就缓存 Context, 返回 `Promise<Context>` 就缓存 `Promise<Context>`
> PS: 在面试中，恰巧遇到了这个面试题，于是偷着乐了

## 异步原子化 Atomic

重命名一个文件，写一个文件，给文件改权限，让你执行这三个操作，于是你瞬间写出

```typescript
await fs.rename('hello.txt', 'xxx.txt');
await fs.writeFile('hello.txt', 'hello world');
await fs.chmod('hello.txt', 777);
```

但是如果说，要你任一一个操作失败后，整个任务算失败，直接全部回滚呢？

这个库做了这件事 [npm/write-file-atomic](https://github.com/npm/write-file-atomic)，大概实现就是，先创建一个 `hello.txt_232_xxx` 的临时文件用来写，到执行最后再提交。

原子化，指的不是拆分成小的任务，反而恰恰相反，是聚合任务成一个不可拆分的整体。

反映到异步中，就是将多个异步任务以某种策略聚合成一个异步任务

```typescript
const cachedPromise: Promise<{name: string,email: string}> | null = null;
function getInformation() {
  if (!cachedPromise) {
    cachedPromise = (async function (){
      const name = await getName();
      const email = await getEmailByName(name);
      return {
        name,
        email
      }
    })();
  }
  return cachedPromise;
}
```

若拆分成两个函数则为如下：

```typescript
async function getInformation() {
  const [name, email] = await Promise.all([getName(), getEmail()]);
  // 如果两个任务是依赖关系，则需要串行
  // const name = getName();
  // const email = getEmailByName(name);
  return {
    name,
    email
  }
}

const cachedPromise: Promise<{name: string,email: string}> | null = null;
function getInformation_cached() {
  if (!cachedPromise){
    cachedPromise = getInformation();
  }
  return cachedPromise;
}
```

在异步单例模式中，`create` 将几个异步任务合并变为不可拆分的整体，再用 `getInstance` 做缓存

## 总结

1. 缓存函数返回值即可，需注意异步函数并发 promise 的问题

2. 缓存正确的 promise，正确的聚合异步任务，防止竞态问题
