import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  root: path.resolve(__dirname), // punta alla cartella Frontend

  plugins: [react()],

  server: {
    port: 5173,
    proxy: {
      "/api" : "http://localhost:3000"     //per usare chiamate di tipo fetch
    }
  },

})
