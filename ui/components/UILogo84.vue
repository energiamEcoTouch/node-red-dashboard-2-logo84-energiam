<template>
  <div class="l84-root">

    <!-- Fila superior: SVG + Estados -->
    <div class="l84-top">

      <!-- Panel SVG (izquierda) -->
      <div class="l84-panel-svg">
        <div class="l84-controls">
          <label>Entradas</label>
          <input type="number" v-model.number="editNIn" min="1" max="20" />
          <label>Salidas</label>
          <input type="number" v-model.number="editNOut" min="1" max="16" />
          <button @click="applyConfig" :disabled="!selectedLogo">Aplicar</button>
        </div>
        <div ref="plcWrap" class="l84-svg-wrap"></div>
      </div>

      <!-- Panel Estados (derecha) -->
      <div class="l84-panel-estados">
        <div class="l84-section-title">Estados</div>
        <table class="l84-table-estados">
          <thead>
            <tr><th>Logo</th><th>Estado</th><th>Última vez</th></tr>
          </thead>
          <tbody>
            <tr
              v-for="item in tableData"
              :key="item.logo"
              :class="{ 'l84-row-active': item.logo === selectedLogo }"
              @click="selectLogo(item.logo)"
            >
              <td>{{ item.logo }}</td>
              <td><span :class="['l84-badge', item.status]">{{ item.status }}</span></td>
              <td class="l84-td-time">{{ item.lastTime }}</td>
            </tr>
            <tr v-if="tableData.length === 0">
              <td colspan="3" class="l84-empty">Sin datos MQTT aún</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Fila inferior: tabla I/O -->
    <div class="l84-panel-io">
      <div class="l84-section-title">Entradas / Salidas</div>
      <span v-if="selectedLogo" class="l84-editing">Editando: <strong>{{ selectedLogo }}</strong></span>
      <div v-if="!selectedLogo" class="l84-empty">
        Seleccioná un logo en la tabla de estado
      </div>
      <table v-else class="l84-table-io">
        <thead>
          <tr><th>Pin</th><th>Nombre / descripción</th></tr>
        </thead>
        <tbody>
          <tr v-for="pin in pins" :key="pin.id">
            <td class="l84-pin-id">{{ pin.id }}</td>
            <td>
              <input
                type="text"
                :value="pinNames[pin.id] || ''"
                placeholder="Sin nombre"
                @input="savePinName(pin.id, $event.target.value)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script>
