import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotarizeComponent } from './notarize.component';

describe('NotarizeComponent', () => {
  let component: NotarizeComponent;
  let fixture: ComponentFixture<NotarizeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotarizeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotarizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
