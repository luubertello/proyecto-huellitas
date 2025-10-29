// test/utils.pg.animales.ts

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { AppModule } from '../src/app.module'; // Asume que AppModule está un nivel arriba
import { HttpService } from '@nestjs/axios';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Request } from 'express'; // Para tipar el req.user

// ⬇️ AJUSTA ESTOS IMPORTS a tus nombres de entidades y rutas REALES
import { Animal } from '../src/animal/animal.entity';
//import { Sexo } from '../src/sexo/sexo.entity';
import { Estado } from '../src/estado/estado.entity';
import { Raza } from '../src/raza/raza.entity'; 
import { Especie } from '../src/especie/especie.entity'; // Asumiendo que también usas Especie

// ⚠️ Usamos las credenciales de tu Docker Compose para evitar el error de autenticación
const DB_USER = 'admin';
const DB_PASS = '1234';
const DB_NAME = 'animales_test'; // Nombre de base de datos para los tests

/**
 * 1. Levanta el contenedor de PostgreSQL con las credenciales de tu YAML.
 */
export async function bootPostgresContainer() {
  const container: StartedPostgreSqlContainer =
    await new PostgreSqlContainer('postgres:16-alpine') // Puedes usar postgres:17.6 si lo prefieres
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

/**
 * 2. Configura la aplicación de NestJS con el TypeORM conectado al contenedor.
 */
export async function createAnimalsAppWithPostgres(opts?: {
  fakeUser?: { id: number; roles?: string[] };
  runMigrations?: boolean; // default true
  dropSchema?: boolean;    // default true
}) {
  const cfg = { runMigrations: true, dropSchema: true, ...(opts || {}) };
  const pg = await bootPostgresContainer();

  const moduleRef: TestingModule = await Test.createTestingModule({
    imports: [
      // Configuración de TypeORM inyectada para el test
      TypeOrmModule.forRoot({
        type: 'postgres',
        host: pg.host,
        port: pg.port,
        username: pg.user, // 'admin'
        password: pg.pass, // '1234'
        database: pg.db,
        autoLoadEntities: true,
        synchronize: false, // Mejor usar migraciones
        dropSchema: cfg.dropSchema,
        // Ajusta la ruta de tus migraciones si es necesario
        migrations: [__dirname + '/../src/migrations/*{.ts,.js}'], 
        migrationsRun: false, 
      }),
      AppModule, // Se importa el módulo raíz de tu aplicación
    ],
  })
    // ⬇️ MOCKEO DE DEPENDENCIAS EXTERNAS
    .overrideProvider(HttpService)
    .useValue({
      get: jest.fn(), post: jest.fn(), patch: jest.fn(), put: jest.fn(), delete: jest.fn(),
    })
    .compile();

  const app: INestApplication = moduleRef.createNestApplication();

  // ⬇️ MIDDLEWARE PARA INYECTAR USUARIO FAKE (simulando JWT/Gateway)
  app.use((req: Request & { user: any }, _res, next) => {
    req.user = opts?.fakeUser || { id: 1, roles: ['admin'] };
    next();
  });

  await app.init();

  // ⬇️ EJECUCIÓN DE MIGRACIONES
  if (cfg.runMigrations) {
    const ds = moduleRef.get(DataSource);
    await ds.runMigrations();
  }

  // ⬇️ SEEDS MÍNIMOS DE CATÁLOGOS (Asegura FKs)
  const sexoRepo: Repository<Sexo>   = moduleRef.get(getRepositoryToken(Sexo));
  const estadoRepo: Repository<EstadoAnimal> = moduleRef.get(getRepositoryToken(EstadoAnimal));
  const razaRepo: Repository<Raza>   = moduleRef.get(getRepositoryToken(Raza));
  const especieRepo: Repository<Especie> = moduleRef.get(getRepositoryToken(Especie));
  
  if (await sexoRepo.count() === 0) {
    await sexoRepo.save([{ nombre: 'Macho' }, { nombre: 'Hembra' }]);
  }
  if (await estadoRepo.count() === 0) {
    await estadoRepo.save([
      { nombre: 'Disponible' }, { nombre: 'Reservado' }, { nombre: 'Adoptado' },
    ]);
  }
  if (await razaRepo.count() === 0) {
    await razaRepo.save([{ nombre: 'Mestizo' }]);
  }
  // Si usas Especie para la FK, descomenta:
  /*
  if (await especieRepo.count() === 0) {
    await especieRepo.save([{ nombre: 'Perro' }, { nombre: 'Gato' }]);
  }
  */

  const close = async () => {
    await app.close();
    await pg.container.stop(); // 🛑 Detiene el contenedor
  };

  return { app, moduleRef, close };
}

// NO es necesario un describe aquí, ya que este archivo es solo un helper.