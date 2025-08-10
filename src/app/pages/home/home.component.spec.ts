import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { HomeComponent } from './home.component';
import { HomeContentService } from '../../services/home-content.service';
import { HomeInitializationService } from '../../services/home/home-initilization.service';
import { HomeContent } from '../../models/Home';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let homeContentServiceMock: jasmine.SpyObj<HomeContentService>;
  let homeInitializationServiceMock: jasmine.SpyObj<HomeInitializationService>;

  const mockContent: HomeContent = {
    title: 'Test Title',
    subtitle: 'Test Subtitle',
    introText: 'Test Intro',
    btnPrestataire: 'Test Prestataire',
    btnParticulier: 'Test Particulier',
    btnConnexion: 'Test Connexion',
    featuresTitle: 'Test Features',
    iconType: 'custom',
    mainIcon: 'test-icon.svg',
    features: [
      {
        title: 'Feature 1',
        desc: 'Description 1',
        icon: 'icon1.svg',
        iconType: 'custom'
      }
    ]
  };

  beforeEach(async () => {
    homeContentServiceMock = jasmine.createSpyObj<HomeContentService>(
      'HomeContentService',
      ['getContent']
    );
    homeContentServiceMock.getContent.and.returnValue(mockContent);

    homeInitializationServiceMock = jasmine.createSpyObj<HomeInitializationService>(
      'HomeInitializationService',
      ['initializeHomeServices', 'cleanup']
    );
    homeInitializationServiceMock.initializeHomeServices.and.returnValue(Promise.resolve());

    await TestBed.configureTestingModule({
      imports: [HomeComponent, NoopAnimationsModule],
      providers: [
        { provide: HomeContentService, useValue: homeContentServiceMock },
        { provide: HomeInitializationService, useValue: homeInitializationServiceMock },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct properties', () => {
    expect(component.mainLogo).toBe('assets/pictures/logo.png');
    expect(component.display).toBe('block');
    expect(component.height).toBe('100%');
  });

  it('should initialize content and services on ngOnInit', async () => {
    spyOn(console, 'log');
    component.ngOnInit();
    await fixture.whenStable();

    expect(homeContentServiceMock.getContent).toHaveBeenCalled();
    expect(component.content).toEqual(mockContent);
    expect(homeInitializationServiceMock.initializeHomeServices).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith('HomeComponent initialized');
    expect(console.log).toHaveBeenCalledWith('Initializing content...');
    expect(console.log).toHaveBeenCalledWith('Content initialized:', mockContent);
    expect(console.log).toHaveBeenCalledWith('Initializing services...');
    expect(console.log).toHaveBeenCalledWith('Services initialized successfully');
  });

  it('should use default content when getContent returns null', () => {
    homeContentServiceMock.getContent.and.returnValue(null as any);
    spyOn(console, 'log');

    component.ngOnInit();

    expect(component.content.title).toBe('Vacances Tranquilles');
    expect(component.content.subtitle).toBe('Votre partenaire de confiance pour des vacances sereines');
    expect(component.content.introText).toBe('Simplifiez la gestion de vos locations saisonnières');
    expect(component.content.btnPrestataire).toBe('Inscription Prestataires');
    expect(component.content.btnParticulier).toBe('Inscription Particuliers');
    expect(component.content.btnConnexion).toBe('Connexion');
    expect(component.content.featuresTitle).toBe('Pourquoi nous choisir');
    expect(component.content.iconType).toBe('custom');
    expect(component.content.mainIcon).toBe('assets/icons/beach_access_FFA101.svg');
    expect(component.content.features).toEqual([]);
  });

  it('should handle initialization error gracefully', async () => {
    const error = new Error('Initialization failed');
    homeInitializationServiceMock.initializeHomeServices.and.returnValue(Promise.reject(error));
    spyOn(console, 'error');

    component.ngOnInit();
    await fixture.whenStable();

    expect(console.error).toHaveBeenCalledWith('Erreur lors de l\'initialisation des services:', error);
  });

  it('should cleanup services on ngOnDestroy', () => {
    component.ngOnDestroy();
    expect(homeInitializationServiceMock.cleanup).toHaveBeenCalled();
  });

  it('should have correct host bindings', () => {
    expect(component.display).toBe('block');
    expect(component.height).toBe('100%');
  });

  it('should render content correctly', () => {
    component.ngOnInit();
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('img[src="assets/pictures/logo.png"]')).toBeTruthy();
  });

  describe('Content initialization', () => {
    it('should handle empty features array', () => {
      const contentWithEmptyFeatures = { ...mockContent, features: [] };
      homeContentServiceMock.getContent.and.returnValue(contentWithEmptyFeatures);

      component.ngOnInit();

      expect(component.content.features).toEqual([]);
    });

    it('should handle content with multiple features', () => {
          const contentWithMultipleFeatures = {
      ...mockContent,
      features: [
        { title: 'Feature 1', desc: 'Desc 1', icon: 'icon1.svg', iconType: 'custom' as const },
        { title: 'Feature 2', desc: 'Desc 2', icon: 'icon2.svg', iconType: 'custom' as const }
      ]
    };
      homeContentServiceMock.getContent.and.returnValue(contentWithMultipleFeatures);

      component.ngOnInit();

      expect(component.content.features.length).toBe(2);
      expect(component.content.features[0].title).toBe('Feature 1');
      expect(component.content.features[1].title).toBe('Feature 2');
    });
  });

  describe('Service initialization', () => {
    it('should handle successful service initialization', async () => {
      spyOn(console, 'log');
      homeInitializationServiceMock.initializeHomeServices.and.returnValue(Promise.resolve());

      component.ngOnInit();
      await fixture.whenStable();

      expect(console.log).toHaveBeenCalledWith('Services initialized successfully');
    });

    it('should handle service initialization timeout', async () => {
      spyOn(console, 'error');
      const timeoutError = new Error('Timeout');
      homeInitializationServiceMock.initializeHomeServices.and.returnValue(Promise.reject(timeoutError));

      component.ngOnInit();
      await fixture.whenStable();

      expect(console.error).toHaveBeenCalledWith('Erreur lors de l\'initialisation des services:', timeoutError);
    });
  });

  describe('Component lifecycle', () => {
    it('should call ngOnInit only once', () => {
      spyOn(component, 'ngOnInit');
      fixture.detectChanges();
      expect(component.ngOnInit).not.toHaveBeenCalled();
    });

    it('should call ngOnDestroy only once', () => {
      spyOn(component, 'ngOnDestroy');
      component.ngOnDestroy();
      expect(component.ngOnDestroy).toHaveBeenCalledTimes(1);
    });
  });
});
