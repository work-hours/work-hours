import{c as s}from"./createLucideIcon-CdLL0xzd.js";import{r,b as o,m as i,t as a}from"./TaskController-DRILXs0Z.js";/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u=[["line",{x1:"4",x2:"20",y1:"9",y2:"9",key:"4lhtct"}],["line",{x1:"4",x2:"20",y1:"15",y2:"15",key:"vyu0kd"}],["line",{x1:"10",x2:"8",y1:"3",y2:"21",key:"1ggp8o"}],["line",{x1:"16",x2:"14",y1:"3",y2:"21",key:"weycgp"}]],m=s("Hash",u),l={errors:{},call:function({params:t={},headers:n={},methodHead:e=!1}){return fetch(r("client.list",t),{method:e?"HEAD":"GET",headers:o(n)}).then(c=>(l.errors=i(c),a(c),c))},data:function({params:t={},headers:n={}}){return fetch(r("client.list",t),{method:"GET",headers:o(n)}).then(async e=>(l.errors=i(e),a(e),e.json()))},route:function(t={}){return r("client.list",t)},routeName:"client.list",form:function(t={}){return{method:"get",url:r("client.list",t)}}};export{m as H,l as c};
