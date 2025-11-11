import { NestMiddleware } from '@nestjs/common';
export declare class ProxyMiddleware implements NestMiddleware {
    private proxyMap;
    constructor();
    use(req: any, res: any, next: () => void): any;
}
