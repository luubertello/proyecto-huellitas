import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdoptaGatos } from './adopta-gatos';

describe('AdoptaGatos', () => {
  let component: AdoptaGatos;
  let fixture: ComponentFixture<AdoptaGatos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdoptaGatos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdoptaGatos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
