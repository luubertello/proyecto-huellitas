// En: src/app.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuarioModule } from './usuario/usuario.module';
import { RolModule } from './rol/rol.module';
import { PermisosModule } from './permisos/permisos.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'admin',
      password: process.env.DB_PASSWORD || '1234',
      database: process.env.DB_DATABASE || 'usuarios',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),

    UsuarioModule,
    RolModule,
    PermisosModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],  
})
export class AppModule {}