if(!self.define){let e,s={};const r=(r,a)=>(r=new URL(r+".js",a).href,s[r]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=r,e.onload=s,document.head.appendChild(e)}else e=r,importScripts(r),s()})).then((()=>{let e=s[r];if(!e)throw new Error(`Module ${r} didn’t register its module`);return e})));self.define=(a,n)=>{const i=e||("document"in self?document.currentScript.src:"")||location.href;if(s[i])return;let l={};const o=e=>r(e,i),t={module:{uri:i},exports:l,require:o};s[i]=Promise.all(a.map((e=>t[e]||o(e)))).then((e=>(n(...e),l)))}}define(["./workbox-f51ab5e4"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"about.html",revision:"ccbe7510570b60c4aa05ba1a7386af38"},{url:"assets/_name_.ed5fb9c8.js",revision:null},{url:"assets/404.d1412136.js",revision:null},{url:"assets/about.6e1889df.css",revision:null},{url:"assets/about.fec368ff.js",revision:null},{url:"assets/app.a880e261.js",revision:null},{url:"assets/asyncSinglePattern.4a44f94a.js",revision:null},{url:"assets/demo.dd5712a3.js",revision:null},{url:"assets/frameworkWandering.c5b0cfb6.js",revision:null},{url:"assets/frontend-monorepo.80b5958e.js",revision:null},{url:"assets/home.e313b32b.js",revision:null},{url:"assets/index.7ae7a813.css",revision:null},{url:"assets/myNewWebsite.5d91771d.js",revision:null},{url:"assets/Post.3a852ae3.css",revision:null},{url:"assets/Post.vue_vue_type_script_setup_true_lang.20172b9f.js",revision:null},{url:"assets/ReactRerender.b836bd9b.js",revision:null},{url:"assets/scopes.9e1b080c.js",revision:null},{url:"assets/toNewMember.b30a8f92.js",revision:null},{url:"assets/virtual_pwa-register.3ff79d29.js",revision:null},{url:"index.html",revision:"c1bfaa35ca87b7f01913a94111c28472"},{url:"posts/asyncsinglepattern.html",revision:"ccbe7510570b60c4aa05ba1a7386af38"},{url:"posts/demo.html",revision:"ccbe7510570b60c4aa05ba1a7386af38"},{url:"posts/frameworkwandering.html",revision:"ccbe7510570b60c4aa05ba1a7386af38"},{url:"posts/frontend-monorepo.html",revision:"ccbe7510570b60c4aa05ba1a7386af38"},{url:"posts/mynewwebsite.html",revision:"ccbe7510570b60c4aa05ba1a7386af38"},{url:"posts/reactrerender.html",revision:"ccbe7510570b60c4aa05ba1a7386af38"},{url:"posts/scopes.html",revision:"ccbe7510570b60c4aa05ba1a7386af38"},{url:"posts/tonewmember.html",revision:"ccbe7510570b60c4aa05ba1a7386af38"},{url:"favicon.svg",revision:"87e1c67527eab5095307b165be4a7619"},{url:"favicon-dark.svg",revision:"55ad73fbfa03e7c8d0303329d38d1641"},{url:"safari-pinned-tab.svg",revision:"da870e408b102799ab9344d352d4923e"},{url:"pwa-192x192.png",revision:"1e777e091ff30ec915e47c7291e3d4bc"},{url:"pwa-512x512.png",revision:"2d9de31d7e53e7b5ee76c33e69122935"},{url:"manifest.webmanifest",revision:"1d79e6e538cbde2e83590e6a3173c3f9"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));