import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// https://stackoverflow.com/questions/68076527/how-to-set-vite-config-js-base-public-path
export default defineConfig({
  plugins: [react()],
  base: '/KanjiFlashcards/'
})
