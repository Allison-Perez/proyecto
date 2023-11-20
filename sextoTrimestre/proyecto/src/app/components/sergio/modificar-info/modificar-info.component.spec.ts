import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarInfoComponent } from './modificar-info.component';

describe('ModificarInfoComponent', () => {
  let component: ModificarInfoComponent;
  let fixture: ComponentFixture<ModificarInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModificarInfoComponent]
    });
    fixture = TestBed.createComponent(ModificarInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
