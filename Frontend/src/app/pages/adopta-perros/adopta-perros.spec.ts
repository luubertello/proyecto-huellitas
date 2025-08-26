import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdoptaPerros } from './adopta-perros';

describe('AdoptaPerros', () => {
  let component: AdoptaPerros;
  let fixture: ComponentFixture<AdoptaPerros>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdoptaPerros]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdoptaPerros);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
