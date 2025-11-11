import { Test, TestingModule } from '@nestjs/testing';
import { DonacionMonetariaService } from './donacion-monetaria.service';

describe('DonacionMonetariaService', () => {
  let service: DonacionMonetariaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DonacionMonetariaService],
    }).compile();

    service = module.get<DonacionMonetariaService>(DonacionMonetariaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
