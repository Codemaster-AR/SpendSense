import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] || 'SpendSense';
const base = process.env.GITHUB_PAGES === 'true' ? `/${repoName}/` : '/';

export default defineConfig({
  base,
  plugins: [react()],
  build: {
    rollupOptions: {
      output: { manualChunks: { charts: ['recharts'], icons: ['lucide-react'] } },
    },
  },
});
