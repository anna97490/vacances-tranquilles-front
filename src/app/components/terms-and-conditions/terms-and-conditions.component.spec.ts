import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TermsAndConditionsComponent } from './terms-and-conditions.component';
import { LocationService } from './../../services/terms-and-conditions/location.service';

// Mocks robustes pour CGU/CGV
const MOCK_CGU = {
  title: 'Conditions Générales d\'Utilisation',
  date: '2024-01-01',
  sections: [
    { title: 'Section 1', content: [{ text: 'Texte CGU 1' }] },
    { title: 'Section 2', content: [{ text: 'Texte CGU 2' }] }
  ]
};
const MOCK_CGV = {
  title: 'Conditions Générales de Vente',
  date: '2024-01-01',
  sections: [
    { title: 'Section 1', content: [{ text: 'Texte CGV 1' }] }
  ]
};

// Mocks pour cas limites
const EMPTY_CGU = { title: '', date: '', sections: [] };
const EMPTY_CGV = { title: '', date: '', sections: [] };

// Utilitaire pour nettoyer le DOM après chaque test
function cleanDOM() {
  document.querySelectorAll('h2, h3, p').forEach(e => {
    if (e.parentNode) e.parentNode.removeChild(e);
  });
}

// Importer les vraies données CGU/CGV pour les tests de rendu
import { CGU_DATA } from './../../services/terms-and-conditions/cgu';
import { CGV_DATA } from './../../services/terms-and-conditions/cgv';

