import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express'; 
import { ProxyMiddleware } from './proxy.middleware';

async function bootstrap() {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  const proxy = new ProxyMiddleware();
  app.use(proxy.use.bind(proxy));

  await app.listen(3000);
  console.log('Gateway corriendo en http://localhost:3000');
}
bootstrap();