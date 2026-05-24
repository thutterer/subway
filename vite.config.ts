import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/subway/' : '/',
  plugins: [
    VitePWA({
      manifest: {
        theme_color: '#F5DEB3',
        background_color: '#16171d',
      }
    })
  ]
}))
