import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/subway/' : '/',
  plugins: [
    VitePWA()
  ]
}))
