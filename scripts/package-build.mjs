import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { transform } from 'esbuild';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const library = JSON.parse(await fs.readFile(path.join(rootDir, 'library.json'), 'utf8'));
const pkg = JSON.parse(await fs.readFile(path.join(rootDir, 'package.json'), 'utf8'));

const version = `${library.majorVersion}.${library.minorVersion}.${library.patchVersion}`;
const distRoot = path.join(rootDir, 'dist', `${pkg.name}-${version}`);
const jsDistDir = path.join(distRoot, 'js');
const cssDistDir = path.join(distRoot, 'css');

await fs.rm(distRoot, { recursive: true, force: true });
await fs.mkdir(jsDistDir, { recursive: true });
await fs.mkdir(cssDistDir, { recursive: true });

for (const asset of library.preloadedJs) {
  const filename = path.basename(asset.path);
  const viteOutputFile = path.join(rootDir, '.vite-build', 'js', filename);
  const distFile = path.join(jsDistDir, filename);
  const minifiedDistFile = path.join(jsDistDir, `${path.basename(filename, '.js')}.min.js`);

  const code = await fs.readFile(viteOutputFile, 'utf8');
  await fs.writeFile(distFile, code);

  const minified = await transform(code, {
    loader: 'js',
    minify: true,
    legalComments: 'none'
  });

  await fs.writeFile(minifiedDistFile, minified.code);
}

for (const asset of library.preloadedCss) {
  const filename = path.basename(asset.path);
  const sourceFile = path.join(rootDir, asset.path);
  const distFile = path.join(cssDistDir, filename);
  const minifiedDistFile = path.join(cssDistDir, `${path.basename(filename, '.css')}.min.css`);

  const sourceCss = await fs.readFile(sourceFile, 'utf8');
  const prefixed = await postcss([autoprefixer()]).process(sourceCss, {
    from: sourceFile,
    to: distFile
  });

  await fs.writeFile(distFile, prefixed.css);

  const minified = await transform(prefixed.css, {
    loader: 'css',
    minify: true,
    legalComments: 'none'
  });

  await fs.writeFile(minifiedDistFile, minified.code);
}

await fs.cp(path.join(rootDir, 'fonts'), path.join(distRoot, 'fonts'), { recursive: true });
await fs.copyFile(path.join(rootDir, 'library.json'), path.join(distRoot, 'library.json'));
await fs.copyFile(path.join(rootDir, 'README.md'), path.join(distRoot, 'README.md'));
