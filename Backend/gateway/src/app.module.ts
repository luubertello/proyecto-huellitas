// src/app.module.ts
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ProxyMiddleware } from './proxy.middleware';

@Module({
  imports: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ProxyMiddleware)
      .forRoutes('*'); // middleware aplicado a todas las rutas
  }
}
