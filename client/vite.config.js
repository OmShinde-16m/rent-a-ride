import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'


// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    build: {
      outDir: 'dist',
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            // React core
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            // State management
            'vendor-redux': ['@reduxjs/toolkit', 'react-redux', 'redux-persist'],
            // MUI / UI libraries
            'vendor-mui': [
              '@mui/icons-material',
              '@mui/x-data-grid',
              '@mui/x-date-pickers',
              '@emotion/react',
              '@emotion/styled',
            ],
            // Charting libraries
            'vendor-charts': [
              '@nivo/bar',
              '@nivo/core',
              '@nivo/pie',
            ],
            // Syncfusion
            'vendor-syncfusion': [
              '@syncfusion/ej2',
              '@syncfusion/ej2-react-calendars',
              '@syncfusion/ej2-react-charts',
              '@syncfusion/ej2-react-dropdowns',
              '@syncfusion/ej2-react-grids',
              '@syncfusion/ej2-react-inputs',
              '@syncfusion/ej2-react-kanban',
              '@syncfusion/ej2-react-popups',
              '@syncfusion/ej2-react-richtexteditor',
              '@syncfusion/ej2-react-schedule',
            ],
            // Other UI utilities
            'vendor-ui': ['antd', 'framer-motion', 'flowbite-react'],
          },
        },
      },
    },
    server: {
      proxy: mode === "development" ? {
        "/api": {
          target: env.VITE_PRODUCTION_BACKEND_URL,
          changeOrigin: true,
          secure: false,
          // rewrite: (path) => path.replace(/^\/api/, '')
        }
      } : {}
    }
  }
})
