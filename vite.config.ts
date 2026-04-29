import { defineConfig } from 'vite';

export default defineConfig({
  base: '/choojai-cowork-quiz/',
  build: { target: 'es2020', sourcemap: true },
  server: { host: true, port: 5173 },
});
