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
    icon: 'assets/icons/custom.svg',
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
    const scriptElement = document.createElement('script');
    mockRenderer.createElement.and.returnValue(scriptElement);
    component['addScript']('https://test-script.js');
    expect(mockRenderer.appendChild).toHaveBeenCalledWith(document.body, scriptElement);
    expect(component['scriptElements'].length).toBe(1);
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
  });

  it('should generate a random ID starting with "id-"', () => {
    const id = component['generateRandomId']();
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

    spyOn(component as any, 'generateRandomId').and.returnValue('id-test-123');
    
    // Mock fetch avec une réponse réussie
    spyOn(window, 'fetch').and.returnValue(Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ success: true })
    }) as any);

    // Espionner console.log pour vérifier les messages
    spyOn(console, 'log');

    component['sendBonjourToBotpress']();

    setTimeout(() => {
      expect(window.fetch).toHaveBeenCalledWith('https://chat.botpress.cloud/v1/chat/conversations/abc123/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'text',
          payload: { text: 'Bonjour' },
          messageId: 'id-test-123'
        })
      });
      expect(console.log).toHaveBeenCalledWith('Message "Bonjour" envoyé avec succès');
      done();
    }, 600);
  });

  it('should handle fetch failure gracefully', (done) => {
    const bpMock = { conversationId: 'abc123' };
    (window as any).botpressWebChat = bpMock;

    spyOn(component as any, 'generateRandomId').and.returnValue('id-fail');
    
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
      expect(window.fetch).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith('Erreur lors de l\'envoi du message', jasmine.any(Error));
      done();
    }, 600);
  });

  it('should handle fetch network error', (done) => {
    const bpMock = { conversationId: 'abc123' };
    (window as any).botpressWebChat = bpMock;

    spyOn(component as any, 'generateRandomId').and.returnValue('id-network-error');
    
    // Mock fetch avec une erreur réseau
    spyOn(window, 'fetch').and.returnValue(Promise.reject(new Error('Network error')));

    // Espionner console.error pour vérifier la gestion d'erreur
    spyOn(console, 'error');

    component['sendBonjourToBotpress']();

    setTimeout(() => {
      expect(window.fetch).toHaveBeenCalled();
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

    it('should handle null or undefined content gracefully', () => {
      mockHomeContentService.getContent.and.returnValue(null as any);
      
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
    });
  });

  describe('Script Management', () => {
    it('should add multiple scripts', () => {
      const script1 = document.createElement('script');
      const script2 = document.createElement('script');
      
      mockRenderer.createElement.and.returnValues(script1, script2);
      
      component['addScript']('https://script1.js');
      component['addScript']('https://script2.js');
      
      expect(mockRenderer.appendChild).toHaveBeenCalledTimes(2);
      expect(component['scriptElements'].length).toBe(2);
    });

    it('should set script src attribute', () => {
      const scriptElement = document.createElement('script');
      mockRenderer.createElement.and.returnValue(scriptElement);
      
      component['addScript']('https://example.com/script.js');
      
      expect(scriptElement.src).toBe('https://example.com/script.js');
    });
  });
});