import { Test, TestingModule } from '@nestjs/testing';
import { DonacionInsumoService } from './donacion-insumo.service';

describe('DonacionInsumoService', () => {
  let service: DonacionInsumoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DonacionInsumoService],
    }).compile();

    service = module.get<DonacionInsumoService>(DonacionInsumoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
