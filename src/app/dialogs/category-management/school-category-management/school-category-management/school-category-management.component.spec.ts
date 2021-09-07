import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolCategoryManagementComponent } from './school-category-management.component';

describe('SchoolCategoryManagementComponent', () => {
  let component: SchoolCategoryManagementComponent;
  let fixture: ComponentFixture<SchoolCategoryManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchoolCategoryManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolCategoryManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
