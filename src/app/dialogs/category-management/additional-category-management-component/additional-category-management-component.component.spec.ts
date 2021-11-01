import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalCategoryManagementComponentComponent } from './additional-category-management-component.component';

describe('AdditionalCategoryManagementComponentComponent', () => {
  let component: AdditionalCategoryManagementComponentComponent;
  let fixture: ComponentFixture<AdditionalCategoryManagementComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdditionalCategoryManagementComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalCategoryManagementComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
