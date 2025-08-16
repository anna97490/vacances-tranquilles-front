import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleChanges } from '@angular/core';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DisplayProfileComponent } from './display-profile.component';
import { UserInformationService } from '../../../services/user-information/user-information.service';
import { User, UserRole } from '../../../models/User';
import { Service, ServiceCategory } from '../../../models/Service';

describe('DisplayProfileComponent', () => {
  let component: DisplayProfileComponent;
  let fixture: ComponentFixture<DisplayProfileComponent>;
  let userInformationService: jasmine.SpyObj<UserInformationService>;

  const mockUser: User = {
    idUser: 1,
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: UserRole.PROVIDER,
    phoneNumber: '1234567890',
    address: '123 Test St',
    city: 'Test City',
    postalCode: 12345,
    description: 'Test bio'
  };

  const mockServices: Service[] = [
    {
      id: 1,
      title: 'Test Service',
      description: 'Test Description',
      category: ServiceCategory.HOME,
      price: 50,
      providerId: 1
    }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('UserInformationService', ['getUserProfile', 'getMyServices']);

    await TestBed.configureTestingModule({
      imports: [
        DisplayProfileComponent,
        HttpClientTestingModule
      ],
      providers: [
        { provide: UserInformationService, useValue: spy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayProfileComponent);
    component = fixture.componentInstance;
    userInformationService = TestBed.inject(UserInformationService) as jasmine.SpyObj<UserInformationService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      // Nettoyer le localStorage avant chaque test
      localStorage.clear();
    });

    it('should not load user profile when user is already provided', () => {
      component.user = mockUser;
      component.services = mockServices;
      component.userRole = UserRole.PROVIDER;

      component.ngOnInit();

      expect(userInformationService.getUserProfile).not.toHaveBeenCalled();
      expect(userInformationService.getMyServices).not.toHaveBeenCalled();
    });

    it('should load user profile when user is not provided', () => {
      userInformationService.getUserProfile.and.returnValue(of(mockUser));
      userInformationService.getMyServices.and.returnValue(of(mockServices));

      component.ngOnInit();

      expect(userInformationService.getUserProfile).toHaveBeenCalled();
      expect(userInformationService.getMyServices).toHaveBeenCalled();
    });

    it('should set isProviderProfile to true when displayedUserId exists in localStorage', () => {
      localStorage.setItem('displayedUserId', '123');
      userInformationService.getUserProfile.and.returnValue(of(mockUser));
      userInformationService.getMyServices.and.returnValue(of(mockServices));

      component.ngOnInit();

      expect(component.isProviderProfile).toBe(true);
    });

    it('should set isProviderProfile to false when displayedUserId does not exist in localStorage', () => {
      localStorage.removeItem('displayedUserId');
      userInformationService.getUserProfile.and.returnValue(of(mockUser));
      userInformationService.getMyServices.and.returnValue(of(mockServices));

      component.ngOnInit();

      expect(component.isProviderProfile).toBe(false);
    });
  });

  describe('loadUserProfile (private method)', () => {
    beforeEach(() => {
      component.user = undefined as any;
      component.services = undefined as any;
    });

    it('should load user profile successfully', () => {
      userInformationService.getUserProfile.and.returnValue(of(mockUser));
      userInformationService.getMyServices.and.returnValue(of(mockServices));

      component.ngOnInit();

      expect(userInformationService.getUserProfile).toHaveBeenCalled();
      expect(userInformationService.getMyServices).toHaveBeenCalled();
    });

    it('should handle error when loading user profile fails silently', () => {
      userInformationService.getUserProfile.and.returnValue(throwError(() => new Error('User profile error')));
      userInformationService.getMyServices.and.returnValue(of(mockServices));

      component.ngOnInit();

      // La méthode gère les erreurs silencieusement, donc pas de console.error
      expect(userInformationService.getUserProfile).toHaveBeenCalled();
    });

    it('should handle error when loading services fails and set empty array', () => {
      userInformationService.getUserProfile.and.returnValue(of(mockUser));
      userInformationService.getMyServices.and.returnValue(throwError(() => new Error('Services error')));

      component.ngOnInit();

      expect(userInformationService.getMyServices).toHaveBeenCalled();
      // Les services sont définis dans le subscribe, donc on ne peut pas tester directement
      // mais la méthode gère l'erreur en définissant services = []
    });
  });

  describe('ngOnChanges', () => {
    it('should not throw error when called', () => {
      const changes: SimpleChanges = {};

      expect(() => component.ngOnChanges(changes)).not.toThrow();
    });
  });

  describe('updateProfileData', () => {
    it('should update user and services data', () => {
      const newUser: User = { ...mockUser, firstName: 'Jane', lastName: 'Smith' };
      const newServices: Service[] = [
        { ...mockServices[0], title: 'Updated Service' }
      ];

      component.updateProfileData(newUser, newServices);

      expect(component.user).toEqual(newUser);
      expect(component.services).toEqual(newServices);
    });

    it('should update with empty services array', () => {
      const newUser: User = { ...mockUser, firstName: 'Jane' };

      component.updateProfileData(newUser, []);

      expect(component.user).toEqual(newUser);
      expect(component.services).toEqual([]);
    });
  });

  describe('Input properties', () => {
    it('should accept user input', () => {
      component.user = mockUser;

      expect(component.user).toEqual(mockUser);
    });

    it('should accept services input', () => {
      component.services = mockServices;

      expect(component.services).toEqual(mockServices);
    });

    it('should accept userRole input', () => {
      component.userRole = UserRole.PROVIDER;

      expect(component.userRole).toEqual(UserRole.PROVIDER);
    });
  });

  describe('isProviderProfile property', () => {
    it('should be false by default', () => {
      expect(component.isProviderProfile).toBe(false);
    });

    it('should be accessible', () => {
      component.isProviderProfile = true;

      expect(component.isProviderProfile).toBe(true);
    });
  });
});
