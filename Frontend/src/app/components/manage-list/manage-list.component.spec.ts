import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageListComponent } from './manage-list.component';

describe('ManageListComponent', () => {
  let component: ManageListComponent;
  let fixture: ComponentFixture<ManageListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
