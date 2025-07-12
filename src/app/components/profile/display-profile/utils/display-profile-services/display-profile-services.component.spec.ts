import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayProfileServicesComponent } from './display-profile-services.component';

describe('DisplayProfileServicesComponent', () => {
  let component: DisplayProfileServicesComponent;
  let fixture: ComponentFixture<DisplayProfileServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayProfileServicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayProfileServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
