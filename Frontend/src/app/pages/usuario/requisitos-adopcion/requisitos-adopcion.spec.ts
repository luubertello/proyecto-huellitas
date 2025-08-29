import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequisitosAdopcion } from './requisitos-adopcion';

describe('RequisitosAdopcion', () => {
  let component: RequisitosAdopcion;
  let fixture: ComponentFixture<RequisitosAdopcion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequisitosAdopcion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequisitosAdopcion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
