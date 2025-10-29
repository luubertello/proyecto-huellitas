import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { AppModule } from '../../src/app.module';
import { HttpService } from '@nestjs/axios';
import { Request } from 'express';

// --- Tus Entidades ---
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

// (bootPostgresContainer sigue igual)
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
    entities: entities, // <--- Lista completa de entidades

    // --- ¡ESTA ES LA CORRECCIÓN! ---
    synchronize: true, // true: Crea tablas desde las entidades
    dropSchema: true, // true: Borra todo antes de sincronizar (tests limpios)
    // --- Fin de la corrección ---
  });

  // Esto ahora creará las tablas 'estado', 'animal', 'raza', etc.
  await appDataSource.initialize(); 

  // Eliminamos toda la lógica de `runMigrations` que ya no es necesaria

  const moduleRef: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(DataSource)
    .useValue(appDataSource) // Reemplaza la DB de la app con la nuestra
    .overrideProvider(HttpService)
    .useValue({
      get: jest.fn(),
      post: jest.fn(),
    })
    .compile();

  const app: INestApplication = moduleRef.createNestApplication();

  app.use((req: Request & { user: any }, _res, next) => {
    req.user = opts?.fakeUser || { id: 1, roles: ['admin'] };
    next();
  });

  await app.init();

  // --- SEEDING (Creación de datos base) ---
  // Esto ahora funcionará porque `appDataSource.initialize()` ya creó las tablas.
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

  const close = async () => {
    await app.close();
    await appDataSource.destroy(); 
    await pg.container.stop();
  };

  // Esto ahora tiene todo lo que el spec.ts necesita
  return { app, moduleRef, close, appDataSource };
}

