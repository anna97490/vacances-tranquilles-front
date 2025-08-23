import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { ProviderProfileComponent } from './provider-profile.component';
import { UserInformationService } from '../../services/user-information/user-information.service';
import { User, UserRole } from '../../models/User';
import { BackButtonComponent } from '../../components/shared/back-button/back-button.component';

describe('ProviderProfileComponent', () => {
  let component: ProviderProfileComponent;
  let fixture: ComponentFixture<ProviderProfileComponent>;
  let userInformationService: jasmine.SpyObj<UserInformationService>;
  let router: jasmine.SpyObj<Router>;

  const mockUser: User = {
    idUser: 1,
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@example.com',
    role: UserRole.PROVIDER,
    phoneNumber: '0123456789',
    address: '123 Rue de la Paix',
    city: 'Paris',
    postalCode: 75001,
    companyName: 'Services Jean Dupont',
    siretSiren: '12345678901234'
  } as User;

  beforeEach(async () => {
    const userInfoSpy = jasmine.createSpyObj('UserInformationService', ['getUserById']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ProviderProfileComponent],
      providers: [
        provideHttpClient(withFetch()),
        { provide: UserInformationService, useValue: userInfoSpy },
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProviderProfileComponent);
    component = fixture.componentInstance;
    userInformationService = TestBed.inject(UserInformationService) as jasmine.SpyObj<UserInformationService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    spyOn(localStorage, 'getItem').and.returnValue('1');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load provider data on initialization', () => {
      userInformationService.getUserById.and.returnValue(of(mockUser));

      component.ngOnInit();

      expect(userInformationService.getUserById).toHaveBeenCalledWith(1);
      expect(component.provider).toEqual({ ...mockUser, idUser: 1, role: UserRole.PROVIDER });
      expect(component.isLoading).toBeFalse();
      expect(component.hasError).toBeFalse();
    });

    it('should handle error when loading data', () => {
      userInformationService.getUserById.and.returnValue(throwError(() => new Error('Network error')));

      component.ngOnInit();

      expect(component.isLoading).toBeFalse();
      expect(component.hasError).toBeTrue();
      expect(component.provider).toBeNull();
    });

    it('should redirect to home if no displayedUserId found', () => {
      (localStorage.getItem as jasmine.Spy).and.returnValue(null);

      component.ngOnInit();

      expect(router.navigate).toHaveBeenCalledWith(['/home']);
      expect(userInformationService.getUserById).not.toHaveBeenCalled();
    });

    it('should use API user ID if available', () => {
      const userWithId = { ...mockUser, idUser: 5 };
      userInformationService.getUserById.and.returnValue(of(userWithId));

      component.ngOnInit();

      expect(component.provider).toEqual({ ...userWithId, idUser: 5, role: UserRole.PROVIDER });
    });

    it('should use localStorage ID if API does not provide ID', () => {
      const userWithoutId = { ...mockUser, idUser: undefined } as any;
      userInformationService.getUserById.and.returnValue(of(userWithoutId));

      component.ngOnInit();

      expect(component.provider).toEqual({ ...userWithoutId, idUser: 1, role: UserRole.PROVIDER });
    });
  });

  describe('loadProviderData', () => {
    it('should load provider data successfully', () => {
      userInformationService.getUserById.and.returnValue(of(mockUser));

      (component as any).loadProviderData();

      expect(userInformationService.getUserById).toHaveBeenCalledWith(1);
      expect(component.provider).toEqual({ ...mockUser, idUser: 1, role: UserRole.PROVIDER });
      expect(component.isLoading).toBeFalse();
      expect(component.hasError).toBeFalse();
    });

    it('should handle error when loading data', () => {
      userInformationService.getUserById.and.returnValue(throwError(() => new Error('Network error')));

      (component as any).loadProviderData();

      expect(component.isLoading).toBeFalse();
      expect(component.hasError).toBeTrue();
      expect(component.provider).toBeNull();
    });

    it('should redirect to home if no displayedUserId found', () => {
      (localStorage.getItem as jasmine.Spy).and.returnValue(null);

      (component as any).loadProviderData();

      expect(router.navigate).toHaveBeenCalledWith(['/home']);
      expect(userInformationService.getUserById).not.toHaveBeenCalled();
    });

    it('should handle empty displayedUserId', () => {
      (localStorage.getItem as jasmine.Spy).and.returnValue('');

      (component as any).loadProviderData();

      expect(router.navigate).toHaveBeenCalledWith(['/home']);
    });
  });

  describe('retryLoadData', () => {
    it('should reset state and reload data', () => {
      component.isLoading = false;
      component.hasError = true;
      component.provider = mockUser;

      userInformationService.getUserById.and.returnValue(of(mockUser));
      (localStorage.getItem as jasmine.Spy).and.returnValue('1');

      component.retryLoadData();

      expect(userInformationService.getUserById).toHaveBeenCalledWith(1);
    });

    it('should call getUserById with correct ID', () => {
      userInformationService.getUserById.and.returnValue(of(mockUser));
      (localStorage.getItem as jasmine.Spy).and.returnValue('123');

      component.retryLoadData();

      expect(userInformationService.getUserById).toHaveBeenCalledWith(123);
    });
  });

  describe('goBack', () => {
    it('should navigate back to available providers page', () => {
      component.goBack();
      expect(router.navigate).toHaveBeenCalledWith(['/available-providers']);
    });

    it('should be called when back button is clicked', () => {
      // Configurer les mocks nécessaires
      userInformationService.getUserById.and.returnValue(of(mockUser));
      component.ngOnInit();
      
      spyOn(component, 'goBack');
      fixture.detectChanges();
      
      const backButton = fixture.nativeElement.querySelector('app-back-button');
      expect(backButton).toBeTruthy();
      
      // Simuler le clic sur le bouton retour
      const backButtonComponent = fixture.debugElement.query(backButton => backButton.componentInstance instanceof BackButtonComponent);
      if (backButtonComponent) {
        backButtonComponent.componentInstance.backClick.emit();
        expect(component.goBack).toHaveBeenCalled();
      }
    });
  });

  describe('Back button integration', () => {
    it('should render back button with correct aria-label and title', () => {
      // Configurer les mocks nécessaires
      userInformationService.getUserById.and.returnValue(of(mockUser));
      component.ngOnInit();
      fixture.detectChanges();
      
      const backButton = fixture.nativeElement.querySelector('app-back-button');
      expect(backButton).toBeTruthy();
      
      // Vérifier que le composant back-button est bien intégré
      const backButtonComponent = fixture.debugElement.query(backButton => backButton.componentInstance instanceof BackButtonComponent);
      expect(backButtonComponent).toBeTruthy();
    });

    it('should have correct accessibility attributes on back button', () => {
      // Configurer les mocks nécessaires
      userInformationService.getUserById.and.returnValue(of(mockUser));
      component.ngOnInit();
      fixture.detectChanges();
      
      const backButton = fixture.nativeElement.querySelector('app-back-button');
      expect(backButton).toBeTruthy();
      
      // Vérifier les attributs d'accessibilité
      const button = backButton.querySelector('button');
      expect(button.getAttribute('aria-label')).toBe('Retour à la page des prestataires disponibles');
      expect(button.getAttribute('title')).toBe('Retour à la page des prestataires disponibles');
    });
  });

  describe('Integration', () => {
    it('should update display after successful data loading', () => {
      userInformationService.getUserById.and.returnValue(of(mockUser));

      component.ngOnInit();
      fixture.detectChanges();

      expect(component.provider).toEqual({ ...mockUser, idUser: 1, role: UserRole.PROVIDER });
      expect(component.isLoading).toBeFalse();
      expect(component.hasError).toBeFalse();
    });

    it('should display error state after loading failure', () => {
      userInformationService.getUserById.and.returnValue(throwError(() => new Error('Network error')));

      component.ngOnInit();
      fixture.detectChanges();

      expect(component.isLoading).toBeFalse();
      expect(component.hasError).toBeTrue();
      expect(component.provider).toBeNull();
    });

    it('should allow retry after error', () => {
      userInformationService.getUserById.and.returnValue(throwError(() => new Error('Network error')));
      component.ngOnInit();

      expect(component.hasError).toBeTrue();

      userInformationService.getUserById.and.returnValue(of(mockUser));
      component.retryLoadData();

      expect(component.provider).toEqual({ ...mockUser, idUser: 1, role: UserRole.PROVIDER });
      expect(component.isLoading).toBeFalse();
      expect(component.hasError).toBeFalse();
    });
  });

  describe('Edge cases', () => {
    it('should handle user with partial data', () => {
      const partialUser = {
        idUser: 1,
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean@example.com',
        role: UserRole.PROVIDER
      } as User;
      userInformationService.getUserById.and.returnValue(of(partialUser));

      component.ngOnInit();

      expect(component.provider).toEqual({ ...partialUser, idUser: 1, role: UserRole.PROVIDER });
    });

    it('should handle large displayedUserId', () => {
      (localStorage.getItem as jasmine.Spy).and.returnValue('999999999');
      userInformationService.getUserById.and.returnValue(of(mockUser));

      component.ngOnInit();

      expect(userInformationService.getUserById).toHaveBeenCalledWith(999999999);
    });

    it('should handle negative displayedUserId', () => {
      (localStorage.getItem as jasmine.Spy).and.returnValue('-1');
      userInformationService.getUserById.and.returnValue(of(mockUser));

      component.ngOnInit();

      expect(userInformationService.getUserById).toHaveBeenCalledWith(-1);
    });
  });
});
