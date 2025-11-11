import { Test, TestingModule } from '@nestjs/testing';
import { EstadoInsumoService } from './estado-insumo.service';

describe('EstadoInsumoService', () => {
  let service: EstadoInsumoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EstadoInsumoService],
    }).compile();

    service = module.get<EstadoInsumoService>(EstadoInsumoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
