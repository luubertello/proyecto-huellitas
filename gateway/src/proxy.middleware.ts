// src/proxy.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { createProxyMiddleware } from 'http-proxy-middleware';

@Injectable()
export class ProxyMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    // Mapeo de rutas
    const targets = {
      '/usuarios': 'http://localhost:3001',
      '/animales': 'http://localhost:3002',
      '/adopcion': 'http://localhost:3003',
      '/donacion': 'http://localhost:3004',
      '/inventario': 'http://localhost:3005',
      '/chatbot': 'http://localhost:3006',
    };

    for (const path in targets) {
      if (req.url.startsWith(path)) {
        return createProxyMiddleware({
          target: targets[path],
          changeOrigin: true,
          pathRewrite: { [`^${path}`]: '' },
        })(req, res, next);
      }
    }

    next();
  }
}