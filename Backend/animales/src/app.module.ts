import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnimalModule } from './animal/animal.module';
import { CambioEstadoModule } from './cambioEstado/cambioEstado.module';
import { EstadoModule } from './estado/estado.module';
import { EspecieModule } from './especie/especie.module';
import { RazaModule } from './raza/raza.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'admin',
      password: process.env.DB_PASSWORD || '1234',
      database: process.env.DB_DATABASE || 'animales',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
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
