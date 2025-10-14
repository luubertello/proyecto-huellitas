import { Test, TestingModule } from '@nestjs/testing';
import { AnimalService } from './animal.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Animal } from './animal.entity';
import { Repository } from 'typeorm';
import { Especie } from '../especie/especie.entity';
import { Estado } from '../estado/estado.entity';
import { Raza } from '../raza/raza.entity';
import { Sexo } from '../sexo/sexo.entity';

describe('AnimalService', () => {
  let service: AnimalService;
  let repo: Repository<Animal>;

  const mockRepo = {
    findOne: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnimalService,
        { provide: getRepositoryToken(Animal), useValue: mockRepo },
        { provide: getRepositoryToken(Especie), useValue: {} },
        { provide: getRepositoryToken(Estado), useValue: {} },
        { provide: getRepositoryToken(Raza), useValue: {} },
        { provide: getRepositoryToken(Sexo), useValue: {} },
      ],
    }).compile();

    service = module.get<AnimalService>(AnimalService);
    repo = module.get<Repository<Animal>>(getRepositoryToken(Animal));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ================== PRUEBAS findAll ==================
  describe('findAll', () => {
    it('debería devolver todos los animales con relaciones', async () => {
      const animalesMock = [
        {
          id: 1,
          nombre: 'Luna',
          especie: { id: 1, nombre: 'Perro' },
          raza: { id: 3, nombre: 'Labrador' },
          sexo: { id: 2, nombre: 'Hembra' },
          estadoActual: { id: 1, nombre: 'EnAdopcion' },
          cambiosEstado: [],
        },
        {
          id: 2,
          nombre: 'Michi',
          especie: { id: 2, nombre: 'Gato' },
          raza: { id: 2, nombre: 'Persa' },
          sexo: { id: 1, nombre: 'Macho' },
          estadoActual: { id: 1, nombre: 'EnAdopcion' },
          cambiosEstado: [],
        },
      ];

      mockRepo.find.mockResolvedValue(animalesMock);

      const resultado = await service.findAll();
      expect(resultado).toEqual(animalesMock);
      expect(mockRepo.find).toHaveBeenCalledWith({
        relations: ['especie', 'estadoActual', 'raza', 'sexo', 'cambiosEstado'],
      });
    });

    it('debería devolver un array vacío si no hay animales', async () => {
      mockRepo.find.mockResolvedValue([]);
      const resultado = await service.findAll();
      expect(resultado).toEqual([]);
    });
  });

  // ================== PRUEBAS findOne ==================
  describe('findOne', () => {
    it('debería devolver el animal con todas sus relaciones', async () => {
      const animalMock = {
        id: 1,
        nombre: 'Luna',
        especie: { id: 1, nombre: 'Perro' },
        raza: { id: 3, nombre: 'Labrador' },
        sexo: { id: 2, nombre: 'Hembra' },
        estadoActual: { id: 1, nombre: 'EnAdopcion' },
        cambiosEstado: [],
      };

      mockRepo.findOne.mockResolvedValue(animalMock);

      const resultado = await service.findOne(1);
      expect(resultado).toEqual(animalMock);
      expect(mockRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['especie', 'estadoActual', 'raza', 'sexo', 'cambiosEstado'],
      });
    });

    it('debería dar error si no existe el animal', async () => {
      mockRepo.findOne.mockResolvedValue(undefined);

      await expect(service.findOne(999)).rejects.toThrow('Animal no encontrado');
    });
  });
});
