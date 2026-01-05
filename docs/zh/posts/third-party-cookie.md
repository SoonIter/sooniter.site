---
title: 禁用第三方 Cookie
description: 2024年 Chrome 全面禁用第三方 Cookie，整理了所有相关内容和应对措施
date: 2023-12-17
lang: zh
duration: 30min
image: /imgs/third-party-cookie/tld+1.png
---

## 跨域(cross-origin) 和 跨站(cross-site)

### 跨域 cross-origin

同源：协议、主机、端口都一致

![cross-origin](/imgs/third-party-cookie/cross-origin.png)

```
（1） Cookie、LocalStorage 和 IndexDB 无法读取。
（2） DOM 无法获得。
（3） AJAX 请求不能发送。
```

### 跨站 cross-site

同站：具有相同 eTLD+1，即相同的协议+相同的二级域名

https://a.xxx.com 和 https://b.xxx.com 相同的二级域名，是同站

![tld+1](/imgs/third-party-cookie/tld+1.png)

![cross-site](/imgs/third-party-cookie/cross-site.png)

## SameSite

Chrome 51 起，Cookie 新增 SameSite 属性，用来防止 CSRF 攻击 (安全) 和用户追踪 (隐私)。

- Strict（严格）：当设置为 Strict 时，浏览器将只在当前网页的域名与 Cookie 所属的域名完全一致的情况下才发送该 Cookie 。
- Lax（宽松）：当设置为 Lax 时，浏览器将在导航到目标网页的情况下发送 Cookie，但仅限于顶级导航（如点击链接或通过 URL 导航）。在跨域的 POST 请求或通过 iframe 加载的请求中，浏览器将不会发送 Cookie。

- None（无）：当设置为 None 时，浏览器将始终发送 Cookie，无论请求是同站点还是跨站点。但是，要使用 None 值，还需要同时设置 Secure 属性，以确保仅在使用 HTTPS 安全连接时发送 Cookie。

Chrome 80 起，默认会给第三方 Cookie 添加 SameSite=Lax 属性，A 域名跨域请求 B 域名，不会携带 Cookie。 如果要使用三方 Cookie，需显式设置 `SameSite=None; Secure`

Chrome 118 开始有第三方 Cookie 的警告，2024 年 Q1-Q3 逐步禁用 `SameSite=None; Secure`，请求时无法读取并携带 `SameSite=None;Secure` 的 Cookie，响应 `Set-Cookie: xxx=xx;SameSite=None;Secure` 时也无法写入

## 影响范围？

