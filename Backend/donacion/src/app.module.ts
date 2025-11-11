
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EstadoPago } from './estado-pago/estado-pago.entity';
import { DonacionMonetaria } from './donacion-monetaria/donacion-monetaria.entity';
import { EstadoInsumo } from './estado-insumo/estado-insumo.entity';
import { DonacionInsumo } from './donacion-insumo/donacion-insumo.entity';


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
          EstadoPago,
          DonacionMonetaria,
          EstadoInsumo,
          DonacionInsumo
        ],
        
        synchronize: true, 
      }),
    }),
    TypeOrmModule.forFeature([
      EstadoPago,
      DonacionMonetaria,
      EstadoInsumo,
      DonacionInsumo
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}