import { Test, TestingModule } from '@nestjs/testing';
import { RazaService } from './raza.service';

describe('RazaService', () => {
  let service: RazaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RazaService],
    }).compile();

    service = module.get<RazaService>(RazaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
