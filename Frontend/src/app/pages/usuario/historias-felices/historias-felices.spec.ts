import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriasFelices } from './historias-felices';

describe('HistoriasFelices', () => {
  let component: HistoriasFelices;
  let fixture: ComponentFixture<HistoriasFelices>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoriasFelices]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoriasFelices);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
