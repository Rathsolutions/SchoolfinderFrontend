import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaManagementComponent } from './area-management.component';

describe('AreaManagementComponent', () => {
  let component: AreaManagementComponent;
  let fixture: ComponentFixture<AreaManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AreaManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
