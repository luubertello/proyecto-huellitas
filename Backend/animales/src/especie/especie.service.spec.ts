import { Test, TestingModule } from '@nestjs/testing';
import { EspecieService } from './especie.service';

describe('EspecieService', () => {
  let service: EspecieService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EspecieService],
    }).compile();

    service = module.get<EspecieService>(EspecieService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
