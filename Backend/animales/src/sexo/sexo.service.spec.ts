import { Test, TestingModule } from '@nestjs/testing';
import { SexoService } from './sexo.service';

describe('SexoService', () => {
  let service: SexoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SexoService],
    }).compile();

    service = module.get<SexoService>(SexoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
