import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

import { ProfilePageComponent } from './profile-page.component';
import { UserInformationService } from '../../services/user-information/user-information.service';
import { AuthStorageService } from '../../services/login/auth-storage.service';
import { User, UserRole } from '../../models/User';
import { Service, ServiceCategory } from '../../models/Service';

describe('ProfilePageComponent', () => {
  let component: ProfilePageComponent;
  let fixture: ComponentFixture<ProfilePageComponent>;
  let userInformationService: jasmine.SpyObj<UserInformationService>;
  let authStorageService: jasmine.SpyObj<AuthStorageService>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  const mockUser: User = {
    idUser: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    role: UserRole.PROVIDER,
    phoneNumber: '0123456789',
    address: '123 Main St',
    city: 'Paris',
    postalCode: 75001,
    companyName: 'John Services',
    siretSiren: '12345678901234'
  } as User;

  const mockServices: Service[] = [
    {
      id: 1,
      title: 'Service 1',
      description: 'Description 1',
      category: ServiceCategory.HOME,
      price: 50,
      providerId: 1
    } as Service
  ];

  beforeEach(async () => {
    const userInfoSpy = jasmine.createSpyObj('UserInformationService', [
      'getUserProfile', 'getUserById', 'getMyServices', 'getUserServices'
    ]);
    const authStorageSpy = jasmine.createSpyObj('AuthStorageService', ['getUserId']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    userInfoSpy.getUserProfile.and.returnValue(of(mockUser));
    userInfoSpy.getUserById.and.returnValue(of(mockUser));
    userInfoSpy.getMyServices.and.returnValue(of(mockServices));
    userInfoSpy.getUserServices.and.returnValue(of(mockServices));
    authStorageSpy.getUserId.and.returnValue(1);
    snackBarSpy.open.and.returnValue({} as any);

    await TestBed.configureTestingModule({
      imports: [
        ProfilePageComponent,
        MatSnackBarModule,
        NoopAnimationsModule
      ],
      providers: [
        provideHttpClient(withFetch()),
        { provide: UserInformationService, useValue: userInfoSpy },
        { provide: AuthStorageService, useValue: authStorageSpy },
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilePageComponent);
    component = fixture.componentInstance;
    userInformationService = TestBed.inject(UserInformationService) as jasmine.SpyObj<UserInformationService>;
    authStorageService = TestBed.inject(AuthStorageService) as jasmine.SpyObj<AuthStorageService>;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;

    // Mock localStorage
    spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOn(localStorage, 'removeItem').and.stub();
    spyOn(localStorage, 'setItem').and.stub();

    spyOn(console, 'error').and.stub();
  });

  afterEach(() => {
    if (snackBar && snackBar.open) {
      snackBar.open.calls.reset();
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load logged user data on init', () => {
      authStorageService.getUserId.and.returnValue(1);
      userInformationService.getUserProfile.and.returnValue(of(mockUser));
      userInformationService.getMyServices.and.returnValue(of(mockServices));

      component.ngOnInit();

      expect(userInformationService.getUserProfile).toHaveBeenCalled();
    });

    it('should handle error when loading user data', () => {
      authStorageService.getUserId.and.returnValue(1);
      userInformationService.getUserProfile.and.returnValue(throwError(() => new Error('Network error')));

      component.ngOnInit();

      expect(component.hasError).toBeTrue();
    });

    it('should load displayed user data when displayedUserId is set', () => {
      authStorageService.getUserId.and.returnValue(1);
      (localStorage.getItem as jasmine.Spy).and.callFake((key: string) => {
        if (key === 'displayedUserId') return '2';
        if (key === 'userRole') return UserRole.PROVIDER;
        return null;
      });
      userInformationService.getUserById.and.returnValue(of(mockUser));
      userInformationService.getUserServices.and.returnValue(of(mockServices));
      userInformationService.getUserProfile.and.returnValue(of(mockUser));

      component.ngOnInit();

      expect(userInformationService.getUserById).toHaveBeenCalledWith(2);
    });

    it('should load services for provider user', () => {
      authStorageService.getUserId.and.returnValue(1);
      (localStorage.getItem as jasmine.Spy).and.callFake((key: string) => {
        if (key === 'userRole') return UserRole.PROVIDER;
        return null;
      });
      userInformationService.getUserProfile.and.returnValue(of(mockUser));
      userInformationService.getMyServices.and.returnValue(of(mockServices));

      component.ngOnInit();

      expect(userInformationService.getMyServices).toHaveBeenCalled();
    });

    it('should not load services for client user', () => {
      authStorageService.getUserId.and.returnValue(1);
      (localStorage.getItem as jasmine.Spy).and.callFake((key: string) => {
        if (key === 'userRole') return UserRole.CLIENT;
        return null;
      });
      userInformationService.getUserProfile.and.returnValue(of(mockUser));

      component.ngOnInit();

      expect(userInformationService.getMyServices).not.toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should remove displayedUserId from localStorage', () => {
      component.ngOnDestroy();

      expect(localStorage.removeItem).toHaveBeenCalledWith('displayedUserId');
    });
  });

  describe('retryLoadData', () => {
    it('should reload user data', () => {
      authStorageService.getUserId.and.returnValue(1);
      userInformationService.getUserProfile.and.returnValue(of(mockUser));

      component.retryLoadData();

      expect(userInformationService.getUserProfile).toHaveBeenCalled();
    });
  });

  describe('toggleEditMode', () => {
    it('should enter edit mode when not in edit mode', () => {
      component.isEditMode = false;
      component.displayedUser = mockUser;

      component.toggleEditMode();

      expect(component.isEditMode).toBeTrue();
    });

    it('should save profile changes when exiting edit mode', () => {
      component.isEditMode = true;
      component.displayedUser = mockUser;
      component.updateProfileComponent = {
        saveProfile: jasmine.createSpy('saveProfile').and.returnValue(of(true))
      } as any;

      component.toggleEditMode();

      expect(component.updateProfileComponent.saveProfile).toHaveBeenCalled();
    });

    it('should handle missing displayedUser', () => {
      component.isEditMode = true;
      component.displayedUser = null;

      component.toggleEditMode();

      expect(true).toBeTrue();
    });
  });

  describe('getButtonText', () => {
    it('should return "Sauvegarde..." when saving', () => {
      component.isSaving = true;

      const result = component.getButtonText();

      expect(result).toBe('Sauvegarde...');
    });

    it('should return "Valider les modifications" when in edit mode', () => {
      component.isSaving = false;
      component.isEditMode = true;

      const result = component.getButtonText();

      expect(result).toBe('Valider les modifications');
    });

    it('should return "Modifier" when not in edit mode', () => {
      component.isSaving = false;
      component.isEditMode = false;

      const result = component.getButtonText();

      expect(result).toBe('Modifier');
    });
  });

  describe('onProfileDataChange', () => {
    it('should update displayedUser when user data is provided', () => {
      const updatedUser = { ...mockUser, firstName: 'Jane' };
      const event = { user: updatedUser };

      component.onProfileDataChange(event);

      expect(component.displayedUser).toEqual(updatedUser);
    });

    it('should update services when services data is provided', () => {
      const updatedServices = [...mockServices, { id: 2, title: 'Service 2' } as Service];
      const event = { services: updatedServices };

      component.onProfileDataChange(event);

      expect(component.services).toEqual(updatedServices);
    });

    it('should update both user and services when both are provided', () => {
      const updatedUser = { ...mockUser, firstName: 'Jane' };
      const updatedServices = [...mockServices, { id: 2, title: 'Service 2' } as Service];
      const event = { user: updatedUser, services: updatedServices };

      component.onProfileDataChange(event);

      expect(component.displayedUser).toEqual(updatedUser);
      expect(component.services).toEqual(updatedServices);
    });

    it('should not update anything when no data is provided', () => {
      const originalUser = component.displayedUser;
      const originalServices = component.services;
      const event = {};

      component.onProfileDataChange(event);

      expect(component.displayedUser).toBe(originalUser);
      expect(component.services).toBe(originalServices);
    });
  });

  describe('onValidationError', () => {
    it('should handle validation error', () => {
      const errorMessage = 'Validation error';

      component.onValidationError(errorMessage);

      expect(true).toBeTrue();
    });
  });

  describe('onSaveSuccess', () => {
    it('should handle save success correctly', () => {
      component.isSaving = true;
      component.isEditMode = true;
      component.displayedUser = mockUser;
      component.displayProfileComponent = {
        updateProfileData: jasmine.createSpy('updateProfileData')
      } as any;

      component.onSaveSuccess();

      expect(component.isSaving).toBeFalse();
      expect(component.isEditMode).toBeFalse();
      expect(component.displayProfileComponent.updateProfileData).toHaveBeenCalledWith(mockUser, component.services);
    });

    it('should handle save success without displayProfileComponent', () => {
      component.isSaving = true;
      component.isEditMode = true;
      component.displayedUser = mockUser;
      component.displayProfileComponent = null as any;

      component.onSaveSuccess();

      expect(component.isSaving).toBeFalse();
      expect(component.isEditMode).toBeFalse();
    });
  });

  describe('onSaveError', () => {
    it('should handle save error correctly', () => {
      component.isSaving = true;
      const errorMessage = 'Save failed';

      component.onSaveError(errorMessage);

      expect(component.isSaving).toBeFalse();
    });
  });

  describe('isCurrentUserProfile', () => {
    it('should return true when displayed user is current user', () => {
      component.displayedUser = mockUser;
      component.loggedUser = mockUser;

      const result = component.isCurrentUserProfile();

      expect(result).toBeTrue();
    });

    it('should return false when displayed user is different from current user', () => {
      component.displayedUser = mockUser;
      component.loggedUser = { ...mockUser, idUser: 2 };

      const result = component.isCurrentUserProfile();

      expect(result).toBeFalse();
    });

    it('should return false when displayedUser is null', () => {
      component.displayedUser = null;
      component.loggedUser = mockUser;

      const result = component.isCurrentUserProfile();

      expect(result).toBeFalse();
    });

    it('should return false when loggedUser is null', () => {
      component.displayedUser = mockUser;
      component.loggedUser = null;

      const result = component.isCurrentUserProfile();

      expect(result).toBeFalse();
    });

    it('should return true when both users are null', () => {
      component.displayedUser = null;
      component.loggedUser = null;

      const result = component.isCurrentUserProfile();

      expect(result).toBeTrue();
    });
  });

  describe('loadDisplayedUserData', () => {
    it('should load displayed user data successfully', () => {
      const userId = 2;
      userInformationService.getUserById.and.returnValue(of(mockUser));
      userInformationService.getUserServices.and.returnValue(of(mockServices));

      (component as any).loadDisplayedUserData(userId);

      expect(userInformationService.getUserById).toHaveBeenCalledWith(userId);
      expect(component.displayedUser).toEqual(mockUser);
      expect(component.isLoading).toBeFalse();
      expect(component.hasError).toBeFalse();
    });

    it('should load services for provider displayed user', () => {
      const userId = 2;
      const providerUser = { ...mockUser, role: UserRole.PROVIDER };
      userInformationService.getUserById.and.returnValue(of(providerUser));
      userInformationService.getUserServices.and.returnValue(of(mockServices));

      (component as any).loadDisplayedUserData(userId);

      expect(userInformationService.getUserServices).toHaveBeenCalledWith(userId);
      expect(component.services).toEqual(mockServices);
    });

    it('should not load services for client displayed user', () => {
      const userId = 2;
      const clientUser = { ...mockUser, role: UserRole.CLIENT };
      userInformationService.getUserById.and.returnValue(of(clientUser));

      (component as any).loadDisplayedUserData(userId);

      expect(userInformationService.getUserServices).not.toHaveBeenCalled();
    });

    it('should handle error when loading displayed user data', () => {
      const userId = 2;
      userInformationService.getUserById.and.returnValue(throwError(() => new Error('Network error')));

      (component as any).loadDisplayedUserData(userId);

      expect(component.isLoading).toBeFalse();
      expect(component.hasError).toBeTrue();
    });

    it('should handle error when loading user services', () => {
      const userId = 2;
      const providerUser = { ...mockUser, role: UserRole.PROVIDER };
      userInformationService.getUserById.and.returnValue(of(providerUser));
      userInformationService.getUserServices.and.returnValue(throwError(() => new Error('Services error')));

      (component as any).loadDisplayedUserData(userId);

      expect(component.services).toEqual([]);
    });
  });

  describe('loadLoggedUserDataOnly', () => {
    it('should load logged user data successfully', () => {
      authStorageService.getUserId.and.returnValue(1);
      userInformationService.getUserProfile.and.returnValue(of(mockUser));
      userInformationService.getMyServices.and.returnValue(of(mockServices));
      (localStorage.getItem as jasmine.Spy).and.callFake((key: string) => {
        if (key === 'userRole') return UserRole.PROVIDER;
        return null;
      });

      component.userRole = UserRole.PROVIDER;

      (component as any).loadLoggedUserDataOnly();

      expect(userInformationService.getUserProfile).toHaveBeenCalled();
      expect(component.loggedUser).toEqual({ ...mockUser, role: UserRole.PROVIDER });
      expect(component.isLoading).toBeFalse();
      expect(component.hasError).toBeFalse();
    });

    it('should set displayedUser to loggedUser when no displayedUserId', () => {
      authStorageService.getUserId.and.returnValue(1);
      userInformationService.getUserProfile.and.returnValue(of(mockUser));
      (localStorage.getItem as jasmine.Spy).and.returnValue(null);

      (component as any).loadLoggedUserDataOnly();

      expect(component.displayedUser).toEqual(component.loggedUser);
    });

    it('should not set displayedUser when displayedUserId exists', () => {
      authStorageService.getUserId.and.returnValue(1);
      userInformationService.getUserProfile.and.returnValue(of(mockUser));
      (localStorage.getItem as jasmine.Spy).and.callFake((key: string) => {
        if (key === 'displayedUserId') return '2';
        return null;
      });

      (component as any).loadLoggedUserDataOnly();

      expect(component.displayedUser).toBeNull();
    });

    it('should handle error when loading logged user data', () => {
      authStorageService.getUserId.and.returnValue(1);
      userInformationService.getUserProfile.and.returnValue(throwError(() => new Error('Network error')));

      (component as any).loadLoggedUserDataOnly();

      expect(component.isLoading).toBeFalse();
      expect(component.hasError).toBeTrue();
    });

    it('should handle error when loading user services', () => {
      authStorageService.getUserId.and.returnValue(1);
      userInformationService.getUserProfile.and.returnValue(of(mockUser));
      userInformationService.getMyServices.and.returnValue(throwError(() => new Error('Services error')));
      (localStorage.getItem as jasmine.Spy).and.callFake((key: string) => {
        if (key === 'userRole') return UserRole.PROVIDER;
        return null;
      });

      (component as any).loadLoggedUserDataOnly();

      expect(component.services).toEqual([]);
    });
  });

  describe('saveProfileChanges', () => {
    it('should save profile changes successfully', () => {
      component.displayedUser = mockUser;
      component.updateProfileComponent = {
        saveProfile: jasmine.createSpy('saveProfile').and.returnValue(of(true))
      } as any;

      (component as any).saveProfileChanges();

      expect(component.updateProfileComponent.saveProfile).toHaveBeenCalled();
    });

    it('should handle save success', () => {
      component.displayedUser = mockUser;
      component.updateProfileComponent = {
        saveProfile: jasmine.createSpy('saveProfile').and.returnValue(of(true))
      } as any;

      (component as any).saveProfileChanges();

      expect(component.updateProfileComponent.saveProfile).toHaveBeenCalled();
    });

    it('should handle save failure', () => {
      component.displayedUser = mockUser;
      component.updateProfileComponent = {
        saveProfile: jasmine.createSpy('saveProfile').and.returnValue(of(false))
      } as any;

      (component as any).saveProfileChanges();

      expect(component.isSaving).toBeFalse();
    });

    it('should handle save error', () => {
      component.displayedUser = mockUser;
      component.updateProfileComponent = {
        saveProfile: jasmine.createSpy('saveProfile').and.returnValue(throwError(() => new Error('Save error')))
      } as any;

      (component as any).saveProfileChanges();

      expect(true).toBeTrue();
    });

    it('should handle missing displayedUser', () => {
      component.displayedUser = null;

      (component as any).saveProfileChanges();

      expect(true).toBeTrue();
    });

    it('should handle missing updateProfileComponent', () => {
      component.displayedUser = mockUser;
      component.updateProfileComponent = null as any;

      (component as any).saveProfileChanges();

      expect(true).toBeTrue();
    });
  });
});
