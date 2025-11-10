// src/proxy.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { createProxyMiddleware, RequestHandler } from 'http-proxy-middleware';

@Injectable()
export class ProxyMiddleware implements NestMiddleware {
  private proxyMap: Record<string, RequestHandler>;

  constructor() {
    const targets: Record<string, string> = {
      '/usuarios': 'http://usuarios-api:3000',
      '/rol': 'http://usuarios-api:3000',
      '/permisos': 'http://usuarios-api:3000',
      '/auth': 'http://usuarios-api:3000',
      '/animales': 'http://animales-api:3000',
      '/raza': 'http://animales-api:3000',
      '/especie': 'http://animales-api:3000', 
      '/estado': 'http://adopcion-api:3000',
      '/solicitudes': 'http://adopcion-api:3000',
      '/email': 'http://correo-api:3000',
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
