import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const isDev = mode === 'development'
  return {
    plugins: [react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin']
      }
    })],
    server: {
      host: true,
      proxy: {
        '/apiKonami': {
          target: 'https://img.yugioh-card.com/en/downloads/forms/KDE_DeckList.pdf',
          changeOrigin: isDev,
          secure: !isDev,
          rewrite: path => path.replace('/apiKonami', '')
        },
        '/api': {
          target: 'https://db.ygoprodeck.com/api/v7/cardinfo.php',
          changeOrigin: isDev,
          secure: !isDev,
          rewrite: path => path.replace('/api', '')
        }
      }
    }
  }
})
