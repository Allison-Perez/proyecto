import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticsInstructoresComponent } from './statistics-instructores.component';

describe('StatisticsInstructoresComponent', () => {
  let component: StatisticsInstructoresComponent;
  let fixture: ComponentFixture<StatisticsInstructoresComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatisticsInstructoresComponent]
    });
    fixture = TestBed.createComponent(StatisticsInstructoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
