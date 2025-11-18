"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const platform_express_1 = require("@nestjs/platform-express");
const express_1 = __importDefault(require("express"));
const proxy_middleware_1 = require("./proxy.middleware");
async function bootstrap() {
    const server = (0, express_1.default)();
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(server));
    const proxy = new proxy_middleware_1.ProxyMiddleware();
    app.use(proxy.use.bind(proxy));
    await app.listen(3000);
    console.log('Gateway corriendo en http://localhost:3000');
}
bootstrap();
//# sourceMappingURL=main.js.map