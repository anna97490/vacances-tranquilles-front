import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { fakeAsync, tick } from '@angular/core/testing';

import { ProviderProfileComponent } from './provider-profile.component';
import { UserInformationService } from '../../services/user-information/user-information.service';
import { User, UserRole } from '../../models/User';

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

    // Mock localStorage
    spyOn(localStorage, 'getItem').and.returnValue('1');
    spyOn(console, 'error').and.stub();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('devrait charger les données du prestataire lors de l\'initialisation', () => {
      userInformationService.getUserById.and.returnValue(of(mockUser));

      component.ngOnInit();

      expect(userInformationService.getUserById).toHaveBeenCalledWith(1);
      expect(component.provider).toEqual({ ...mockUser, idUser: 1 });
      expect(component.isLoading).toBeFalse();
      expect(component.hasError).toBeFalse();
    });

    it('devrait gérer l\'erreur lors du chargement des données', () => {
      userInformationService.getUserById.and.returnValue(throwError(() => new Error('Erreur réseau')));

      component.ngOnInit();

      expect(component.isLoading).toBeFalse();
      expect(component.hasError).toBeTrue();
      expect(component.provider).toBeNull();
    });

    it('devrait rediriger vers la page d\'accueil si aucun displayedUserId n\'est trouvé', () => {
      (localStorage.getItem as jasmine.Spy).and.returnValue(null);

      component.ngOnInit();

      expect(router.navigate).toHaveBeenCalledWith(['/home']);
      expect(userInformationService.getUserById).not.toHaveBeenCalled();
    });

    it('devrait utiliser l\'ID utilisateur fourni par l\'API si disponible', () => {
      const userWithId = { ...mockUser, idUser: 5 };
      userInformationService.getUserById.and.returnValue(of(userWithId));

      component.ngOnInit();

      expect(component.provider).toEqual({ ...userWithId, idUser: 5 });
    });

    it('devrait utiliser l\'ID du localStorage si l\'API ne fournit pas d\'ID', () => {
      const userWithoutId = { ...mockUser, idUser: undefined } as any;
      userInformationService.getUserById.and.returnValue(of(userWithoutId));

      component.ngOnInit();

      expect(component.provider).toEqual({ ...userWithoutId, idUser: 1 });
    });
  });

  describe('loadProviderData', () => {
    it('devrait charger les données du prestataire avec succès', () => {
      userInformationService.getUserById.and.returnValue(of(mockUser));

      (component as any).loadProviderData();

      expect(userInformationService.getUserById).toHaveBeenCalledWith(1);
      expect(component.provider).toEqual({ ...mockUser, idUser: 1 });
      expect(component.isLoading).toBeFalse();
      expect(component.hasError).toBeFalse();
    });

    it('devrait gérer l\'erreur lors du chargement des données', () => {
      userInformationService.getUserById.and.returnValue(throwError(() => new Error('Erreur réseau')));

      (component as any).loadProviderData();

      expect(component.isLoading).toBeFalse();
      expect(component.hasError).toBeTrue();
      expect(component.provider).toBeNull();
    });

    it('devrait rediriger vers la page d\'accueil si aucun displayedUserId n\'est trouvé', () => {
      (localStorage.getItem as jasmine.Spy).and.returnValue(null);

      (component as any).loadProviderData();

      expect(router.navigate).toHaveBeenCalledWith(['/home']);
      expect(userInformationService.getUserById).not.toHaveBeenCalled();
    });

    it('devrait gérer les displayedUserId non numériques', () => {
      (localStorage.getItem as jasmine.Spy).and.returnValue('abc');

      // Configurer le mock pour retourner une valeur par défaut
      userInformationService.getUserById.and.returnValue(of(mockUser));

      (component as any).loadProviderData();

      // Le composant utilise parseInt() qui retourne NaN pour 'abc'
      // mais il appelle quand même getUserById avec NaN
      expect(userInformationService.getUserById).toHaveBeenCalledWith(NaN);
    });

    it('devrait gérer les displayedUserId vides', () => {
      (localStorage.getItem as jasmine.Spy).and.returnValue('');

      (component as any).loadProviderData();

      expect(router.navigate).toHaveBeenCalledWith(['/home']);
    });
  });

  describe('retryLoadData', () => {
    it('devrait réinitialiser l\'état et recharger les données', () => {
      // Définir l'état initial
      component.isLoading = false;
      component.hasError = true;
      component.provider = mockUser;

      // Configurer le mock pour retourner une valeur
      userInformationService.getUserById.and.returnValue(of(mockUser));

      // Configurer localStorage pour retourner un ID valide
      (localStorage.getItem as jasmine.Spy).and.returnValue('1');

      component.retryLoadData();

      // Vérifier que loadProviderData a été appelé (via getUserById)
      expect(userInformationService.getUserById).toHaveBeenCalledWith(1);
    });

    it('devrait appeler getUserById avec l\'ID correct', () => {
      // Configurer le mock
      userInformationService.getUserById.and.returnValue(of(mockUser));
      (localStorage.getItem as jasmine.Spy).and.returnValue('123');

      component.retryLoadData();

      expect(userInformationService.getUserById).toHaveBeenCalledWith(123);
    });
  });

  describe('Intégration', () => {
    it('devrait mettre à jour l\'affichage après le chargement réussi des données', () => {
      userInformationService.getUserById.and.returnValue(of(mockUser));

      component.ngOnInit();
      fixture.detectChanges();

      expect(component.provider).toEqual({ ...mockUser, idUser: 1 });
      expect(component.isLoading).toBeFalse();
      expect(component.hasError).toBeFalse();
    });

    it('devrait afficher l\'état d\'erreur après un échec de chargement', () => {
      userInformationService.getUserById.and.returnValue(throwError(() => new Error('Erreur réseau')));

      component.ngOnInit();
      fixture.detectChanges();

      expect(component.isLoading).toBeFalse();
      expect(component.hasError).toBeTrue();
      expect(component.provider).toBeNull();
    });

    it('devrait permettre de réessayer après une erreur', () => {
      // Premier appel échoue
      userInformationService.getUserById.and.returnValue(throwError(() => new Error('Erreur réseau')));
      component.ngOnInit();

      expect(component.hasError).toBeTrue();

      // Deuxième appel réussit
      userInformationService.getUserById.and.returnValue(of(mockUser));
      component.retryLoadData();

      expect(component.provider).toEqual({ ...mockUser, idUser: 1 });
      expect(component.isLoading).toBeFalse();
      expect(component.hasError).toBeFalse();
    });
  });

  describe('Gestion des cas limites', () => {
    it('devrait gérer un utilisateur avec des données partielles', () => {
      const partialUser = {
        idUser: 1,
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean@example.com',
        role: UserRole.PROVIDER
      } as User;
      userInformationService.getUserById.and.returnValue(of(partialUser));

      component.ngOnInit();

      expect(component.provider).toEqual({ ...partialUser, idUser: 1 });
    });

    it('devrait gérer un displayedUserId très grand', () => {
      (localStorage.getItem as jasmine.Spy).and.returnValue('999999999');
      userInformationService.getUserById.and.returnValue(of(mockUser));

      component.ngOnInit();

      expect(userInformationService.getUserById).toHaveBeenCalledWith(999999999);
    });

    it('devrait gérer un displayedUserId négatif', () => {
      (localStorage.getItem as jasmine.Spy).and.returnValue('-1');
      userInformationService.getUserById.and.returnValue(of(mockUser));

      component.ngOnInit();

      expect(userInformationService.getUserById).toHaveBeenCalledWith(-1);
    });
  });
});
