// En: correo-api/src/app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { join } from 'path'; 

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),

    MailerModule.forRootAsync({
      imports: [ConfigModule], 
      inject: [ConfigService],  
      useFactory: (configService: ConfigService) => ({
        
        // --- Conexión al Servidor de Correo ---
        transport: {
          service: configService.get<string>('EMAIL_SERVICE'), 
          auth: {
            user: configService.get<string>('EMAIL_USER'), 
            pass: configService.get<string>('EMAIL_PASS'), 
          },
        },
        
        defaults: {
          from: `"Huellitas Adopción" <${configService.get<string>('EMAIL_USER')}>`,
        },

        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}