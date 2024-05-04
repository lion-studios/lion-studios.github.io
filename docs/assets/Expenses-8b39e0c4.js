import{b as i,u as N,y as z,E as G,e as m,o as $,c as k,a as u,f as l,q as d,F as H,s as p,t as f}from"./index-59b1a81b.js";import{_ as W}from"./ErrorMessage-f525a803.js";import{_ as Y}from"./LoadingModal-bfb2afa3.js";const Z={class:"grid"},j={class:"col-12"},q={class:"card"},K={class:"flex flex-row flex-wrap card-container"},J=u("div",{class:"w-7"},[u("h2",null,"Expenses")],-1),Q={class:"col-12"},X={class:"p-input-icon-left md:w-9"},ee=u("i",{class:"pi pi-search"},null,-1),te=u("template",null,null,-1),le={__name:"Expenses",setup(oe){const C=i(!1);N();const L=i([{name:"All",code:"ALL"},{name:"Amazon",code:"AMAZON"},{name:"Walmart",code:"WALMART"},{name:"Etsy",code:"ETSY"},{name:"Shopify",code:"SHOPIFY"}]),_=i(),E=i(""),D=i(0),P=i(null),S=i(20),h=i(null),F=i(!1),b=i();z(()=>{h.value=[],g()});function U(o,e){let t=[];for(var r in e.items){let n={};n[o]=e.items[r][o],t.push(n)}return t}function R(o){let e=[];for(var t in o.items){let n={},a=[];for(var r in o.items[t].integrations)a.push(r);n.salesChannel=a.join(", "),e.push(n)}return e}function v(o,e){let t=[];for(var r in e.items){let n={},a=e.items[r].expense;a&&(n[o]=a[o],t.push(n))}return t}function A(o,e){let t=[];for(var r in e.items){let n={},a=e.items[r].platformFees.AMAZON[o];a&&(n[o]=a.feePerUnit,t.push(n))}return t}function V(o){D.value=o.page,S.value=o.rows,g()}async function g(){C.value=!0,h.value!==[]&&(h.value=[]);let o=_.value?_.value.code:"",e=await G.getProductExpenses(E.value,D.value,S.value,o);if(e){if(e.items){P.value=e.size;let r=U("name",e),n=R(e),a=U("upc",e),x=v("costOfGoodsPerUnit",e),y=v("inboundShippingCost",e),s=v("selfShippingCost",e),O=v("totalCostPerUnit",e),T=A("REFERRAL_FEE",e),B=A("FBA_FEE",e);for(var t in e.items){let I={...r[t],...n[t],...a[t],...x[t],...y[t],...s[t],...O[t],...T[t],...B[t]};h.value[t]=I}}}else F.value=!0;C.value=!1}const c=o=>o?o.toLocaleString("en-US",{style:"currency",currency:"USD"}):"$0.00";let w;function M(){w&&clearTimeout(w),w=setTimeout(()=>{g()},2e3)}return(o,e)=>{const t=m("Dropdown"),r=m("Calendar"),n=m("InputText"),a=m("Column"),x=m("DataTable"),y=m("Paginator");return $(),k(H,null,[u("div",Z,[u("div",j,[u("div",q,[l(W,{showErrorMessage:F.value},null,8,["showErrorMessage"]),u("div",K,[J,l(t,{onChange:g,modelValue:_.value,"onUpdate:modelValue":e[0]||(e[0]=s=>_.value=s),options:L.value,optionLabel:"name",placeholder:"Sales Channel"},null,8,["modelValue","options"]),l(r,{modelValue:b.value,"onUpdate:modelValue":e[1]||(e[1]=s=>b.value=s),selectionMode:"multiple",manualInput:!1,showIcon:""},null,8,["modelValue"])]),u("div",Q,[u("span",X,[ee,l(n,{style:{width:"400px"},"onUpdate:modelValue":[M,e[2]||(e[2]=s=>E.value=s)],modelValue:E.value,placeholder:"Search"},null,8,["modelValue"])])]),l(x,{stripedRows:"",value:h.value,paginator:!1,class:"p-datatable-gridlines",dataKey:"id",rowHover:!0,filterDisplay:"menu",responsiveLayout:"scroll"},{empty:d(()=>[p(" No product expenses found. ")]),loading:d(()=>[p(" Loading product expenses data. Please wait. ")]),default:d(()=>[te,l(a,{field:"name",header:"Product Name"}),l(a,{field:"upc",header:"UPC Code"}),l(a,{header:"COGS Per Unit"},{body:d(({data:s})=>[p(f(c(s.costOfGoodsPerUnit)),1)]),_:1}),l(a,{header:"Inbound Shipping Cost"},{body:d(({data:s})=>[p(f(c(s.inboundShippingCost)),1)]),_:1}),l(a,{header:"Referral Fees"},{body:d(({data:s})=>[p(f(c(s.REFERRAL_FEE)),1)]),_:1}),l(a,{header:"FBA Fees"},{body:d(({data:s})=>[p(f(c(s.FBA_FEE)),1)]),_:1}),l(a,{header:"Self Shipping Cost"},{body:d(({data:s})=>[p(f(c(s.selfShippingCost)),1)]),_:1}),l(a,{header:"Total Cost Per Unit"},{body:d(({data:s})=>[p(f(c(s.totalCostPerUnit)),1)]),_:1})]),_:1},8,["value"]),l(y,{onPage:V,rows:20,totalRecords:P.value,rowsPerPageOptions:[10,20,30]},null,8,["totalRecords"])])])]),l(Y,{showLoadingModal:C.value},null,8,["showLoadingModal"])],64)}}};export{le as default};