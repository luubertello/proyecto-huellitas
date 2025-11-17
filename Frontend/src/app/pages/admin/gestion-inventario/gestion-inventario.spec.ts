import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionInventario } from './gestion-inventario';

describe('GestionInventario', () => {
  let component: GestionInventario;
  let fixture: ComponentFixture<GestionInventario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionInventario]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionInventario);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
