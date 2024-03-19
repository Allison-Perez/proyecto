import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsistenciaFichasComponent } from './asistencia-fichas.component';

describe('AsistenciaFichasComponent', () => {
  let component: AsistenciaFichasComponent;
  let fixture: ComponentFixture<AsistenciaFichasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsistenciaFichasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AsistenciaFichasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
