import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexKatalinaComponent } from './index.katalina.component';

describe('IndexKatalinaComponent', () => {
  let component: IndexKatalinaComponent;
  let fixture: ComponentFixture<IndexKatalinaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IndexKatalinaComponent]
    });
    fixture = TestBed.createComponent(IndexKatalinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
