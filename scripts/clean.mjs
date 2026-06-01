import { rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

await rm(path.join(rootDir, '.vite-build'), { recursive: true, force: true });
await rm(path.join(rootDir, 'dist'), { recursive: true, force: true });
