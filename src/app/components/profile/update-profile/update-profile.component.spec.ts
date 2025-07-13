import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeProfileComponent } from './change-profile.component';

describe('ChangeProfileComponent', () => {
  let component: ChangeProfileComponent;
  let fixture: ComponentFixture<ChangeProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
