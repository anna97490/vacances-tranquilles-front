import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { TermsAndConditionsComponent } from './terms-and-conditions.component';

describe('TermsAndConditionsComponent', () => {
  let component: TermsAndConditionsComponent;
  let fixture: ComponentFixture<TermsAndConditionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TermsAndConditionsComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}), // ou ce que tu attends comme données
            snapshot: {},
          },
        },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TermsAndConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
