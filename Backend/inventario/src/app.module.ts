
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriaInsumo } from './categoria-insumo/categoria-insumo.entity';
import { Insumo } from './insumo/insumo.entity';
import { InsumoController } from './insumo/insumo.controller';
import { InsumoService } from './insumo/insumo.service';
import { InsumoModule } from './insumo/insumo.module';
import { CategoriaInsumoModule } from './categoria-insumo/categoria-insumo.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/jwt.strategy';
import { HttpModule } from '@nestjs/axios';

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
          CategoriaInsumo,
          Insumo
        ],
        
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

    InsumoModule,
    CategoriaInsumoModule,
    HttpModule,
  ],
  controllers: [AppController, InsumoController],
  providers: [AppService, InsumoService, JwtStrategy],
})
export class AppModule {}