module.exports=[46008,a=>{"use strict";let b,c;var d,e=a.i(87924),f=a.i(72131),g=a.i(83490),h=a.i(5434),i=a.i(70106);let j=(0,i.default)("camera",[["path",{d:"M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z",key:"18u6gg"}],["circle",{cx:"12",cy:"13",r:"3",key:"1vg3eu"}]]);var k=a.i(46842),l=a.i(96221),m=a.i(41675),n=a.i(3314),o=a.i(92258);let p=(0,i.default)("at-sign",[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8",key:"7n84p3"}]]),q={data:""},r=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,s=/\/\*[^]*?\*\/|  +/g,t=/\n+/g,u=(a,b)=>{let c="",d="",e="";for(let f in a){let g=a[f];"@"==f[0]?"i"==f[1]?c=f+" "+g+";":d+="f"==f[1]?u(g,f):f+"{"+u(g,"k"==f[1]?"":b)+"}":"object"==typeof g?d+=u(g,b?b.replace(/([^,])+/g,a=>f.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,b=>/&/.test(b)?b.replace(/&/g,a):a?a+" "+b:b)):f):null!=g&&(f=/^--/.test(f)?f:f.replace(/[A-Z]/g,"-$&").toLowerCase(),e+=u.p?u.p(f,g):f+":"+g+";")}return c+(b&&e?b+"{"+e+"}":e)+d},v={},w=a=>{if("object"==typeof a){let b="";for(let c in a)b+=c+w(a[c]);return b}return a};function x(a){let b,c,d=this||{},e=a.call?a(d.p):a;return((a,b,c,d,e)=>{var f;let g=w(a),h=v[g]||(v[g]=(a=>{let b=0,c=11;for(;b<a.length;)c=101*c+a.charCodeAt(b++)>>>0;return"go"+c})(g));if(!v[h]){let b=g!==a?a:(a=>{let b,c,d=[{}];for(;b=r.exec(a.replace(s,""));)b[4]?d.shift():b[3]?(c=b[3].replace(t," ").trim(),d.unshift(d[0][c]=d[0][c]||{})):d[0][b[1]]=b[2].replace(t," ").trim();return d[0]})(a);v[h]=u(e?{["@keyframes "+h]:b}:b,c?"":"."+h)}let i=c&&v.g?v.g:null;return c&&(v.g=v[h]),f=v[h],i?b.data=b.data.replace(i,f):-1===b.data.indexOf(f)&&(b.data=d?f+b.data:b.data+f),h})(e.unshift?e.raw?(b=[].slice.call(arguments,1),c=d.p,e.reduce((a,d,e)=>{let f=b[e];if(f&&f.call){let a=f(c),b=a&&a.props&&a.props.className||/^go/.test(a)&&a;f=b?"."+b:a&&"object"==typeof a?a.props?"":u(a,""):!1===a?"":a}return a+d+(null==f?"":f)},"")):e.reduce((a,b)=>Object.assign(a,b&&b.call?b(d.p):b),{}):e,d.target||q,d.g,d.o,d.k)}x.bind({g:1});let y,z,A,B=x.bind({k:1});function C(a,b){let c=this||{};return function(){let d=arguments;function e(f,g){let h=Object.assign({},f),i=h.className||e.className;c.p=Object.assign({theme:z&&z()},h),c.o=/ *go\d+/.test(i),h.className=x.apply(c,d)+(i?" "+i:""),b&&(h.ref=g);let j=a;return a[0]&&(j=h.as||a,delete h.as),A&&j[0]&&A(h),y(j,h)}return b?b(e):e}}var D=(a,b)=>"function"==typeof a?a(b):a,E=(b=0,()=>(++b).toString()),F="default",G=(a,b)=>{let{toastLimit:c}=a.settings;switch(b.type){case 0:return{...a,toasts:[b.toast,...a.toasts].slice(0,c)};case 1:return{...a,toasts:a.toasts.map(a=>a.id===b.toast.id?{...a,...b.toast}:a)};case 2:let{toast:d}=b;return G(a,{type:+!!a.toasts.find(a=>a.id===d.id),toast:d});case 3:let{toastId:e}=b;return{...a,toasts:a.toasts.map(a=>a.id===e||void 0===e?{...a,dismissed:!0,visible:!1}:a)};case 4:return void 0===b.toastId?{...a,toasts:[]}:{...a,toasts:a.toasts.filter(a=>a.id!==b.toastId)};case 5:return{...a,pausedAt:b.time};case 6:let f=b.time-(a.pausedAt||0);return{...a,pausedAt:void 0,toasts:a.toasts.map(a=>({...a,pauseDuration:a.pauseDuration+f}))}}},H=[],I={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},J={},K=(a,b=F)=>{J[b]=G(J[b]||I,a),H.forEach(([a,c])=>{a===b&&c(J[b])})},L=a=>Object.keys(J).forEach(b=>K(a,b)),M=(a=F)=>b=>{K(b,a)},N={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},O=a=>(b,c)=>{let d,e=((a,b="blank",c)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:b,ariaProps:{role:"status","aria-live":"polite"},message:a,pauseDuration:0,...c,id:(null==c?void 0:c.id)||E()}))(b,a,c);return M(e.toasterId||(d=e.id,Object.keys(J).find(a=>J[a].toasts.some(a=>a.id===d))))({type:2,toast:e}),e.id},P=(a,b)=>O("blank")(a,b);P.error=O("error"),P.success=O("success"),P.loading=O("loading"),P.custom=O("custom"),P.dismiss=(a,b)=>{let c={type:3,toastId:a};b?M(b)(c):L(c)},P.dismissAll=a=>P.dismiss(void 0,a),P.remove=(a,b)=>{let c={type:4,toastId:a};b?M(b)(c):L(c)},P.removeAll=a=>P.remove(void 0,a),P.promise=(a,b,c)=>{let d=P.loading(b.loading,{...c,...null==c?void 0:c.loading});return"function"==typeof a&&(a=a()),a.then(a=>{let e=b.success?D(b.success,a):void 0;return e?P.success(e,{id:d,...c,...null==c?void 0:c.success}):P.dismiss(d),a}).catch(a=>{let e=b.error?D(b.error,a):void 0;e?P.error(e,{id:d,...c,...null==c?void 0:c.error}):P.dismiss(d)}),a};var Q=1e3,R=B`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,S=B`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,T=B`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,U=C("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${a=>a.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${R} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${S} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${a=>a.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${T} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,V=B`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,W=C("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${a=>a.secondary||"#e0e0e0"};
  border-right-color: ${a=>a.primary||"#616161"};
  animation: ${V} 1s linear infinite;
`,X=B`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,Y=B`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,Z=C("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${a=>a.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${X} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${Y} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${a=>a.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,$=C("div")`
  position: absolute;
`,_=C("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,aa=B`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,ab=C("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${aa} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,ac=({toast:a})=>{let{icon:b,type:c,iconTheme:d}=a;return void 0!==b?"string"==typeof b?f.createElement(ab,null,b):b:"blank"===c?null:f.createElement(_,null,f.createElement(W,{...d}),"loading"!==c&&f.createElement($,null,"error"===c?f.createElement(U,{...d}):f.createElement(Z,{...d})))},ad=C("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,ae=C("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,af=f.memo(({toast:a,position:b,style:d,children:e})=>{let g=a.height?((a,b)=>{let d=a.includes("top")?1:-1,[e,f]=c?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*d}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*d}%,-1px) scale(.6); opacity:0;}
`];return{animation:b?`${B(e)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${B(f)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(a.position||b||"top-center",a.visible):{opacity:0},h=f.createElement(ac,{toast:a}),i=f.createElement(ae,{...a.ariaProps},D(a.message,a));return f.createElement(ad,{className:a.className,style:{...g,...d,...a.style}},"function"==typeof e?e({icon:h,message:i}):f.createElement(f.Fragment,null,h,i))});d=f.createElement,u.p=void 0,y=d,z=void 0,A=void 0;var ag=({id:a,className:b,style:c,onHeightUpdate:d,children:e})=>{let g=f.useCallback(b=>{if(b){let c=()=>{d(a,b.getBoundingClientRect().height)};c(),new MutationObserver(c).observe(b,{subtree:!0,childList:!0,characterData:!0})}},[a,d]);return f.createElement("div",{ref:g,className:b,style:c},e)},ah=x`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,ai=({reverseOrder:a,position:b="top-center",toastOptions:d,gutter:e,children:g,toasterId:h,containerStyle:i,containerClassName:j})=>{let{toasts:k,handlers:l}=((a,b="default")=>{let{toasts:c,pausedAt:d}=((a={},b=F)=>{let[c,d]=(0,f.useState)(J[b]||I),e=(0,f.useRef)(J[b]);(0,f.useEffect)(()=>(e.current!==J[b]&&d(J[b]),H.push([b,d]),()=>{let a=H.findIndex(([a])=>a===b);a>-1&&H.splice(a,1)}),[b]);let g=c.toasts.map(b=>{var c,d,e;return{...a,...a[b.type],...b,removeDelay:b.removeDelay||(null==(c=a[b.type])?void 0:c.removeDelay)||(null==a?void 0:a.removeDelay),duration:b.duration||(null==(d=a[b.type])?void 0:d.duration)||(null==a?void 0:a.duration)||N[b.type],style:{...a.style,...null==(e=a[b.type])?void 0:e.style,...b.style}}});return{...c,toasts:g}})(a,b),e=(0,f.useRef)(new Map).current,g=(0,f.useCallback)((a,b=Q)=>{if(e.has(a))return;let c=setTimeout(()=>{e.delete(a),h({type:4,toastId:a})},b);e.set(a,c)},[]);(0,f.useEffect)(()=>{if(d)return;let a=Date.now(),e=c.map(c=>{if(c.duration===1/0)return;let d=(c.duration||0)+c.pauseDuration-(a-c.createdAt);if(d<0){c.visible&&P.dismiss(c.id);return}return setTimeout(()=>P.dismiss(c.id,b),d)});return()=>{e.forEach(a=>a&&clearTimeout(a))}},[c,d,b]);let h=(0,f.useCallback)(M(b),[b]),i=(0,f.useCallback)(()=>{h({type:5,time:Date.now()})},[h]),j=(0,f.useCallback)((a,b)=>{h({type:1,toast:{id:a,height:b}})},[h]),k=(0,f.useCallback)(()=>{d&&h({type:6,time:Date.now()})},[d,h]),l=(0,f.useCallback)((a,b)=>{let{reverseOrder:d=!1,gutter:e=8,defaultPosition:f}=b||{},g=c.filter(b=>(b.position||f)===(a.position||f)&&b.height),h=g.findIndex(b=>b.id===a.id),i=g.filter((a,b)=>b<h&&a.visible).length;return g.filter(a=>a.visible).slice(...d?[i+1]:[0,i]).reduce((a,b)=>a+(b.height||0)+e,0)},[c]);return(0,f.useEffect)(()=>{c.forEach(a=>{if(a.dismissed)g(a.id,a.removeDelay);else{let b=e.get(a.id);b&&(clearTimeout(b),e.delete(a.id))}})},[c,g]),{toasts:c,handlers:{updateHeight:j,startPause:i,endPause:k,calculateOffset:l}}})(d,h);return f.createElement("div",{"data-rht-toaster":h||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...i},className:j,onMouseEnter:l.startPause,onMouseLeave:l.endPause},k.map(d=>{let h,i,j=d.position||b,k=l.calculateOffset(d,{reverseOrder:a,gutter:e,defaultPosition:b}),m=(h=j.includes("top"),i=j.includes("center")?{justifyContent:"center"}:j.includes("right")?{justifyContent:"flex-end"}:{},{left:0,right:0,display:"flex",position:"absolute",transition:c?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${k*(h?1:-1)}px)`,...h?{top:0}:{bottom:0},...i});return f.createElement(ag,{id:d.id,key:d.id,onHeightUpdate:l.updateHeight,className:d.visible?ah:"",style:m},"custom"===d.type?D(d.message,d):g?g(d):f.createElement(af,{toast:d,position:j}))}))},aj=a.i(33217),ak=a.i(70025),al=a.i(37927),am=a.i(62036),an=a.i(46271);let ao=({label:a,icon:b,children:c,hint:d})=>(0,e.jsxs)("div",{className:"space-y-2",children:[(0,e.jsxs)("div",{className:"flex items-center gap-2",children:[b&&(0,e.jsx)("span",{className:"text-muted-foreground flex items-center",children:b}),(0,e.jsx)("label",{className:"text-[11px] font-black uppercase tracking-widest text-muted-foreground",children:a})]}),c,d&&(0,e.jsx)("p",{className:"text-[11px] text-muted-foreground",children:d})]}),ap=({title:a,desc:b,icon:c,children:d})=>(0,e.jsxs)("div",{className:"rounded-3xl border border-border bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/55 shadow-sm overflow-hidden",children:[(0,e.jsxs)("div",{className:"flex items-start gap-3 p-5 sm:p-6 border-b border-border",children:[(0,e.jsx)("div",{className:"h-11 w-11 rounded-2xl border border-border bg-background/40 flex items-center justify-center text-primary",children:c}),(0,e.jsxs)("div",{className:"min-w-0",children:[(0,e.jsx)("h3",{className:"text-sm sm:text-base font-black tracking-tight",children:a}),b&&(0,e.jsx)("p",{className:"text-xs text-muted-foreground mt-1",children:b})]})]}),(0,e.jsx)("div",{className:"p-5 sm:p-6",children:d})]});a.s(["default",0,()=>{let a=(0,al.useQueryClient)(),b=(0,f.useRef)(null),[c,d]=(0,f.useState)({first_name:"",last_name:"",email:"",role:"",current_password:"",new_password:""}),i="https://admin-crm.onrender.com",q=h.default.get("token"),{data:r,isLoading:s}=(0,aj.useQuery)({queryKey:["profile"],queryFn:()=>{let a=h.default.get("user")||localStorage.getItem("user");if(a){let b=JSON.parse(a);return b.data?b.data:b}return null},staleTime:1/0});(0,f.useEffect)(()=>{r&&d(a=>({...a,first_name:r.first_name||"",last_name:r.last_name||"",email:r.email||"",role:r.role||"manager"}))},[r]);let t=(0,ak.useMutation)({mutationFn:async a=>{await g.default.post(`${i}/api/auth/edit-profile`,{first_name:a.first_name,last_name:a.last_name,email:a.email},{headers:{Authorization:`Bearer ${q}`}}),a.current_password&&a.new_password&&await g.default.post(`${i}/api/auth/edit-password`,{current_password:a.current_password,new_password:a.new_password},{headers:{Authorization:`Bearer ${q}`}})},onSuccess:()=>{let b={...r,...c};h.default.set("user",JSON.stringify(b)),localStorage.setItem("user",JSON.stringify(b)),a.setQueryData(["profile"],b),P.success("Muvaffaqiyatli yangilandi"),d(a=>({...a,current_password:"",new_password:""}))},onError:()=>{P.error("Yangilashda xatolik")}}),u=(0,ak.useMutation)({mutationFn:async a=>{let b=new FormData;b.append("image",a);let c=await g.default.post(`${i}/api/auth/edit-profile-img`,b,{headers:{Authorization:`Bearer ${q}`,"Content-Type":"multipart/form-data"}});return c.data?.image||c.data?.data?.image},onSuccess:c=>{let d={...r,image:c||r?.image};h.default.set("user",JSON.stringify(d)),localStorage.setItem("user",JSON.stringify(d)),a.setQueryData(["profile"],d),P.success("Rasm muvaffaqiyatli yangilandi"),b.current&&(b.current.value="")},onError:a=>{P.error(a.response?.data?.message||"Rasmni yuklashda xatolik")}}),v=()=>r?.image?r.image.startsWith("http")?r.image:`${i}/${r.image}`:null,w=(0,f.useMemo)(()=>(((r?.first_name||"U")[0]||"U")+((r?.last_name||"S")[0]||"")).toUpperCase(),[r]);return s?(0,e.jsx)("div",{className:"min-h-screen flex items-center justify-center bg-background text-foreground",children:(0,e.jsx)(l.Loader2,{className:"animate-spin text-primary"})}):(0,e.jsxs)("div",{className:"relative w-full p-4 sm:p-6 min-h-screen text-foreground overflow-hidden",children:[(0,e.jsx)(ai,{position:"top-center"}),(0,e.jsx)("div",{className:"pointer-events-none absolute -top-24 left-1/3 h-[520px] w-[520px] rounded-full bg-primary/10 blur-[120px]"}),(0,e.jsx)("div",{className:"pointer-events-none absolute -bottom-40 -right-24 h-[520px] w-[520px] rounded-full bg-blue-500/10 blur-[140px]"}),(0,e.jsxs)("div",{className:"max-w-6xl mx-auto space-y-5",children:[(0,e.jsx)("div",{className:"relative rounded-3xl border border-border bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/55 p-5 sm:p-6 shadow-sm",children:(0,e.jsxs)("div",{className:"flex flex-col md:flex-row md:items-center md:justify-between gap-5",children:[(0,e.jsxs)("div",{className:"flex items-center gap-5",children:[(0,e.jsxs)("div",{className:"relative",children:[(0,e.jsxs)("div",{className:"relative h-20 w-20 md:h-24 md:w-24 rounded-3xl border border-border bg-background/40 overflow-hidden shadow-sm",children:[v()?(0,e.jsx)("img",{src:v(),alt:"User",className:"w-full h-full object-cover"}):(0,e.jsx)("div",{className:"w-full h-full flex items-center justify-center text-primary font-black text-2xl bg-primary/10",children:w}),(0,e.jsx)(am.AnimatePresence,{children:u.isPending&&(0,e.jsx)(an.motion.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},className:"absolute inset-0 bg-background/70 flex items-center justify-center",children:(0,e.jsx)(l.Loader2,{className:"animate-spin text-primary",size:24})})})]}),(0,e.jsx)("button",{type:"button",disabled:u.isPending,onClick:()=>b.current?.click(),className:"absolute -bottom-2 -right-2 h-11 w-11 rounded-2xl border border-border bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:opacity-90 transition active:scale-95 disabled:opacity-50",title:"Rasmni o'zgartirish",children:(0,e.jsx)(j,{size:18})}),(0,e.jsx)("input",{type:"file",hidden:!0,ref:b,accept:"image/*",onChange:a=>{a.target.files?.[0]&&u.mutate(a.target.files[0])}})]}),(0,e.jsxs)("div",{className:"min-w-0",children:[(0,e.jsxs)("h2",{className:"text-2xl md:text-3xl font-black tracking-tight truncate",children:[r?.first_name," ",r?.last_name]}),(0,e.jsx)("p",{className:"text-muted-foreground text-sm truncate mt-1",children:r?.email}),(0,e.jsxs)("div",{className:"flex items-center gap-2 text-muted-foreground text-xs mt-2",children:[(0,e.jsx)(m.Calendar,{size:12}),"Qo'shilgan: ",r?.createdAt?.split("T")[0]||"2025-06-04"]})]})]}),(0,e.jsxs)("div",{className:"inline-flex items-center justify-center self-start md:self-auto rounded-2xl border border-border bg-background/40 px-4 py-2",children:[(0,e.jsx)("span",{className:"text-[11px] font-black uppercase tracking-[0.25em] text-muted-foreground",children:"role"}),(0,e.jsx)("span",{className:"ml-3 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-primary",children:r?.role||"manager"})]})]})}),(0,e.jsxs)("div",{className:"grid grid-cols-1 lg:grid-cols-3 gap-5",children:[(0,e.jsxs)("div",{className:"lg:col-span-2 space-y-5",children:[(0,e.jsx)(ap,{title:"Profil ma'lumotlari",desc:"Ism, familiya va emailni yangilang.",icon:(0,e.jsx)(k.User,{size:18}),children:(0,e.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[(0,e.jsx)(ao,{label:"Ism",icon:(0,e.jsx)(k.User,{size:14}),children:(0,e.jsx)("input",{className:"w-full rounded-2xl border border-border bg-background/55 px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-ring",value:c.first_name,onChange:a=>d({...c,first_name:a.target.value})})}),(0,e.jsx)(ao,{label:"Familiya",icon:(0,e.jsx)(k.User,{size:14}),children:(0,e.jsx)("input",{className:"w-full rounded-2xl border border-border bg-background/55 px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-ring",value:c.last_name,onChange:a=>d({...c,last_name:a.target.value})})}),(0,e.jsx)(ao,{label:"Email",icon:(0,e.jsx)(o.Mail,{size:14}),children:(0,e.jsx)("input",{className:"w-full rounded-2xl border border-border bg-background/55 px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-ring",value:c.email,onChange:a=>d({...c,email:a.target.value})})}),(0,e.jsx)(ao,{label:"Rol",icon:(0,e.jsx)(p,{size:14}),hint:"Rolni faqat admin o'zgartiradi.",children:(0,e.jsx)("input",{className:"w-full rounded-2xl border border-border bg-background/40 px-4 py-3 text-sm outline-none opacity-60 cursor-not-allowed",value:c.role,disabled:!0})})]})}),(0,e.jsxs)(ap,{title:"Xavfsizlik",desc:"Parolni yangilash uchun joriy va yangi parolni kiriting.",icon:(0,e.jsx)(n.Shield,{size:18}),children:[(0,e.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[(0,e.jsx)(ao,{label:"Joriy parol",children:(0,e.jsx)("input",{type:"password",autoComplete:"current-password",className:"w-full rounded-2xl border border-border bg-background/55 px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-ring",value:c.current_password,onChange:a=>d({...c,current_password:a.target.value})})}),(0,e.jsx)(ao,{label:"Yangi parol",hint:"Ikki maydon ham to'ldirilsa parol yangilanadi.",children:(0,e.jsx)("input",{type:"password",autoComplete:"new-password",className:"w-full rounded-2xl border border-border bg-background/55 px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-ring",value:c.new_password,onChange:a=>d({...c,new_password:a.target.value})})})]}),(0,e.jsxs)("div",{className:"mt-5 flex flex-col sm:flex-row gap-2 sm:justify-end",children:[(0,e.jsx)("button",{type:"button",onClick:()=>d(a=>({...a,current_password:"",new_password:""})),className:"sm:w-auto w-full rounded-2xl border border-border bg-background/45 px-5 py-3 text-sm font-black hover:bg-muted/50 transition",children:"Tozalash"}),(0,e.jsx)("button",{type:"button",onClick:()=>t.mutate(c),disabled:t.isPending,className:((...a)=>a.filter(Boolean).join(" "))("sm:w-auto w-full rounded-2xl bg-primary text-primary-foreground px-7 py-3 text-sm font-black hover:opacity-90 transition shadow-sm","active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"),children:(0,e.jsxs)("span",{className:"inline-flex items-center justify-center gap-2",children:[t.isPending&&(0,e.jsx)(l.Loader2,{size:16,className:"animate-spin"}),"O'zgartirish"]})})]})]})]}),(0,e.jsxs)("div",{className:"lg:col-span-1 space-y-5",children:[(0,e.jsxs)("div",{className:"rounded-3xl border border-border bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/55 shadow-sm p-5 sm:p-6",children:[(0,e.jsx)("p",{className:"text-[11px] font-black uppercase tracking-[0.25em] text-muted-foreground",children:"Profil holati"}),(0,e.jsxs)("div",{className:"mt-4 space-y-3",children:[(0,e.jsxs)("div",{className:"flex items-center justify-between rounded-2xl border border-border bg-background/40 p-4",children:[(0,e.jsx)("span",{className:"text-xs text-muted-foreground",children:"Rasm"}),(0,e.jsx)("span",{className:"text-xs font-black",children:v()?"Bor":"Yo‘q"})]}),(0,e.jsxs)("div",{className:"flex items-center justify-between rounded-2xl border border-border bg-background/40 p-4",children:[(0,e.jsx)("span",{className:"text-xs text-muted-foreground",children:"Email"}),(0,e.jsx)("span",{className:"text-xs font-black truncate max-w-[160px]",children:r?.email||"---"})]}),(0,e.jsxs)("div",{className:"flex items-center justify-between rounded-2xl border border-border bg-background/40 p-4",children:[(0,e.jsx)("span",{className:"text-xs text-muted-foreground",children:"Qo‘shilgan"}),(0,e.jsx)("span",{className:"text-xs font-black",children:r?.createdAt?.split("T")[0]||"2025-06-04"})]})]}),(0,e.jsx)("p",{className:"mt-4 text-xs text-muted-foreground",children:"Eslatma: Profil ma’lumoti cookie/localStorage’da saqlanmoqda."})]}),(0,e.jsxs)("div",{className:"rounded-3xl border border-border bg-primary/10 p-5 sm:p-6",children:[(0,e.jsx)("p",{className:"text-sm font-black tracking-tight text-primary",children:"Tip"}),(0,e.jsx)("p",{className:"mt-2 text-xs text-muted-foreground",children:"Agar rasm yuklanmayotgan bo‘lsa, backend’da static file serve (uploads) yoqilganini tekshiring."})]})]})]})]})]})}],46008)}];

//# sourceMappingURL=app_%28main%29_profile_page_tsx_8f6acfd4._.js.map