测试设置位于 [chrome://flags/#test-third-party-cookie-phaseout](chrome://flags/#test-third-party-cookie-phaseout)

- 前端监控：上报的接口为跨站接口，通过三方 Cookie 来存储一个用户标识；
- 统一登录：通过统一的跨站 SSO 接口为网站实现单点登录能力，共享用户身份；
- 广告业务：通过三方 Cookie 存储用户标识，用于进行广告归因或兴趣推荐；
- CSRF ：通过 Cookie 存储 CSRF Token 信息，跨站请求则为三方 Cookie；
- iframe：通用的聊天、地图等 iframe，通过三方 Cookie 来共享一些状态；

## 解决方案？

#### 1. 变更携带位置+存储位置

不用 `Cookie` 和 `Set-Cookie`，改成其他地方，携带位置改到 query、请求头、请求体，存储位置改到 localStorage、sessionStorage、indexDB 等

优点: 自由度高

缺点: 改动较大

#### 2. 服务端代理

例如在 `a.com` 域名发起请求 `b.com/update` ，代理将调用改写为 `a.com/proxy/b.com/update`

优点：略微减少了改造成本

缺点: 改动较大，服务端流量，增加成本

#### 3. Cookie CHIPS

让三方 iframe 嵌入发起的跨站请求的依然可以携带三方 Cookie

解决三方 Cookie 问题的提案中，其实还有一个提案是 `SameParty`，意味标记同一方的 Cookie。最终采纳的是 `Partitioned`，不过可以达到差不多的效果。

![partitioned](/imgs/third-party-cookie/partitioned.png)

通过设置 Partitioned，就可以将站点选择将 Cookie 存储在由顶级站点分区的单独 Cookie jar 中。比如我们在站点 A 中通过 iframe 嵌入了一个站点 C，正常情况下如果三方 Cookie 被禁用后，C 是无法在 A 站点访问到它的 Cookie 的。如果 C 在它的 Cookie 上指定了 Partitioned 属性，这个 Cookie 将保存在一个特殊的分区 jar 中。
它只会在站点 A 中通过 iframe 嵌入站点 C 时才会生效，浏览器会判定只会在顶级站点为 A 时才发送该 Cookie。当用户访问一个新站点时，例如站点 B，如果也它通过 iframe 嵌入了站点 C，这时在站点 B 下的站点 C 是无法访问到之前在 A 下面设置的那个 Cookie 的。如果用户直接访问站点 C ，一样也是访问不到这个 Cookie 的。

#### 4. Related Website Sets

解决同一个公司或组织下不同域名的数据共享能力。

可以将多个站点标记为一方, 例如 `taobao.com` 和 `tmail.com` 同样属于阿里, 可以标记为同一方

除了把这个站点在自己的网站下部署一份，有点奇葩的是我们还需要通过 PR 将其 Google 提供的 [相关网站集 GitHub 存储库](https://github.com/GoogleChrome/related-website-sets)。然后站点可以使用 Storage Access API 通过 requestStorageAccess() 请求访问跨站点 Cookie ，或使用 requestStorageAccessFor() 委托访问。当站点位于同一组内时，浏览器将自动授予访问权限，并且跨站点 Cookie 是可用的。

#### 5. Attribution Reporting API

在不追踪用户跨站活动的情况下，提供跨站点的广告归因、转化分析能力。

使用方式大概是这样的：我们首先需要提供一个用于存储归因报告数据的接口，然后在 HTML a、img 、iframe 等标签上追加 attributionsrc：

```html
<a
  href="https://shoes.example/landing"
  attributionsrc="http://adtech.example/register-source?..."
  target="_blank"
>
  Click me</a
>

<img
  href="https://advertiser.example/landing"
  attributionsrc="https://adtech.example/register-source?..."
/>
```

或者通过 JavaScript 调用注入 attribution src：

```javascript
const encodedUrl = encodeURIComponent('https://adtech.example/attribution_source?ad_id=...');
window.open(
  "https://shoes.example/landing",
  "_blank",
  attributionsrc=${encodedUrl});
```

#### 6. Topics API

在不依赖三方 Cookie 的情况下由浏览器进行用户的兴趣推断。

通过 Topics API ，浏览器可以根据用户的浏览活动观察并记录用户感兴趣的主题。这些信息只会记录在用户的设备上。然后，Topics API 可以让 API 调用者（例如广告技术平台）访问用户感兴趣的主题，但不会透露有关用户浏览活动的其他信息。

```javascript
const topics = await document.browsingTopics();
```

#### 7. Shared Storage API

在保护用户隐私的场景下支持跨站点信息存储和读取。

像其他 JavaScript 存储 API（例如 localStorage 或 indexedDB）一样，我们可以随时写入 Shared Storage ，但区别是我们只能在一个安全的环境（shared storage worklet）中读取共享存储的值。

#### 8. FedCM

提供一种标准化的方式进行用户身份验证和凭据管理。

FedCM（联合凭证管理）是联合身份服务（例如“使用...登录”）的一种隐私保护方法，用户可以通过该方法登录网站，而无需与身份服务或网站共享其个人信息。

## 附录

1. `SameSite: Lax` 下请求

| 请求类型  | 示例                                 | 正常情况    | Lax         |
| --------- | ------------------------------------ | ----------- | ----------- |
| 链接      | `<a href="..."></a>`                 | 发送 Cookie | 发送 Cookie |
| 预加载    | `<link rel="prerender" href="..."/>` | 发送 Cookie | 发送 Cookie |
| GET 表单  | `<form method="GET" action="..."> `  | 发送 Cookie | 发送 Cookie |
| POST 表单 | `<form method="POST" action="...">`  | 发送 Cookie | 不发送      |
| iframe    | `<iframe src="..."></iframe> `       | 发送 Cookie | 不发送      |
| AJAX      | `$.get("...")   `                    | 发送 Cookie | 不发送      |
| Image     | `<img src="..."> `                   | 发送 Cookie | 不发送      |

Lax 主要解决 Strict 的易用性问题，用户从第三方页面访问一个已登录的系统时，由于未携带Cookie，总是需要重新登录。但由于现在基本上所有网站都是 SPA + ajax 请求，a 链接跳转携带的 Cookie 一般可以忽视

## 引用

本文主要为信息整理

- [1] [浏览器同源政策及其规避方法](https://www.ruanyifeng.com/blog/2016/04/same-origin-policy.html)
- [2] [Cookie 的 SameSite 属性](https://www.ruanyifeng.com/blog/2019/09/cookie-samesite.html)
- [3] [Intent to Deprecate & Remove: Third-Party Cookies](https://groups.google.com/a/chromium.org/g/blink-dev/c/RG0oLYQ0f2I/m/xMSdsEAzBwAJ?pli=1)
- [4] [Chrome 官方 - 第三方 Cookie 倒计时](https://developers.google.com/privacy-sandbox/blog/cookie-countdown-2023oct)
- [5] [聊聊 Cookie 的 CHIPS 机制](https://blog.conardli.top/2022/03/22/web/cookie-chips/)
- [6] [Third-Party Cookie Deprecation Testing and Debugging](https://www.chromium.org/Home/chromium-privacy/privacy-sandbox/third-party-cookie-phaseout/)
