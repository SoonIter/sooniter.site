if(!self.define){let e,s={};const r=(r,i)=>(r=new URL(r+".js",i).href,s[r]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=r,e.onload=s,document.head.appendChild(e)}else e=r,importScripts(r),s()})).then((()=>{let e=s[r];if(!e)throw new Error(`Module ${r} didn’t register its module`);return e})));self.define=(i,n)=>{const l=e||("document"in self?document.currentScript.src:"")||location.href;if(s[l])return;let o={};const a=e=>r(e,l),t={module:{uri:l},exports:o,require:a};s[l]=Promise.all(i.map((e=>t[e]||a(e)))).then((e=>(n(...e),o)))}}define(["./workbox-f51ab5e4"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"about.html",revision:"4e957ecfa27cef217dca39484ee2eeac"},{url:"assets/_name_.7c5a8429.js",revision:null},{url:"assets/404.96d0ff9c.js",revision:null},{url:"assets/about.6e1889df.css",revision:null},{url:"assets/about.c9067b57.js",revision:null},{url:"assets/app.5f316c77.js",revision:null},{url:"assets/asyncSinglePattern.7e3245c7.js",revision:null},{url:"assets/configuration-node-eslint.b954b12e.js",revision:null},{url:"assets/frameworkWandering.53384e7a.js",revision:null},{url:"assets/frontend-monorepo.c57014cc.js",revision:null},{url:"assets/home.3708a7c4.js",revision:null},{url:"assets/index.79f26e93.css",revision:null},{url:"assets/myNewWebsite.45ae6e41.js",revision:null},{url:"assets/Post.3a852ae3.css",revision:null},{url:"assets/Post.vue_vue_type_script_setup_true_lang.4faa9011.js",revision:null},{url:"assets/ReactRerender.439183a6.js",revision:null},{url:"assets/scopes.4bc0898d.js",revision:null},{url:"assets/third-party-cookie.9bd3cf46.js",revision:null},{url:"assets/toNewMember.ea496df3.js",revision:null},{url:"assets/virtual_pwa-register.3ff79d29.js",revision:null},{url:"assets/wip-demo.a1eba285.js",revision:null},{url:"assets/wip-hello-monorepo.f85ad117.js",revision:null},{url:"index.html",revision:"c7addf86cd63a4b30c397b228a3b9bf3"},{url:"posts/asyncsinglepattern.html",revision:"4e957ecfa27cef217dca39484ee2eeac"},{url:"posts/configuration-node-eslint.html",revision:"4e957ecfa27cef217dca39484ee2eeac"},{url:"posts/frameworkwandering.html",revision:"4e957ecfa27cef217dca39484ee2eeac"},{url:"posts/frontend-monorepo.html",revision:"4e957ecfa27cef217dca39484ee2eeac"},{url:"posts/mynewwebsite.html",revision:"4e957ecfa27cef217dca39484ee2eeac"},{url:"posts/reactrerender.html",revision:"4e957ecfa27cef217dca39484ee2eeac"},{url:"posts/scopes.html",revision:"4e957ecfa27cef217dca39484ee2eeac"},{url:"posts/third-party-cookie.html",revision:"4e957ecfa27cef217dca39484ee2eeac"},{url:"posts/tonewmember.html",revision:"4e957ecfa27cef217dca39484ee2eeac"},{url:"posts/wip-demo.html",revision:"4e957ecfa27cef217dca39484ee2eeac"},{url:"posts/wip-hello-monorepo.html",revision:"4e957ecfa27cef217dca39484ee2eeac"},{url:"favicon.svg",revision:"87e1c67527eab5095307b165be4a7619"},{url:"favicon-dark.svg",revision:"55ad73fbfa03e7c8d0303329d38d1641"},{url:"safari-pinned-tab.svg",revision:"da870e408b102799ab9344d352d4923e"},{url:"pwa-192x192.png",revision:"1e777e091ff30ec915e47c7291e3d4bc"},{url:"pwa-512x512.png",revision:"2d9de31d7e53e7b5ee76c33e69122935"},{url:"manifest.webmanifest",revision:"1d79e6e538cbde2e83590e6a3173c3f9"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
