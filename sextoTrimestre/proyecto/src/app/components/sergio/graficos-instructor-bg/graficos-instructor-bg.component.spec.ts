import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficosInstructorBGComponent } from './graficos-instructor-bg.component';

describe('GraficosInstructorBGComponent', () => {
  let component: GraficosInstructorBGComponent;
  let fixture: ComponentFixture<GraficosInstructorBGComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraficosInstructorBGComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GraficosInstructorBGComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