export default {
  name: 'UILogo84',

  inject: ['$socket'],

  props: {
    id:    { type: String,  required: true },
    props: { type: Object,  default: () => ({}) },
    msg:   { type: Object,  default: () => ({}) }
  },

  data () {
    return {
      tableData:      [],
      selectedLogo:   null,
      editNIn:        8,
      editNOut:       4,
      pins:           [],
      pinNames:       {},
      _logoForPins:   null   // tracking interno para no rebuildar pins innecesariamente
    }
  },

  mounted () {
    this.buildPLC()

    // Escuchar actualizaciones en tiempo real
    this.$socket.on('msg-input:' + this.id, (msg) => {
      if (msg && msg.payload) this.handleMsg(msg.payload)
    })

    // Recibir estado almacenado al cargar/reconectar
    this.$socket.on('widget-load:' + this.id, (msg) => {
      if (msg && msg.payload) this.handleMsg(msg.payload)
    })

    // Pedir estado guardado al backend
    this.$socket.emit('widget-action', this.id, {
      payload: { action: 'get_state' }
    })
  },

  beforeUnmount () {
    this.$socket.off('msg-input:' + this.id)
    this.$socket.off('widget-load:' + this.id)
  },

  methods: {

    // ── Comunicación con Node-RED ────────────────────────────────────
    send (action, value) {
      this.$socket.emit('widget-action', this.id, {
        payload: { action, value }
      })
    },

    selectLogo (logo) {
      this.selectedLogo = logo
      this.send('select_logo', logo)
    },

    applyConfig () {
      if (!this.selectedLogo) return
      const nIn  = Math.max(1, Math.min(20, this.editNIn  || 8))
      const nOut = Math.max(1, Math.min(16, this.editNOut || 4))
      this.editNIn  = nIn
      this.editNOut = nOut
      this.buildPLC()
      this.send('save_config', { logo: this.selectedLogo, nIn, nOut })
    },

    savePinName (pinId, value) {
      if (!this.selectedLogo) return
      this.pinNames = { ...this.pinNames, [pinId]: value }
      this.send('save_pin_names', { logo: this.selectedLogo, names: { ...this.pinNames } })
    },

    // ── Procesar mensajes del backend ────────────────────────────────
    handleMsg (payload) {
      if (!payload) return
      // restore_state: llega solo al reconectar (get_state). Restaura selección.
      if (payload.type === 'restore_state') {
        if (Array.isArray(payload.tableData)) this.tableData = payload.tableData
        if (payload.selectedLogo) {
          this.selectedLogo = payload.selectedLogo
        }
        this._applyLogoData(payload.logoData)
        return
      }

      // state_update: updates normales de MQTT. NO toca selectedLogo del frontend.
      if (payload.type !== 'state_update') return

      if (Array.isArray(payload.tableData)) {
        this.tableData = payload.tableData
      }

      // Aplicar datos del SVG solo si coincide con la selección local del usuario
      if (payload.logoData && payload.logoData.slot === this.selectedLogo) {
        this._applyLogoData(payload.logoData)
      }
    },

    // ── Aplicar datos de un logo al SVG y tabla I/O ──────────────────
    _applyLogoData (d) {
      if (!d) return
      const nIn  = d.nIn  || 8
      const nOut = d.nOut || 4

      const logoChanged = d.slot !== this._logoForPins

      if (logoChanged) {
        // Al cambiar de logo: actualizar spinners, reconstruir SVG y tabla I/O
        this.editNIn  = nIn
        this.editNOut = nOut
        this.buildPLC()
        this.buildPins(nIn, nOut)
        this._logoForPins = d.slot
        if (d.pinNames) this.pinNames = { ...d.pinNames }
      }

      // Siempre actualizar colores de pines y textos del SVG
      this.applyState(d)
    },

    buildPins (nIn, nOut) {
      const pins = []
      for (let i = 1; i <= nIn;  i++) pins.push({ id: `I${i}` })
      for (let i = 1; i <= nOut; i++) pins.push({ id: `Q${i}` })
      this.pins = pins
    },

    // ── SVG: construir estructura ────────────────────────────────────
    buildPLC () {
      const nIn  = Math.max(1, Math.min(20, this.editNIn  || 8))
      const nOut = Math.max(1, Math.min(16, this.editNOut || 4))
      this.editNIn  = nIn
      this.editNOut = nOut

      const wrap    = this.$refs.plcWrap
      if (!wrap) return

      const W      = Math.max(560, (Math.max(nIn, nOut) + 1) * 30 + 80)
      const H      = 340
      const bodyX  = 40, bodyY  = 70, bodyW = W - 80, bodyH = 220
      const inSpacing  = bodyW / (nIn  + 1)
      const outSpacing = bodyW / (nOut + 1)

      let topPins = ''
      for (let i = 0; i < nIn; i++) {
        const cx = bodyX + inSpacing * (i + 1)
        topPins += `
          <rect class="wire-in" data-idx="${i}" x="${cx-3}" y="${bodyY-20}" width="6" height="20" rx="1" fill="#6b6b66"/>
          <circle cx="${cx}" cy="${bodyY-28}" r="11" fill="#0c0c0b"/>
          <circle class="pin-in" data-idx="${i}" cx="${cx}" cy="${bodyY-28}" r="8.5" fill="#2a2a27" stroke="#1a1a18" stroke-width="1"/>
          <circle cx="${cx-2.5}" cy="${bodyY-30.5}" r="2.2" fill="#ffffff" opacity="0.25"/>
          <text x="${cx}" y="${bodyY-46}" text-anchor="middle" font-size="9" fill="#888" font-family="sans-serif" font-weight="500">I${i+1}</text>
        `
      }

      let bottomPins = ''
      for (let i = 0; i < nOut; i++) {
        const cx = bodyX + outSpacing * (i + 1)
        const by = bodyY + bodyH
        bottomPins += `
          <rect class="wire-out" data-idx="${i}" x="${cx-3}" y="${by}" width="6" height="20" rx="1" fill="#6b6b66"/>
          <circle cx="${cx}" cy="${by+28}" r="11" fill="#0c0c0b"/>
          <circle class="pin-out" data-idx="${i}" cx="${cx}" cy="${by+28}" r="8.5" fill="#2a2a27" stroke="#1a1a18" stroke-width="1"/>
          <circle cx="${cx-2.5}" cy="${by+25.5}" r="2.2" fill="#ffffff" opacity="0.25"/>
          <text x="${cx}" y="${by+48}" text-anchor="middle" font-size="9" fill="#888" font-family="sans-serif" font-weight="500">Q${i+1}</text>
        `
      }

      wrap.innerHTML = `
      <svg viewBox="0 0 ${W} ${H}" width="100%" style="display:block;">
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

        ${topPins}

        <rect x="${bodyX}" y="${bodyY}" width="${bodyW}" height="${bodyH}" rx="8"
              fill="url(#l84bodyGrad)" stroke="#1c1c1a" stroke-width="1.5"/>
        <rect x="${bodyX+10}" y="${bodyY+9}" width="${bodyW-20}" height="13" rx="2"
              fill="url(#l84topStripe)"/>

        <rect x="${bodyX+22}" y="${bodyY+34}" width="${bodyW*0.30}" height="40" rx="3" fill="#2c2c29"/>
        <text x="${bodyX+30}" y="${bodyY+50}" font-size="12" fill="#e3e1d8"
              font-family="sans-serif" letter-spacing="1.2" font-weight="500">SIEMENS</text>
        <text x="${bodyX+30}" y="${bodyY+66}" font-size="14" fill="#ffffff"
              font-family="sans-serif" font-weight="500">LOGO!</text>

        <rect x="${bodyX+22}" y="${bodyY+86}" width="${bodyW*0.35}" height="${bodyH*0.40}"
              rx="4" fill="#0a0a09" stroke="#000" stroke-width="1.5"/>
        <rect x="${bodyX+27}" y="${bodyY+91}" width="${bodyW*0.35-10}" height="${bodyH*0.40-10}"
              rx="2" fill="url(#l84lcdGlow)"/>
        <text class="lcd-line-0" x="${bodyX+33}" y="${bodyY+86+16}"
              font-size="10" fill="#4fd3a0" font-family="monospace" font-weight="500"></text>
        <text class="lcd-line-1" x="${bodyX+33}" y="${bodyY+86+30}"
              font-size="10" fill="#4fd3a0" font-family="monospace" font-weight="500"></text>
        <text class="lcd-line-2" x="${bodyX+33}" y="${bodyY+86+44}"
              font-size="10" fill="#4fd3a0" font-family="monospace" font-weight="500"></text>
        <text class="lcd-line-3" x="${bodyX+33}" y="${bodyY+86+58}"
              font-size="10" fill="#4fd3a0" font-family="monospace" font-weight="500"></text>

        <g transform="translate(${bodyX+bodyW*0.62}, ${bodyY+86+(bodyH*0.40)/2})">
          <circle r="42" fill="#37372f"/>
          <path d="M -8 -16 L 8 -16 L 0 -28 Z" fill="url(#l84btnGrad)"/>
          <path d="M -8 16 L 8 16 L 0 28 Z"    fill="url(#l84btnGrad)"/>
          <path d="M -16 -8 L -16 8 L -28 0 Z" fill="url(#l84btnGrad)"/>
          <path d="M 16 -8 L 16 8 L 28 0 Z"    fill="url(#l84btnGrad)"/>
          <circle r="13" fill="url(#l84btnGrad)"/>
        </g>

        <circle class="lan-glow" cx="${bodyX+22}" cy="${bodyY+bodyH-14}"
                r="10" fill="url(#l84ledGlow)" opacity="0"/>
        <circle cx="${bodyX+22}" cy="${bodyY+bodyH-14}" r="4.5" fill="#0c0c0b"/>
        <circle class="lan-dot" cx="${bodyX+22}" cy="${bodyY+bodyH-14}"
                r="3" fill="#2a2a27"/>
        <text x="${bodyX+34}" y="${bodyY+bodyH-11}"
              font-size="9.5" fill="#a8a79f" font-family="sans-serif">LAN</text>

        <rect x="${bodyX+bodyW*0.78}" y="${bodyY+34}" width="${bodyW*0.18}" height="22"
              rx="3" fill="#1c1c1a" stroke="#0a0a09" stroke-width="1"/>
        <text class="slot-text"
              x="${bodyX+bodyW*0.78+bodyW*0.09}" y="${bodyY+49}"
              text-anchor="middle" font-size="9" fill="#a8a79f" font-family="monospace">sin selección</text>

        <image x="${bodyX+bodyW*0.42}" y="${bodyY+30}"
               width="${bodyW*0.34}" height="48"
               href="/logo84-energiam/logo.png"
               preserveAspectRatio="xMidYMid meet"/>

        ${bottomPins}
      </svg>`

      this.applyState({ slot: this.selectedLogo })
    },

    // ── SVG: actualizar estado sin redibujar ─────────────────────────
    applyState (payload) {
      if (!payload) return
      const wrap = this.$refs.plcWrap
      if (!wrap) return

      const setPin = (selector, val) => {
        const el = wrap.querySelector(selector)
        if (!el) return
        el.setAttribute('fill',   val ? '#5DCAA5' : '#2a2a27')
        el.setAttribute('stroke', val ? '#0F6E56' : '#1a1a18')
        el.style.filter = val ? 'drop-shadow(0 0 4px #5DCAA5)' : 'none'
      }

      if (Array.isArray(payload.inputs)) {
        payload.inputs.forEach((val, i) => {
          setPin(`.pin-in[data-idx="${i}"]`, val)
          const wire = wrap.querySelector(`.wire-in[data-idx="${i}"]`)
          if (wire) wire.setAttribute('fill', val ? '#5DCAA5' : '#6b6b66')
          // Tooltip
          const pin = wrap.querySelector(`.pin-in[data-idx="${i}"]`)
          if (pin) {
            const label = (payload.pinNames && payload.pinNames[`I${i+1}`]) || 's/n'
            let title = pin.querySelector('title')
            if (!title) {
              title = document.createElementNS('http://www.w3.org/2000/svg', 'title')
              pin.appendChild(title)
            }
            title.textContent = `I${i+1}: ${label}`
          }
        })
      }

      if (Array.isArray(payload.outputs)) {
        payload.outputs.forEach((val, i) => {
          setPin(`.pin-out[data-idx="${i}"]`, val)
          const wire = wrap.querySelector(`.wire-out[data-idx="${i}"]`)
          if (wire) wire.setAttribute('fill', val ? '#5DCAA5' : '#6b6b66')
          const pin = wrap.querySelector(`.pin-out[data-idx="${i}"]`)
          if (pin) {
            const label = (payload.pinNames && payload.pinNames[`Q${i+1}`]) || 's/n'
            let title = pin.querySelector('title')
            if (!title) {
              title = document.createElementNS('http://www.w3.org/2000/svg', 'title')
              pin.appendChild(title)
            }
            title.textContent = `Q${i+1}: ${label}`
          }
        })
      }

      const lanDot  = wrap.querySelector('.lan-dot')
      const lanGlow = wrap.querySelector('.lan-glow')
      if (lanDot) {
        lanDot.setAttribute('fill', payload.lan ? '#5DCAA5' : '#2a2a27')
        lanDot.style.filter = payload.lan ? 'drop-shadow(0 0 4px #5DCAA5)' : 'none'
      }
      if (lanGlow) lanGlow.setAttribute('opacity', payload.lan ? '1' : '0')

      if (payload.lcd !== undefined) {
        const txt = (payload.lcd || '').toString()
        const charsPerLine = 25
        const lines = []
        for (let i = 0; i < txt.length && lines.length < 4; i += charsPerLine) {
          lines.push(txt.slice(i, i + charsPerLine))
        }
        for (let i = 0; i < 4; i++) {
          const el = wrap.querySelector(`.lcd-line-${i}`)
          if (el) el.textContent = lines[i] || ''
        }
      }

      const slotEl = wrap.querySelector('.slot-text')
      if (slotEl) {
        slotEl.textContent = payload.slot || 'sin selección'
        slotEl.setAttribute('fill', payload.slot ? '#5DCAA5' : '#a8a79f')
      }
    }
  },

}
</script>

