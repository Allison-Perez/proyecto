import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPerfilComponent } from './admin-perfil.component';

describe('AdminPerfilComponent', () => {
  let component: AdminPerfilComponent;
  let fixture: ComponentFixture<AdminPerfilComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminPerfilComponent]
    });
    fixture = TestBed.createComponent(AdminPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
