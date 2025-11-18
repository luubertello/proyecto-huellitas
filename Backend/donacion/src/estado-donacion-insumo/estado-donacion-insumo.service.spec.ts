import { Test, TestingModule } from '@nestjs/testing';
import { EstadoDonacionInsumoService } from './estado-donacion-insumo.service';

describe('EstadoDonacionInsumoService', () => {
  let service: EstadoDonacionInsumoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EstadoDonacionInsumoService],
    }).compile();

    service = module.get<EstadoDonacionInsumoService>(EstadoDonacionInsumoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
