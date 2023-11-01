import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaInstructorComponent } from './vista-instructor.component';

describe('VistaInstructorComponent', () => {
  let component: VistaInstructorComponent;
  let fixture: ComponentFixture<VistaInstructorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VistaInstructorComponent]
    });
    fixture = TestBed.createComponent(VistaInstructorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
