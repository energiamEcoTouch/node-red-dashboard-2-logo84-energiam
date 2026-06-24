(function(){"use strict";try{if(typeof document<"u"){var e=document.createElement("style");e.appendChild(document.createTextNode(".l84-root[data-v-36ebf98e]{display:flex;flex-direction:column;gap:12px;width:100%;font-family:sans-serif;font-size:13px;color:#ccc}.l84-top[data-v-36ebf98e]{display:flex;gap:12px;flex-wrap:wrap}.l84-panel-svg[data-v-36ebf98e]{flex:2;min-width:280px;display:flex;flex-direction:column;gap:8px}.l84-panel-estados[data-v-36ebf98e]{flex:1;min-width:240px}.l84-controls[data-v-36ebf98e]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.l84-controls label[data-v-36ebf98e]{font-size:12px;color:#aaa}.l84-controls input[type=number][data-v-36ebf98e]{width:56px;background:#2c2c2a;border:1px solid #555;border-radius:4px;color:#fff;padding:4px 6px;font-size:13px}.l84-controls button[data-v-36ebf98e]{background:#444;border:1px solid #666;border-radius:4px;color:#fff;padding:5px 12px;cursor:pointer;font-size:12px}.l84-controls button[data-v-36ebf98e]:disabled{opacity:.4;cursor:default}.l84-controls button[data-v-36ebf98e]:hover:not(:disabled){background:#555}.l84-slot-label[data-v-36ebf98e]{font-size:12px;color:#5dcaa5;font-family:monospace}.l84-svg-wrap[data-v-36ebf98e]{width:100%;overflow-x:auto}.l84-section-title[data-v-36ebf98e]{font-size:18px;font-weight:700;color:#fff;margin-bottom:8px;display:flex;align-items:center;gap:8px}.l84-table-estados[data-v-36ebf98e]{width:100%;border-collapse:collapse}.l84-table-estados th[data-v-36ebf98e],.l84-table-estados td[data-v-36ebf98e]{text-align:left;padding:9px 12px;border-bottom:1px solid #2a2a2a}.l84-table-estados th[data-v-36ebf98e]{color:#888;font-weight:500}.l84-table-estados tbody tr[data-v-36ebf98e]{cursor:pointer;transition:background .15s}.l84-table-estados tbody tr[data-v-36ebf98e]:hover{background:#ffffff0a}.l84-row-active[data-v-36ebf98e]{background:#5dcaa514!important}.l84-td-time[data-v-36ebf98e]{font-size:11px;color:#888;white-space:nowrap}.l84-badge[data-v-36ebf98e]{padding:2px 10px;border-radius:999px;font-size:12px}.l84-badge.online[data-v-36ebf98e]{background:#1d9e7526;color:#1d9e75}.l84-badge.offline[data-v-36ebf98e]{background:#e24b4a26;color:#e24b4a}.l84-panel-io[data-v-36ebf98e]{width:100%;background:#1a1a1a;border-radius:6px;padding:14px 16px;box-sizing:border-box}.l84-editing[data-v-36ebf98e]{font-size:13px;font-weight:400;color:#aaa;display:block;margin-top:2px;margin-bottom:10px}.l84-editing strong[data-v-36ebf98e]{color:#5dcaa5}.l84-table-io[data-v-36ebf98e]{width:100%;border-collapse:collapse}.l84-table-io th[data-v-36ebf98e],.l84-table-io td[data-v-36ebf98e]{text-align:left;padding:10px 14px;border-bottom:1px solid #2a2a2a}.l84-table-io th[data-v-36ebf98e]{color:#fff;font-weight:700;font-size:14px}.l84-pin-id[data-v-36ebf98e]{font-family:monospace;color:#fff;width:60px;font-size:14px;font-weight:500}.l84-table-io input[data-v-36ebf98e]{width:100%;background:#2c2c2a;border:1px solid #444;border-radius:4px;color:#fff;padding:6px 10px;font-size:13px;box-sizing:border-box}.l84-table-io input[data-v-36ebf98e]::placeholder{color:#666}.l84-table-io input[data-v-36ebf98e]:focus{outline:none;border-color:#5dcaa5}.l84-empty[data-v-36ebf98e]{color:#666;font-size:12px;padding:8px 0}")),document.head.appendChild(e)}}catch(a){console.error("vite-plugin-css-injected-by-js",a)}})();
(function(g,t){typeof exports=="object"&&typeof module<"u"?t(exports,require("vue")):typeof define=="function"&&define.amd?define(["exports","vue"],t):(g=typeof globalThis<"u"?globalThis:g||self,t(g["ui-logo84"]={},g.Vue))})(this,function(g,t){"use strict";const $=(e,o)=>{const d=e.__vccOpts||e;for(const[c,r]of o)d[c]=r;return d},u={name:"UILogo84",inject:["$socket"],props:{id:{type:String,required:!0},props:{type:Object,default:()=>({})},msg:{type:Object,default:()=>({})}},data(){return{tableData:[],selectedLogo:null,editNIn:8,editNOut:4,pins:[],pinNames:{},_logoForPins:null}},mounted(){this.buildPLC(),this.$socket.on("msg-input:"+this.id,e=>{e&&e.payload&&this.handleMsg(e.payload)}),this.$socket.on("widget-load:"+this.id,e=>{e&&e.payload&&this.handleMsg(e.payload)}),this.$socket.emit("widget-action",this.id,{payload:{action:"get_state"}})},beforeUnmount(){this.$socket.off("msg-input:"+this.id),this.$socket.off("widget-load:"+this.id)},methods:{send(e,o){this.$socket.emit("widget-action",this.id,{payload:{action:e,value:o}})},selectLogo(e){this.selectedLogo=e,this.send("select_logo",e)},applyConfig(){if(!this.selectedLogo)return;const e=Math.max(1,Math.min(20,this.editNIn||8)),o=Math.max(1,Math.min(16,this.editNOut||4));this.editNIn=e,this.editNOut=o,this.buildPLC(),this.send("save_config",{logo:this.selectedLogo,nIn:e,nOut:o})},savePinName(e,o){this.selectedLogo&&(this.pinNames={...this.pinNames,[e]:o},this.send("save_pin_names",{logo:this.selectedLogo,names:{...this.pinNames}}))},handleMsg(e){if(e){if(e.type==="restore_state"){Array.isArray(e.tableData)&&(this.tableData=e.tableData),e.selectedLogo&&(this.selectedLogo=e.selectedLogo),this._applyLogoData(e.logoData);return}e.type==="state_update"&&(Array.isArray(e.tableData)&&(this.tableData=e.tableData),e.logoData&&e.logoData.slot===this.selectedLogo&&this._applyLogoData(e.logoData))}},_applyLogoData(e){if(!e)return;const o=e.nIn||8,d=e.nOut||4;e.slot!==this._logoForPins&&(this.editNIn=o,this.editNOut=d,this.buildPLC(),this.buildPins(o,d),this._logoForPins=e.slot,e.pinNames&&(this.pinNames={...e.pinNames})),this.applyState(e)},buildPins(e,o){const d=[];for(let c=1;c<=e;c++)d.push({id:`I${c}`});for(let c=1;c<=o;c++)d.push({id:`Q${c}`});this.pins=d},buildPLC(){const e=Math.max(1,Math.min(20,this.editNIn||8)),o=Math.max(1,Math.min(16,this.editNOut||4));this.editNIn=e,this.editNOut=o;const d=this.$refs.plcWrap;if(!d)return;const c=Math.max(560,(Math.max(e,o)+1)*30+80),r=340,s=40,l=60,i=c-80,n=210,a=i/(e+1),m=i/(o+1);let p="";for(let f=0;f<e;f++){const h=s+a*(f+1);p+=`
          <rect class="wire-in" data-idx="${f}" x="${h-3}" y="${l-20}" width="6" height="20" rx="1" fill="#6b6b66"/>
          <circle cx="${h}" cy="${l-28}" r="11" fill="#0c0c0b"/>
          <circle class="pin-in" data-idx="${f}" cx="${h}" cy="${l-28}" r="8.5" fill="#2a2a27" stroke="#1a1a18" stroke-width="1"/>
          <circle cx="${h-2.5}" cy="${l-30.5}" r="2.2" fill="#ffffff" opacity="0.25"/>
          <text x="${h}" y="${l-46}" text-anchor="middle" font-size="9" fill="#888" font-family="sans-serif" font-weight="500">I${f+1}</text>
        `}let y="";for(let f=0;f<o;f++){const h=s+m*(f+1),x=l+n;y+=`
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

        <rect x="${s}" y="${l}" width="${i}" height="${n}" rx="8"
              fill="url(#l84bodyGrad)" stroke="#1c1c1a" stroke-width="1.5"/>
        <rect x="${s+10}" y="${l+9}" width="${i-20}" height="13" rx="2"
              fill="url(#l84topStripe)"/>

        <rect x="${s+22}" y="${l+34}" width="${i*.3}" height="40" rx="3" fill="#2c2c29"/>
        <text x="${s+30}" y="${l+50}" font-size="12" fill="#e3e1d8"
              font-family="sans-serif" letter-spacing="1.2" font-weight="500">SIEMENS</text>
        <text x="${s+30}" y="${l+66}" font-size="14" fill="#ffffff"
              font-family="sans-serif" font-weight="500">LOGO!</text>

        <rect x="${s+22}" y="${l+86}" width="${i*.35}" height="${n*.4}"
              rx="4" fill="#0a0a09" stroke="#000" stroke-width="1.5"/>
        <rect x="${s+27}" y="${l+91}" width="${i*.35-10}" height="${n*.4-10}"
              rx="2" fill="url(#l84lcdGlow)"/>
        <text class="lcd-line-0" x="${s+33}" y="${l+86+16}"
              font-size="10" fill="#4fd3a0" font-family="monospace" font-weight="500"></text>
        <text class="lcd-line-1" x="${s+33}" y="${l+86+30}"
              font-size="10" fill="#4fd3a0" font-family="monospace" font-weight="500"></text>
        <text class="lcd-line-2" x="${s+33}" y="${l+86+44}"
              font-size="10" fill="#4fd3a0" font-family="monospace" font-weight="500"></text>
        <text class="lcd-line-3" x="${s+33}" y="${l+86+58}"
              font-size="10" fill="#4fd3a0" font-family="monospace" font-weight="500"></text>

        <g transform="translate(${s+i*.62}, ${l+86+n*.4/2})">
          <circle r="42" fill="#37372f"/>
          <path d="M -8 -16 L 8 -16 L 0 -28 Z" fill="url(#l84btnGrad)"/>
          <path d="M -8 16 L 8 16 L 0 28 Z"    fill="url(#l84btnGrad)"/>
          <path d="M -16 -8 L -16 8 L -28 0 Z" fill="url(#l84btnGrad)"/>
          <path d="M 16 -8 L 16 8 L 28 0 Z"    fill="url(#l84btnGrad)"/>
          <circle r="13" fill="url(#l84btnGrad)"/>
        </g>

        <circle class="lan-glow" cx="${s+22}" cy="${l+n-14}"
                r="10" fill="url(#l84ledGlow)" opacity="0"/>
        <circle cx="${s+22}" cy="${l+n-14}" r="4.5" fill="#0c0c0b"/>
        <circle class="lan-dot" cx="${s+22}" cy="${l+n-14}"
                r="3" fill="#2a2a27"/>
        <text x="${s+34}" y="${l+n-11}"
              font-size="9.5" fill="#a8a79f" font-family="sans-serif">LAN</text>

        <rect x="${s+i*.78}" y="${l+34}" width="${i*.18}" height="22"
              rx="3" fill="#1c1c1a" stroke="#0a0a09" stroke-width="1"/>
        <text class="slot-text"
              x="${s+i*.78+i*.09}" y="${l+49}"
              text-anchor="middle" font-size="9" fill="#a8a79f" font-family="monospace">sin selección</text>

        <image x="${s+i*.42}" y="${l+30}"
               width="${i*.34}" height="48"
               href="/logo84-energiam/logo.png"
               preserveAspectRatio="xMidYMid meet"/>

        ${y}
      </svg>`,this.applyState({slot:this.selectedLogo})},applyState(e){if(!e)return;const o=this.$refs.plcWrap;if(!o)return;const d=(l,i)=>{const n=o.querySelector(l);n&&(n.setAttribute("fill",i?"#5DCAA5":"#2a2a27"),n.setAttribute("stroke",i?"#0F6E56":"#1a1a18"),n.style.filter=i?"drop-shadow(0 0 4px #5DCAA5)":"none")};Array.isArray(e.inputs)&&e.inputs.forEach((l,i)=>{d(`.pin-in[data-idx="${i}"]`,l);const n=o.querySelector(`.wire-in[data-idx="${i}"]`);n&&n.setAttribute("fill",l?"#5DCAA5":"#6b6b66");const a=o.querySelector(`.pin-in[data-idx="${i}"]`);if(a){const m=e.pinNames&&e.pinNames[`I${i+1}`]||"s/n";let p=a.querySelector("title");p||(p=document.createElementNS("http://www.w3.org/2000/svg","title"),a.appendChild(p)),p.textContent=`I${i+1}: ${m}`}}),Array.isArray(e.outputs)&&e.outputs.forEach((l,i)=>{d(`.pin-out[data-idx="${i}"]`,l);const n=o.querySelector(`.wire-out[data-idx="${i}"]`);n&&n.setAttribute("fill",l?"#5DCAA5":"#6b6b66");const a=o.querySelector(`.pin-out[data-idx="${i}"]`);if(a){const m=e.pinNames&&e.pinNames[`Q${i+1}`]||"s/n";let p=a.querySelector("title");p||(p=document.createElementNS("http://www.w3.org/2000/svg","title"),a.appendChild(p)),p.textContent=`Q${i+1}: ${m}`}});const c=o.querySelector(".lan-dot"),r=o.querySelector(".lan-glow");if(c&&(c.setAttribute("fill",e.lan?"#5DCAA5":"#2a2a27"),c.style.filter=e.lan?"drop-shadow(0 0 4px #5DCAA5)":"none"),r&&r.setAttribute("opacity",e.lan?"1":"0"),e.lcd!==void 0){const l=(e.lcd||"").toString(),i=25,n=[];for(let a=0;a<l.length&&n.length<4;a+=i)n.push(l.slice(a,a+i));for(let a=0;a<4;a++){const m=o.querySelector(`.lcd-line-${a}`);m&&(m.textContent=n[a]||"")}}const s=o.querySelector(".slot-text");s&&(s.textContent=e.slot||"sin selección",s.setAttribute("fill",e.slot?"#5DCAA5":"#a8a79f"))}}},b={class:"l84-root"},N={class:"l84-top"},w={class:"l84-panel-svg"},E={class:"l84-controls"},k=["disabled"],L={ref:"plcWrap",class:"l84-svg-wrap"},V={class:"l84-panel-estados"},_={class:"l84-table-estados"},A=["onClick"],S={class:"l84-td-time"},D={key:0},C={class:"l84-panel-io"},M={key:0,class:"l84-editing"},G={key:1,class:"l84-empty"},I={key:2,class:"l84-table-io"},B={class:"l84-pin-id"},O=["value","onInput"];function P(e,o,d,c,r,s){return t.openBlock(),t.createElementBlock("div",b,[t.createElementVNode("div",N,[t.createElementVNode("div",w,[t.createElementVNode("div",E,[o[3]||(o[3]=t.createElementVNode("label",null,"Entradas",-1)),t.withDirectives(t.createElementVNode("input",{type:"number","onUpdate:modelValue":o[0]||(o[0]=l=>r.editNIn=l),min:"1",max:"20"},null,512),[[t.vModelText,r.editNIn,void 0,{number:!0}]]),o[4]||(o[4]=t.createElementVNode("label",null,"Salidas",-1)),t.withDirectives(t.createElementVNode("input",{type:"number","onUpdate:modelValue":o[1]||(o[1]=l=>r.editNOut=l),min:"1",max:"16"},null,512),[[t.vModelText,r.editNOut,void 0,{number:!0}]]),t.createElementVNode("button",{onClick:o[2]||(o[2]=(...l)=>s.applyConfig&&s.applyConfig(...l)),disabled:!r.selectedLogo},"Aplicar",8,k)]),t.createElementVNode("div",L,null,512)]),t.createElementVNode("div",V,[o[7]||(o[7]=t.createElementVNode("div",{class:"l84-section-title"},"Estados",-1)),t.createElementVNode("table",_,[o[6]||(o[6]=t.createElementVNode("thead",null,[t.createElementVNode("tr",null,[t.createElementVNode("th",null,"Logo"),t.createElementVNode("th",null,"Estado"),t.createElementVNode("th",null,"Última vez")])],-1)),t.createElementVNode("tbody",null,[(t.openBlock(!0),t.createElementBlock(t.Fragment,null,t.renderList(r.tableData,l=>(t.openBlock(),t.createElementBlock("tr",{key:l.logo,class:t.normalizeClass({"l84-row-active":l.logo===r.selectedLogo}),onClick:i=>s.selectLogo(l.logo)},[t.createElementVNode("td",null,t.toDisplayString(l.logo),1),t.createElementVNode("td",null,[t.createElementVNode("span",{class:t.normalizeClass(["l84-badge",l.status])},t.toDisplayString(l.status),3)]),t.createElementVNode("td",S,t.toDisplayString(l.lastTime),1)],10,A))),128)),r.tableData.length===0?(t.openBlock(),t.createElementBlock("tr",D,[...o[5]||(o[5]=[t.createElementVNode("td",{colspan:"3",class:"l84-empty"},"Sin datos MQTT aún",-1)])])):t.createCommentVNode("",!0)])])])]),t.createElementVNode("div",C,[o[10]||(o[10]=t.createElementVNode("div",{class:"l84-section-title"},"Entradas / Salidas",-1)),r.selectedLogo?(t.openBlock(),t.createElementBlock("span",M,[o[8]||(o[8]=t.createTextVNode("Editando: ",-1)),t.createElementVNode("strong",null,t.toDisplayString(r.selectedLogo),1)])):t.createCommentVNode("",!0),r.selectedLogo?(t.openBlock(),t.createElementBlock("table",I,[o[9]||(o[9]=t.createElementVNode("thead",null,[t.createElementVNode("tr",null,[t.createElementVNode("th",null,"Pin"),t.createElementVNode("th",null,"Nombre / descripción")])],-1)),t.createElementVNode("tbody",null,[(t.openBlock(!0),t.createElementBlock(t.Fragment,null,t.renderList(r.pins,l=>(t.openBlock(),t.createElementBlock("tr",{key:l.id},[t.createElementVNode("td",B,t.toDisplayString(l.id),1),t.createElementVNode("td",null,[t.createElementVNode("input",{type:"text",value:r.pinNames[l.id]||"",placeholder:"Sin nombre",onInput:i=>s.savePinName(l.id,i.target.value)},null,40,O)])]))),128))])])):(t.openBlock(),t.createElementBlock("div",G," Seleccioná un logo en la tabla de estado "))])])}const q=$(u,[["render",P],["__scopeId","data-v-36ebf98e"]]);g.UILogo84=q,Object.defineProperty(g,Symbol.toStringTag,{value:"Module"})});
