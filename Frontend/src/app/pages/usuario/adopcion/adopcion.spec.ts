import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Adopcion } from './adopcion';

describe('Adopcion', () => {
  let component: Adopcion;
  let fixture: ComponentFixture<Adopcion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Adopcion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Adopcion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
