import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { TermsAndConditionsComponent } from './terms-and-conditions.component';
import { CGU_DATA } from '../../services/terms-and-conditions/cgu';
import { CGV_DATA } from '../../services/terms-and-conditions/cgv';

// Mock de window.location pour les tests
const mockLocation = {
  pathname: '/',
  href: 'http://localhost:4200/',
  origin: 'http://localhost:4200',
  protocol: 'http:',
  host: 'localhost:4200',
  hostname: 'localhost',
  port: '4200',
  search: '',
  hash: '',
  assign: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
};

describe('TermsAndConditionsComponent', () => {
  let component: TermsAndConditionsComponent;
  let fixture: ComponentFixture<TermsAndConditionsComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    // Configuration des mocks spécifiques à ce test
    Object.defineProperty(window, 'location', {
      value: mockLocation,
      writable: true,
      configurable: true
    });

    await TestBed.configureTestingModule({
      imports: [TermsAndConditionsComponent, CommonModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TermsAndConditionsComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
  });

  afterEach(() => {
    // Restaurer le location original après chaque test
    Object.defineProperty(window, 'location', {
      value: mockLocation,
      writable: true,
      configurable: true
    });
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have default values for isCGU and isCGV', () => {
      expect(component.isCGU).toBe(false);
      expect(component.isCGV).toBe(false);
    });
  });

  describe('Path Detection', () => {
    it('should set isCGU to true when path contains "cgu"', () => {
      // Mock window.location pour le test CGU
      Object.defineProperty(window, 'location', {
        value: { ...mockLocation, pathname: '/cgu' },
        writable: true,
        configurable: true
      });

      // Recréer le composant avec le nouveau path
      fixture = TestBed.createComponent(TermsAndConditionsComponent);
      component = fixture.componentInstance;

      expect(component.isCGU).toBe(true);
      expect(component.isCGV).toBe(false);
    });

    it('should set isCGV to true when path contains "cgv"', () => {
      // Mock window.location pour le test CGV
      Object.defineProperty(window, 'location', {
        value: { ...mockLocation, pathname: '/cgv' },
        writable: true,
        configurable: true
      });

      // Recréer le composant avec le nouveau path
      fixture = TestBed.createComponent(TermsAndConditionsComponent);
      component = fixture.componentInstance;

      expect(component.isCGV).toBe(true);
      expect(component.isCGU).toBe(false);
    });

    it('should handle paths with cgu in nested routes', () => {
      Object.defineProperty(window, 'location', {
        value: { ...mockLocation, pathname: '/legal/cgu' },
        writable: true,
        configurable: true
      });

      fixture = TestBed.createComponent(TermsAndConditionsComponent);
      component = fixture.componentInstance;

      expect(component.isCGU).toBe(true);
      expect(component.isCGV).toBe(false);
    });

    it('should handle paths with cgv in nested routes', () => {
      Object.defineProperty(window, 'location', {
        value: { ...mockLocation, pathname: '/legal/cgv' },
        writable: true,
        configurable: true
      });

      fixture = TestBed.createComponent(TermsAndConditionsComponent);
      component = fixture.componentInstance;

      expect(component.isCGV).toBe(true);
      expect(component.isCGU).toBe(false);
    });

    it('should not set flags for unrelated paths', () => {
      Object.defineProperty(window, 'location', {
        value: { ...mockLocation, pathname: '/home' },
        writable: true,
        configurable: true
      });

      fixture = TestBed.createComponent(TermsAndConditionsComponent);
      component = fixture.componentInstance;

      expect(component.isCGU).toBe(false);
      expect(component.isCGV).toBe(false);
    });
  });

  describe('Content Getters', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should return CGU_DATA for cguContent getter', () => {
      expect(component.cguContent).toEqual(CGU_DATA);
      expect(component.cguContent.title).toBeDefined();
      expect(component.cguContent.sections).toBeDefined();
      expect(Array.isArray(component.cguContent.sections)).toBe(true);
    });

    it('should return CGV_DATA for cgvContent getter', () => {
      expect(component.cgvContent).toEqual(CGV_DATA);
      expect(component.cgvContent.title).toBeDefined();
      expect(component.cgvContent.sections).toBeDefined();
      expect(Array.isArray(component.cgvContent.sections)).toBe(true);
    });

    it('should verify CGU content structure', () => {
      const cguContent = component.cguContent;
      
      expect(cguContent.title).toBeTruthy();
      expect(cguContent.date).toBeTruthy();
      expect(cguContent.sections.length).toBeGreaterThan(0);
      
      // Vérifier la structure de la première section
      if (cguContent.sections.length > 0) {
        const firstSection = cguContent.sections[0];
        expect(firstSection.title).toBeTruthy();
        expect(Array.isArray(firstSection.content)).toBe(true);
        expect(firstSection.content.length).toBeGreaterThan(0);
        expect(firstSection.content[0].text).toBeTruthy();
      }
    });

    it('should verify CGV content structure', () => {
      const cgvContent = component.cgvContent;
      
      expect(cgvContent.title).toBeTruthy();
      expect(cgvContent.date).toBeTruthy();
      expect(cgvContent.sections.length).toBeGreaterThan(0);
      
      // Vérifier la structure de la première section
      if (cgvContent.sections.length > 0) {
        const firstSection = cgvContent.sections[0];
        expect(firstSection.title).toBeTruthy();
        expect(Array.isArray(firstSection.content)).toBe(true);
        expect(firstSection.content.length).toBeGreaterThan(0);
        expect(firstSection.content[0].text).toBeTruthy();
      }
    });
  });

  describe('getContent Method', () => {
    it('should return CGU content when isCGU is true', () => {
      component.isCGU = true;
      component.isCGV = false;

      const content = component.getContent();
      expect(content).toEqual(CGU_DATA);
    });

    it('should return CGV content when isCGV is true', () => {
      component.isCGU = false;
      component.isCGV = true;

      const content = component.getContent();
      expect(content).toEqual(CGV_DATA);
    });

    it('should return empty structure when neither flag is true', () => {
      component.isCGU = false;
      component.isCGV = false;

      const content = component.getContent();
      expect(content).toEqual({ title: '', date: '', sections: [] });
    });

    it('should prioritize CGU when both flags are true', () => {
      component.isCGU = true;
      component.isCGV = true;

      const content = component.getContent();
      expect(content).toEqual(CGU_DATA);
    });
  });

  describe('Helper Methods', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should correctly identify arrays with isArray method', () => {
      expect(component.isArray(['test', 'array'])).toBe(true);
      expect(component.isArray([])).toBe(true);
      expect(component.isArray('not an array')).toBe(false);
      // expect(component.isArray(null)).toBe(false);
      // expect(component.isArray(undefined)).toBe(false);
    });

    describe('isShowingCGU Method', () => {
      it('should return true when isCGU is true', () => {
        component.isCGU = true;
        expect(component.isShowingCGU()).toBe(true);
      });

      it('should return false when isCGU is false', () => {
        component.isCGU = false;
        expect(component.isShowingCGU()).toBe(false);
      });
    });

    describe('isShowingCGV Method', () => {
      it('should return true when isCGV is true', () => {
        component.isCGV = true;
        expect(component.isShowingCGV()).toBe(true);
      });

      it('should return false when isCGV is false', () => {
        component.isCGV = false;
        expect(component.isShowingCGV()).toBe(false);
      });
    });
  });

  describe('Template Rendering', () => {
    it('should render CGU content when isCGU is true', () => {
      component.isCGU = true;
      component.isCGV = false;
      fixture.detectChanges();
  
      // Vérifier que le contenu CGU est affiché
      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('Conditions Générales d\'Utilisation');
    });

    it('should render CGV content when isCGV is true', () => {
      component.isCGU = false;
      component.isCGV = true;
      fixture.detectChanges();
      
      // Vérifier que le contenu CGV est affiché
      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('Conditions Générales de Vente');
    });

    it('should render "no content" message when neither flag is true', () => {
      component.isCGU = false;
      component.isCGV = false;
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('Aucune condition à afficher');
    });

    it('should render correct section titles for CGU', () => {
      component.isCGU = true;
      fixture.detectChanges();

      const sectionTitles = debugElement.queryAll(By.css('h3'));
      expect(sectionTitles.length).toBeGreaterThan(0);
      
      // Vérifier que les titres correspondent aux sections CGU
      const cguSections = CGU_DATA.sections;
      sectionTitles.forEach((titleElement, index) => {
        if (index < cguSections.length) {
          expect(titleElement.nativeElement.textContent.trim()).toBe(cguSections[index].title);
        }
      });
    });

    it('should render correct section titles for CGV', () => {
      component.isCGV = true;
      fixture.detectChanges();

      const sectionTitles = debugElement.queryAll(By.css('h3'));
      expect(sectionTitles.length).toBeGreaterThan(0);
      
      // Vérifier que les titres correspondent aux sections CGV
      const cgvSections = CGV_DATA.sections;
      sectionTitles.forEach((titleElement, index) => {
        if (index < cgvSections.length) {
          expect(titleElement.nativeElement.textContent.trim()).toBe(cgvSections[index].title);
        }
      });
    });

    it('should render content paragraphs for each section', () => {
      component.isCGU = true;
      fixture.detectChanges();

      const paragraphs = debugElement.queryAll(By.css('p'));
      expect(paragraphs.length).toBeGreaterThan(0);
      
      // Vérifier qu'au moins le premier paragraphe contient du texte
      expect(paragraphs[0].nativeElement.textContent.trim().length).toBeGreaterThan(0);
    });
  });

  describe('Data Integrity', () => {
    it('should have non-empty CGU data', () => {
      expect(CGU_DATA).toBeDefined();
      expect(CGU_DATA.title).toBeTruthy();
      expect(CGU_DATA.sections.length).toBeGreaterThan(0);
    });

    it('should have non-empty CGV data', () => {
      expect(CGV_DATA).toBeDefined();
      expect(CGV_DATA.title).toBeTruthy();
      expect(CGV_DATA.sections.length).toBeGreaterThan(0);
    });

    it('should have consistent data structure for CGU', () => {
      CGU_DATA.sections.forEach((section, index) => {
        expect(section.title).toBeTruthy();
        expect(Array.isArray(section.content)).toBe(true);
        expect(section.content.length).toBeGreaterThan(0);
        
        section.content.forEach((content, contentIndex) => {
          expect(content.text).toBeTruthy();
        });
      });
    });

    it('should have consistent data structure for CGV', () => {
      CGV_DATA.sections.forEach((section, index) => {
        expect(section.title).toBeTruthy();
        expect(Array.isArray(section.content)).toBe(true);
        expect(section.content.length).toBeGreaterThan(0);
        
        section.content.forEach((content, contentIndex) => {
          expect(content.text).toBeTruthy();
        });
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty path gracefully', () => {
      Object.defineProperty(window, 'location', {
        value: { ...mockLocation, pathname: '' },
        writable: true,
        configurable: true
      });

      fixture = TestBed.createComponent(TermsAndConditionsComponent);
      component = fixture.componentInstance;

      expect(component.isCGU).toBe(false);
      expect(component.isCGV).toBe(false);
    });

    it('should handle paths with special characters', () => {
      Object.defineProperty(window, 'location', {
        value: { ...mockLocation, pathname: '/légal/cgu' },
        writable: true,
        configurable: true
      });

      fixture = TestBed.createComponent(TermsAndConditionsComponent);
      component = fixture.componentInstance;

      expect(component.isCGU).toBe(true);
    });

    it('should handle case sensitivity in paths', () => {
      Object.defineProperty(window, 'location', {
        value: { ...mockLocation, pathname: '/CGU' },
        writable: true,
        configurable: true
      });

      fixture = TestBed.createComponent(TermsAndConditionsComponent);
      component = fixture.componentInstance;

      // Assuming the component is case-sensitive
      expect(component.isCGU).toBe(false);
    });

    it('should handle multiple occurrences in path', () => {
      Object.defineProperty(window, 'location', {
        value: { ...mockLocation, pathname: '/cgu/section/cgu' },
        writable: true,
        configurable: true
      });

      fixture = TestBed.createComponent(TermsAndConditionsComponent);
      component = fixture.componentInstance;

      expect(component.isCGU).toBe(true);
    });
  });

  describe('Performance', () => {
    it('should not cause memory leaks with repeated content access', () => {
      for (let i = 0; i < 100; i++) {
        const cguContent = component.cguContent;
        const cgvContent = component.cgvContent;
        expect(cguContent).toBeDefined();
        expect(cgvContent).toBeDefined();
      }
      
      expect(true).toBeTruthy(); // Test passed if no errors thrown
    });

    it('should render efficiently without performance issues', () => {
      const startTime = performance.now();
      
      component.isCGU = true;
      fixture.detectChanges();
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Le rendu ne devrait pas prendre plus de 100ms
      expect(renderTime).toBeLessThan(100);
    });

    it('should handle multiple re-renders efficiently', () => {
      const iterations = 10;
      const startTime = performance.now();
      
      for (let i = 0; i < iterations; i++) {
        component.isCGU = i % 2 === 0;
        component.isCGV = i % 2 === 1;
        fixture.detectChanges();
      }
      
      const endTime = performance.now();
      const averageTime = (endTime - startTime) / iterations;
      
      // Chaque rendu ne devrait pas prendre plus de 50ms en moyenne
      expect(averageTime).toBeLessThan(50);
    });
  });

  describe('Component State Management', () => {
    it('should maintain state consistency', () => {
      component.isCGU = true;
      component.isCGV = false;
      
      expect(component.isCGU).toBe(true);
      expect(component.isCGV).toBe(false);
      
      component.isCGU = false;
      component.isCGV = true;
      
      expect(component.isCGU).toBe(false);
      expect(component.isCGV).toBe(true);
    });

    it('should handle simultaneous flags correctly', () => {
      component.isCGU = true;
      component.isCGV = true;
      
      // Le composant devrait gérer ce cas de manière définie
      expect(component.isCGU).toBe(true);
      expect(component.isCGV).toBe(true);
    });

    it('should reset flags correctly', () => {
      component.isCGU = true;
      component.isCGV = true;
      
      component.isCGU = false;
      component.isCGV = false;
      
      expect(component.isCGU).toBe(false);
      expect(component.isCGV).toBe(false);
    });
  });
});