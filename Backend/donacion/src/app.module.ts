
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DonacionInsumo } from './donacion-insumo/donacion-insumo.entity';
import { EstadoDonacionDineroModule } from './estado-donacion-dinero/estado-donacion-dinero.module';
import { EstadoDonacionInsumoService } from './estado-donacion-insumo/estado-donacion-insumo.service';
import { EstadoDonacionInsumoController } from './estado-donacion-insumo/estado-donacion-insumo.controller';
import { EstadoDonacionInsumoModule } from './estado-donacion-insumo/estado-donacion-insumo.module';
import { DonacionDinero } from './donacion-dinero/donacion-dinero.entity';
import { EstadoDonacionInsumo } from './estado-donacion-insumo/estado-donacion-insumo.entity';
import { EstadoDonacionDinero } from './estado-donacion-dinero/estado-donacion-dinero.entity';
import { DonacionDineroModule } from './donacion-dinero/donacion-dinero.module';
import { DonacionInsumoModule } from './donacion-insumo/donacion-insumo.module';
import { JwtStrategy } from './auth/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        
        entities: [
          EstadoDonacionInsumo,
          DonacionDinero,
          EstadoDonacionDinero,
          DonacionInsumo
        ],
        
        synchronize: true, 
      }),
    }),
    TypeOrmModule.forFeature([
      EstadoDonacionDinero,
      DonacionDinero,
      EstadoDonacionInsumo,
      DonacionInsumo
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.registerAsync({
      imports: [ConfigModule], 
      inject: [ConfigService],  
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
    EstadoDonacionDineroModule,
    EstadoDonacionInsumoModule,
    DonacionDineroModule,
    DonacionInsumoModule
  ],
  controllers: [AppController, EstadoDonacionInsumoController],
  providers: [AppService, EstadoDonacionInsumoService, JwtStrategy],
  exports: [PassportModule, JwtModule],
})
export class AppModule {}