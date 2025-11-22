// En: inventario-api/src/auth/guards/internal-api-key.guard.ts

import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class InternalApiKeyGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    console.log("HEADERS RECIBIDOS:", request.headers);

    const apiKey = request.headers['x-api-key'];
    console.log("API KEY HEADER:", apiKey);

    console.log("INTERNAL_API_KEY ENV:", process.env.INTERNAL_API_KEY);

    return apiKey === process.env.INTERNAL_API_KEY;
  }
}