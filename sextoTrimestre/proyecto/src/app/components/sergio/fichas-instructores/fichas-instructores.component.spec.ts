import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichasInstructoresComponent } from './fichas-instructores.component';

describe('FichasInstructoresComponent', () => {
  let component: FichasInstructoresComponent;
  let fixture: ComponentFixture<FichasInstructoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FichasInstructoresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FichasInstructoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
