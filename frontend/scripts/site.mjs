import { cpSync, copyFileSync, lstatSync, mkdirSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Readable } from 'node:stream';
import { fileURLToPath } from 'node:url';
import express from 'express';
import webpack from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import { buildPages } from './build-pages.mjs';
import { PAGES } from '../src/data/site.js';

const root = fileURLToPath(new URL('../../', import.meta.url));
const preview = process.argv.includes('--serve');
const output = preview ? mkdtempSync(join(tmpdir(), 'clevanoo-preview-')) : join(root, 'build');
const apiBase = process.env.CLEVANOO_API_BASE_URL;
const previousOutput = lstatSync(output, { throwIfNoEntry: false });
if (previousOutput && !previousOutput.isDirectory()) {
  throw new Error('The build output must be a directory: ' + output);
}

const compiler = webpack({
  mode: 'production',
  context: root,
  entry: { home: './frontend/src/main.jsx', inner: './frontend/src/site/inner.js', jobUpload: './frontend/src/job-upload.jsx' },
  output: {
    path: output,
    publicPath: '/',
    filename: 'frontend-assets/[name].[contenthash:8].js',
    chunkFilename: 'frontend-assets/[name].[contenthash:8].js',
    clean: true,
  },
  resolve: {
    alias: {
      'gsap$': join(root, 'frontend/shims/gsap.cjs'),
      'gsap/ScrollTrigger$': join(root, 'frontend/shims/ScrollTrigger.cjs'),
      'three$': join(root, 'frontend/shims/three.cjs'),
    },
  },
  module: {
    rules: [
      { test: /\.jsx$/, use: { loader: 'babel-loader', options: { presets: ['@babel/preset-react'] } } },
      { test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader'] },
      { test: /\.woff2$/, type: 'asset/resource', generator: { filename: 'frontend-assets/[name].[contenthash:8][ext]' } },
    ],
  },
  plugins: [new MiniCssExtractPlugin({ filename: 'frontend-assets/[name].[contenthash:8].css' })],
  optimization: { minimizer: ['...', new CssMinimizerPlugin()] },
});

const bundles = await new Promise((resolve, reject) => {
  compiler.run((error, stats) => {
    compiler.close((closeError) => {
      if (error || closeError) return reject(error || closeError);
      if (stats.hasErrors()) return reject(new Error(stats.toString({ all: false, errors: true })));
      console.log(stats.toString({ all: false, warnings: true, assets: true }));
      const { assetsByChunkName } = stats.toJson({ all: false, assets: true });
      resolve({
        home: assetsByChunkName.home.find((name) => name.endsWith('.js')),
        inner: assetsByChunkName.inner.find((name) => name.endsWith('.js')),
        css: assetsByChunkName.home.find((name) => name.endsWith('.css')),
        jobUpload: assetsByChunkName.jobUpload.find((name) => name.endsWith('.js')),
        jobUploadCss: assetsByChunkName.jobUpload.find((name) => name.endsWith('.css')),
      });
    });
  });
});

mkdirSync(output, { recursive: true });
cpSync(join(root, 'public/assets'), join(output, 'assets'), { recursive: true });
for (const file of ['favicon.ico', 'logo.webp', 'robots.txt', 'sitemap.xml']) {
  copyFileSync(join(root, 'public', file), join(output, file));
}
buildPages(output, preview ? '/preview-api' : apiBase || '/backend/public/api', !preview, bundles);
copyFileSync(join(root, 'frontend/hosting.htaccess'), join(output, '.htaccess'));
console.log('Built ' + output);

if (preview) {
  const app = express();
  const upstream = (apiBase || 'http://localhost/clevanoo_website/backend/public/api').replace(/\/+$/, '');
  const reads = /^\/(?:all-jobs|jobs\/[1-9]\d*)$/;
  const posts = new Set(['/website-email', '/save-candidates', '/create-job']);
  app.use('/preview-api', async (request, response) => {
    const reading = request.method === 'GET' && reads.test(request.path);
    const writing = (request.method === 'POST' && posts.has(request.path))
      || (request.method === 'PUT' && /^\/update-job\/[1-9]\d*$/.test(request.path))
      || (request.method === 'DELETE' && /^\/delete-job\/[1-9]\d*$/.test(request.path));
    if (!reading && !writing) {
      response.sendStatus(404);
      return;
    }
    const headers = { Accept: 'application/json' };
    const body = writing && request.method !== 'DELETE' ? request : undefined;
    if (body) headers['Content-Type'] = request.get('Content-Type') || 'application/octet-stream';
    try {
      const result = await fetch(upstream + request.url, {
        method: request.method,
        headers,
        body,
        duplex: 'half',
        signal: AbortSignal.timeout(15000),
      });
      response.status(result.status).type(result.headers.get('Content-Type') || 'application/json');
      if (result.body) Readable.fromWeb(result.body).on('error', () => response.destroy()).pipe(response);
      else response.end();
    } catch {
      response.status(502).json({ error: 'The local Laravel API could not be reached.' });
    }
  });
  const send = (file) => (_request, response) => response.sendFile(file, { root: output });
  for (const { path, file } of Object.values(PAGES)) {
    if (path) app.get(path, send(file));
  }
  app.get(/^\/job\/[1-9]\d*\/?$/, send(PAGES.job.file));
  app.use(express.static(output));
  app.use((_request, response) => response.status(404).sendFile('404.html', { root: output }));
  const port = Number(process.env.PORT || 3000);
  const host = process.env.HOST || '0.0.0.0';
  app.listen(port, host, (error) => {
    if (error) throw error;
    console.log('Preview at http://localhost:' + port);
  });
}
