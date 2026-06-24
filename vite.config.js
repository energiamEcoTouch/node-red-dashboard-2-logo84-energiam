import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import { resolve } from 'path'

export default defineConfig({
    plugins: [
        vue(),
        cssInjectedByJsPlugin()
    ],
    build: {
        lib: {
            entry: resolve(__dirname, 'ui/index.js'),
            name: 'ui-logo84',
            fileName: () => 'ui-logo84.umd.js',
            formats: ['umd']
        },
        outDir: 'resources',
        emptyOutDir: false,
        rollupOptions: {
            external: ['vue'],
            output: {
                globals: { vue: 'Vue' },
                exports: 'named'
            }
        }
    }
})
