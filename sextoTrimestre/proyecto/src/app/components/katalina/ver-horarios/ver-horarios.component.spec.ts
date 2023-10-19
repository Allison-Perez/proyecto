import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerHorariosComponent } from './ver-horarios.component';

describe('VerHorariosComponent', () => {
  let component: VerHorariosComponent;
  let fixture: ComponentFixture<VerHorariosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerHorariosComponent]
    });
    fixture = TestBed.createComponent(VerHorariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
