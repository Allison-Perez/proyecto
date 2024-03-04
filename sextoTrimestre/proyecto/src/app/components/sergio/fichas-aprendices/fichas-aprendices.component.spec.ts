import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichasAprendicesComponent } from './fichas-aprendices.component';

describe('FichasAprendicesComponent', () => {
  let component: FichasAprendicesComponent;
  let fixture: ComponentFixture<FichasAprendicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FichasAprendicesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FichasAprendicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
