// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [tailwindcss(),react()],
// })


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss(), react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Stream chat ko alag chunk mein daal rahe hain
            if (id.includes('stream-chat')) {
              return 'stream-vendor';
            }
            // Baki sabhi libraries 'vendor' file mein jayengi
            return 'vendor';
          }
        }
      }
    },
    // Optional: limit badhane ke liye agar abhi bhi warning aaye
    chunkSizeWarningLimit: 1000, 
  }
})