describe('TermsAndConditionsComponent (robuste)', () => {
  let component: TermsAndConditionsComponent;
  let fixture: ComponentFixture<TermsAndConditionsComponent>;
  let mockLocationService: { getPathname: jasmine.Spy };

  // Sauvegarde des getters originaux pour éviter les effets de bord
  let originalCguContentGetter: PropertyDescriptor | undefined;
  let originalCgvContentGetter: PropertyDescriptor | undefined;

  beforeAll(() => {
    // Sauvegarder les getters originaux
    originalCguContentGetter = Object.getOwnPropertyDescriptor(TermsAndConditionsComponent.prototype, 'cguContent');
    originalCgvContentGetter = Object.getOwnPropertyDescriptor(TermsAndConditionsComponent.prototype, 'cgvContent');
    // Redéfinir les getters pour injecter les mocks par défaut
    Object.defineProperty(TermsAndConditionsComponent.prototype, 'cguContent', {
      get: () => MOCK_CGU,
      configurable: true
    });
    Object.defineProperty(TermsAndConditionsComponent.prototype, 'cgvContent', {
      get: () => MOCK_CGV,
      configurable: true
    });
  });

  beforeEach(async () => {
    mockLocationService = {
      getPathname: jasmine.createSpy('getPathname')
    };
    await TestBed.configureTestingModule({
      imports: [TermsAndConditionsComponent],
      providers: [
        { provide: LocationService, useValue: mockLocationService }
      ]
    }).compileComponents();
  });

  afterEach(() => {
    cleanDOM();
    mockLocationService.getPathname.calls.reset();
    // Toujours restaurer les getters originaux après chaque test
    if (originalCguContentGetter) {
      Object.defineProperty(TermsAndConditionsComponent.prototype, 'cguContent', originalCguContentGetter);
    }
    if (originalCgvContentGetter) {
      Object.defineProperty(TermsAndConditionsComponent.prototype, 'cgvContent', originalCgvContentGetter);
    }
  });

  it('devrait créer le composant', () => {
    mockLocationService.getPathname.and.returnValue('/terms-and-conditions/cgu');
    fixture = TestBed.createComponent(TermsAndConditionsComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  describe('Détection de la route', () => {
    it('devrait détecter CGU', () => {
      mockLocationService.getPathname.and.returnValue('/terms-and-conditions/cgu');
      fixture = TestBed.createComponent(TermsAndConditionsComponent);
      component = fixture.componentInstance;
      expect(component.isCGU).toBeTrue();
      expect(component.isCGV).toBeFalse();
      expect(component.isShowingCGU()).toBeTrue();
      expect(component.isShowingCGV()).toBeFalse();
    });
    it('devrait détecter CGV', () => {
      mockLocationService.getPathname.and.returnValue('/terms-and-conditions/cgv');
      fixture = TestBed.createComponent(TermsAndConditionsComponent);
      component = fixture.componentInstance;
      expect(component.isCGU).toBeFalse();
      expect(component.isCGV).toBeTrue();
      expect(component.isShowingCGU()).toBeFalse();
      expect(component.isShowingCGV()).toBeTrue();
    });
    it('aucun flag ne doit être à true pour une autre route', () => {
      mockLocationService.getPathname.and.returnValue('/autre');
      fixture = TestBed.createComponent(TermsAndConditionsComponent);
      component = fixture.componentInstance;
      expect(component.isCGU).toBeFalse();
      expect(component.isCGV).toBeFalse();
      expect(component.isShowingCGU()).toBeFalse();
      expect(component.isShowingCGV()).toBeFalse();
    });
    it('doit détecter partiellement cgu/cgv', () => {
      mockLocationService.getPathname.and.returnValue('/foo-cgu-bar');
      fixture = TestBed.createComponent(TermsAndConditionsComponent);
      component = fixture.componentInstance;
      expect(component.isCGU).toBeTrue();
      mockLocationService.getPathname.and.returnValue('/foo-cgv-bar');
      fixture = TestBed.createComponent(TermsAndConditionsComponent);
      component = fixture.componentInstance;
      expect(component.isCGV).toBeTrue();
    });
  });

  describe('Méthodes publiques', () => {
    beforeEach(() => {
      mockLocationService.getPathname.and.returnValue('/terms-and-conditions/cgu');
      // Redéfinir le getter cguContent juste avant chaque test de contenu
      Object.defineProperty(TermsAndConditionsComponent.prototype, 'cguContent', {
        get: () => MOCK_CGU,
        configurable: true
      });
      Object.defineProperty(TermsAndConditionsComponent.prototype, 'cgvContent', {
        get: () => MOCK_CGV,
        configurable: true
      });
      fixture = TestBed.createComponent(TermsAndConditionsComponent);
      component = fixture.componentInstance;
    });
    afterEach(() => {
      // Restaurer les getters originaux après chaque test
      if (originalCguContentGetter) {
        Object.defineProperty(TermsAndConditionsComponent.prototype, 'cguContent', originalCguContentGetter);
      }
      if (originalCgvContentGetter) {
        Object.defineProperty(TermsAndConditionsComponent.prototype, 'cgvContent', originalCgvContentGetter);
      }
    });
    it('isArray doit détecter un tableau', () => {
      expect(component.isArray(['a', 'b'])).toBeTrue();
      expect(component.isArray('foo')).toBeFalse();
    });
    it('getContent retourne le bon contenu pour CGU', () => {
      expect(component.getContent()).toEqual(MOCK_CGU);
    });
    it('getContent retourne le bon contenu pour CGV', () => {
      // Redéfinir le getter cgvContent juste avant ce test
      Object.defineProperty(TermsAndConditionsComponent.prototype, 'cgvContent', {
        get: () => MOCK_CGV,
        configurable: true
      });
      mockLocationService.getPathname.and.returnValue('/terms-and-conditions/cgv');
      fixture = TestBed.createComponent(TermsAndConditionsComponent);
      component = fixture.componentInstance;
      expect(component.getContent()).toEqual(MOCK_CGV);
    });
    it('getContent retourne un objet vide si aucun flag', () => {
      mockLocationService.getPathname.and.returnValue('/autre');
      fixture = TestBed.createComponent(TermsAndConditionsComponent);
      component = fixture.componentInstance;
      expect(component.getContent()).toEqual({ title: '', date: '', sections: [] });
    });
  });

  describe('Structure des données', () => {
    beforeEach(() => {
      mockLocationService.getPathname.and.returnValue('/terms-and-conditions/cgu');
      fixture = TestBed.createComponent(TermsAndConditionsComponent);
      component = fixture.componentInstance;
    });
    it('cguContent et cgvContent doivent avoir la bonne structure', () => {
      const cgu = component.cguContent;
      expect(cgu.title).toBeDefined();
      expect(Array.isArray(cgu.sections)).toBeTrue();
      cgu.sections.forEach(section => {
        expect(section.title).toBeDefined();
        expect(Array.isArray(section.content)).toBeTrue();
        section.content.forEach(c => {
          expect(typeof c.text).toBe('string');
        });
      });
      const cgv = component.cgvContent;
      expect(cgv.title).toBeDefined();
      expect(Array.isArray(cgv.sections)).toBeTrue();
    });
    // Cas limite : CGU vide
    it('gère un contenu CGU vide sans erreur', () => {
      Object.defineProperty(TermsAndConditionsComponent.prototype, 'cguContent', {
        get: () => EMPTY_CGU,
        configurable: true
      });
      expect(() => {
        fixture = TestBed.createComponent(TermsAndConditionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      }).not.toThrow();
    });
    // Cas limite : CGV vide
    it('gère un contenu CGV vide sans erreur', () => {
      Object.defineProperty(TermsAndConditionsComponent.prototype, 'cgvContent', {
        get: () => EMPTY_CGV,
        configurable: true
      });
      mockLocationService.getPathname.and.returnValue('/terms-and-conditions/cgv');
      expect(() => {
        fixture = TestBed.createComponent(TermsAndConditionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      }).not.toThrow();
    });
  });

  describe('Rendu du template', () => {
    beforeEach(() => {
      // Utiliser les vraies données pour les tests de rendu
      Object.defineProperty(TermsAndConditionsComponent.prototype, 'cguContent', {
        get: () => CGU_DATA,
        configurable: true
      });
      Object.defineProperty(TermsAndConditionsComponent.prototype, 'cgvContent', {
        get: () => CGV_DATA,
        configurable: true
      });
    });
    afterEach(() => {
      // Restaurer les getters originaux après chaque test
      if (originalCguContentGetter) {
        Object.defineProperty(TermsAndConditionsComponent.prototype, 'cguContent', originalCguContentGetter);
      }
      if (originalCgvContentGetter) {
        Object.defineProperty(TermsAndConditionsComponent.prototype, 'cgvContent', originalCgvContentGetter);
      }
    });
    it('affiche le titre et les sections CGU', () => {
      mockLocationService.getPathname.and.returnValue('/terms-and-conditions/cgu');
      fixture = TestBed.createComponent(TermsAndConditionsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('h2')?.textContent).toMatch(/Utilisation/i);
      const sections = compiled.querySelectorAll('h3');
      expect(sections.length).toBe(CGU_DATA.sections.length);
    });
    it('affiche le titre et les sections CGV', () => {
      mockLocationService.getPathname.and.returnValue('/terms-and-conditions/cgv');
      fixture = TestBed.createComponent(TermsAndConditionsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('h2')?.textContent).toMatch(/Vente/i);
      const sections = compiled.querySelectorAll('h3');
      expect(sections.length).toBe(CGV_DATA.sections.length);
    });
    it('affiche le fallback si aucun flag', () => {
      mockLocationService.getPathname.and.returnValue('/autre');
      fixture = TestBed.createComponent(TermsAndConditionsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toMatch(/Aucune condition à afficher/i);
    });
    it('affiche le titre même si sections vide', () => {
      Object.defineProperty(TermsAndConditionsComponent.prototype, 'cguContent', {
        get: () => ({ ...CGU_DATA, sections: [] }),
        configurable: true
      });
      mockLocationService.getPathname.and.returnValue('/terms-and-conditions/cgu');
      fixture = TestBed.createComponent(TermsAndConditionsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('h2')?.textContent).toMatch(/Utilisation/i);
      const sections = compiled.querySelectorAll('h3');
      expect(sections.length).toBe(0);
    });
  });
});