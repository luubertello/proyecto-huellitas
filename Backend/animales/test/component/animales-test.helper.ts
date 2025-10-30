// --- ARCHIVO: apps/animales-service/test/component/animales-test.helper.ts ---

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { AppModule } from '../../src/app.module';
import { HttpService } from '@nestjs/axios';
import { Request } from 'express';

// --- Entidades ---
import { Animal } from '../../src/animal/animal.entity';
import { Estado } from '../../src/estado/estado.entity';
import { Raza } from '../../src/raza/raza.entity';
import { Especie } from '../../src/especie/especie.entity';
import { CambioEstado } from '../../src/cambioEstado/cambioEstado.entity';

// Lista de entidades para el DataSource
const entities = [Animal, Estado, Raza, Especie, CambioEstado];

const DB_USER = 'admin';
const DB_PASS = '1234';
const DB_NAME = 'animales_test';

export async function bootPostgresContainer() {
  const container: StartedPostgreSqlContainer =
    await new PostgreSqlContainer('postgres:16-alpine')
      .withDatabase(DB_NAME)
      .withUsername(DB_USER)
      .withPassword(DB_PASS)
      .start();

  return {
    container,
    host: container.getHost(),
    port: container.getPort(),
    db: container.getDatabase(),
    user: container.getUsername(),
    pass: container.getPassword(),
  };
}

export async function createAnimalsTestApp(opts?: {
  fakeUser?: { id: number; roles?: string[] };
}) {
  const pg = await bootPostgresContainer();

  // --- 1. CREACIÓN MANUAL DEL DATASOURCE ---
  const appDataSource = new DataSource({
    type: 'postgres',
    host: pg.host,
    port: pg.port,
    username: pg.user,
    password: pg.pass,
    database: pg.db,
    entities: entities,
    synchronize: true, 
    dropSchema: true, 
  });

  await appDataSource.initialize();

  const moduleRef: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(DataSource)
    .useValue(appDataSource)
    .overrideProvider(HttpService)
    .useValue({
      get: jest.fn(),
      post: jest.fn(),
    })
    .compile();

  const app: INestApplication = moduleRef.createNestApplication();

  // (El ValidationPipe está perfecto)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // (El middleware de usuario fake sigue igual)
  app.use((req: Request & { user: any }, _res, next) => {
    req.user = opts?.fakeUser || { id: 1, roles: ['admin'] };
    next();
  });

  await app.init();

  // (El Seeding sigue igual)
  const estadoRepo = appDataSource.getRepository(Estado);
  if ((await estadoRepo.count()) === 0) {
    await estadoRepo.save([
      { nombre: 'EnAdopcion' },
      { nombre: 'PendienteAdopcion' },
      { nombre: 'Adoptado' },
    ]);
  }
  const razaRepo = appDataSource.getRepository(Raza);
  if ((await razaRepo.count()) === 0) {
    await razaRepo.save([{ nombre: 'Mestizo' }, { nombre: 'Puro' }]);
  }
  const especieRepo = appDataSource.getRepository(Especie);
  if ((await especieRepo.count()) === 0) {
    await especieRepo.save([{ nombre: 'Perro' }, { nombre: 'Gato' }]);
  }

  // --- (EL CIERRE CORREGIDO) ---
  const close = async () => {
    await app.close();
    
    if (appDataSource.isInitialized) {
      await appDataSource.destroy();
    }
    // ---------------------------------
    
    await pg.container.stop();
  };

  return { app, moduleRef, close, appDataSource };
}