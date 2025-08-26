import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarAnimales } from './gestionar-animales';

describe('GestionarAnimales', () => {
  let component: GestionarAnimales;
  let fixture: ComponentFixture<GestionarAnimales>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarAnimales]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionarAnimales);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
