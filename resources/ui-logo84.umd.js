(function(){"use strict";try{if(typeof document<"u"){var d=document.createElement("style");d.appendChild(document.createTextNode(".l84-root[data-v-b0ddc660]{display:flex;flex-direction:column;gap:12px;width:100%;font-family:sans-serif;font-size:13px;color:#ccc}.l84-top[data-v-b0ddc660]{display:flex;gap:12px;flex-wrap:wrap}.l84-panel-svg[data-v-b0ddc660]{flex:2;min-width:280px;display:flex;flex-direction:column;gap:8px}.l84-panel-estados[data-v-b0ddc660]{flex:1;min-width:240px}.l84-controls[data-v-b0ddc660]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.l84-controls label[data-v-b0ddc660]{font-size:12px;color:#aaa}.l84-controls input[type=number][data-v-b0ddc660]{width:56px;background:#2c2c2a;border:1px solid #555;border-radius:4px;color:#fff;padding:4px 6px;font-size:13px}.l84-controls button[data-v-b0ddc660]{background:#444;border:1px solid #666;border-radius:4px;color:#fff;padding:5px 12px;cursor:pointer;font-size:12px}.l84-controls button[data-v-b0ddc660]:disabled{opacity:.4;cursor:default}.l84-controls button[data-v-b0ddc660]:hover:not(:disabled){background:#555}.l84-slot-label[data-v-b0ddc660]{font-size:12px;color:#5dcaa5;font-family:monospace}.l84-svg-wrap[data-v-b0ddc660]{width:100%;overflow-x:auto}.l84-section-title[data-v-b0ddc660]{font-size:13px;font-weight:600;color:#ddd;margin-bottom:8px;display:flex;align-items:center;gap:8px}.l84-table-estados[data-v-b0ddc660]{width:100%;border-collapse:collapse}.l84-table-estados th[data-v-b0ddc660],.l84-table-estados td[data-v-b0ddc660]{text-align:left;padding:9px 12px;border-bottom:1px solid #2a2a2a}.l84-table-estados th[data-v-b0ddc660]{color:#888;font-weight:500}.l84-table-estados tbody tr[data-v-b0ddc660]{cursor:pointer;transition:background .15s}.l84-table-estados tbody tr[data-v-b0ddc660]:hover{background:#ffffff0a}.l84-row-active[data-v-b0ddc660]{background:#5dcaa514!important}.l84-td-time[data-v-b0ddc660]{font-size:11px;color:#888;white-space:nowrap}.l84-badge[data-v-b0ddc660]{padding:2px 10px;border-radius:999px;font-size:12px}.l84-badge.online[data-v-b0ddc660]{background:#1d9e7526;color:#1d9e75}.l84-badge.offline[data-v-b0ddc660]{background:#e24b4a26;color:#e24b4a}.l84-panel-io[data-v-b0ddc660]{width:100%}.l84-editing[data-v-b0ddc660]{font-size:12px;font-weight:400;color:#888}.l84-editing strong[data-v-b0ddc660]{color:#5dcaa5}.l84-table-io[data-v-b0ddc660]{width:100%;border-collapse:collapse}.l84-table-io th[data-v-b0ddc660],.l84-table-io td[data-v-b0ddc660]{text-align:left;padding:8px 14px;border-bottom:1px solid #333}.l84-table-io th[data-v-b0ddc660]{color:#ccc;font-weight:600;font-size:13px}.l84-pin-id[data-v-b0ddc660]{font-family:monospace;color:#ccc;width:60px;font-size:13px}.l84-table-io input[data-v-b0ddc660]{width:100%;background:#2c2c2a;border:1px solid #444;border-radius:4px;color:#fff;padding:5px 8px;font-size:13px;box-sizing:border-box}.l84-table-io input[data-v-b0ddc660]::placeholder{color:#666}.l84-table-io input[data-v-b0ddc660]:focus{outline:none;border-color:#5dcaa5}.l84-empty[data-v-b0ddc660]{color:#666;font-size:12px;padding:8px 0}")),document.head.appendChild(d)}}catch(a){console.error("vite-plugin-css-injected-by-js",a)}})();
(function(g,t){typeof exports=="object"&&typeof module<"u"?t(exports,require("vue")):typeof define=="function"&&define.amd?define(["exports","vue"],t):(g=typeof globalThis<"u"?globalThis:g||self,t(g["ui-logo84"]={},g.Vue))})(this,function(g,t){"use strict";const $=(e,l)=>{const d=e.__vccOpts||e;for(const[c,r]of l)d[c]=r;return d},u={name:"UILogo84",inject:["$socket"],props:{id:{type:String,required:!0},props:{type:Object,default:()=>({})},msg:{type:Object,default:()=>({})}},data(){return{tableData:[],selectedLogo:null,editNIn:8,editNOut:4,pins:[],pinNames:{},_logoForPins:null}},mounted(){this.buildPLC(),this.$socket.on("msg-input:"+this.id,e=>{e&&e.payload&&this.handleMsg(e.payload)}),this.$socket.on("widget-load:"+this.id,e=>{e&&e.payload&&this.handleMsg(e.payload)}),this.$socket.emit("widget-action",this.id,{payload:{action:"get_state"}})},beforeUnmount(){this.$socket.off("msg-input:"+this.id),this.$socket.off("widget-load:"+this.id)},methods:{send(e,l){this.$socket.emit("widget-action",this.id,{payload:{action:e,value:l}})},selectLogo(e){console.log("[LOGO84] selectLogo",e),this.selectedLogo=e,this.send("select_logo",e)},applyConfig(){if(!this.selectedLogo)return;const e=Math.max(1,Math.min(20,this.editNIn||8)),l=Math.max(1,Math.min(16,this.editNOut||4));this.editNIn=e,this.editNOut=l,this.buildPLC(),this.send("save_config",{logo:this.selectedLogo,nIn:e,nOut:l})},savePinName(e,l){this.selectedLogo&&(this.pinNames={...this.pinNames,[e]:l},this.send("save_pin_names",{logo:this.selectedLogo,names:{...this.pinNames}}))},handleMsg(e){if(e){if(console.log("[LOGO84] handleMsg type=",e.type,"logoData.slot=",e.logoData&&e.logoData.slot,"selectedLogo=",this.selectedLogo),e.type==="restore_state"){Array.isArray(e.tableData)&&(this.tableData=e.tableData),e.selectedLogo&&(this.selectedLogo=e.selectedLogo),this._applyLogoData(e.logoData);return}e.type==="state_update"&&(Array.isArray(e.tableData)&&(this.tableData=e.tableData),e.logoData&&e.logoData.slot===this.selectedLogo&&this._applyLogoData(e.logoData))}},_applyLogoData(e){if(!e)return;const l=e.nIn||8,d=e.nOut||4;e.slot!==this._logoForPins&&(this.editNIn=l,this.editNOut=d,this.buildPLC(),this.buildPins(l,d),this._logoForPins=e.slot,e.pinNames&&(this.pinNames={...e.pinNames})),this.applyState(e)},buildPins(e,l){const d=[];for(let c=1;c<=e;c++)d.push({id:`I${c}`});for(let c=1;c<=l;c++)d.push({id:`Q${c}`});this.pins=d},buildPLC(){const e=Math.max(1,Math.min(20,this.editNIn||8)),l=Math.max(1,Math.min(16,this.editNOut||4));this.editNIn=e,this.editNOut=l;const d=this.$refs.plcWrap;if(!d)return;const c=Math.max(560,(Math.max(e,l)+1)*30+80),r=340,s=40,o=70,i=c-80,n=220,a=i/(e+1),m=i/(l+1);let p="";for(let f=0;f<e;f++){const h=s+a*(f+1);p+=`
          <rect class="wire-in" data-idx="${f}" x="${h-3}" y="${o-20}" width="6" height="20" rx="1" fill="#6b6b66"/>
          <circle cx="${h}" cy="${o-28}" r="11" fill="#0c0c0b"/>
          <circle class="pin-in" data-idx="${f}" cx="${h}" cy="${o-28}" r="8.5" fill="#2a2a27" stroke="#1a1a18" stroke-width="1"/>
          <circle cx="${h-2.5}" cy="${o-30.5}" r="2.2" fill="#ffffff" opacity="0.25"/>
          <text x="${h}" y="${o-46}" text-anchor="middle" font-size="9" fill="#888" font-family="sans-serif" font-weight="500">I${f+1}</text>
        `}let y="";for(let f=0;f<l;f++){const h=s+m*(f+1),x=o+n;y+=`
          <rect class="wire-out" data-idx="${f}" x="${h-3}" y="${x}" width="6" height="20" rx="1" fill="#6b6b66"/>
          <circle cx="${h}" cy="${x+28}" r="11" fill="#0c0c0b"/>
          <circle class="pin-out" data-idx="${f}" cx="${h}" cy="${x+28}" r="8.5" fill="#2a2a27" stroke="#1a1a18" stroke-width="1"/>
          <circle cx="${h-2.5}" cy="${x+25.5}" r="2.2" fill="#ffffff" opacity="0.25"/>
          <text x="${h}" y="${x+48}" text-anchor="middle" font-size="9" fill="#888" font-family="sans-serif" font-weight="500">Q${f+1}</text>
        `}d.innerHTML=`
      <svg viewBox="0 0 ${c} ${r}" width="100%" style="display:block;">
        <defs>
          <linearGradient id="l84bodyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stop-color="#56564f"/>
            <stop offset="8%"   stop-color="#4a4a44"/>
            <stop offset="92%"  stop-color="#403f3a"/>
            <stop offset="100%" stop-color="#34332f"/>
          </linearGradient>
          <linearGradient id="l84topStripe" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stop-color="#2a2a27"/>
            <stop offset="100%" stop-color="#1c1c1a"/>
          </linearGradient>
          <radialGradient id="l84lcdGlow" cx="50%" cy="35%" r="70%">
            <stop offset="0%"   stop-color="#0f2e22"/>
            <stop offset="100%" stop-color="#061811"/>
          </radialGradient>
          <linearGradient id="l84btnGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stop-color="#6a6a65"/>
            <stop offset="100%" stop-color="#48473f"/>
          </linearGradient>
          <radialGradient id="l84ledGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stop-color="#5DCAA5" stop-opacity="0.55"/>
            <stop offset="100%" stop-color="#5DCAA5" stop-opacity="0"/>
          </radialGradient>
        </defs>

        ${p}

        <rect x="${s}" y="${o}" width="${i}" height="${n}" rx="8"
              fill="url(#l84bodyGrad)" stroke="#1c1c1a" stroke-width="1.5"/>
        <rect x="${s+10}" y="${o+9}" width="${i-20}" height="13" rx="2"
              fill="url(#l84topStripe)"/>

        <rect x="${s+22}" y="${o+34}" width="${i*.3}" height="40" rx="3" fill="#2c2c29"/>
        <text x="${s+30}" y="${o+50}" font-size="12" fill="#e3e1d8"
              font-family="sans-serif" letter-spacing="1.2" font-weight="500">SIEMENS</text>
        <text x="${s+30}" y="${o+66}" font-size="14" fill="#ffffff"
              font-family="sans-serif" font-weight="500">LOGO!</text>

        <rect x="${s+22}" y="${o+86}" width="${i*.35}" height="${n*.4}"
              rx="4" fill="#0a0a09" stroke="#000" stroke-width="1.5"/>
        <rect x="${s+27}" y="${o+91}" width="${i*.35-10}" height="${n*.4-10}"
              rx="2" fill="url(#l84lcdGlow)"/>
        <text class="lcd-line-0" x="${s+33}" y="${o+86+16}"
              font-size="10" fill="#4fd3a0" font-family="monospace" font-weight="500"></text>
        <text class="lcd-line-1" x="${s+33}" y="${o+86+30}"
              font-size="10" fill="#4fd3a0" font-family="monospace" font-weight="500"></text>
        <text class="lcd-line-2" x="${s+33}" y="${o+86+44}"
              font-size="10" fill="#4fd3a0" font-family="monospace" font-weight="500"></text>
        <text class="lcd-line-3" x="${s+33}" y="${o+86+58}"
              font-size="10" fill="#4fd3a0" font-family="monospace" font-weight="500"></text>

        <g transform="translate(${s+i*.62}, ${o+86+n*.4/2})">
          <circle r="42" fill="#37372f"/>
          <path d="M -8 -16 L 8 -16 L 0 -28 Z" fill="url(#l84btnGrad)"/>
          <path d="M -8 16 L 8 16 L 0 28 Z"    fill="url(#l84btnGrad)"/>
          <path d="M -16 -8 L -16 8 L -28 0 Z" fill="url(#l84btnGrad)"/>
          <path d="M 16 -8 L 16 8 L 28 0 Z"    fill="url(#l84btnGrad)"/>
          <circle r="13" fill="url(#l84btnGrad)"/>
        </g>

        <circle class="lan-glow" cx="${s+22}" cy="${o+n-14}"
                r="10" fill="url(#l84ledGlow)" opacity="0"/>
        <circle cx="${s+22}" cy="${o+n-14}" r="4.5" fill="#0c0c0b"/>
        <circle class="lan-dot" cx="${s+22}" cy="${o+n-14}"
                r="3" fill="#2a2a27"/>
        <text x="${s+34}" y="${o+n-11}"
              font-size="9.5" fill="#a8a79f" font-family="sans-serif">LAN</text>

        <rect x="${s+i*.78}" y="${o+34}" width="${i*.18}" height="22"
              rx="3" fill="#1c1c1a" stroke="#0a0a09" stroke-width="1"/>
        <text class="slot-text"
              x="${s+i*.78+i*.09}" y="${o+49}"
              text-anchor="middle" font-size="9" fill="#a8a79f" font-family="monospace">sin selección</text>

        <image x="${s+i*.42}" y="${o+30}"
               width="${i*.34}" height="48"
               href="/logo84-energiam/logo.png"
               preserveAspectRatio="xMidYMid meet"/>

        ${y}
      </svg>`,this.applyState({slot:this.selectedLogo})},applyState(e){if(!e)return;const l=this.$refs.plcWrap;if(!l)return;const d=(o,i)=>{const n=l.querySelector(o);n&&(n.setAttribute("fill",i?"#5DCAA5":"#2a2a27"),n.setAttribute("stroke",i?"#0F6E56":"#1a1a18"),n.style.filter=i?"drop-shadow(0 0 4px #5DCAA5)":"none")};Array.isArray(e.inputs)&&e.inputs.forEach((o,i)=>{d(`.pin-in[data-idx="${i}"]`,o);const n=l.querySelector(`.wire-in[data-idx="${i}"]`);n&&n.setAttribute("fill",o?"#5DCAA5":"#6b6b66");const a=l.querySelector(`.pin-in[data-idx="${i}"]`);if(a){const m=e.pinNames&&e.pinNames[`I${i+1}`]||"s/n";let p=a.querySelector("title");p||(p=document.createElementNS("http://www.w3.org/2000/svg","title"),a.appendChild(p)),p.textContent=`I${i+1}: ${m}`}}),Array.isArray(e.outputs)&&e.outputs.forEach((o,i)=>{d(`.pin-out[data-idx="${i}"]`,o);const n=l.querySelector(`.wire-out[data-idx="${i}"]`);n&&n.setAttribute("fill",o?"#5DCAA5":"#6b6b66");const a=l.querySelector(`.pin-out[data-idx="${i}"]`);if(a){const m=e.pinNames&&e.pinNames[`Q${i+1}`]||"s/n";let p=a.querySelector("title");p||(p=document.createElementNS("http://www.w3.org/2000/svg","title"),a.appendChild(p)),p.textContent=`Q${i+1}: ${m}`}});const c=l.querySelector(".lan-dot"),r=l.querySelector(".lan-glow");if(c&&(c.setAttribute("fill",e.lan?"#5DCAA5":"#2a2a27"),c.style.filter=e.lan?"drop-shadow(0 0 4px #5DCAA5)":"none"),r&&r.setAttribute("opacity",e.lan?"1":"0"),e.lcd!==void 0){const o=(e.lcd||"").toString(),i=25,n=[];for(let a=0;a<o.length&&n.length<4;a+=i)n.push(o.slice(a,a+i));for(let a=0;a<4;a++){const m=l.querySelector(`.lcd-line-${a}`);m&&(m.textContent=n[a]||"")}}const s=l.querySelector(".slot-text");s&&(s.textContent=e.slot||"sin selección",s.setAttribute("fill",e.slot?"#5DCAA5":"#a8a79f"))}}},b={class:"l84-root"},N={class:"l84-top"},w={class:"l84-panel-svg"},E={class:"l84-controls"},L=["disabled"],k={ref:"plcWrap",class:"l84-svg-wrap"},V={class:"l84-panel-estados"},_={class:"l84-table-estados"},A=["onClick"],D={class:"l84-td-time"},S={key:0},C={class:"l84-panel-io"},G={class:"l84-section-title"},M={key:0,class:"l84-editing"},I={key:0,class:"l84-empty"},O={key:1,class:"l84-table-io"},B={class:"l84-pin-id"},P=["value","onInput"];function q(e,l,d,c,r,s){return t.openBlock(),t.createElementBlock("div",b,[t.createElementVNode("div",N,[t.createElementVNode("div",w,[t.createElementVNode("div",E,[l[3]||(l[3]=t.createElementVNode("label",null,"Entradas",-1)),t.withDirectives(t.createElementVNode("input",{type:"number","onUpdate:modelValue":l[0]||(l[0]=o=>r.editNIn=o),min:"1",max:"20"},null,512),[[t.vModelText,r.editNIn,void 0,{number:!0}]]),l[4]||(l[4]=t.createElementVNode("label",null,"Salidas",-1)),t.withDirectives(t.createElementVNode("input",{type:"number","onUpdate:modelValue":l[1]||(l[1]=o=>r.editNOut=o),min:"1",max:"16"},null,512),[[t.vModelText,r.editNOut,void 0,{number:!0}]]),t.createElementVNode("button",{onClick:l[2]||(l[2]=(...o)=>s.applyConfig&&s.applyConfig(...o)),disabled:!r.selectedLogo},"Aplicar",8,L)]),t.createElementVNode("div",k,null,512)]),t.createElementVNode("div",V,[l[7]||(l[7]=t.createElementVNode("div",{class:"l84-section-title"},"Estados",-1)),t.createElementVNode("table",_,[l[6]||(l[6]=t.createElementVNode("thead",null,[t.createElementVNode("tr",null,[t.createElementVNode("th",null,"Logo"),t.createElementVNode("th",null,"Estado"),t.createElementVNode("th",null,"Última vez")])],-1)),t.createElementVNode("tbody",null,[(t.openBlock(!0),t.createElementBlock(t.Fragment,null,t.renderList(r.tableData,o=>(t.openBlock(),t.createElementBlock("tr",{key:o.logo,class:t.normalizeClass({"l84-row-active":o.logo===r.selectedLogo}),onClick:i=>s.selectLogo(o.logo)},[t.createElementVNode("td",null,t.toDisplayString(o.logo),1),t.createElementVNode("td",null,[t.createElementVNode("span",{class:t.normalizeClass(["l84-badge",o.status])},t.toDisplayString(o.status),3)]),t.createElementVNode("td",D,t.toDisplayString(o.lastTime),1)],10,A))),128)),r.tableData.length===0?(t.openBlock(),t.createElementBlock("tr",S,[...l[5]||(l[5]=[t.createElementVNode("td",{colspan:"3",class:"l84-empty"},"Sin datos MQTT aún",-1)])])):t.createCommentVNode("",!0)])])])]),t.createElementVNode("div",C,[t.createElementVNode("div",G,[l[9]||(l[9]=t.createTextVNode(" Entradas / Salidas ",-1)),r.selectedLogo?(t.openBlock(),t.createElementBlock("span",M,[l[8]||(l[8]=t.createTextVNode("Editando: ",-1)),t.createElementVNode("strong",null,t.toDisplayString(r.selectedLogo),1)])):t.createCommentVNode("",!0)]),r.selectedLogo?(t.openBlock(),t.createElementBlock("table",O,[l[10]||(l[10]=t.createElementVNode("thead",null,[t.createElementVNode("tr",null,[t.createElementVNode("th",null,"Pin"),t.createElementVNode("th",null,"Nombre / descripción")])],-1)),t.createElementVNode("tbody",null,[(t.openBlock(!0),t.createElementBlock(t.Fragment,null,t.renderList(r.pins,o=>(t.openBlock(),t.createElementBlock("tr",{key:o.id},[t.createElementVNode("td",B,t.toDisplayString(o.id),1),t.createElementVNode("td",null,[t.createElementVNode("input",{type:"text",value:r.pinNames[o.id]||"",placeholder:"Sin nombre",onInput:i=>s.savePinName(o.id,i.target.value)},null,40,P)])]))),128))])])):(t.openBlock(),t.createElementBlock("div",I," Seleccioná un logo en la tabla de estado "))])])}const z=$(u,[["render",q],["__scopeId","data-v-b0ddc660"]]);g.UILogo84=z,Object.defineProperty(g,Symbol.toStringTag,{value:"Module"})});
