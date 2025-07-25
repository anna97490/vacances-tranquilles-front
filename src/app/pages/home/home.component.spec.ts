import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { HomeContentService, HomeContent } from '../../services/home-content.service';
import { provideRouter } from '@angular/router';
import { Renderer2 } from '@angular/core';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockHomeContentService: jasmine.SpyObj<HomeContentService>;
  let mockRenderer: jasmine.SpyObj<Renderer2>;

  const mockFeature = {
    iconType: 'custom' as const,
    icon: 'assets/icons/beach_access.svg',
    title: 'Avantage Test',
    desc: 'Description de test'
  };

  const mockContent: HomeContent = {
    title: 'Accueil',
    subtitle: 'Sous-titre',
    introText: 'Introduction...',
    btnPrestataire: 'Inscription Prestataire',
    btnParticulier: 'Inscription Particulier',
    btnConnexion: 'Connexion',
    featuresTitle: 'Fonctionnalités',
    iconType: 'custom',
    mainIcon: 'home',
    features: [mockFeature]
  };

  beforeEach(async () => {
    mockHomeContentService = jasmine.createSpyObj('HomeContentService', ['getContent']);
    mockRenderer = jasmine.createSpyObj('Renderer2', ['createElement', 'appendChild']);

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        provideRouter([]),
        { provide: HomeContentService, useValue: mockHomeContentService },
        { provide: Renderer2, useValue: mockRenderer }
      ]
    }).compileComponents();

    mockHomeContentService.getContent.and.returnValue(mockContent);

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    // Nettoyer après chaque test
    if ((window as any).botpressWebChat) {
      delete (window as any).botpressWebChat;
    }
    // Nettoyer le DOM des scripts ajoutés
    document.querySelectorAll('script').forEach(s => {
      if (s.parentNode) s.parentNode.removeChild(s);
    });
    // Réinitialiser le tableau scriptElements si le composant existe
    if (component && component['scriptElements']) {
      component['scriptElements'] = [];
    }
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize content in ngOnInit', () => {
    expect(component.content).toEqual(mockContent);
  });

  it('should bind logo path correctly', () => {
    expect(component.mainLogo).toBe('assets/pictures/logo.png');
  });

  it('should render DOM elements from content', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.title')?.textContent).toContain(mockContent.title);
    expect(compiled.querySelector('.subtitle')?.textContent).toContain(mockContent.subtitle);
    expect(compiled.querySelector('.intro-text')?.textContent).toContain(mockContent.introText);
    expect(compiled.querySelector('.features-title')?.textContent).toContain(mockContent.featuresTitle);
    expect(compiled.querySelector('.feature-title')?.textContent).toContain(mockFeature.title);
    expect(compiled.querySelector('.feature-desc')?.textContent).toContain(mockFeature.desc);
  });

  it('should render feature card with image for iconType "custom"', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const image = compiled.querySelector('.feature-card img');
    expect(image).toBeTruthy();
    expect(image?.getAttribute('src')).toBe(mockFeature.icon);
  });

  it('should call addScript and append script', () => {
    // Instancier le composant avec le mock Renderer2, sans passer par Angular
    const scriptElement = document.createElement('script');
    let _src = '';
    Object.defineProperty(scriptElement, 'src', {
      get: () => _src,
      set: (val) => { _src = val; },
      configurable: true
    });
    mockRenderer.createElement.and.returnValue(scriptElement);
    const comp = new HomeComponent(mockHomeContentService, mockRenderer);
    comp['scriptElements'] = [];
    comp['addScript']('https://test-script.js');
    expect(mockRenderer.createElement).toHaveBeenCalledWith('script');
    expect(mockRenderer.appendChild).toHaveBeenCalledWith(document.body, scriptElement);
    expect(comp['scriptElements'].length).toBe(1);
    expect(comp['scriptElements'][0]).toBe(scriptElement);
    expect(scriptElement.src).toContain('https://test-script.js');
  });

  it('should remove script elements on ngOnDestroy', () => {
    const script1 = document.createElement('script');
    const script2 = document.createElement('script');
    document.body.appendChild(script1);
    document.body.appendChild(script2);
    component['scriptElements'].push(script1, script2);
    component.ngOnDestroy();
    expect(document.body.contains(script1)).toBeFalse();
    expect(document.body.contains(script2)).toBeFalse();
    expect(component['scriptElements'].length).toBe(0);
  });

  it('should generate a random ID starting with "id-"', () => {
    const id = component['generateSecureRandomId']();
    expect(id.startsWith('id-')).toBeTrue();
    expect(id.length).toBeGreaterThan(5);
  });

  it('should not throw when botpressWebChat is undefined', () => {
    // S'assurer que botpressWebChat est undefined
    delete (window as any).botpressWebChat;
    expect(() => component['sendBonjourToBotpress']()).not.toThrow();
  });

  it('should handle botpressWebChat without conversationId', () => {
    // Configurer botpressWebChat sans conversationId
    (window as any).botpressWebChat = {};
    expect(() => component['sendBonjourToBotpress']()).not.toThrow();
  });

  it('should send message when botpressWebChat is defined with conversationId', (done) => {
    const bpMock = {
      conversationId: 'abc123'
    };
    (window as any).botpressWebChat = bpMock;

    spyOn(component as any, 'generateSecureRandomId').and.returnValue('id-test-123');

    // Mock fetch avec une réponse réussie
    spyOn(window, 'fetch').and.returnValue(Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ success: true })
    }) as any);

    // Espionner console.log pour vérifier les messages
    spyOn(console, 'log');

    component['sendBonjourToBotpress']();

    setTimeout(() => {
      expect(window.fetch).toHaveBeenCalledWith(
        'https://webchat.botpress.cloud/30677914-9ece-488e-b7ad-f2415dad46c3/messages',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            conversationId: 'abc123',
            payload: {
              type: 'text',
              text: 'Bonjour'
            },
            metadata: {
              clientMessageId: 'id-test-123'
            }
          })
        }
      );
      // Accepte le message réel et n'importe quel objet en second argument
      expect(console.log).toHaveBeenCalledWith('Message envoyé avec succès', jasmine.any(Object));
      done();
    }, 600);
  });

  it('should handle fetch failure gracefully', (done) => {
    const bpMock = { conversationId: 'abc123' };
    (window as any).botpressWebChat = bpMock;

    spyOn(component as any, 'generateSecureRandomId').and.returnValue('id-fail');

    // Mock fetch avec une réponse d'erreur
    spyOn(window, 'fetch').and.returnValue(Promise.resolve({
      ok: false,
      status: 404,
      json: () => Promise.resolve({})
    }) as any);

    // Espionner console.error pour vérifier la gestion d'erreur
    spyOn(console, 'error');

    component['sendBonjourToBotpress']();

    setTimeout(() => {
      // Vérifier que fetch a été appelé avec la bonne URL
      expect(window.fetch).toHaveBeenCalledWith(
        'https://webchat.botpress.cloud/30677914-9ece-488e-b7ad-f2415dad46c3/messages',
        jasmine.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: jasmine.stringMatching(/"conversationId":"abc123"/)
        })
      );
      expect(console.error).toHaveBeenCalledWith('Erreur lors de l\'envoi du message', jasmine.any(Error));
      done();
    }, 600);
  });

  it('should handle fetch network error', (done) => {
    const bpMock = { conversationId: 'abc123' };
    (window as any).botpressWebChat = bpMock;

    spyOn(component as any, 'generateSecureRandomId').and.returnValue('id-network-error');

    // Mock fetch avec une erreur réseau
    spyOn(window, 'fetch').and.returnValue(Promise.reject(new Error('Network error')));

    // Espionner console.error pour vérifier la gestion d'erreur
    spyOn(console, 'error');

    component['sendBonjourToBotpress']();

    setTimeout(() => {
      // Vérifier que fetch a été appelé
      expect(window.fetch).toHaveBeenCalledWith(
        'https://webchat.botpress.cloud/30677914-9ece-488e-b7ad-f2415dad46c3/messages',
        jasmine.objectContaining({
          method: 'POST'
        })
      );
      expect(console.error).toHaveBeenCalledWith('Erreur lors de l\'envoi du message', jasmine.any(Error));
      done();
    }, 600);
  });

  describe('Edge Cases', () => {
    it('should handle empty features array', () => {
      const emptyContent = { ...mockContent, features: [] };
      mockHomeContentService.getContent.and.returnValue(emptyContent);

      const newComponent = TestBed.createComponent(HomeComponent);
      newComponent.detectChanges();

      const compiled = newComponent.nativeElement as HTMLElement;
      const featureCards = compiled.querySelectorAll('.feature-card');
      expect(featureCards.length).toBe(0);
    });

    it('should handle features with different iconType', () => {
      const materialFeature = {
        iconType: 'material' as const,
        icon: 'home',
        title: 'Material Icon',
        desc: 'Description material'
      };

      const contentWithMaterialIcon = {
        ...mockContent,
        features: [materialFeature]
      };

      mockHomeContentService.getContent.and.returnValue(contentWithMaterialIcon);

      const newComponent = TestBed.createComponent(HomeComponent);
      newComponent.detectChanges();

      const compiled = newComponent.nativeElement as HTMLElement;
      const materialIcon = compiled.querySelector('.feature-card mat-icon');
      expect(materialIcon).toBeTruthy();
      expect(materialIcon?.textContent?.trim()).toBe('home');
    });

    // Gérer le contenu null avec un contenu par défaut
    it('should handle null or undefined content gracefully', () => {
      mockHomeContentService.getContent.and.returnValue(null as any);
      const newComponent = TestBed.createComponent(HomeComponent).componentInstance;
      // Appeler ngOnInit explicitement avant l'assertion
      expect(() => newComponent.ngOnInit()).not.toThrow();
      expect(newComponent.content).toBeDefined();
    });

    // Test pour contenu undefined
    it('should handle undefined content gracefully', () => {
      mockHomeContentService.getContent.and.returnValue(undefined as any);
      const newComponent = TestBed.createComponent(HomeComponent).componentInstance;
      // Appeler ngOnInit explicitement avant l'assertion
      expect(() => newComponent.ngOnInit()).not.toThrow();
      expect(newComponent.content).toBeDefined();
    });

    // Test avec contenu partiellement manquant
    it('should handle content with missing properties', () => {
      const incompleteContent = {
        title: 'Titre seulement',
        // Propriétés manquantes intentionnellement
      } as HomeContent;

      mockHomeContentService.getContent.and.returnValue(incompleteContent);

      expect(() => {
        const newComponent = TestBed.createComponent(HomeComponent);
        newComponent.detectChanges();
      }).not.toThrow();
    });

    // Test avec features null
    it('should handle content with null features', () => {
      const contentWithNullFeatures = {
        ...mockContent,
        features: null as any
      };

      mockHomeContentService.getContent.and.returnValue(contentWithNullFeatures);

      expect(() => {
        const newComponent = TestBed.createComponent(HomeComponent);
        newComponent.detectChanges();
      }).not.toThrow();
    });
  });

  describe('Component Lifecycle', () => {
    it('should call ngOnInit and initialize content', () => {
      spyOn(component, 'ngOnInit').and.callThrough();
      component.ngOnInit();
      expect(component.ngOnInit).toHaveBeenCalled();
      expect(component.content).toEqual(mockContent);
    });

    it('should clean up scripts on ngOnDestroy', () => {
      const script = document.createElement('script');
      component['scriptElements'].push(script);
      document.body.appendChild(script);
      expect(document.body.contains(script)).toBeTrue();
      component.ngOnDestroy();
      expect(document.body.contains(script)).toBeFalse();
      expect(component['scriptElements'].length).toBe(0);
    });
  });

