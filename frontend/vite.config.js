import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Em desenvolvimento, tudo que começa com /api vai para o backend (porta 3001).
// Em produção, defina VITE_API_URL com o endereço da API (veja docs/DEPLOY.md).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
