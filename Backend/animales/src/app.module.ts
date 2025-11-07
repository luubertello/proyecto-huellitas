import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnimalModule } from './animal/animal.module';
import { CambioEstadoModule } from './cambioEstado/cambioEstado.module';
import { EstadoModule } from './estado/estado.module';
import { EspecieModule } from './especie/especie.module';
import { RazaModule } from './raza/raza.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
        username: configService.get<string>('DB_USERNAME', 'admin'),
        password: configService.get<string>('DB_PASSWORD', '1234'),
        database: configService.get<string>('DB_DATABASE', 'animales'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),
    AnimalModule,
    CambioEstadoModule,
    EstadoModule,
    EspecieModule,
    RazaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
