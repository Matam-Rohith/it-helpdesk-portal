import { app } from './server/app';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import express from 'express';
import fs from 'fs';

const isProd = process.env.NODE_ENV === 'production';
// In development, AI Studio strictly requires port 3000. In production (Render/Docker), use process.env.PORT.
const PORT = !isProd ? 3000 : (process.env.PORT ? parseInt(process.env.PORT, 10) : 3000);

async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'custom',
    });
    app.use(vite.middlewares);

    // Serve transformed index.html for SPA routes in dev
    app.use(async (req, res, next) => {
      if (req.method !== 'GET') return next();
      try {
        const url = req.originalUrl;
        let template = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        next(e);
      }
    });
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.use((_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT} (${isProd ? 'production' : 'development'})`);
  });
}

startServer();
