import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProviderCardComponent } from './provider-card.component';
import { ServiceCategory } from '../../models/Service';
import { User, UserRole } from '../../models/User';
import { SimpleChange } from '@angular/core';

describe('ProviderCardComponent', () => {
  let component: ProviderCardComponent;
  let fixture: ComponentFixture<ProviderCardComponent>;

  const mockUser = new User({
    idUser: 101,
    firstName: 'Marie',
    lastName: 'Dubois',
    email: 'marie@test.com',
    phoneNumber: '0600000001',
    address: '10 rue du Test',
    role: UserRole.PROVIDER,
    city: 'Lyon',
    postalCode: 69000,
    password: ''
  });

  const mockService = {
    id: 2,
    title: 'Tonte de pelouse',
    description: 'Coupe et entretien du gazon',
    category: ServiceCategory.OUTDOOR,
    price: 45,
    providerId: 101
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProviderCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ProviderCardComponent);
    component = fixture.componentInstance;

    component.service = mockService;
    component.providerInfo = mockUser;

    component.ngOnChanges({
      service: new SimpleChange(null, mockService, true),
      providerInfo: new SimpleChange(null, mockUser, true)
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

it('should display the service description', () => {
  const compiled = fixture.nativeElement as HTMLElement;
  const description = compiled.querySelector('.description');

  expect(description?.textContent).toContain('Coupe et entretien du gazon');
});

  it('should not crash if description is undefined', () => {
    if (component.service) {
      component.service.description = undefined;
    }

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).not.toContain('undefined');
  });

  it('should display the service price with euro symbol', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('€');
    expect(compiled.textContent).toContain('45');
  });

  it('should not crash if service is undefined', () => {
    component.service = undefined as any;

    component.ngOnChanges({
      service: new SimpleChange(mockService, undefined, false)
    });

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).not.toContain('undefined');
  });

  it('should update user when providerInfo is set after service', () => {
    component.service = mockService;
    component.providerInfo = mockUser;

    component.ngOnChanges({
      service: new SimpleChange(null, mockService, true),
      providerInfo: new SimpleChange(null, mockUser, true)
    });

    expect(component.user).toEqual(mockUser);
  });

  it('should display user full name when user is provided', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const name = compiled.querySelector('.name');
    expect(name?.textContent).toContain('Marie Dubois');
  });

  it('should display "Voir le profil" button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('.profile-btn');
    expect(button?.textContent).toContain('Voir le profil');
  });

  it('should include app-rating-stars component', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const ratingStars = compiled.querySelector('app-rating-stars');
    expect(ratingStars).not.toBeNull();
  });

  it('should display reserve button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const reserveBtn = compiled.querySelector('.reserve-btn');
    expect(reserveBtn).not.toBeNull();
  });
});
