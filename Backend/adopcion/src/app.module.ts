import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SolicitudAdopcionModule } from './solicitud-adopcion/solicitud-adopcion.module';
import { EstadoModule } from './estado/estado.module';
import { CambioEstadoModule } from './cambio-estado/cambio-estado.module';
import { FormularioAdopcionModule } from './formulario-adopcion/formulario-adopcion.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'admin',
      password: process.env.DB_PASSWORD || '1234',
      database: process.env.DB_DATABASE || 'adopcion',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
      PassportModule.register({ defaultStrategy: 'jwt' }),
      JwtModule.register({
        secret: process.env.JWT_SECRET || 'huellitas123',
        signOptions: { expiresIn: '1h' },
    }),
   FormularioAdopcionModule,
   SolicitudAdopcionModule,
   EstadoModule,
   CambioEstadoModule
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
  exports: [PassportModule, JwtModule],
})
export class AppModule {}
