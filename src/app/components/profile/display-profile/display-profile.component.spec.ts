import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
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
      imports: [DisplayProfileComponent],
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
    it('should not load user profile when user is already provided', () => {
      // Arrange
      component.user = mockUser;
      component.services = mockServices;
      component.userRole = UserRole.PROVIDER;

      // Act
      component.ngOnInit();

      // Assert
      expect(userInformationService.getUserProfile).not.toHaveBeenCalled();
      expect(userInformationService.getMyServices).not.toHaveBeenCalled();
    });

    it('should load user profile when user is not provided', () => {
      // Arrange
      userInformationService.getUserProfile.and.returnValue(of(mockUser));
      userInformationService.getMyServices.and.returnValue(of(mockServices));

      // Act
      component.ngOnInit();

      // Assert
      expect(userInformationService.getUserProfile).toHaveBeenCalled();
      expect(userInformationService.getMyServices).toHaveBeenCalled();
    });
  });

  describe('loadUserProfile', () => {
    beforeEach(() => {
      // Reset component state
      component.user = undefined as any;
      component.services = undefined as any;
    });

    it('should load user profile successfully', () => {
      // Arrange
      userInformationService.getUserProfile.and.returnValue(of(mockUser));
      userInformationService.getMyServices.and.returnValue(of(mockServices));

      // Act
      component['loadUserProfile']();

      // Assert
      expect(userInformationService.getUserProfile).toHaveBeenCalled();
      expect(userInformationService.getMyServices).toHaveBeenCalled();
    });

    it('should handle error when loading user profile fails', () => {
      // Arrange
      const consoleSpy = spyOn(console, 'error');
      userInformationService.getUserProfile.and.returnValue(throwError(() => new Error('User profile error')));
      userInformationService.getMyServices.and.returnValue(of(mockServices));

      // Act
      component['loadUserProfile']();

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith('Erreur lors du chargement du profil utilisateur:', jasmine.any(Error));
    });

    it('should handle error when loading services fails', () => {
      // Arrange
      const consoleSpy = spyOn(console, 'error');
      userInformationService.getUserProfile.and.returnValue(of(mockUser));
      userInformationService.getMyServices.and.returnValue(throwError(() => new Error('Services error')));

      // Act
      component['loadUserProfile']();

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith('Erreur lors du chargement des services:', jasmine.any(Error));
      expect(component.services).toEqual([]);
    });

    it('should handle both user profile and services errors', () => {
      // Arrange
      const consoleSpy = spyOn(console, 'error');
      userInformationService.getUserProfile.and.returnValue(throwError(() => new Error('User profile error')));
      userInformationService.getMyServices.and.returnValue(throwError(() => new Error('Services error')));

      // Act
      component['loadUserProfile']();

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith('Erreur lors du chargement du profil utilisateur:', jasmine.any(Error));
      expect(consoleSpy).toHaveBeenCalledWith('Erreur lors du chargement des services:', jasmine.any(Error));
      expect(component.services).toEqual([]);
    });
  });

  describe('updateProfileData', () => {
    it('should update user and services data', () => {
      // Arrange
      const newUser: User = { ...mockUser, firstName: 'Jane', lastName: 'Smith' };
      const newServices: Service[] = [
        { ...mockServices[0], title: 'Updated Service' }
      ];

      // Act
      component.updateProfileData(newUser, newServices);

      // Assert
      expect(component.user).toEqual(newUser);
      expect(component.services).toEqual(newServices);
    });

    it('should update with empty services array', () => {
      // Arrange
      const newUser: User = { ...mockUser, firstName: 'Jane' };

      // Act
      component.updateProfileData(newUser, []);

      // Assert
      expect(component.user).toEqual(newUser);
      expect(component.services).toEqual([]);
    });
  });

  describe('Input properties', () => {
    it('should accept user input', () => {
      // Arrange & Act
      component.user = mockUser;

      // Assert
      expect(component.user).toEqual(mockUser);
    });

    it('should accept services input', () => {
      // Arrange & Act
      component.services = mockServices;

      // Assert
      expect(component.services).toEqual(mockServices);
    });

    it('should accept userRole input', () => {
      // Arrange & Act
      component.userRole = UserRole.PROVIDER;

      // Assert
      expect(component.userRole).toEqual(UserRole.PROVIDER);
    });
  });
});
