import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProfileHeaderComponent } from './update-profile-header.component';

describe('UpdateProfileHeaderComponent', () => {
  let component: UpdateProfileHeaderComponent;
  let fixture: ComponentFixture<UpdateProfileHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateProfileHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateProfileHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
