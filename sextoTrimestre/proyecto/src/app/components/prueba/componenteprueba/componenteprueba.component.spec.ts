import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentepruebaComponent } from './componenteprueba.component';

describe('ComponentepruebaComponent', () => {
  let component: ComponentepruebaComponent;
  let fixture: ComponentFixture<ComponentepruebaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ComponentepruebaComponent]
    });
    fixture = TestBed.createComponent(ComponentepruebaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
