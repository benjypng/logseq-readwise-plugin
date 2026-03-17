import { defineConfig } from 'vite'
import logseqPlugin from 'vite-plugin-logseq'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  base: './',
  plugins: [logseqPlugin(), tsconfigPaths()],
  build: {
    target: 'esnext',
  },
})
