import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonCategoryManagementComponent } from './person-category-management.component';

describe('PersonCategoryManagementComponent', () => {
  let component: PersonCategoryManagementComponent;
  let fixture: ComponentFixture<PersonCategoryManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonCategoryManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonCategoryManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
