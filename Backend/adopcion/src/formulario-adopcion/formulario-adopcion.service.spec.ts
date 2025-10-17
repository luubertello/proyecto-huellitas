import { Test, TestingModule } from '@nestjs/testing';
import { FormularioAdopcionService } from './formulario-adopcion.service';

describe('FormularioAdopcionService', () => {
  let service: FormularioAdopcionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FormularioAdopcionService],
    }).compile();

    service = module.get<FormularioAdopcionService>(FormularioAdopcionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
