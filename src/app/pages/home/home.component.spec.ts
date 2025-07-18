import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { MatIconModule } from '@angular/material/icon';
import { HomeComponent } from './home.component';
import { HomeContent, HomeFeature } from './../../services/home-content.service';
import { HomeContentService } from './../../services/home-content.service';
import { Renderer2 } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let debugElement: DebugElement;

  // Mock du service HomeContentService
  const mockHomeContentService = {
    getContent: jest.fn().mockReturnValue({
      title: 'Test Title',
      subtitle: 'Test Subtitle',
      description: 'Test Description'
    })
  };

  // Mock de Renderer2
  const mockRenderer2 = {
    createElement: jest.fn(),
    appendChild: jest.fn(),
    removeChild: jest.fn()
  };

  // Mock de fetch pour les tests
  const mockFetch = jest.fn();
  global.fetch = mockFetch;

  const mockContent: HomeContent = {
    iconType: 'custom' as const,
    mainIcon: 'assets/icons/beach_access_FFA101.svg',
    title: 'Vacances Tranquilles',
    subtitle: 'Votre partenaire de confiance pour des vacances sereines',
    introText: 'Simplifiez la gestion de vos locations saisonnières et profitez de services de conciergerie de qualité. Notre plateforme connecte propriétaires et prestataires de services pour une expérience sans souci.',
    btnPrestataire: 'Inscription Prestataires',
    btnParticulier: 'Inscription Particuliers',
    btnConnexion: 'Connexion',
    featuresTitle: 'Pourquoi Nous Choisir',
    features: [
      {
        iconType: 'custom' as const,
        icon: 'assets/icons/field_FFA101.svg',
        title: 'Prestataires Vérifiés',
        desc: 'Tous nos prestataires sont soigneusement sélectionnés et vérifiés'
      },
      {
        iconType: 'custom' as const,
        icon: 'assets/icons/calendar_FFA101.svg',
        title: 'Disponibilité 7j/7',
        desc: 'Une équipe disponible pour répondre à vos besoins'
      },
      {
        iconType: 'custom' as const,
        icon: 'assets/icons/thumb_up_FFA101.svg',
        title: 'Satisfaction Garantie',
        desc: 'Votre satisfaction est notre priorité absolue'
      },
      {
        iconType: 'custom' as const,
        icon: 'assets/icons/check_FFA101.svg',
        title: 'Service Personnalisé',
        desc: 'Des services adaptés à vos besoins spécifiques'
      }
    ]
  };

  beforeEach(async () => {
    // Reset tous les mocks avant chaque test
    jest.clearAllMocks();
    mockFetch.mockClear();

    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        CommonModule,
        NgOptimizedImage,
        RouterTestingModule,
        RouterModule.forRoot([]),
        MatIconModule,
        FooterComponent
      ],
      providers: [
        { provide: HomeContentService, useValue: mockHomeContentService },
        { provide: Renderer2, useValue: mockRenderer2 }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;

    // Configuration des inputs du composant
    component.mainLogo = 'assets/pictures/logo.png';
    component.content = mockContent;

    fixture.detectChanges();
  });

  afterEach(() => {
    // Nettoyer les timers et les mocks
    jest.clearAllTimers();
    jest.clearAllMocks();
    
    // Nettoyer window.botpressWebChat
    delete (window as any).botpressWebChat;
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with correct inputs', () => {
      expect(component.mainLogo).toBe('assets/pictures/logo.png');
      expect(component.content).toEqual(mockContent);
    });

    it('should have homepage container structure', () => {
      const container = debugElement.query(By.css('.homepage-container'));
      expect(container).toBeTruthy();
    });
  });

  describe('Template Rendering', () => {
    it('should display the main logo', () => {
      const logoImg = debugElement.query(By.css('.logo img'));
      expect(logoImg).toBeTruthy();
      expect(logoImg.nativeElement.src).toContain('assets/pictures/logo.png');
      expect(logoImg.nativeElement.classList.contains('logo')).toBeTruthy();
    });

    it('should display main title correctly', () => {
      const titleElement = debugElement.query(By.css('h2.title'));
      expect(titleElement).toBeTruthy();
      expect(titleElement.nativeElement.textContent.trim()).toBe(mockContent.title);
    });

    it('should display subtitle correctly', () => {
      const subtitleElement = debugElement.query(By.css('.subtitle'));
      expect(subtitleElement).toBeTruthy();
      expect(subtitleElement.nativeElement.textContent.trim()).toBe(mockContent.subtitle);
    });

    it('should display intro text correctly', () => {
      const introTextElement = debugElement.query(By.css('.intro-text'));
      expect(introTextElement).toBeTruthy();
      expect(introTextElement.nativeElement.textContent.trim()).toBe(mockContent.introText);
    });

    it('should have main content section', () => {
      const mainContent = debugElement.query(By.css('main.content'));
      expect(mainContent).toBeTruthy();
    });
  });

  describe('CTA Buttons', () => {
    it('should display all CTA buttons', () => {
      const ctaContainer = debugElement.query(By.css('.cta-buttons'));
      expect(ctaContainer).toBeTruthy();
      
      const buttons = debugElement.queryAll(By.css('.cta-buttons button'));
      expect(buttons.length).toBe(3);
    });

    it('should display prestataire button with correct link and text', () => {
      const prestataireBtn = debugElement.query(By.css('button[routerLink="/auth/register/prestataire"]'));
      expect(prestataireBtn).toBeTruthy();
      expect(prestataireBtn.nativeElement.textContent.trim()).toBe(mockContent.btnPrestataire);
      expect(prestataireBtn.nativeElement.classList.contains('btn')).toBeTruthy();
      expect(prestataireBtn.nativeElement.classList.contains('blue')).toBeTruthy();
    });

    it('should display particulier button with correct link and text', () => {
      const particulierBtn = debugElement.query(By.css('button[routerLink="/auth/register/particulier"]'));
      expect(particulierBtn).toBeTruthy();
      expect(particulierBtn.nativeElement.textContent.trim()).toBe(mockContent.btnParticulier);
      expect(particulierBtn.nativeElement.classList.contains('btn')).toBeTruthy();
      expect(particulierBtn.nativeElement.classList.contains('blue')).toBeTruthy();
    });

    it('should display connexion button with correct link and text', () => {
      const connexionBtn = debugElement.query(By.css('button[routerLink="/auth/login"]'));
      expect(connexionBtn).toBeTruthy();
      expect(connexionBtn.nativeElement.textContent.trim()).toBe(mockContent.btnConnexion);
      expect(connexionBtn.nativeElement.classList.contains('btn')).toBeTruthy();
      expect(connexionBtn.nativeElement.classList.contains('grey')).toBeTruthy();
    });

    it('should have correct router links on buttons', () => {
      const prestataireBtn = debugElement.query(By.css('button[routerLink="/auth/register/prestataire"]'));
      const particulierBtn = debugElement.query(By.css('button[routerLink="/auth/register/particulier"]'));
      const connexionBtn = debugElement.query(By.css('button[routerLink="/auth/login"]'));
      
      expect(prestataireBtn.nativeElement.getAttribute('routerLink')).toBe('/auth/register/prestataire');
      expect(particulierBtn.nativeElement.getAttribute('routerLink')).toBe('/auth/register/particulier');
      expect(connexionBtn.nativeElement.getAttribute('routerLink')).toBe('/auth/login');
    });
  });

  describe('Features Section', () => {
    it('should display features section with title', () => {
      const featuresSection = debugElement.query(By.css('.features-section'));
      expect(featuresSection).toBeTruthy();
      
      const featuresTitle = debugElement.query(By.css('h3.features-title'));
      expect(featuresTitle).toBeTruthy();
      expect(featuresTitle.nativeElement.textContent.trim()).toBe(mockContent.featuresTitle);
    });

    it('should display features grid', () => {
      const featuresGrid = debugElement.query(By.css('.features-grid'));
      expect(featuresGrid).toBeTruthy();
    });

    it('should display correct number of feature cards', () => {
      const featureCards = debugElement.queryAll(By.css('.feature-card'));
      expect(featureCards.length).toBe(mockContent.features.length);
    });

    it('should display feature cards with correct content', () => {
      const featureCards = debugElement.queryAll(By.css('.feature-card'));
      
      mockContent.features.forEach((feature: HomeFeature, index: number) => {
        const card = featureCards[index];
        
        // Vérifier le titre
        const titleElement = card.query(By.css('.feature-title'));
        expect(titleElement.nativeElement.textContent.trim()).toBe(feature.title);
        
        // Vérifier la description
        const descElement = card.query(By.css('.feature-desc'));
        expect(descElement.nativeElement.textContent.trim()).toBe(feature.desc);
      });
    });

    it('should display custom icons correctly', () => {
      const customFeatures = mockContent.features.filter((f: HomeFeature) => f.iconType === 'custom');
      
      customFeatures.forEach((feature: HomeFeature) => {
        const customIcon = debugElement.query(By.css(`img[src="${feature.icon}"]`));
        expect(customIcon).toBeTruthy();
        expect(customIcon.nativeElement.classList.contains('feature-icon')).toBeTruthy();
        expect(customIcon.nativeElement.alt).toBe(''); // Le template a alt=""
      });
    });

    it('should display material icons correctly', () => {
      // Créer un contenu de test avec des icônes material
      const contentWithMaterialIcons: HomeContent = {
        ...mockContent,
        features: [
          {
            iconType: 'material' as const,
            icon: 'verified',
            title: 'Service Certifié',
            desc: 'Certification qualité pour tous nos services'
          },
          {
            iconType: 'material' as const,
            icon: 'security',
            title: 'Sécurité',
            desc: 'Données protégées'
          }
        ]
      };
      
      component.content = contentWithMaterialIcons;
      fixture.detectChanges();
      
      const materialFeatures = contentWithMaterialIcons.features.filter((f: HomeFeature) => f.iconType === 'material');
      
      if (materialFeatures.length > 0) {
        // Chercher tous les mat-icon avec la classe feature-icon
        const matIcons = debugElement.queryAll(By.css('mat-icon.feature-icon'));
        expect(matIcons.length).toBe(materialFeatures.length);
        
        materialFeatures.forEach((feature: HomeFeature) => {
          const hasIcon = matIcons.some(icon => 
            icon.nativeElement.textContent.trim() === feature.icon
          );
          expect(hasIcon).toBeTruthy();
        });
      }
    });

    it('should handle mixed icon types in features', () => {
      // Test avec un mélange d'icônes custom et material
      const mixedContent: HomeContent = {
        ...mockContent,
        features: [
          {
            iconType: 'custom' as const,
            icon: 'assets/icons/custom.svg',
            title: 'Custom Feature',
            desc: 'Custom description'
          },
          {
            iconType: 'material' as const,
            icon: 'star',
            title: 'Material Feature',
            desc: 'Material description'
          }
        ]
      };
      
      component.content = mixedContent;
      fixture.detectChanges();
      
      const customIcon = debugElement.query(By.css('img.feature-icon'));
      const materialIcon = debugElement.query(By.css('mat-icon.feature-icon'));
      
      expect(customIcon).toBeTruthy();
      expect(materialIcon).toBeTruthy();
    });
  });

  describe('Footer', () => {
    it('should include footer component', () => {
      const footer = debugElement.query(By.css('app-footer'));
      expect(footer).toBeTruthy();
    });
  });

  describe('Component Input Changes', () => {
    it('should update logo when mainLogo input changes', () => {
      const newLogo = 'assets/new-logo.png';
      component.mainLogo = newLogo;
      fixture.detectChanges();

      const logoImg = debugElement.query(By.css('.logo img'));
      expect(logoImg.nativeElement.src).toContain(newLogo);
    });

    it('should update content when content input changes', () => {
      const newContent: HomeContent = {
        ...mockContent,
        title: 'Nouveau Titre',
        subtitle: 'Nouveau Sous-titre'
      };
      
      component.content = newContent;
      fixture.detectChanges();

      const titleElement = debugElement.query(By.css('h2.title'));
      const subtitleElement = debugElement.query(By.css('.subtitle'));
      
      expect(titleElement.nativeElement.textContent.trim()).toBe('Nouveau Titre');
      expect(subtitleElement.nativeElement.textContent.trim()).toBe('Nouveau Sous-titre');
    });

    it('should update features when features array changes', () => {
      const newContent: HomeContent = {
        ...mockContent,
        features: [
          {
            iconType: 'custom' as const,
            icon: 'assets/icons/new.svg',
            title: 'Nouvelle Fonctionnalité',
            desc: 'Description de la nouvelle fonctionnalité'
          }
        ]
      };
      
      component.content = newContent;
      fixture.detectChanges();

      const featureCards = debugElement.queryAll(By.css('.feature-card'));
      expect(featureCards.length).toBe(1);
      
      const titleElement = featureCards[0].query(By.css('.feature-title'));
      expect(titleElement.nativeElement.textContent.trim()).toBe('Nouvelle Fonctionnalité');
    });
  });

  describe('Error Handling', () => {
    it('should handle empty mainLogo gracefully', () => {
      component.mainLogo = '';
      
      expect(() => fixture.detectChanges()).not.toThrow();
    });

    it('should handle empty features array', () => {
      const contentWithEmptyFeatures: HomeContent = {
        ...mockContent,
        features: []
      };
      
      component.content = contentWithEmptyFeatures;
      fixture.detectChanges();
      
      const featureCards = debugElement.queryAll(By.css('.feature-card'));
      expect(featureCards.length).toBe(0);
    });

    it('should handle content with minimal data', () => {
      const minimalContent: HomeContent = {
        iconType: 'custom' as const,
        mainIcon: '',
        title: '',
        subtitle: '',
        introText: '',
        btnPrestataire: '',
        btnParticulier: '',
        btnConnexion: '',
        featuresTitle: '',
        features: []
      };
      
      component.content = minimalContent;
      
      expect(() => fixture.detectChanges()).not.toThrow();
    });
  });

  describe('CSS Classes and Structure', () => {
    it('should have correct CSS classes on buttons', () => {
      const blueButtons = debugElement.queryAll(By.css('button.btn.blue'));
      const greyButtons = debugElement.queryAll(By.css('button.btn.grey'));
      
      expect(blueButtons.length).toBe(2); // prestataire et particulier
      expect(greyButtons.length).toBe(1); // connexion
    });

    it('should have proper section structure', () => {
      const main = debugElement.query(By.css('main.content'));
      const section = debugElement.query(By.css('section.features-section'));
      
      expect(main).toBeTruthy();
      expect(section).toBeTruthy();
    });

    it('should have proper heading hierarchy', () => {
      const h2 = debugElement.query(By.css('h2.title'));
      const h3 = debugElement.query(By.css('h3.features-title'));
      
      expect(h2).toBeTruthy();
      expect(h3).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have proper alt attributes for images', () => {
      const logoImg = debugElement.query(By.css('.logo img'));
      const featureIcons = debugElement.queryAll(By.css('img.feature-icon'));
      
      expect(logoImg.nativeElement.hasAttribute('alt')).toBeTruthy();
      featureIcons.forEach(icon => {
        expect(icon.nativeElement.hasAttribute('alt')).toBeTruthy();
      });
    });

    it('should have proper heading structure', () => {
      const h2 = debugElement.query(By.css('h2'));
      const h3 = debugElement.query(By.css('h3'));
      
      expect(h2).toBeTruthy();
      expect(h3).toBeTruthy();
    });

    it('should have semantic HTML structure', () => {
      const main = debugElement.query(By.css('main'));
      const section = debugElement.query(By.css('section'));
      
      expect(main).toBeTruthy();
      expect(section).toBeTruthy();
    });
  });

  describe('Router Integration', () => {
    it('should have routerLink attributes on buttons', () => {
      const routerLinks = debugElement.queryAll(By.css('button[routerLink]'));
      expect(routerLinks.length).toBe(3);
      
      const routes = routerLinks.map(link => link.nativeElement.getAttribute('routerLink'));
      expect(routes).toContain('/auth/register/prestataire');
      expect(routes).toContain('/auth/register/particulier');
      expect(routes).toContain('/auth/login');
    });
  });

  describe('Botpress Integration (lines 57-95)', () => {
    describe('sendBonjourToBotpress Method', () => {
      beforeEach(() => {
        jest.useFakeTimers();
      });

      afterEach(() => {
        jest.useRealTimers();
      });

      it('should wait for botpressWebChat to be available before sending message', fakeAsync(() => {
        // Mock de fetch avec une réponse réussie
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue({ success: true })
        });

        // Appeler la méthode
        (component as any).sendBonjourToBotpress();

        // Vérifier que l'intervalle est créé mais aucune requête n'est envoyée initialement
        expect(mockFetch).not.toHaveBeenCalled();

        // Simuler que botpressWebChat devient disponible
        (window as any).botpressWebChat = {
          conversationId: 'test-conversation-id'
        };

        // Avancer le timer de 500ms
        tick(500);

        // Vérifier que fetch a été appelé
        expect(mockFetch).toHaveBeenCalledWith(
          'https://webchat.botpress.cloud/30677914-9ece-488e-b7ad-f2415dad46c3/messages',
          expect.objectContaining({
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: expect.stringContaining('test-conversation-id')
          })
        );
      }));

      it('should send correct message payload to Botpress', fakeAsync(() => {
        // Mock de fetch avec une réponse réussie
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue({ success: true })
        });

        // Mock de generateRandomId
        const mockId = 'test-random-id';
        jest.spyOn(component as any, 'generateRandomId').mockReturnValue(mockId);

        // Configurer botpressWebChat
        (window as any).botpressWebChat = {
          conversationId: 'test-conversation-id'
        };

        // Appeler la méthode
        (component as any).sendBonjourToBotpress();

        // Avancer le timer
        tick(500);

        // Vérifier le payload
        const expectedPayload = {
          conversationId: 'test-conversation-id',
          payload: { type: 'text', text: 'Bonjour' },
          metadata: { clientMessageId: mockId }
        };

        expect(mockFetch).toHaveBeenCalledWith(
          'https://webchat.botpress.cloud/30677914-9ece-488e-b7ad-f2415dad46c3/messages',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(expectedPayload)
          }
        );
      }));

      it('should handle successful response from Botpress', fakeAsync(() => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
        const mockResponse = { messageId: 'msg-123', status: 'sent' };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue(mockResponse)
        });

        (window as any).botpressWebChat = {
          conversationId: 'test-conversation-id'
        };

        (component as any).sendBonjourToBotpress();
        tick(500);

        // Attendre que les promesses se résolvent
        tick(100);

        expect(consoleSpy).toHaveBeenCalledWith('Message envoyé avec succès', mockResponse);
        
        consoleSpy.mockRestore();
      }));

      it('should handle HTTP error response from Botpress', fakeAsync(() => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error'
        });

        (window as any).botpressWebChat = {
          conversationId: 'test-conversation-id'
        };

        (component as any).sendBonjourToBotpress();
        tick(500);

        // Attendre que les promesses se résolvent
        tick(100);

        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Erreur lors de l\'envoi du message',
          expect.any(Error)
        );
        
        consoleErrorSpy.mockRestore();
      }));

      it('should handle network error', fakeAsync(() => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        const networkError = new Error('Network error');

        mockFetch.mockRejectedValueOnce(networkError);

        (window as any).botpressWebChat = {
          conversationId: 'test-conversation-id'
        };

        (component as any).sendBonjourToBotpress();
        tick(500);

        // Attendre que les promesses se résolvent
        tick(100);

        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Erreur lors de l\'envoi du message',
          networkError
        );
        
        consoleErrorSpy.mockRestore();
      }));

      it('should clear interval after successful message send', fakeAsync(() => {
        const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue({ success: true })
        });

        (window as any).botpressWebChat = {
          conversationId: 'test-conversation-id'
        };

        (component as any).sendBonjourToBotpress();
        tick(500);

        expect(clearIntervalSpy).toHaveBeenCalled();
        
        clearIntervalSpy.mockRestore();
      }));

      it('should continue polling if botpressWebChat is not available', fakeAsync(() => {
        (component as any).sendBonjourToBotpress();

        // Première tentative - pas de botpressWebChat
        tick(500);
        expect(mockFetch).not.toHaveBeenCalled();

        // Deuxième tentative - toujours pas disponible
        tick(500);
        expect(mockFetch).not.toHaveBeenCalled();

        // Troisième tentative - botpressWebChat devient disponible
        (window as any).botpressWebChat = {
          conversationId: 'test-conversation-id'
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue({ success: true })
        });

        tick(500);
        expect(mockFetch).toHaveBeenCalledTimes(1);
      }));

      it('should not send message if conversationId is missing', fakeAsync(() => {
        // botpressWebChat existe mais sans conversationId
        (window as any).botpressWebChat = {};

        (component as any).sendBonjourToBotpress();
        tick(500);

        expect(mockFetch).not.toHaveBeenCalled();

        // Avec conversationId undefined
        (window as any).botpressWebChat.conversationId = undefined;
        tick(500);

        expect(mockFetch).not.toHaveBeenCalled();

        // Avec conversationId null
        (window as any).botpressWebChat.conversationId = null;
        tick(500);

        expect(mockFetch).not.toHaveBeenCalled();
      }));
    });

    describe('generateRandomId Method', () => {
      it('should generate a unique ID with correct format', () => {
        const id1 = (component as any).generateRandomId();
        const id2 = (component as any).generateRandomId();

        // Vérifier le format
        expect(id1).toMatch(/^id-[a-z0-9]{16}$/);
        expect(id2).toMatch(/^id-[a-z0-9]{16}$/);

        // Vérifier l'unicité
        expect(id1).not.toBe(id2);
      });

      it('should always start with "id-" prefix', () => {
        for (let i = 0; i < 10; i++) {
          const id = (component as any).generateRandomId();
          expect(id).toMatch(/^id-/);
        }
      });

      it('should generate IDs of consistent length', () => {
        for (let i = 0; i < 10; i++) {
          const id = (component as any).generateRandomId();
          expect(id.length).toBe(19); // 'id-' (3) + 16 caractères
        }
      });

      it('should only contain valid characters', () => {
        for (let i = 0; i < 10; i++) {
          const id = (component as any).generateRandomId();
          const validPattern = /^id-[a-z0-9]+$/;
          expect(id).toMatch(validPattern);
        }
      });

      it('should be statistically random', () => {
        const ids = new Set();
        const iterations = 100;

        // Générer plusieurs IDs
        for (let i = 0; i < iterations; i++) {
          const id = (component as any).generateRandomId();
          ids.add(id);
        }

        // Tous les IDs devraient être uniques
        expect(ids.size).toBe(iterations);
      });
    });

    describe('Integration Tests', () => {
      beforeEach(() => {
        jest.useFakeTimers();
      });

      afterEach(() => {
        jest.useRealTimers();
      });

      it('should integrate generateRandomId with sendBonjourToBotpress', fakeAsync(() => {
        const generateIdSpy = jest.spyOn(component as any, 'generateRandomId');
        const testId = 'test-generated-id';
        generateIdSpy.mockReturnValue(testId);

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue({ success: true })
        });

        (window as any).botpressWebChat = {
          conversationId: 'test-conversation-id'
        };

        (component as any).sendBonjourToBotpress();
        tick(500);

        // Vérifier que generateRandomId a été appelé
        expect(generateIdSpy).toHaveBeenCalled();

        // Vérifier que l'ID généré est utilisé dans la requête
        const callArgs = mockFetch.mock.calls[0];
        const requestBody = JSON.parse(callArgs[1].body);
        expect(requestBody.metadata.clientMessageId).toBe(testId);

        generateIdSpy.mockRestore();
      }));

      it('should handle multiple rapid calls to sendBonjourToBotpress', fakeAsync(() => {
        const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

        mockFetch.mockResolvedValue({
          ok: true,
          json: jest.fn().mockResolvedValue({ success: true })
        });

        (window as any).botpressWebChat = {
          conversationId: 'test-conversation-id'
        };

        // Appeler plusieurs fois rapidement
        (component as any).sendBonjourToBotpress();
        (component as any).sendBonjourToBotpress();
        (component as any).sendBonjourToBotpress();

        tick(500);

        // Vérifier qu'au moins un message a été envoyé
        expect(mockFetch).toHaveBeenCalled();
        
        // Vérifier que les intervals sont nettoyés
        expect(clearIntervalSpy).toHaveBeenCalled();

        clearIntervalSpy.mockRestore();
      }));
    });

    describe('Error Scenarios', () => {
      beforeEach(() => {
        jest.useFakeTimers();
      });

      afterEach(() => {
        jest.useRealTimers();
      });

      it('should handle invalid JSON response', fakeAsync(() => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockRejectedValue(new Error('Invalid JSON'))
        });

        (window as any).botpressWebChat = {
          conversationId: 'test-conversation-id'
        };

        (component as any).sendBonjourToBotpress();
        tick(500);
        tick(100);

        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Erreur lors de l\'envoi du message',
          expect.any(Error)
        );

        consoleErrorSpy.mockRestore();
      }));

      it('should handle fetch timeout', fakeAsync(() => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        const timeoutError = new Error('Request timeout');

        mockFetch.mockRejectedValueOnce(timeoutError);

        (window as any).botpressWebChat = {
          conversationId: 'test-conversation-id'
        };

        (component as any).sendBonjourToBotpress();
        tick(500);
        tick(100);

        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Erreur lors de l\'envoi du message',
          timeoutError
        );

        consoleErrorSpy.mockRestore();
      }));

      it('should handle undefined window object gracefully', fakeAsync(() => {
        // Sauvegarder la référence originale
        const originalWindow = global.window;

        // Simuler l'absence de window (environnement SSR)
        (global as any).window = undefined;

        expect(() => {
          (component as any).sendBonjourToBotpress();
          tick(500);
        }).not.toThrow();

        // Restaurer window
        global.window = originalWindow;
      }));
    });
  });

  describe('Content Validation', () => {
    it('should render features with proper structure', () => {
      const featureCards = debugElement.queryAll(By.css('.feature-card'));
      
      featureCards.forEach((card, index) => {
        const feature = mockContent.features[index];
        
        // Chaque carte doit avoir une icône
        const icon = card.query(By.css('.feature-icon'));
        expect(icon).toBeTruthy();
        
        // Chaque carte doit avoir un titre
        const title = card.query(By.css('.feature-title'));
        expect(title).toBeTruthy();
        expect(title.nativeElement.textContent.trim()).toBe(feature.title);
        
        // Chaque carte doit avoir une description
        const desc = card.query(By.css('.feature-desc'));
        expect(desc).toBeTruthy();
        expect(desc.nativeElement.textContent.trim()).toBe(feature.desc);
      });
    });
  });
});