<style scoped>
.l84-root {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  font-family: sans-serif;
  font-size: 13px;
  color: #ccc;
}

/* Fila superior */
.l84-top {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.l84-panel-svg {
  flex: 2;
  min-width: 280px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.l84-panel-estados {
  flex: 1;
  min-width: 240px;
}

/* Controles */
.l84-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.l84-controls label {
  font-size: 12px;
  color: #aaa;
}
.l84-controls input[type="number"] {
  width: 56px;
  background: #2c2c2a;
  border: 1px solid #555;
  border-radius: 4px;
  color: #fff;
  padding: 4px 6px;
  font-size: 13px;
}
.l84-controls button {
  background: #444;
  border: 1px solid #666;
  border-radius: 4px;
  color: #fff;
  padding: 5px 12px;
  cursor: pointer;
  font-size: 12px;
}
.l84-controls button:disabled {
  opacity: 0.4;
  cursor: default;
}
.l84-controls button:hover:not(:disabled) {
  background: #555;
}
.l84-slot-label {
  font-size: 12px;
  color: #5DCAA5;
  font-family: monospace;
}

.l84-svg-wrap {
  width: 100%;
  overflow-x: auto;
}

/* Sección título */
.l84-section-title {
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Tabla estados */
.l84-table-estados {
  width: 100%;
  border-collapse: collapse;
}
.l84-table-estados th,
.l84-table-estados td {
  text-align: left;
  padding: 9px 12px;
  border-bottom: 1px solid #2a2a2a;
}
.l84-table-estados th {
  color: #888;
  font-weight: 500;
}
.l84-table-estados tbody tr {
  cursor: pointer;
  transition: background 0.15s;
}
.l84-table-estados tbody tr:hover {
  background: rgba(255,255,255,0.04);
}
.l84-row-active {
  background: rgba(93, 202, 165, 0.08) !important;
}
.l84-td-time {
  font-size: 11px;
  color: #888;
  white-space: nowrap;
}

/* Badges */
.l84-badge {
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 12px;
}
.l84-badge.online {
  background: rgba(29,158,117,0.15);
  color: #1D9E75;
}
.l84-badge.offline {
  background: rgba(226,75,74,0.15);
  color: #E24B4A;
}

/* Panel I/O */
.l84-panel-io {
  width: 100%;
  background: #1a1a1a;
  border-radius: 6px;
  padding: 14px 16px;
  box-sizing: border-box;
}
.l84-editing {
  font-size: 13px;
  font-weight: 400;
  color: #aaa;
  display: block;
  margin-top: 2px;
  margin-bottom: 10px;
}
.l84-editing strong {
  color: #5DCAA5;
}

/* Tabla I/O */
.l84-table-io {
  width: 100%;
  border-collapse: collapse;
}
.l84-table-io th,
.l84-table-io td {
  text-align: left;
  padding: 10px 14px;
  border-bottom: 1px solid #2a2a2a;
}
.l84-table-io th {
  color: #ffffff;
  font-weight: 700;
  font-size: 14px;
}
.l84-pin-id {
  font-family: monospace;
  color: #ffffff;
  width: 60px;
  font-size: 14px;
  font-weight: 500;
}
.l84-table-io input {
  width: 100%;
  background: #2c2c2a;
  border: 1px solid #444;
  border-radius: 4px;
  color: #fff;
  padding: 6px 10px;
  font-size: 13px;
  box-sizing: border-box;
}
.l84-table-io input::placeholder {
  color: #666;
}
.l84-table-io input:focus {
  outline: none;
  border-color: #5DCAA5;
}

/* Mensajes vacíos */
.l84-empty {
  color: #666;
  font-size: 12px;
  padding: 8px 0;
}
</style>
