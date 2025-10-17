import { Test, TestingModule } from '@nestjs/testing';
import { FormularioAdopcionController } from './formulario-adopcion.controller';

describe('FormularioAdopcionController', () => {
  let controller: FormularioAdopcionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormularioAdopcionController],
    }).compile();

    controller = module.get<FormularioAdopcionController>(FormularioAdopcionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
