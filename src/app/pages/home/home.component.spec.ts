import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

import { HomeComponent } from './home.component';
import { HomeContentService } from '../../services/home-content/home-content.service';
import { HomeInitializationService } from '../../services/home/home-initilization.service';
import { AuthStorageService } from '../../services/login/auth-storage.service';
import { ServiceSearchComponent } from '../service-search/service-search.component';
import { HomeContent } from '../../models/Home';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let homeContentService: jasmine.SpyObj<HomeContentService>;
  let homeInitializationService: jasmine.SpyObj<HomeInitializationService>;
  let authStorageService: jasmine.SpyObj<AuthStorageService>;

  const mockHomeContent: HomeContent = {
    title: 'Vacances Tranquilles',
    subtitle: 'Confiez votre maison, partez l\'esprit tranquille',
    introText: 'Trouvez des professionnels de confiance pour veiller sur votre logement et assurer tous vos services à domicile pendant vos vacances.',
    btnPrestataire: 'Je suis prestataire',
    btnParticulier: 'Je suis particulier',
    btnConnexion: 'Connexion',
    featuresTitle: 'Pourquoi nous choisir',
    iconType: 'custom',
    mainIcon: 'assets/icons/beach_access_FFA101.svg',
    features: [
      {
        title: 'Service de qualité',
        desc: 'Des prestataires vérifiés',
        icon: 'assets/icons/quality.svg',
        iconType: 'custom'
      }
    ]
  };

  beforeEach(async () => {
    const homeContentSpy = jasmine.createSpyObj('HomeContentService', ['getContent']);
    const homeInitSpy = jasmine.createSpyObj('HomeInitializationService', ['initializeHomeServices', 'cleanup']);
    const authStorageSpy = jasmine.createSpyObj('AuthStorageService', ['isAuthenticated']);

    homeContentSpy.getContent.and.returnValue(mockHomeContent);
    authStorageSpy.isAuthenticated.and.returnValue(false);

    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        RouterTestingModule,
        MatIconModule,
        CommonModule
      ],
      providers: [
        { provide: HomeContentService, useValue: homeContentSpy },
        { provide: HomeInitializationService, useValue: homeInitSpy },
        { provide: AuthStorageService, useValue: authStorageSpy }
      ]
    })
    .overrideComponent(HomeComponent, {
      remove: { imports: [ServiceSearchComponent] },
      add: { imports: [] }
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    homeContentService = TestBed.inject(HomeContentService) as jasmine.SpyObj<HomeContentService>;
    homeInitializationService = TestBed.inject(HomeInitializationService) as jasmine.SpyObj<HomeInitializationService>;
    authStorageService = TestBed.inject(AuthStorageService) as jasmine.SpyObj<AuthStorageService>;

    // Supprimer les logs console pour les tests
    spyOn(console, 'error').and.stub();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.mainLogo).toBe('assets/pictures/logo.png');
    expect(component.isAuthenticated).toBe(false);
    expect(component.display).toBe('block');
    expect(component.height).toBe('100%');
  });

  describe('ngOnInit', () => {
    it('should initialize component correctly', () => {
      // Act
      component.ngOnInit();

      // Assert
      expect(authStorageService.isAuthenticated).toHaveBeenCalled();
      expect(homeContentService.getContent).toHaveBeenCalled();
      expect(component.content).toEqual(mockHomeContent);
      expect(component.isAuthenticated).toBe(false);
    });

    it('should set authentication status correctly', () => {
      // Arrange
      authStorageService.isAuthenticated.and.returnValue(true);

      // Act
      component.ngOnInit();

      // Assert
      expect(component.isAuthenticated).toBe(true);
    });

    it('should use default content when service returns null', () => {
      // Arrange
      homeContentService.getContent.and.returnValue(null as any);

      // Act
      component.ngOnInit();

      // Assert
      expect(component.content).toBeNull();
    });




  });

  describe('ngOnDestroy', () => {
    it('should cleanup home services on destroy', () => {
      // Act
      component.ngOnDestroy();

      // Assert
      expect(homeInitializationService.cleanup).toHaveBeenCalled();
    });
  });

  describe('getDefaultContent', () => {
    it('should return default content structure', () => {
      // Act
      const defaultContent = homeContentService.getContent();

      // Assert
      expect(defaultContent.title).toBe('Vacances Tranquilles');
      expect(defaultContent.subtitle).toBe('Confiez votre maison, partez l\'esprit tranquille');
      expect(defaultContent.introText).toBe('Trouvez des professionnels de confiance pour veiller sur votre logement et assurer tous vos services à domicile pendant vos vacances.');
      expect(defaultContent.btnPrestataire).toBe('Je suis prestataire');
      expect(defaultContent.btnParticulier).toBe('Je suis particulier');
      expect(defaultContent.btnConnexion).toBe('Connexion');
      expect(defaultContent.featuresTitle).toBe('Pourquoi nous choisir');
      expect(defaultContent.iconType).toBe('custom');
      expect(defaultContent.mainIcon).toBe('assets/icons/beach_access_FFA101.svg');
      expect(defaultContent.features.length).toBe(1);
    });
  });

  describe('Template rendering', () => {
    it('should show homepage for unauthenticated users', () => {
      // Arrange
      component.isAuthenticated = false;
      component.content = mockHomeContent;
      fixture.detectChanges();

      // Assert
      const homepageContainer = fixture.nativeElement.querySelector('.homepage-container');
      expect(homepageContainer).toBeTruthy();
    });



    it('should display logo correctly', () => {
      // Arrange
      component.isAuthenticated = false;
      component.content = mockHomeContent;
      fixture.detectChanges();

      // Assert
      const logo = fixture.nativeElement.querySelector('.logo img');
      expect(logo).toBeTruthy();
      expect(logo.getAttribute('src')).toBe('assets/pictures/logo.png');
      expect(logo.getAttribute('alt')).toBe('Logo Vacances Tranquilles');
    });

    it('should display content title and subtitle', () => {
      // Arrange
      component.isAuthenticated = false;
      component.content = mockHomeContent;
      fixture.detectChanges();

      // Assert
      const title = fixture.nativeElement.querySelector('.title');
      const subtitle = fixture.nativeElement.querySelector('.subtitle');
      const introText = fixture.nativeElement.querySelector('.intro-text');

      expect(title.textContent.trim()).toBe('Vacances Tranquilles');
      expect(subtitle.textContent.trim()).toBe('Confiez votre maison, partez l\'esprit tranquille');
      expect(introText.textContent.trim()).toBe('Trouvez des professionnels de confiance pour veiller sur votre logement et assurer tous vos services à domicile pendant vos vacances.');
    });

    it('should display CTA buttons with correct text', () => {
      // Arrange
      component.isAuthenticated = false;
      component.content = mockHomeContent;
      fixture.detectChanges();

      // Assert
      const buttons = fixture.nativeElement.querySelectorAll('.cta-buttons .btn');
      expect(buttons.length).toBe(3);
      expect(buttons[0].textContent.trim()).toBe('Je suis prestataire');
      expect(buttons[1].textContent.trim()).toBe('Je suis particulier');
      expect(buttons[2].textContent.trim()).toBe('Connexion');
    });

    it('should display features section', () => {
      // Arrange
      component.isAuthenticated = false;
      component.content = mockHomeContent;
      fixture.detectChanges();

      // Assert
      const featuresSection = fixture.nativeElement.querySelector('.features-section');
      const featuresTitle = fixture.nativeElement.querySelector('.features-title');
      expect(featuresSection).toBeTruthy();
      expect(featuresTitle.textContent.trim()).toBe('Pourquoi nous choisir');
    });

    it('should display features correctly', () => {
      // Arrange
      component.isAuthenticated = false;
      component.content = mockHomeContent;
      fixture.detectChanges();

      // Assert
      const featureCards = fixture.nativeElement.querySelectorAll('.feature-card');
      expect(featureCards.length).toBe(1);

      const featureTitle = featureCards[0].querySelector('.feature-title');
      const featureDesc = featureCards[0].querySelector('.feature-desc');
      const featureIcon = featureCards[0].querySelector('.feature-icon');

      expect(featureTitle.textContent.trim()).toBe('Service de qualité');
      expect(featureDesc.textContent.trim()).toBe('Des prestataires vérifiés');
      expect(featureIcon.getAttribute('src')).toBe('assets/icons/quality.svg');
    });

    it('should display custom icons for features', () => {
      // Arrange
      component.isAuthenticated = false;
      component.content = mockHomeContent;
      fixture.detectChanges();

      // Assert
      const customIcon = fixture.nativeElement.querySelector('.feature-icon');
      expect(customIcon.tagName).toBe('IMG');
      expect(customIcon.getAttribute('src')).toBe('assets/icons/quality.svg');
    });



    it('should have proper accessibility attributes', () => {
      // Arrange
      component.isAuthenticated = false;
      component.content = mockHomeContent;
      fixture.detectChanges();

      // Assert
      const prestataireButton = fixture.nativeElement.querySelector('[aria-label="S\'inscrire en tant que prestataire de services"]');
      const particulierButton = fixture.nativeElement.querySelector('[aria-label="S\'inscrire en tant que particulier"]');
      const connexionButton = fixture.nativeElement.querySelector('[aria-label="Se connecter à son compte"]');

      expect(prestataireButton).toBeTruthy();
      expect(particulierButton).toBeTruthy();
      expect(connexionButton).toBeTruthy();
    });

    it('should have screen reader descriptions', () => {
      // Arrange
      component.isAuthenticated = false;
      component.content = mockHomeContent;
      fixture.detectChanges();

      // Assert
      const introTexts = fixture.nativeElement.querySelectorAll('.intro-text');
      expect(introTexts.length).toBeGreaterThan(0);
      expect(introTexts[1].textContent).toContain('Vacances Tranquilles, la plateforme qui prend soin de votre maison');
    });
  });

  describe('Integration tests', () => {
    it('should handle complete initialization flow', () => {
      // Arrange
      authStorageService.isAuthenticated.and.returnValue(false);

      // Act
      component.ngOnInit();
      fixture.detectChanges();

      // Assert
      expect(component.isAuthenticated).toBe(false);
      expect(component.content).toEqual(mockHomeContent);
      expect(homeContentService.getContent).toHaveBeenCalled();
      expect(authStorageService.isAuthenticated).toHaveBeenCalled();
    });


  });
});
