import { fileURLToPath, URL } from 'url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const root = process.cwd()
  const env = loadEnv(mode, root)
  console.log('mode', mode)
  console.log('env', env)

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      proxy: {
        [env.VITE_BASE_API_PROXY_PREFIX || '/api/v1']: {
          target: env.VITE_BASE_API || 'http://localhost:3000',
          changeOrigin: true
        }
      }
    },
  }
})
