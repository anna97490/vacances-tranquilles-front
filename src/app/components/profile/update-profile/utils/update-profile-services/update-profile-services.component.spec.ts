import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProfileServicesComponent } from './update-profile-services.component';

describe('UpdateProfileServicesComponent', () => {
  let component: UpdateProfileServicesComponent;
  let fixture: ComponentFixture<UpdateProfileServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateProfileServicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateProfileServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
