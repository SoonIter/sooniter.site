import{W as N,q as d,E as _,d as h,u as k,a as y,I as b,o as l,c as m,e,t as r,f as s,X as f,Y as w,N as x,b as S,U as g}from"./app.a880e261.js";const B=N("user",()=>{const t=d(""),a=d(new Set),i=_(()=>Array.from(a.value)),o=_(()=>i.value.filter(u=>u!==t.value));function n(u){t.value&&a.value.add(t.value),t.value=u}return{setNewName:n,otherNames:o,savedName:t}}),C={"text-sm":"","opacity-75":""},E={key:0,"text-sm":"","mt-4":""},V={"opacity-75":""},$=["to"],I=h({__name:"[name]",props:{name:null},setup(t){const a=t,i=k(),o=B(),{t:n}=y();return b(()=>{o.setNewName(a.name)}),(u,p)=>{const v=g;return l(),m(f,null,[e("p",null,r(s(n)("intro.hi",{name:a.name})),1),e("p",C,[e("em",null,r(s(n)("intro.dynamic-route")),1)]),s(o).otherNames.length?(l(),m("p",E,[e("span",V,r(s(n)("intro.aka"))+":",1),e("ul",null,[(l(!0),m(f,null,w(s(o).otherNames,c=>(l(),m("li",{key:c},[e("router-link",{to:`/hi/${c}`,replace:""},r(c),9,$)]))),128))])])):x("",!0),S(v,{"h-6":"","w-6":""}),e("div",null,[e("button",{btn:"",m:"3 t6","text-sm":"",onClick:p[0]||(p[0]=c=>s(i).back())},r(s(n)("button.back")),1)])],64)}}});export{I as default};