describe('Script Management', () => {
  let isolatedComponent: HomeComponent;

  // Utilitaire pour créer un mock d'élément script avec une propriété src modifiable
  function createMockScriptElement() {
    const script = document.createElement('script');
    let _src = '';
    Object.defineProperty(script, 'src', {
      get: () => _src,
      set: (val) => { _src = val; },
      configurable: true
    });
    return script;
  }

  beforeEach(() => {
    // Instancier le composant sans passer par Angular pour isoler le mock Renderer2
    isolatedComponent = new HomeComponent(mockHomeContentService, mockRenderer);
    isolatedComponent['scriptElements'] = [];
    mockRenderer.createElement.calls.reset();
    mockRenderer.appendChild.calls.reset();
  });

  it('should call addScript and append script', () => {
    const scriptElement = createMockScriptElement();
    mockRenderer.createElement.and.returnValue(scriptElement);
    isolatedComponent['addScript']('https://test-script.js');
    expect(mockRenderer.createElement).toHaveBeenCalledWith('script');
    expect(mockRenderer.appendChild).toHaveBeenCalledWith(document.body, scriptElement);
    expect(isolatedComponent['scriptElements'].length).toBe(1);
    expect(isolatedComponent['scriptElements'][0]).toBe(scriptElement);
    expect(scriptElement.src).toContain('https://test-script.js');
  });

  it('should add multiple scripts', () => {
    const script1 = createMockScriptElement();
    const script2 = createMockScriptElement();
    mockRenderer.createElement.and.returnValues(script1, script2);
    isolatedComponent['scriptElements'] = [];
    isolatedComponent['addScript']('https://script1.js');
    isolatedComponent['addScript']('https://script2.js');
    expect(mockRenderer.createElement).toHaveBeenCalledTimes(2);
    expect(mockRenderer.appendChild).toHaveBeenCalledTimes(2);
    expect(mockRenderer.appendChild).toHaveBeenCalledWith(document.body, script1);
    expect(mockRenderer.appendChild).toHaveBeenCalledWith(document.body, script2);
    expect(isolatedComponent['scriptElements'].length).toBe(2);
    expect(isolatedComponent['scriptElements'][0].src).toContain('https://script1.js');
    expect(isolatedComponent['scriptElements'][1].src).toContain('https://script2.js');
  });

  it('should set script src attribute', () => {
    const scriptElement = createMockScriptElement();
    mockRenderer.createElement.and.returnValue(scriptElement);
    isolatedComponent['scriptElements'] = [];
    isolatedComponent['addScript']('https://example.com/script.js');
    expect(scriptElement.src).toContain('https://example.com/script.js');
    expect(mockRenderer.createElement).toHaveBeenCalledWith('script');
    expect(mockRenderer.appendChild).toHaveBeenCalledWith(document.body, scriptElement);
  });

  it('should create script with correct attributes', () => {
    const scriptElement = createMockScriptElement();
    mockRenderer.createElement.and.returnValue(scriptElement);
    isolatedComponent['scriptElements'] = [];
    isolatedComponent['addScript']('https://cdn.example.com/lib.js');
    expect(scriptElement.src).toContain('https://cdn.example.com/lib.js');
    expect(scriptElement.tagName.toLowerCase()).toBe('script');
    expect(isolatedComponent['scriptElements']).toContain(scriptElement);
  });

  it('should handle script creation errors gracefully', () => {
    mockRenderer.createElement.and.throwError('Failed to create script');
    isolatedComponent['scriptElements'] = [];
    expect(() => isolatedComponent['addScript']('https://error-script.js')).toThrow();
    expect(isolatedComponent['scriptElements'].length).toBe(0);
  });
});

