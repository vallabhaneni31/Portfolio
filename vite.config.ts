import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Three.js is loaded through a dynamic import in LatticeStage, so it becomes its own chunk.
export default defineConfig({
  plugins: [react()],
  build: { target: 'es2020' },
});
