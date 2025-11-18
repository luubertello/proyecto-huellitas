import { Test, TestingModule } from '@nestjs/testing';
import { CategoriaInsumoService } from './categoria-insumo.service';

describe('CategoriaInsumoService', () => {
  let service: CategoriaInsumoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoriaInsumoService],
    }).compile();

    service = module.get<CategoriaInsumoService>(CategoriaInsumoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
