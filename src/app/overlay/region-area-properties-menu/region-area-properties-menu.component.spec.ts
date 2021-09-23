import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionAreaPropertiesMenuComponent } from './region-area-properties-menu.component';

describe('RegionAreaPropertiesMenuComponent', () => {
  let component: RegionAreaPropertiesMenuComponent;
  let fixture: ComponentFixture<RegionAreaPropertiesMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegionAreaPropertiesMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegionAreaPropertiesMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
