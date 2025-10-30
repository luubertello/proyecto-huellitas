import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import request = require('supertest');
import { createAnimalsTestApp } from './animales-test.helper';
import { Estado } from '../../src/estado/estado.entity';

describe('Estado Service (Component Test)', () => {
  let app: INestApplication;
  let mod: TestingModule;
  let close: () => Promise<void>;
  let appDataSource: DataSource;

  let estadoEnAdopcionId: number;
  let estadoPendienteId: number;
  let estadoAdoptadoId: number;

  jest.setTimeout(60000); 

  beforeAll(async () => {
    const boot = await createAnimalsTestApp();
    app = boot.app;
    mod = boot.moduleRef;
    close = boot.close;
    appDataSource = boot.appDataSource;

    const estadoRepo = appDataSource.getRepository(Estado);
    const estados = await estadoRepo.find();
    estadoEnAdopcionId = estados.find((e) => e.nombre === 'EnAdopcion')!.id;
    estadoPendienteId = estados.find(
      (e) => e.nombre === 'PendienteAdopcion',
    )!.id;
    estadoAdoptadoId = estados.find((e) => e.nombre === 'Adoptado')!.id;
  });

  afterAll(async () => {
    await close();
  });

  describe('GET /estados', () => {
    it('(200) debe devolver los 3 estados creados por el seed', async () => {
      const res = await request(app.getHttpServer())
        .get('/estados') 
        .expect(200);

      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBe(3);
      expect(res.body.map((e) => e.nombre)).toEqual(
        expect.arrayContaining([
          'EnAdopcion',
          'PendienteAdopcion',
          'Adoptado',
        ]),
      );
    });
  });

  describe('GET /estados/:id', () => {
    it('(200) debe devolver un estado por su ID', async () => {
      const res = await request(app.getHttpServer())
        .get(`/estados/${estadoEnAdopcionId}`)
        .expect(200);

      expect(res.body.id).toBe(estadoEnAdopcionId);
      expect(res.body.nombre).toBe('EnAdopcion');
    });

    it('(404) debe fallar si el estado no existe', async () => {
      await request(app.getHttpServer()).get('/estados/99999').expect(404);
    });
  });

  describe('POST /estados', () => {
    it('(201) debe crear un nuevo estado', async () => {
      const dto = { nombre: 'Perdido' };

      const res = await request(app.getHttpServer())
        .post('/estados')
        .send(dto)
        .expect(201);

      expect(res.body.id).toBeDefined();
      expect(res.body.nombre).toBe('Perdido');

      const estadosEnDB = await appDataSource.getRepository(Estado).find();
      expect(estadosEnDB.length).toBe(4);
    });

    it('(400) debe fallar si el nombre está vacío', async () => {
      const dto = { nombre: '' }; 

      await request(app.getHttpServer())
        .post('/estados')
        .send(dto)
        .expect(400);
    });
  });
});
