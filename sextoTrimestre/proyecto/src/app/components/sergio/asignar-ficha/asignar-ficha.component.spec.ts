import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarFichaComponent } from './asignar-ficha.component';

describe('AsignarFichaComponent', () => {
  let component: AsignarFichaComponent;
  let fixture: ComponentFixture<AsignarFichaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsignarFichaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AsignarFichaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
