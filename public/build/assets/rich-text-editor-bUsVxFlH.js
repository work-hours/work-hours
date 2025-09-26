import{r as p,j as e}from"./app-CE94QcfB.js";import{c as u}from"./utils-DKW5XViW.js";import{c as i}from"./createLucideIcon-D9NWueAg.js";import{L as v}from"./list-BjNAZPQN.js";/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=[["path",{d:"M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8",key:"mg9rjx"}]],M=i("Bold",b);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L=[["line",{x1:"19",x2:"10",y1:"4",y2:"4",key:"15jd3p"}],["line",{x1:"14",x2:"5",y1:"20",y2:"20",key:"bu0au3"}],["line",{x1:"15",x2:"9",y1:"4",y2:"20",key:"uljnxc"}]],N=i("Italic",L);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _=[["path",{d:"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71",key:"1cjeqo"}],["path",{d:"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",key:"19qd67"}]],w=i("Link",_);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C=[["path",{d:"M10 12h11",key:"6m4ad9"}],["path",{d:"M10 18h11",key:"11hvi2"}],["path",{d:"M10 6h11",key:"c7qv1k"}],["path",{d:"M4 10h2",key:"16xx2s"}],["path",{d:"M4 6h1v4",key:"cnovpq"}],["path",{d:"M6 18H4c0-1 2-2 2-3s-1-1.5-2-1",key:"m9a95d"}]],U=i("ListOrdered",C);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E=[["path",{d:"M21 7v6h-6",key:"3ptur4"}],["path",{d:"M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7",key:"1kgawr"}]],H=i("Redo",E);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I=[["path",{d:"M6 4v6a6 6 0 0 0 12 0V4",key:"9kb039"}],["line",{x1:"4",x2:"20",y1:"20",y2:"20",key:"nun2al"}]],R=i("Underline",I);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $=[["path",{d:"M3 7v6h6",key:"1v2h90"}],["path",{d:"M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13",key:"1r6uu6"}]],B=i("Undo",$);function V({value:s,onChange:c,placeholder:l="Write something…",className:d,disabled:t=!1,minRows:h}){const a=p.useRef(null),[y,m]=p.useState(!1);p.useEffect(()=>{const n=a.current;if(!n)return;const x=n.innerHTML;!y&&x!==s&&(n.innerHTML=s||"")},[s,y]);const o=(n,x)=>{if(t)return;document.execCommand(n,!1,x);const k=a.current;k&&c(k.innerHTML)},f=()=>{if(t)return;const n=window.prompt("Enter URL");n&&o("createLink",n)},g=()=>{const n=a.current;n&&c(n.innerHTML)},j=()=>{};return e.jsxs("div",{className:u("flex w-full flex-col rounded-md border border-input bg-transparent shadow-sm",t&&"opacity-60",d),children:[e.jsxs("div",{className:"flex items-center gap-1 border-b px-2 py-1 text-muted-foreground",children:[e.jsx(r,{onClick:()=>o("bold"),title:"Bold",icon:M,disabled:t}),e.jsx(r,{onClick:()=>o("italic"),title:"Italic",icon:N,disabled:t}),e.jsx(r,{onClick:()=>o("underline"),title:"Underline",icon:R,disabled:t}),e.jsx("div",{className:"mx-1 h-5 w-px bg-gray-200"}),e.jsx(r,{onClick:()=>o("insertUnorderedList"),title:"Bulleted list",icon:v,disabled:t}),e.jsx(r,{onClick:()=>o("insertOrderedList"),title:"Numbered list",icon:U,disabled:t}),e.jsx("div",{className:"mx-1 h-5 w-px bg-gray-200"}),e.jsx(r,{onClick:f,title:"Insert link",icon:w,disabled:t}),e.jsx("div",{className:"mx-1 h-5 w-px bg-gray-200"}),e.jsx(r,{onClick:()=>o("undo"),title:"Undo",icon:B,disabled:t}),e.jsx(r,{onClick:()=>o("redo"),title:"Redo",icon:H,disabled:t})]}),e.jsx("div",{ref:a,className:u("prose prose-sm max-w-none px-3 py-2 text-gray-900 outline-none dark:text-gray-100","hover:border-primary/50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] rounded-b-md min-h-28"),style:h?{minHeight:`${h*24}px`}:void 0,contentEditable:!t,onFocus:()=>m(!0),onBlur:()=>m(!1),onInput:g,onPaste:j,"data-placeholder":l,suppressContentEditableWarning:!0}),e.jsx("style",{children:`
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: var(--muted-foreground);
        }
        .prose :where(ul) { list-style: disc; padding-left: 1.25rem; }
        .prose :where(ol) { list-style: decimal; padding-left: 1.25rem; }
        .prose :where(a) { color: #2563eb; text-decoration: underline; }
      `})]})}function r({onClick:s,title:c,icon:l,disabled:d}){return e.jsx("button",{type:"button",onClick:s,title:c,disabled:d,className:u("inline-flex h-8 items-center justify-center rounded px-2 text-xs transition-colors","hover:bg-gray-100 active:bg-gray-200 dark:hover:bg-gray-800 dark:active:bg-gray-700","disabled:opacity-50 disabled:cursor-not-allowed"),children:e.jsx(l,{className:"h-4 w-4"})})}export{V as R};
