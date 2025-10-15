// src/proxy.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { createProxyMiddleware, RequestHandler } from 'http-proxy-middleware';

@Injectable()
export class ProxyMiddleware implements NestMiddleware {
  private proxyMap: Record<string, RequestHandler>;

  constructor() {
    const targets: Record<string, string> = {
      '/usuarios': 'http://127.0.0.1:3001',
      '/rol': 'http://localhost:3001',
      '/permisos': 'http://localhost:3001',
      '/auth': 'http://127.0.0.1:3001',
      '/animales': 'http://localhost:3002',
      '/raza': 'http://localhost:3002',
      '/especie': 'http://localhost:3002',
      '/sexo': 'http://localhost:3002',
      '/estado': 'http://localhost:3002',
      '/adopcion': 'http://localhost:3003',
      '/donacion': 'http://localhost:3004',
      '/inventario': 'http://localhost:3005',
      '/chatbot': 'http://localhost:3006',
    };

    this.proxyMap = {};
    for (const path in targets) {
      this.proxyMap[path] = createProxyMiddleware({
        target: targets[path],
        changeOrigin: true,
      });
    }
  }

  use(req: any, res: any, next: () => void) {
    const url = req.originalUrl;

    if (url === '/') {
      return res.send('Gateway funcionando 🚀');
    }

    for (const path in this.proxyMap) {
      if (url.startsWith(path)) {
        return this.proxyMap[path](req, res, next);
      }
    }

    res.status(404).send('Ruta no encontrada en el gateway');
  }
}
