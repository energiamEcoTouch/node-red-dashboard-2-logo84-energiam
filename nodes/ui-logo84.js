const path = require('path')
const fs   = require('fs')

module.exports = function (RED) {

    function UILogo84Node (config) {
        RED.nodes.createNode(this, config)
        const node = this

        const group = RED.nodes.getNode(config.group)
        if (!group) {
            node.error('ui-logo84: No hay grupo de Dashboard configurado')
            return
        }
        const base = group.getBase()

        // ── Estado en closure (igual que el flujo original con context local) ──
        const ioByLogo        = {}   // { logo: { inputs:[], outputs:[] } }
        const plcConfigByLogo = {}   // { logo: { nIn, nOut } }
        const pinNames        = {}   // { logo: { I1:'nombre', ... } }
        const tableData       = {}   // { logo: { logo, status, lastTime } }
        const lastSeen        = {}   // { logo: timestamp_ms }
        const lastThrottle    = {}   // { logo: timestamp_ms }
        let   logoSeleccionado = null

        const TOPIC_PREFIX     = (config.topicPrefix || 'energiam').trim().replace(/\/+$/, '')
        const TOPIC_SEGMENT    = TOPIC_PREFIX ? TOPIC_PREFIX.split('/').length : 0
        const THROTTLE         = Math.max(1, parseInt(config.throttle,      10) || 10) * 1000
        const ONLINE_TIMEOUT   = Math.max(1, parseInt(config.onlineTimeout, 10) || 60) * 1000
        const DEFAULT_NIN      = Math.max(1, Math.min(20, parseInt(config.defaultNIn,  10) || 8))
        const DEFAULT_NOUT     = Math.max(1, Math.min(16, parseInt(config.defaultNOut, 10) || 4))
        const LCD_PREFIX       = (config.lcdPrefix || '').trim()

        // ── Servir logo EnergIAM ──────────────────────────────────────────────
        const logoPath = path.join(__dirname, '..', 'resources', 'energiam-logo.png')
        RED.httpNode.get('/logo84-energiam/logo.png', function (req, res) {
            res.setHeader('Content-Type', 'image/png')
            res.setHeader('Cache-Control', 'public, max-age=86400')
            fs.createReadStream(logoPath).pipe(res)
        })

        // ── Helper: armar payload completo del logo seleccionado ──────────────
        function buildLogoData (logo) {
            const cfg   = plcConfigByLogo[logo] || { nIn: DEFAULT_NIN, nOut: DEFAULT_NOUT }
            const io    = ioByLogo[logo]        || { inputs: [], outputs: [] }
            const names = pinNames[logo]        || {}
            const lcd   = LCD_PREFIX ? LCD_PREFIX + ' ' + logo : logo
            return {
                slot:     logo,
                nIn:      cfg.nIn,
                nOut:     cfg.nOut,
                inputs:   io.inputs,
                outputs:  io.outputs,
                pinNames: names,
                lan:      tableData[logo] && tableData[logo].status === 'online' ? 1 : 0,
                lcd:      lcd
            }
        }

        // ── Helper: emitir update de tabla + SVG (NO toca selectedLogo frontend) ──
        function emitState () {
            const outMsg = {
                payload: {
                    type:      'state_update',
                    tableData: Object.values(tableData),
                    logoData:  logoSeleccionado ? buildLogoData(logoSeleccionado) : null
                }
            }
            base.stores.data.save(base, node, outMsg)
            base.emit('msg-input:' + node.id, outMsg)
        }

        // ── Helper: restore completo al reconectar (incluye selectedLogo) ─────
        function emitRestore (socketId) {
            const outMsg = {
                payload: {
                    type:         'restore_state',
                    tableData:    Object.values(tableData),
                    selectedLogo: logoSeleccionado,
                    logoData:     logoSeleccionado ? buildLogoData(logoSeleccionado) : null
                }
            }
            base.stores.data.save(base, node, outMsg)
            if (socketId) {
                base.emit('msg-input:' + node.id, outMsg, socketId)
            } else {
                base.emit('msg-input:' + node.id, outMsg)
            }
        }

        // ── Registro Dashboard 2.0 ────────────────────────────────────────────
        // IMPORTANTE: onAction ruteа a wNode.send() (salida), NO a node.on('input').
        // Las acciones del widget se interceptan en beforeSend antes de llegar a la salida.
        group.register(node, config, {
            onAction: true,
            beforeSend: function (msg) {
                if (!msg || !msg.payload || !msg.payload.action) return msg
                const { action, value } = msg.payload

                switch (action) {
                    case 'get_state':
                        emitRestore(null)
                        break

                    case 'select_logo':
                        logoSeleccionado = value || null
                        emitState()
                        break

                    case 'save_config': {
                        const { logo, nIn, nOut } = value || {}
                        if (logo) {
                            plcConfigByLogo[logo] = {
                                nIn:  Math.max(1, Math.min(20, parseInt(nIn,  10) || DEFAULT_NIN)),
                                nOut: Math.max(1, Math.min(16, parseInt(nOut, 10) || DEFAULT_NOUT))
                            }
                        }
                        emitState()
                        break
                    }

                    case 'save_pin_names': {
                        const { logo, names } = value || {}
                        if (logo && names) pinNames[logo] = names
                        break
                    }
                }
                return null  // no enviar a salidas del nodo
            }
        })

        // ── Mensajes entrantes (solo MQTT y mensajes de flujos externos) ──────
        node.on('input', function (msg, send, done) {

            // ── Mensaje MQTT del LOGO 8.4 ─────────────────────────────────────
            const reported = (((msg || {}).payload || {}).state || {}).reported
            if (!reported) { done(); return }

            const topicParts = (msg.topic || '').split('/')
            if (topicParts.length <= TOPIC_SEGMENT) { done(); return }
            const logo = topicParts[TOPIC_SEGMENT].replace(/_/g, '')

            // Acumular bits I/Q incrementalmente (igual que Heartbeat del flujo)
            const io = ioByLogo[logo] || { inputs: [], outputs: [] }
            for (const key in reported) {
                if (key === '$logotime') continue
                const item  = reported[key]
                if (!item || !item.desc) continue
                const match = item.desc.match(/^([IQ])-bit-(\d+)-/)
                if (!match) continue
                const type = match[1]
                const idx  = parseInt(match[2], 10) - 1
                const val  = Array.isArray(item.value) ? item.value[0] : item.value
                if (type === 'I') io.inputs[idx]  = val ? 1 : 0
                if (type === 'Q') io.outputs[idx] = val ? 1 : 0
            }
            ioByLogo[logo] = io

            // Sin $logotime → actualizar SVG si es el logo activo
            if (!Object.prototype.hasOwnProperty.call(reported, '$logotime')) {
                if (logo === logoSeleccionado) emitState()
                done()
                return
            }

            // Con $logotime → heartbeat (throttle 10s por logo)
            const now = Date.now()
            if (lastThrottle[logo] && now - lastThrottle[logo] < THROTTLE) {
                // Dentro del throttle: si es el logo activo, actualizar solo SVG
                if (logo === logoSeleccionado) emitState()
                done()
                return
            }

            const prev = lastSeen[logo]
            lastSeen[logo]     = now
            lastThrottle[logo] = now

            const diff   = prev ? now - prev : null
            const status = diff && diff < ONLINE_TIMEOUT ? 'online' : 'offline'
            const lastTime = prev
                ? new Date(prev).toLocaleString('es-AR', {
                    day: '2-digit', month: '2-digit', year: 'numeric',
                    hour: '2-digit', minute: '2-digit', second: '2-digit'
                  })
                : 'Sin datos'

            tableData[logo] = { logo, status, lastTime }

            node.status({
                fill:  status === 'online' ? 'green' : 'red',
                shape: 'dot',
                text:  logo + ': ' + status
            })

            emitState()
            done()
        })

        node.on('close', done => done())
    }

    RED.nodes.registerType('ui-logo84', UILogo84Node)
}
