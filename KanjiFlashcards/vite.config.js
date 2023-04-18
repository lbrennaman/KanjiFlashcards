import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const ASSET_URL = process.env.ASSET_URL || '';

console.log("Directory: ", `${ASSET_URL}/dist/`);

// https://vitejs.dev/config/
// https://stackoverflow.com/questions/68076527/how-to-set-vite-config-js-base-public-path
export default defineConfig({
  plugins: [react()],
  base: `${ASSET_URL}/dist/`
})
