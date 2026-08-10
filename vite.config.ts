import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['fitflow-mark.svg'],
      manifest: {
        name: 'FitFlow Workout Timer',
        short_name: 'FitFlow',
        description: 'A focused, guided workout timer built for consistency.',
        theme_color: '#101611',
        background_color: '#f2f1ea',
        display: 'standalone',
        orientation: 'portrait-primary',
        icons: [
          { src: 'fitflow-mark.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }
        ]
      }
    })
  ]
})
