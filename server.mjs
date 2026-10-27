import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { createServer as createViteServer } from 'vite';

const root = process.cwd();
const indexHtmlPath = path.resolve(root, 'index.html');

async function loadDotEnv() {
  const envPath = path.resolve(root, '.env');

  try {
    const raw = await fs.readFile(envPath, 'utf8');
    const lines = raw.split(/\r?\n/);

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      const equalsIndex = trimmed.indexOf('=');
      if (equalsIndex === -1) continue;

      const key = trimmed.slice(0, equalsIndex).trim();
      if (!key || process.env[key] !== undefined) continue;

      let value = trimmed.slice(equalsIndex + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      process.env[key] = value;
    }
  } catch {
    // No .env file is fine; the app can still run with shell environment variables.
  }
}

function enhanceResponse(res) {
  if (res.status) return;

  res.status = (code) => {
    res.statusCode = code;
    return res;
  };

  res.json = (payload) => {
    if (!res.headersSent) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
    }

    res.end(JSON.stringify(payload));
    return res;
  };

  res.send = (payload) => {
    if (typeof payload === 'object' && !Buffer.isBuffer(payload)) {
      return res.json(payload);
    }

    res.end(payload);
    return res;
  };
}

async function loadFunctionsHandler() {
  const filePath = path.resolve(root, 'api', 'functions.js');
  const moduleUrl = `${pathToFileURL(filePath).href}?t=${Date.now()}`;
  const mod = await import(moduleUrl);
  return mod.default;
}

async function handleApi(req, res) {
  try {
    const handler = await loadFunctionsHandler();
    if (typeof handler !== 'function') {
      res.status(500).json({ error: 'API router is not a function' });
      return;
    }
    await handler(req, res);
  } catch (error) {
    console.error('API Error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message || 'Internal server error' });
    } else {
      res.end();
    }
  }
}

await loadDotEnv();

const vite = await createViteServer({
  server: {
    middlewareMode: true,
  },
  appType: 'spa',
});

const server = http.createServer(async (req, res) => {
  enhanceResponse(res);

  const pathname = new URL(req.url || '/', 'http://localhost').pathname;

  if (pathname.startsWith('/api/')) {
    await handleApi(req, res);
    return;
  }

  vite.middlewares(req, res, async () => {
    try {
      const template = await fs.readFile(indexHtmlPath, 'utf8');
      const html = await vite.transformIndexHtml(pathname, template);
      res.status(200).setHeader('Content-Type', 'text/html; charset=utf-8');
      res.end(html);
    } catch (error) {
      vite.ssrFixStacktrace(error);
      res.status(500).end(error.stack);
    }
  });
});

const port = Number(process.env.PORT || 5173);
server.listen(port, () => {
  console.log(`CareerBoost dev server running at http://localhost:${port}`);
});
