import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const library = JSON.parse(fs.readFileSync(path.join(rootDir, 'library.json'), 'utf8'));

const jsInputs = Object.fromEntries(
  library.preloadedJs.map((asset) => {
    const absolutePath = path.resolve(rootDir, asset.path);
    return [path.basename(asset.path, '.js'), absolutePath];
  })
);

export default defineConfig({
  build: {
    outDir: path.resolve(rootDir, '.vite-build/js'),
    emptyOutDir: true,
    minify: false,
    sourcemap: false,
    target: 'es2015',
    cssCodeSplit: true,
    rollupOptions: {
      input: jsInputs,
      output: {
        format: 'es',
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name].js',
        assetFileNames: 'assets/[name][extname]'
      }
    }
  },
  css: {
    postcss: path.resolve(rootDir, 'postcss.config.cjs')
  }
});
