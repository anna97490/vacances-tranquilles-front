import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { UpdateProfileComponent } from './update-profile.component';
import { UserInformationService } from '../../../services/user-information/user-information.service';
import { ProfileValidationService } from '../../../services/user-profile/profile-validation.service';
import { User } from '../../../models/User';
import { Service, ServiceCategory } from '../../../models/Service';
import { UserRole } from '../../../models/User';

describe('UpdateProfileComponent', () => {
  let component: UpdateProfileComponent;
  let fixture: ComponentFixture<UpdateProfileComponent>;
  let mockUserInformationService: jasmine.SpyObj<UserInformationService>;
  let mockProfileValidationService: jasmine.SpyObj<ProfileValidationService>;
  let mockUser: User;
  let mockServices: Service[];

  beforeEach(async () => {
    const userInfoSpy = jasmine.createSpyObj('UserInformationService', [
      'getUserProfileWithServices', 
      'getMyServices', 
      'updateUserProfile'
    ]);
    const profileValidationSpy = jasmine.createSpyObj('ProfileValidationService', [
      'createProfileForm',
      'markAllFieldsAsTouched',
      'isFormValid',
      'getFieldErrorText'
    ]);

    await TestBed.configureTestingModule({
      imports: [UpdateProfileComponent],
      providers: [
        { provide: UserInformationService, useValue: userInfoSpy },
        { provide: ProfileValidationService, useValue: profileValidationSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateProfileComponent);
    component = fixture.componentInstance;
    mockUserInformationService = TestBed.inject(UserInformationService) as jasmine.SpyObj<UserInformationService>;
    mockProfileValidationService = TestBed.inject(ProfileValidationService) as jasmine.SpyObj<ProfileValidationService>;

    // Mock user data
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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user profile if not provided', () => {
    component.user = null as any;
    component.services = null as any;
    
    mockUserInformationService.getUserProfileWithServices.and.returnValue(of({ user: mockUser, services: mockServices }));
    mockUserInformationService.getMyServices.and.returnValue(of(mockServices));

    component.ngOnInit();

    expect(mockUserInformationService.getUserProfileWithServices).toHaveBeenCalled();
    expect(mockUserInformationService.getMyServices).toHaveBeenCalled();
  });

  it('should emit user change when user is updated', () => {
    spyOn(component.profileDataChange, 'emit');
    const newUser = { ...mockUser, firstName: 'Jane' };

    component.onUserChange(newUser);

    expect(component.user).toEqual(newUser);
    expect(component.profileDataChange.emit).toHaveBeenCalledWith({ user: newUser });
  });

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

  it('should emit validation error when header validation fails', () => {
    spyOn(component.validationError, 'emit');
    const errorMessage = 'Validation error';

    component.onHeaderValidationError(errorMessage);

    expect(component.validationError.emit).toHaveBeenCalledWith(errorMessage);
  });

  it('should return false when form validation fails', () => {
    mockProfileValidationService.markAllFieldsAsTouched.and.returnValue();
    mockProfileValidationService.isFormValid.and.returnValue(false);

    const result = component.validateForm();

    expect(result).toBeFalse();
    expect(mockProfileValidationService.markAllFieldsAsTouched).toHaveBeenCalled();
  });

  it('should return true when form validation passes', () => {
    mockProfileValidationService.markAllFieldsAsTouched.and.returnValue();
    mockProfileValidationService.isFormValid.and.returnValue(true);

    const result = component.validateForm();

    expect(result).toBeTrue();
  });

  it('should return false when saveProfile is called with invalid form', () => {
    spyOn(component, 'validateForm').and.returnValue(false);
    spyOn(component.saveSuccess, 'emit');
    spyOn(component.saveError, 'emit');

    component.saveProfile().subscribe(result => {
      expect(result).toBeFalse();
      expect(component.saveSuccess.emit).not.toHaveBeenCalled();
      expect(component.saveError.emit).not.toHaveBeenCalled();
    });
  });

  it('should return true and emit success when saveProfile succeeds', () => {
    spyOn(component, 'validateForm').and.returnValue(true);
    spyOn(component.saveSuccess, 'emit');
    spyOn(component.saveError, 'emit');
    
    const updatedProfile = { user: mockUser, services: mockServices };
    mockUserInformationService.updateUserProfile.and.returnValue(of(updatedProfile));

    component.saveProfile().subscribe(result => {
      expect(result).toBeTrue();
      expect(component.saveSuccess.emit).toHaveBeenCalled();
      expect(component.saveError.emit).not.toHaveBeenCalled();
      expect(mockUserInformationService.updateUserProfile).toHaveBeenCalled();
    });
  });

  it('should return false and emit error when saveProfile fails', () => {
    spyOn(component, 'validateForm').and.returnValue(true);
    spyOn(component.saveSuccess, 'emit');
    spyOn(component.saveError, 'emit');
    
    mockUserInformationService.updateUserProfile.and.returnValue(
      of().pipe(() => { throw new Error('Network error'); })
    );

    component.saveProfile().subscribe(result => {
      expect(result).toBeFalse();
      expect(component.saveSuccess.emit).not.toHaveBeenCalled();
      expect(component.saveError.emit).toHaveBeenCalledWith('Erreur lors de la sauvegarde du profil');
    });
  });
});
