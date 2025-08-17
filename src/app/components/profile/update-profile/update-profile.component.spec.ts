import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { UpdateProfileComponent } from './update-profile.component';
import { UserInformationService } from '../../../services/user-information/user-information.service';
import { User } from '../../../models/User';
import { Service, ServiceCategory } from '../../../models/Service';
import { UserRole } from '../../../models/User';


describe('UpdateProfileComponent', () => {
  let component: UpdateProfileComponent;
  let fixture: ComponentFixture<UpdateProfileComponent>;
  let mockUserInformationService: jasmine.SpyObj<UserInformationService>;
  let mockUser: User;
  let mockServices: Service[];

  beforeEach(async () => {
    const userInfoSpy = jasmine.createSpyObj('UserInformationService', [
      'getUserProfileWithServices',
      'getMyServices',
      'updateUserProfile'
    ]);

    await TestBed.configureTestingModule({
      imports: [UpdateProfileComponent],
      providers: [
        { provide: UserInformationService, useValue: userInfoSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateProfileComponent);
    component = fixture.componentInstance;
    mockUserInformationService = TestBed.inject(UserInformationService) as jasmine.SpyObj<UserInformationService>;

    mockUser = {
      idUser: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: '0612345678',
      city: 'Paris',
      description: 'Test description',
      role: UserRole.CLIENT,
      address: '123 Test Street',
      postalCode: 75000,
      companyName: '',
      siretSiren: ''
    };

    mockServices = [];
    component.user = mockUser;
    component.services = mockServices;
    component.userRole = UserRole.CLIENT;

    spyOn(console, 'error').and.stub();
    spyOn(console, 'log').and.stub();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load user profile if not provided', () => {
      component.user = undefined as any;
      component.services = undefined as any;
      mockUserInformationService.getUserProfileWithServices.and.returnValue(of({ user: mockUser, services: mockServices }));
      mockUserInformationService.getMyServices.and.returnValue(of(mockServices));

      component.ngOnInit();

      expect(mockUserInformationService.getUserProfileWithServices).toHaveBeenCalled();
      expect(mockUserInformationService.getMyServices).toHaveBeenCalled();
    });

    it('should not load user profile if already provided', () => {
      component.user = mockUser;
      component.services = mockServices;

      component.ngOnInit();

      expect(mockUserInformationService.getUserProfileWithServices).not.toHaveBeenCalled();
      expect(mockUserInformationService.getMyServices).not.toHaveBeenCalled();
    });

    it('should handle error when loading user profile', () => {
      component.user = undefined as any;
      component.services = undefined as any;
      mockUserInformationService.getUserProfileWithServices.and.returnValue(throwError(() => new Error('Network error')));
      mockUserInformationService.getMyServices.and.returnValue(of(mockServices));

      component.ngOnInit();

      expect(mockUserInformationService.getUserProfileWithServices).toHaveBeenCalled();
      expect(mockUserInformationService.getMyServices).toHaveBeenCalled();
    });

    it('should handle error when loading services', () => {
      component.user = undefined as any;
      component.services = undefined as any;
      mockUserInformationService.getUserProfileWithServices.and.returnValue(of({ user: mockUser, services: mockServices }));
      mockUserInformationService.getMyServices.and.returnValue(throwError(() => new Error('Services error')));

      component.ngOnInit();

      expect(mockUserInformationService.getUserProfileWithServices).toHaveBeenCalled();
      expect(mockUserInformationService.getMyServices).toHaveBeenCalled();
    });

    it('should handle both errors when loading profile and services', () => {
      component.user = undefined as any;
      component.services = undefined as any;

      mockUserInformationService.getUserProfileWithServices.and.returnValue(throwError(() => new Error('Profile error')));
      mockUserInformationService.getMyServices.and.returnValue(throwError(() => new Error('Services error')));

      component.ngOnInit();

      expect(mockUserInformationService.getUserProfileWithServices).toHaveBeenCalled();
      expect(mockUserInformationService.getMyServices).toHaveBeenCalled();
    });
  });

  describe('onUserChange', () => {
    it('should emit user change when user is updated', () => {
      spyOn(component.profileDataChange, 'emit');
      const newUser = { ...mockUser, firstName: 'Jane' };

      component.onUserChange(newUser);

      expect(component.user).toEqual(newUser);
      expect(component.profileDataChange.emit).toHaveBeenCalledWith({ user: newUser });
    });

    it('should handle user change with different properties', () => {
      spyOn(component.profileDataChange, 'emit');
      const newUser = {
        ...mockUser,
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com'
      };

      component.onUserChange(newUser);

      expect(component.user).toEqual(newUser);
      expect(component.profileDataChange.emit).toHaveBeenCalledWith({ user: newUser });
    });

    it('should handle user change with undefined user', () => {
      spyOn(component.profileDataChange, 'emit');
      const newUser = undefined as any;

      component.onUserChange(newUser);

      expect(component.user).toBeUndefined();
      expect(component.profileDataChange.emit).toHaveBeenCalledWith({ user: undefined });
    });
  });

  describe('onServicesChange', () => {
    it('should emit services change when services are updated', () => {
      spyOn(component.profileDataChange, 'emit');
      const newServices: Service[] = [{
        id: 1,
        title: 'Test Service',
        category: ServiceCategory.HOME,
        price: 50,
        providerId: 1
      }];

      component.onServicesChange(newServices);

      expect(component.services).toEqual(newServices);
      expect(component.profileDataChange.emit).toHaveBeenCalledWith({ services: newServices });
    });

    it('should handle empty services array', () => {
      spyOn(component.profileDataChange, 'emit');
      const newServices: Service[] = [];

      component.onServicesChange(newServices);

      expect(component.services).toEqual(newServices);
      expect(component.profileDataChange.emit).toHaveBeenCalledWith({ services: newServices });
    });

    it('should handle multiple services', () => {
      spyOn(component.profileDataChange, 'emit');
      const newServices: Service[] = [
        {
          id: 1,
          title: 'Service 1',
          category: ServiceCategory.HOME,
          price: 50,
          providerId: 1
        },
        {
          id: 2,
          title: 'Service 2',
          category: ServiceCategory.OUTDOOR,
          price: 75,
          providerId: 1
        }
      ];

      component.onServicesChange(newServices);

      expect(component.services).toEqual(newServices);
      expect(component.profileDataChange.emit).toHaveBeenCalledWith({ services: newServices });
    });

    it('should handle undefined services', () => {
      spyOn(component.profileDataChange, 'emit');
      const newServices = undefined as any;

      component.onServicesChange(newServices);

      expect(component.services).toBeUndefined();
      expect(component.profileDataChange.emit).toHaveBeenCalledWith({ services: undefined });
    });
  });

  describe('onHeaderValidationError', () => {
    it('should emit validation error when header validation fails', () => {
      spyOn(component.validationError, 'emit');
      const errorMessage = 'Validation error';

      component.onHeaderValidationError(errorMessage);

      expect(component.validationError.emit).toHaveBeenCalledWith(errorMessage);
    });

    it('should handle different error messages', () => {
      spyOn(component.validationError, 'emit');
      const errorMessages = [
        'Email is required',
        'Phone number is invalid',
        'First name is too short'
      ];

      errorMessages.forEach(message => {
        component.onHeaderValidationError(message);
        expect(component.validationError.emit).toHaveBeenCalledWith(message);
      });
    });

    it('should handle empty error message', () => {
      spyOn(component.validationError, 'emit');
      const errorMessage = '';

      component.onHeaderValidationError(errorMessage);

      expect(component.validationError.emit).toHaveBeenCalledWith('');
    });

    it('should handle undefined error message', () => {
      spyOn(component.validationError, 'emit');
      const errorMessage = undefined as any;

      component.onHeaderValidationError(errorMessage);

      expect(component.validationError.emit).toHaveBeenCalledWith(undefined);
    });
  });

  describe('validateForm', () => {
    it('should return false when form validation fails', () => {
      component.headerComponent = {
        validateForm: jasmine.createSpy('validateForm').and.returnValue(false)
      } as any;

      const result = component.validateForm();

      expect(result).toBeFalse();
      expect(component.headerComponent.validateForm).toHaveBeenCalled();
    });

    it('should return true when form validation passes', () => {
      component.headerComponent = {
        validateForm: jasmine.createSpy('validateForm').and.returnValue(true)
      } as any;

      const result = component.validateForm();

      expect(result).toBeTrue();
      expect(component.headerComponent.validateForm).toHaveBeenCalled();
    });

    it('should return true when headerComponent is not available', () => {
      component.headerComponent = undefined as any;

      const result = component.validateForm();

      expect(result).toBeTrue();
    });

    it('should return true when headerComponent is undefined', () => {
      component.headerComponent = undefined as any;

      const result = component.validateForm();

      expect(result).toBeTrue();
    });
  });

  describe('saveProfile', () => {
    it('should return false when form validation fails', (done) => {
      spyOn(component, 'validateForm').and.returnValue(false);
      spyOn(component.saveSuccess, 'emit');
      spyOn(component.saveError, 'emit');

      component.saveProfile().subscribe(result => {
        expect(result).toBeFalse();
        expect(component.saveSuccess.emit).not.toHaveBeenCalled();
        expect(component.saveError.emit).not.toHaveBeenCalled();
        done();
      });
    });

    it('should return true and emit success when saveProfile succeeds', (done) => {
      spyOn(component, 'validateForm').and.returnValue(true);
      spyOn(component.saveSuccess, 'emit');
      spyOn(component.saveError, 'emit');
      spyOn(component.profileDataChange, 'emit');
      const updatedProfile = { user: mockUser, services: mockServices };
      mockUserInformationService.updateUserProfile.and.returnValue(of(updatedProfile));

      component.saveProfile().subscribe(result => {
        expect(result).toBeTrue();
        expect(component.saveSuccess.emit).toHaveBeenCalled();
        expect(component.saveError.emit).not.toHaveBeenCalled();
        expect(mockUserInformationService.updateUserProfile).toHaveBeenCalled();
        expect(component.profileDataChange.emit).toHaveBeenCalledWith({ user: mockUser, services: mockServices });
        done();
      });
    });

    it('should return false and emit error when saveProfile fails', (done) => {
      spyOn(component, 'validateForm').and.returnValue(true);
      spyOn(component.saveSuccess, 'emit');
      spyOn(component.saveError, 'emit');

      mockUserInformationService.updateUserProfile.and.returnValue(throwError(() => new Error('Network error')));

      component.saveProfile().subscribe(result => {
        expect(result).toBeFalse();
        expect(component.saveSuccess.emit).not.toHaveBeenCalled();
        expect(component.saveError.emit).toHaveBeenCalledWith('Erreur lors de la sauvegarde du profil');
        done();
      });
    });

    it('should create correct UpdateUser when saving', (done) => {
      spyOn(component, 'validateForm').and.returnValue(true);
      spyOn(component.saveSuccess, 'emit');
      spyOn(component.saveError, 'emit');

      const updatedProfile = { user: mockUser, services: mockServices };
      mockUserInformationService.updateUserProfile.and.returnValue(of(updatedProfile));

      component.saveProfile().subscribe(() => {
        expect(mockUserInformationService.updateUserProfile).toHaveBeenCalledWith({
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
          email: mockUser.email,
          phoneNumber: mockUser.phoneNumber,
          address: mockUser.address,
          city: mockUser.city,
          postalCode: mockUser.postalCode,
          siretSiren: mockUser.siretSiren,
          companyName: mockUser.companyName,
          rcNumber: mockUser.rcNumber,
          kbisUrl: mockUser.kbisUrl,
          autoEntrepreneurAttestationUrl: mockUser.autoEntrepreneurAttestationUrl,
          insuranceCertificateUrl: mockUser.insuranceCertificateUrl,
          description: mockUser.description
        });
        done();
      });
    });

    it('should handle user with all optional fields', (done) => {
      spyOn(component, 'validateForm').and.returnValue(true);
      spyOn(component.saveSuccess, 'emit');
      spyOn(component.saveError, 'emit');

      const userWithAllFields = {
        ...mockUser,
        rcNumber: 'RC123456',
        kbisUrl: 'https://example.com/kbis.pdf',
        autoEntrepreneurAttestationUrl: 'https://example.com/attestation.pdf',
        insuranceCertificateUrl: 'https://example.com/insurance.pdf'
      };
      component.user = userWithAllFields;
      const updatedProfile = { user: userWithAllFields, services: mockServices };
      mockUserInformationService.updateUserProfile.and.returnValue(of(updatedProfile));

      component.saveProfile().subscribe(() => {
        expect(mockUserInformationService.updateUserProfile).toHaveBeenCalledWith({
          firstName: userWithAllFields.firstName,
          lastName: userWithAllFields.lastName,
          email: userWithAllFields.email,
          phoneNumber: userWithAllFields.phoneNumber,
          address: userWithAllFields.address,
          city: userWithAllFields.city,
          postalCode: userWithAllFields.postalCode,
          siretSiren: userWithAllFields.siretSiren,
          companyName: userWithAllFields.companyName,
          rcNumber: userWithAllFields.rcNumber,
          kbisUrl: userWithAllFields.kbisUrl,
          autoEntrepreneurAttestationUrl: userWithAllFields.autoEntrepreneurAttestationUrl,
          insuranceCertificateUrl: userWithAllFields.insuranceCertificateUrl,
          description: userWithAllFields.description
        });
        done();
      });
    });

    it('should handle user with minimal fields', (done) => {
      spyOn(component, 'validateForm').and.returnValue(true);
      spyOn(component.saveSuccess, 'emit');
      spyOn(component.saveError, 'emit');

      const minimalUser = {
        idUser: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phoneNumber: '0612345678',
        city: 'Paris',
        role: UserRole.CLIENT,
        address: '123 Test Street',
        postalCode: 75000
      } as User;
      component.user = minimalUser;
      const updatedProfile = { user: minimalUser, services: mockServices };
      mockUserInformationService.updateUserProfile.and.returnValue(of(updatedProfile));

      component.saveProfile().subscribe(() => {
        expect(mockUserInformationService.updateUserProfile).toHaveBeenCalledWith({
          firstName: minimalUser.firstName,
          lastName: minimalUser.lastName,
          email: minimalUser.email,
          phoneNumber: minimalUser.phoneNumber,
          address: minimalUser.address,
          city: minimalUser.city,
          postalCode: minimalUser.postalCode,
          siretSiren: undefined,
          companyName: undefined,
          rcNumber: undefined,
          kbisUrl: undefined,
          autoEntrepreneurAttestationUrl: undefined,
          insuranceCertificateUrl: undefined,
          description: undefined
        });
        done();
      });
    });
  });

  describe('Component Input/Output', () => {
    it('should handle different user roles', () => {
      const roles = [UserRole.CLIENT, UserRole.PROVIDER];

      roles.forEach(role => {
        component.userRole = role;
        expect(component.userRole).toBe(role);
      });
    });

    it('should handle different user inputs', () => {
      const differentUsers = [
        { ...mockUser, firstName: 'Alice' },
        { ...mockUser, firstName: 'Bob', lastName: 'Smith' },
        { ...mockUser, email: 'test@example.com' }
      ];

      differentUsers.forEach(user => {
        component.user = user;
        expect(component.user).toEqual(user);
      });
    });

    it('should handle different services inputs', () => {
      const differentServices = [
        [],
        [{ id: 1, title: 'Service 1', category: ServiceCategory.HOME, price: 50, providerId: 1 } as Service],
        [
          { id: 1, title: 'Service 1', category: ServiceCategory.HOME, price: 50, providerId: 1 } as Service,
          { id: 2, title: 'Service 2', category: ServiceCategory.OUTDOOR, price: 75, providerId: 1 } as Service
        ]
      ];

      differentServices.forEach(services => {
        component.services = services;
        expect(component.services).toEqual(services);
      });
    });
  });
});
