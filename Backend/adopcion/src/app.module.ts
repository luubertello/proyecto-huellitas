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
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], 
      inject: [ConfigService], 
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'), 
        port: configService.get<number>('DB_PORT', 5432),       
        username: configService.get<string>('DB_USERNAME', 'admin'),
        password: configService.get<string>('DB_PASSWORD', '1234'),
        database: configService.get<string>('DB_DATABASE', 'adopcion'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),

    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.registerAsync({
      imports: [ConfigModule], 
      inject: [ConfigService],  
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
    FormularioAdopcionModule,
    SolicitudAdopcionModule,
    EstadoModule,
    CambioEstadoModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtStrategy, 
  ],
  exports: [PassportModule, JwtModule],
})
export class AppModule {}