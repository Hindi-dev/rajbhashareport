import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // if using React
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        // Change '/src/main.jsx' to your actual main file path if different
        main: resolve(__dirname, 'index.html'), 
      },
    },
  },
});