describe('Script Cleanup', () => {
  it('should remove script elements on ngOnDestroy', () => {
    // Utiliser de vrais éléments script pour ce test
    const script1 = document.createElement('script');
    const script2 = document.createElement('script');

    // Ajouter les scripts au DOM pour pouvoir les supprimer
    document.body.appendChild(script1);
    document.body.appendChild(script2);

    // Ajouter les scripts à la liste du composant
    component['scriptElements'] = [script1, script2];

    // Vérifier qu'ils sont dans le DOM
    expect(document.body.contains(script1)).toBeTrue();
    expect(document.body.contains(script2)).toBeTrue();

    // Appeler ngOnDestroy
    component.ngOnDestroy();

    // Vérifier qu'ils ont été supprimés du DOM
    expect(document.body.contains(script1)).toBeFalse();
    expect(document.body.contains(script2)).toBeFalse();

    // Vérifier que la liste a été vidée
    expect(component['scriptElements'].length).toBe(0);
  });

  it('should handle empty scriptElements array on ngOnDestroy', () => {
    component['scriptElements'] = [];

    expect(() => component.ngOnDestroy()).not.toThrow();
    expect(component['scriptElements'].length).toBe(0);
  });

  it('should handle script elements not in DOM on ngOnDestroy', () => {
    const script1 = document.createElement('script');
    const script2 = document.createElement('script');

    // Ne pas les ajouter au DOM mais les mettre dans la liste
    component['scriptElements'] = [script1, script2];

    expect(() => component.ngOnDestroy()).not.toThrow();
    expect(component['scriptElements'].length).toBe(0);
  });
});

  // Tests d'intégration pour les scripts
  describe('Script Integration', () => {
    it('should add and remove scripts in complete lifecycle', () => {
      const scriptElement = document.createElement('script');
      let _src = '';
      Object.defineProperty(scriptElement, 'src', {
        get: () => _src,
        set: (val) => { _src = val; },
        configurable: true
      });
      mockRenderer.createElement.and.returnValue(scriptElement);
      const comp = new HomeComponent(mockHomeContentService, mockRenderer);
      comp['scriptElements'] = [];
      comp['addScript']('https://integration-test.js');
      expect(mockRenderer.appendChild).toHaveBeenCalledWith(document.body, scriptElement);
      expect(comp['scriptElements'].length).toBe(1);
      // Simuler la suppression en rendant parentNode configurable
      Object.defineProperty(comp['scriptElements'][0], 'parentNode', {
        value: { removeChild: jasmine.createSpy() },
        configurable: true,
        writable: true
      });
      comp.ngOnDestroy();
      expect(comp['scriptElements'].length).toBe(0);
    });

    it('should handle multiple add/remove cycles', () => {
      const script1 = document.createElement('script');
      const script2 = document.createElement('script');
      mockRenderer.createElement.and.returnValues(script1, script2);
      component['scriptElements'] = [];
      // Premier cycle
      component['addScript']('https://script1.js');
      expect(component['scriptElements'].length).toBe(1);
      document.body.appendChild(script1);
      component.ngOnDestroy();
      expect(component['scriptElements'].length).toBe(0);
      // Deuxième cycle
      component['addScript']('https://script2.js');
      expect(component['scriptElements'].length).toBe(1);
      document.body.appendChild(script2);
      component.ngOnDestroy();
      expect(component['scriptElements'].length).toBe(0);
    });
  });
});