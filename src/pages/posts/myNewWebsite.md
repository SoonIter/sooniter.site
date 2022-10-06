---
title: 我搭建了我的全新个人博客
description: 我搭建该博客的历程、收获和一些产品细节
date: 2022-10-03
lang: zh
duration: 15min
image: site.png
---

[[TOC]]
<img src="/imgs/site.png"/>

我的新的个人博客，选择使用[*Vitesse*](https://github.com/antfu/vitesse)搭建，借鉴了一点[antfu的个人主页](https://antfu.me/)，这个由antfu编写的模版让我用的很爽

算是很多收获吧，一些之前没有注意到的细节让我惊为天人。

先讲一讲Vitesse的、标准的，再讲一讲我原创的。
## 响应式布局 Responsive
我选择的分界线是md 768px，是ipad mini的宽度，尽量让平板设备偏向电脑，不至于太空太丑。个人觉得调的还是比较舒服.

大屏靠左对齐，小屏居中对齐。

微调卡片间距，字体大小。

因为对交互要求不高，无双击，也不需要解决300ms的移动端点击延时。移动端交互，计划之后用[Lath](https://lath.dev/)，做的很赞，值得学习

重点在Tabs标签栏的左右滑动切换，这个在移动端还是比较时髦的，在react-native里有react-native-tab-view，web上重点在于preload二级路由


## 暗黑模式 dark mode
### 三种模式 auto light dark + 一个 smart 切换规则
暗黑模式共有三种，auto、light、dark，主流产品飞书等，会提供这三种选项，让用户自主选择。
![Lark dark](/imgs/dark.jpg)
light和dark不必解释，auto是指跟随系统——受控于系统选择。

默认auto能解决大部分问题，但若是需要切换还要进设置中进一步操作。
切换日夜的按钮不放出来还好，一放出来，作为一个toggle的仅切换true false的按钮，我在VueUse里看到了这个更聪明的方案。我将所有状态图画了出来。每一个情况都看着很合理，我愿称之为smart模式（极致的产品体验就是让用户感觉到智能。

![dark2](/imgs/dark2.png)

系统暗色模式下，只在auto和light之间切换，亮色模式下，只在auto和dark之间切换。

具体可以在本站点或者VueUse文档尝试一下
### 过渡
从亮到暗从暗到亮不至于闪瞎狗眼，加一个过渡，Vue相关的文档都是这么做的，使用`transition`让`backgroundColor`和`textColor`有过渡即可。

文本颜色大都使用灰色，背景颜色用浅黑和浅灰

### ico也要切换
ico的显示效果与应用内的体验无关，所以一律auto，跟随系统即可，`usePreferredDark`。这个可以看Github网站的图标 (话说这也太细了吧

ico是蓝色、绿色这样的亮色可以忽略

### 如何实现？
纯css即可解决。使用css变量 + 顶层元素类名，实现非常方便，调试也比较好调。在此之上，tailwind里直接加装 `dark:` 。

```css
h1 {
  color: var(--geist-background);
}

html.light {
  --geist-background: black;
}

/* 或是
html:not(.dark) {
  --geist-background: red;
}
*/

html.dark {
  --geist-background: white;
}
```

## 语言切换-国际化 i18n
因为我只支持 en 和 zh-CN，也就是英语和汉语，因此做成了和dark mode一样。如果是多种语言，这个最好用设置去切。useI18n 和 vscode-i18n-ally的插件，开发体验很好。

多做的就是配合dayjs的国际化。

## 解析markdown markdown-it
antfu做的这一套很好用，和slidev一样的开发体验，unocss和vite-vue-markdown配合很好。

markdown-it插件系统也很丰富，有其他的需求可以直接写插件。

轻松实现基本的，锚点，大纲，frontmatter。

a标签里加了 norefer noopener nofollow target="_blank"，属于a标签的冷门知识了。

## 返回顶部 BackToTop
在滑动距离`scrollY > 200px`时，触发显示。

## 毛玻璃头部导航栏 HeaderBar
同上，但显示方式为弹出

滑动时的隐藏，`const { isScrolling } = useScroll()`

毛玻璃用 `backdrop:filter(20px);`


## 滚动条 scroll-bar
解决ios的橡皮筋问题，`overscroll-behavior:none;`

`::-webkit-scrollbar`
`::-webkit-scrollbar-track`
`::-webkit-scrollbar-thumb`控制滚动条的样式。

滚动条是不占页面的宽度的，也就是额外宽度，如果在意这个的话，[OverlayScrollbars](https://github.com/KingSora/OverlayScrollbars)可以解决

`window.scrollTo({ smooth: true })`和`scroll-behavior: smooth`适合锚点的跳转，平滑滚动，而不是瞬间移动。

## 搜索引擎优化 SEO
Vite-ssg生成静态站点

元数据：meta标签加入作者author、描述description等等，便于分享、抓取
![meta-label-in-lark](/imgs/myNewWebsite/meta-label.png)

顺便meta标签还可以和twitter、facebook联动

语义化：
1. a标签应该有href，语言切换按钮随手用的a标签，我理应用button
2. img带alt，利于爬虫抓取


## 后续优化 Optimization

首先使用lighthouse和web-vital进行评分测算
![lighthouse](/imgs/myNewWebSite/lighthouse/lighthouse.jpg)

![treemap](/imgs/myNewWebsite/lighthouse/treemap.png)

DA证书，升级https

给img加alt标签



## 局域网调试
```typescript
//vite.config.ts
defineConfig({
  server: {
    host: '0.0.0.0',
  },
})
```
