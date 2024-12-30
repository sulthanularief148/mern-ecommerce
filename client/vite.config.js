import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build',
    sourcemap: true, // Add source maps for debugging
    rollupOptions: {
      onwarn: (warning, warn) => {
        // Log all warnings during the build process
        console.warn(warning.message);
        warn(warning);
      },
    },
  },
});
