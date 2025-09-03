import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonaDinero } from './dona-dinero';

describe('DonaDinero', () => {
  let component: DonaDinero;
  let fixture: ComponentFixture<DonaDinero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonaDinero]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DonaDinero);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
