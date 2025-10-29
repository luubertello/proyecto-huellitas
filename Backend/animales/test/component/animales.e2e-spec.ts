// --- ARCHIVO: apps/animales-service/test/component/animales.e2e-spec.ts ---

import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, Repository } from 'typeorm';
import request = require('supertest');
import { createAnimalsTestApp } from './animales-test.helper';

// Entidades
import { Animal } from '../../src/animal/animal.entity';
import { Estado } from '../../src/estado/estado.entity';
import { Raza } from '../../src/raza/raza.entity';
import { Especie } from '../../src/especie/especie.entity';
import { CambioEstado } from '../../src/cambioEstado/cambioEstado.entity';

describe('Animales Service (Component Test)', () => {
  let app: INestApplication;
  let mod: TestingModule;
  let close: () => Promise<void>;
  let appDataSource: DataSource;
  let animalRepo: Repository<Animal>;
  let cambioEstadoRepo: Repository<CambioEstado>; 

  // --- Datos de Seed ---
  let estadoEnAdopcionId: number;
  let estadoPendienteAdopcionId: number;
  let razaMestizoId: number;
  let especiePerroId: number;

  // --- 1. SETUP ---
  jest.setTimeout(60000);

  beforeAll(async () => {
    // 1. Arrancar la app y la DB
    const boot = await createAnimalsTestApp();

    // 2. Guardar referencias
    app = boot.app;
    mod = boot.moduleRef;
    close = boot.close;
    appDataSource = boot.appDataSource;
    animalRepo = appDataSource.getRepository(Animal);
    cambioEstadoRepo = appDataSource.getRepository(CambioEstado); 

    // 3. Obtener los IDs de los datos de SEED
    const estadoRepo = appDataSource.getRepository(Estado);
    const razaRepo = appDataSource.getRepository(Raza);
    const especieRepo = appDataSource.getRepository(Especie);

    const enAdopcion = await estadoRepo.findOneBy({ nombre: 'EnAdopcion' });
    const pendiente = await estadoRepo.findOneBy({
      nombre: 'PendienteAdopcion',
    });
    const mestizo = await razaRepo.findOneBy({ nombre: 'Mestizo' });
    const perro = await especieRepo.findOneBy({ nombre: 'Perro' });

    if (!enAdopcion || !pendiente || !mestizo || !perro) {
      throw new Error(
        'No se pudieron encontrar los datos de seed (Estado, Raza, Especie)',
      );
    }

    estadoEnAdopcionId = enAdopcion.id;
    estadoPendienteAdopcionId = pendiente.id;
    razaMestizoId = mestizo.id;
    especiePerroId = perro.id;
  });

  afterAll(async () => {
    await close();
  });

  // --- 2. LIMPIEZA ---
  beforeEach(async () => {
    // 1. Borrar la tabla "hija" (la que tiene el FK hacia animal)
    await cambioEstadoRepo.query('DELETE FROM "cambio_estado"');
    
    // 2. Borrar la tabla "madre" (la referenciada)
    await animalRepo.query('DELETE FROM "animal"');
  });

  // --- 3. TESTS ---

  describe('POST /animales', () => {
    it('(201) debe crear un nuevo animal con todos los campos', async () => {
      const dto = {
        nombre: 'Mora',
        sexo: 'Hembra',
        fechaNacimiento: '2023-01-15',
        descripcion: 'Cachorra muy juguetona',
        foto: 'http://example.com/mora.jpg',
        razaId: razaMestizoId,
        especieId: especiePerroId,
        estadoActualId: estadoEnAdopcionId,
      };

      const res = await request(app.getHttpServer())
        .post('/animales')
        .send(dto)
        .expect(201);

      // Verificamos la respuesta de la API
      expect(res.body.id).toBeDefined();
      expect(res.body.nombre).toBe('Mora');
      expect(res.body.sexo).toBe('Hembra');
      // Verifica las relaciones anidadas
      expect(res.body.estadoActual.id).toBe(estadoEnAdopcionId);
      expect(res.body.estadoActual.nombre).toBe('EnAdopcion');
      expect(res.body.raza.id).toBe(razaMestizoId);
      expect(res.body.especie.id).toBe(especiePerroId);

      // Verificamos que realmente se guardó en la DB
      const animalEnDB = await animalRepo.findOneBy({ id: res.body.id });
      expect(animalEnDB).toBeDefined();
      expect(animalEnDB?.nombre).toBe('Mora');
    });

    it('(400) debe fallar si faltan campos requeridos o el tipo es incorrecto', async () => {
      // Enviamos un tipo de dato incorrecto (nombre: numero)
      // para forzar el fallo del class-validator
      const dto = {
        nombre: 'Test de Sexo',
        sexo: 'Invalido', // <--- ESTO DEBE CAUSAR 400
        descripcion: 'Test',
        foto: 'foto.jpg',
        razaId: razaMestizoId,
        especieId: especiePerroId,
        estadoActualId: estadoEnAdopcionId,
      };

      await request(app.getHttpServer())
        .post('/animales')
        .send(dto)
        .expect(400); // <-- Este test fallará (dará 201) hasta que arregles la validación en tu app
    });
  });

  describe('GET /animales/:id', () => {
    let animalCreado;

    beforeEach(async () => {
      // --- ¡ESTA ES LA CORRECCIÓN 1! ---
      // Usamos el formato de objeto anidado para 'save'
      animalCreado = await animalRepo.save({
        nombre: 'Rocky',
        sexo: 'Macho',
        fechaNacimiento: new Date(),
        descripcion: 'Perro guardián',
        foto: 'http://example.com/rocky.jpg',
        raza: { id: razaMestizoId },
        especie: { id: especiePerroId },
        estadoActual: { id: estadoEnAdopcionId },
      });
    });

    it('(200) debe encontrar un animal existente', async () => {
      const res = await request(app.getHttpServer())
        .get(`/animales/${animalCreado.id}`)
        .expect(200);

      expect(res.body.id).toBe(animalCreado.id);
      expect(res.body.nombre).toBe('Rocky');
      // Este test asume que tu GET /:id devuelve las relaciones (por 'eager: true')
      expect(res.body.estadoActual.nombre).toBe('EnAdopcion');
    });

    it('(404) debe fallar si el animal no existe', async () => {
      // Este test asume que tu servicio lanza NotFoundException
      await request(app.getHttpServer()).get('/animales/99999').expect(404);
    });
  });

  describe('PATCH /animales/:id', () => {
    let animalCreado;

    beforeEach(async () => {
      // --- ¡ESTA ES LA CORRECCIÓN 2! ---
      // Usamos el formato de objeto anidado para 'save'
      animalCreado = await animalRepo.save({
        nombre: 'Luna',
        sexo: 'Hembra',
        fechaNacimiento: new Date(),
        descripcion: 'Muy tranquila',
        foto: 'http://example.com/luna.jpg',
        raza: { id: razaMestizoId },
        especie: { id: especiePerroId },
        estadoActual: { id: estadoEnAdopcionId },
      });
    });

    it('(200) debe actualizar un animal existente', async () => {
      const dtoUpdate = {
        descripcion: 'Ahora es muy sociable',
        estadoActualId: estadoPendienteAdopcionId,
      };

      const res = await request(app.getHttpServer())
        .patch(`/animales/${animalCreado.id}`)
        .send(dtoUpdate)
        .expect(200);

      // Verificamos la respuesta de la API
      expect(res.body.id).toBe(animalCreado.id);
      expect(res.body.descripcion).toBe('Ahora es muy sociable');
      
      // Asume que tu PATCH devuelve la entidad con relaciones
      if (res.body.estadoActual) {
         expect(res.body.estadoActual.nombre).toBe('PendienteAdopcion');
      }

      // Verificamos en la DB
      const animalEnDB = await animalRepo.findOne({
        where: { id: animalCreado.id },
        relations: ['estadoActual'], // Cargamos la relación para verificar
      });
      expect(animalEnDB?.descripcion).toBe('Ahora es muy sociable');
      expect(animalEnDB?.estadoActual.nombre).toBe('PendienteAdopcion');
    });

    it('(404) debe fallar al intentar actualizar un animal que no existe', async () => {
      // Este test asume que tu servicio lanza NotFoundException
      await request(app.getHttpServer())
        .patch('/animales/99999')
        .send({ nombre: 'Fantasma' })
        .expect(404);
    });
  });

  describe('DELETE /animales/:id', () => {
    let animalCreado;

    beforeEach(async () => {
      // --- ¡ESTA ES LA CORRECCIÓN 3! ---
      // Usamos el formato de objeto anidado para 'save'
      animalCreado = await animalRepo.save({
        nombre: 'Zeus',
        sexo: 'Macho',
        fechaNacimiento: new Date(),
        descripcion: 'Muy enérgico',
        foto: 'http://example.com/zeus.jpg',
        raza: { id: razaMestizoId },
        especie: { id: especiePerroId },
        estadoActual: { id: estadoEnAdopcionId },
      });
    });

    it('(200) debe eliminar un animal existente', async () => {
      // 1. Verificamos que existe
      const animalAntes = await animalRepo.findOneBy({ id: animalCreado.id });
      expect(animalAntes).toBeDefined();

      // 2. Ejecutamos el DELETE
      await request(app.getHttpServer())
        .delete(`/animales/${animalCreado.id}`)
        .expect(200);

      // 3. Verificamos que ya no existe en la DB
      const animalDespues = await animalRepo.findOneBy({ id: animalCreado.id });
      expect(animalDespues).toBeNull();

      await request(app.getHttpServer())
        .get(`/animales/${animalCreado.id}`)
        .expect(404);
    });

    it('(404) debe fallar al intentar eliminar un animal que no existe', async () => {
      await request(app.getHttpServer()).delete('/animales/99999').expect(404);
    });
  });
});