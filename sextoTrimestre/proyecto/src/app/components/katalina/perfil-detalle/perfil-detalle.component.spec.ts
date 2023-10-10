import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilDetalleComponent } from './perfil-detalle.component';

describe('PerfilDetalleComponent', () => {
  let component: PerfilDetalleComponent;
  let fixture: ComponentFixture<PerfilDetalleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PerfilDetalleComponent]
    });
    fixture = TestBed.createComponent(PerfilDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
