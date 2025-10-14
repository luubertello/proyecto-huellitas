import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarInsumo } from './registrar-insumo';

describe('RegistrarInsumo', () => {
  let component: RegistrarInsumo;
  let fixture: ComponentFixture<RegistrarInsumo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarInsumo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarInsumo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
