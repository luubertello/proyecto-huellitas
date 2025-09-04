import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioHeader } from './usuario-header';

describe('UsuarioHeader', () => {
  let component: UsuarioHeader;
  let fixture: ComponentFixture<UsuarioHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuarioHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuarioHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
