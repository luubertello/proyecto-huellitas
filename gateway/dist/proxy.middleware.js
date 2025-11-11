"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProxyMiddleware = void 0;
const common_1 = require("@nestjs/common");
const http_proxy_middleware_1 = require("http-proxy-middleware");
let ProxyMiddleware = class ProxyMiddleware {
    proxyMap;
    constructor() {
        const targets = {
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
            this.proxyMap[path] = (0, http_proxy_middleware_1.createProxyMiddleware)({
                target: targets[path],
                changeOrigin: true,
            });
        }
    }
    use(req, res, next) {
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
};
exports.ProxyMiddleware = ProxyMiddleware;
exports.ProxyMiddleware = ProxyMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ProxyMiddleware);
//# sourceMappingURL=proxy.middleware.js.map