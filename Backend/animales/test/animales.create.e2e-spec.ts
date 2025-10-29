import request from 'supertest';
import { createAnimalsAppWithPostgres } from './utils.pg.animales';
import { getRepositoryToken } from '@nestjs/typeorm';

// Ajustar si cambia
//import { Sexo } from '../src/sexo/sexo.entity';
import { Estado } from '../../estado/estado.entity';
import { Raza } from '../src/raza/raza.entity';

describe('POST /animales (e2e)', () => {
  let app: any, mod: any, close: () => Promise<void>;
  let sexoId: number, estadoId: number, razaId: number;

  beforeAll(async () => {
    const boot = await createAnimalsAppWithPostgres({
      runMigrations: true,
      dropSchema: true,
    });
    app = boot.app;
    mod = boot.moduleRef;
    close = boot.close;

    const sexoRepo = mod.get(getRepositoryToken(sexo));
    const estadoRepo = mod.get(getRepositoryToken(estado));
    const razaRepo = mod.get(getRepositoryToken(raza));
    sexoId = (await sexoRepo.findOne({ where: { nombre: 'Macho' } }))!.id;
    estadoId = (await estadoRepo.findOne({ where: { nombre: 'pendienteAdopcion' } }))!
      .id;
    razaId = (await razaRepo.findOne({ where: { nombre: 'Mestizo' } }))!.id;
  });

  afterAll(async () => {
    await close();
  });

  it('crea 201 con FK válidas', async () => {
    const dto = {
      nombre: 'Mora',
      edadMeses: 10,
      pesoKg: 12.3,
      sexoId,
      estadoId,
      razaId,
      chip: 'CHIP-0001', // si tenés UNIQUE en este campo, mejor
      descripcion: 'Muy sociable',
    };

    const res = await request(app.getHttpServer())
      .post('/animales')
      .send(dto)
      .expect(201);
    expect(res.body?.id).toBeDefined();
    expect(res.body?.estado?.id || res.body?.estadoId).toBe(estadoId);
    expect(res.body?.sexo?.id || res.body?.sexoId).toBe(sexoId);
  });

  it('400 por DTO inválido', async () => {
    const bad = { nombre: 123, sexoId: null }; // rompe class-validator
    await request(app.getHttpServer()).post('/animales').send(bad).expect(400);
  });

  it('409 por UNIQUE (chip repetido)', async () => {
    const ok = {
      nombre: 'Luna',
      edadMeses: 8,
      pesoKg: 9.1,
      sexoId,
      estadoId,
      razaId,
      chip: 'CHIP-0002',
    };
    await request(app.getHttpServer()).post('/animales').send(ok).expect(201);
    // Repetimos chip
    await request(app.getHttpServer()).post('/animales').send(ok).expect(409);
  });
});
