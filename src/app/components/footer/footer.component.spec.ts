import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { FooterComponent } from './footer.component';
import { provideRouter } from '@angular/router';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FooterComponent,
        MatListModule
      ],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have footer element', () => {
      const footerElement = debugElement.query(By.css('footer'));
      expect(footerElement).toBeTruthy();
    });
  });

  describe('Footer Structure', () => {
    it('should have footer with correct CSS class', () => {
      const footer = debugElement.query(By.css('footer.footer-mockup'));
      expect(footer).toBeTruthy();
      expect(footer.nativeElement.classList.contains('footer-mockup')).toBeTruthy();
    });

    it('should have footer content container', () => {
      const footerContent = debugElement.query(By.css('.footer-content'));
      expect(footerContent).toBeTruthy();
    });

    it('should have footer copyright section', () => {
      const footerCopyright = debugElement.query(By.css('.footer-copyright'));
      expect(footerCopyright).toBeTruthy();
    });

    it('should have 4 footer columns', () => {
      const footerColumns = debugElement.queryAll(By.css('.footer-col'));
      expect(footerColumns.length).toBe(4);
    });
  });

  describe('Footer Columns Content', () => {
    it('should display company information in first column', () => {
      const footerColumns = debugElement.queryAll(By.css('.footer-col'));
      const firstColumn = footerColumns[0];
      
      const title = firstColumn.query(By.css('.footer-title'));
      const text = firstColumn.query(By.css('.footer-text'));
      
      expect(title).toBeTruthy();
      expect(title.nativeElement.textContent.trim()).toBe('Vacances Tranquilles');
      
      expect(text).toBeTruthy();
      expect(text.nativeElement.textContent).toContain('Votre partenaire de confiance');
      expect(text.nativeElement.textContent).toContain('depuis 2020');
    });

    it('should display Services title in second column', () => {
      const footerColumns = debugElement.queryAll(By.css('.footer-col'));
      const secondColumn = footerColumns[1];
      
      const title = secondColumn.query(By.css('.footer-title'));
      expect(title).toBeTruthy();
      expect(title.nativeElement.textContent.trim()).toBe('Services');
    });

    it('should display À Propos title in third column', () => {
      const footerColumns = debugElement.queryAll(By.css('.footer-col'));
      const thirdColumn = footerColumns[2];
      
      const title = thirdColumn.query(By.css('.footer-title'));
      expect(title).toBeTruthy();
      expect(title.nativeElement.textContent.trim()).toBe('À Propos');
    });

    it('should display Légal title in fourth column', () => {
      const footerColumns = debugElement.queryAll(By.css('.footer-col'));
      const fourthColumn = footerColumns[3];
      
      const title = fourthColumn.query(By.css('.footer-title'));
      expect(title).toBeTruthy();
      expect(title.nativeElement.textContent.trim()).toBe('Légal');
    });
  });

  describe('Legal Section', () => {
    it('should have mat-nav-list in legal column', () => {
      const footerColumns = debugElement.queryAll(By.css('.footer-col'));
      const legalColumn = footerColumns[3];
      
      const navList = legalColumn.query(By.css('mat-nav-list'));
      expect(navList).toBeTruthy();
    });

    it('should display CGU link', () => {
      const cguLink = debugElement.query(By.css('a[routerLink="/terms-and-conditions/cgu"]'));
      expect(cguLink).toBeTruthy();
      expect(cguLink.nativeElement.textContent.trim()).toBe('Conditions générales d\'utilisation');
      expect(cguLink.nativeElement.classList.contains('footer-link')).toBeTruthy();
    });

    it('should display CGV link', () => {
      const cgvLink = debugElement.query(By.css('a[routerLink="/terms-and-conditions/cgv"]'));
      expect(cgvLink).toBeTruthy();
      expect(cgvLink.nativeElement.textContent.trim()).toBe('Conditions générales de vente');
      expect(cgvLink.nativeElement.classList.contains('footer-link')).toBeTruthy();
    });

    it('should have 2 legal links', () => {
      const legalLinks = debugElement.queryAll(By.css('.footer-link'));
      expect(legalLinks.length).toBe(2);
    });

    it('should have mat-list-item directive on legal links', () => {
      const legalLinks = debugElement.queryAll(By.css('a[mat-list-item]'));
      expect(legalLinks.length).toBe(2);
      
      legalLinks.forEach(link => {
        expect(link.nativeElement.hasAttribute('mat-list-item')).toBeTruthy();
      });
    });

    it('should have disableRipple attribute on legal links', () => {
      const legalLinks = debugElement.queryAll(By.css('.footer-link'));
      legalLinks.forEach(link => {
        // Vérifier via le component instance au lieu de l'attribut HTML
        const componentInstance = link.componentInstance;
        if (componentInstance && componentInstance.disableRipple !== undefined) {
          expect(componentInstance.disableRipple).toBe(true);
        } else {
          // Alternative : vérifier que l'attribut ng-reflect-disable-ripple est présent
          const ngReflectAttr = link.nativeElement.getAttribute('ng-reflect-disable-ripple');
          expect(ngReflectAttr).toBe('true');
        }
      });
    });
  });
  describe('Router Links', () => {
    it('should have correct routerLink attributes', () => {
      const cguLink = debugElement.query(By.css('a[routerLink="/terms-and-conditions/cgu"]'));
      const cgvLink = debugElement.query(By.css('a[routerLink="/terms-and-conditions/cgv"]'));
      
      expect(cguLink.nativeElement.getAttribute('routerLink')).toBe('/terms-and-conditions/cgu');
      expect(cgvLink.nativeElement.getAttribute('routerLink')).toBe('/terms-and-conditions/cgv');
    });

    it('should have all required router links', () => {
      const routerLinks = debugElement.queryAll(By.css('a[routerLink]'));
      expect(routerLinks.length).toBe(2);
      
      const routes = routerLinks.map(link => link.nativeElement.getAttribute('routerLink'));
      expect(routes).toContain('/terms-and-conditions/cgu');
      expect(routes).toContain('/terms-and-conditions/cgv');
    });
  });

  describe('Copyright Section', () => {
    it('should display copyright text', () => {
      const copyright = debugElement.query(By.css('.footer-copyright'));
      expect(copyright).toBeTruthy();
      expect(copyright.nativeElement.textContent.trim()).toBe('© 2025 Tous droits réservés');
    });

    it('should have correct copyright year', () => {
      const copyright = debugElement.query(By.css('.footer-copyright'));
      expect(copyright.nativeElement.textContent).toContain('2025');
    });
  });

  describe('CSS Classes', () => {
    it('should have correct CSS classes on footer elements', () => {
      const footer = debugElement.query(By.css('footer'));
      const footerContent = debugElement.query(By.css('.footer-content'));
      const footerCopyright = debugElement.query(By.css('.footer-copyright'));
      
      expect(footer.nativeElement.classList.contains('footer-mockup')).toBeTruthy();
      expect(footerContent.nativeElement.classList.contains('footer-content')).toBeTruthy();
      expect(footerCopyright.nativeElement.classList.contains('footer-copyright')).toBeTruthy();
    });

    it('should have correct CSS classes on footer columns', () => {
      const footerColumns = debugElement.queryAll(By.css('.footer-col'));
      footerColumns.forEach(column => {
        expect(column.nativeElement.classList.contains('footer-col')).toBeTruthy();
      });
    });

    it('should have correct CSS classes on footer titles', () => {
      const footerTitles = debugElement.queryAll(By.css('.footer-title'));
      expect(footerTitles.length).toBe(4);
      
      footerTitles.forEach(title => {
        expect(title.nativeElement.classList.contains('footer-title')).toBeTruthy();
      });
    });

    it('should have correct CSS classes on footer text', () => {
      const footerText = debugElement.query(By.css('.footer-text'));
      expect(footerText).toBeTruthy();
      expect(footerText.nativeElement.classList.contains('footer-text')).toBeTruthy();
    });

    it('should have correct CSS classes on footer links', () => {
      const footerLinks = debugElement.queryAll(By.css('.footer-link'));
      footerLinks.forEach(link => {
        expect(link.nativeElement.classList.contains('footer-link')).toBeTruthy();
      });
    });
  });

  describe('HTML Structure', () => {
    it('should have proper semantic HTML structure', () => {
      const footer = debugElement.query(By.css('footer'));
      expect(footer).toBeTruthy();
      expect(footer.nativeElement.tagName.toLowerCase()).toBe('footer');
    });

    it('should have proper navigation structure', () => {
      const navList = debugElement.query(By.css('mat-nav-list'));
      expect(navList).toBeTruthy();
      
      const navLinks = navList.queryAll(By.css('a'));
      expect(navLinks.length).toBe(2);
    });

    it('should have proper link structure', () => {
      const links = debugElement.queryAll(By.css('a[routerLink]'));
      links.forEach(link => {
        expect(link.nativeElement.tagName.toLowerCase()).toBe('a');
        expect(link.nativeElement.hasAttribute('routerLink')).toBeTruthy();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper link attributes', () => {
      const links = debugElement.queryAll(By.css('a[routerLink]'));
      links.forEach(link => {
        expect(link.nativeElement.hasAttribute('routerLink')).toBeTruthy();
        expect(link.nativeElement.textContent.trim().length).toBeGreaterThan(0);
      });
    });

    it('should have meaningful link text', () => {
      const cguLink = debugElement.query(By.css('a[routerLink="/terms-and-conditions/cgu"]'));
      const cgvLink = debugElement.query(By.css('a[routerLink="/terms-and-conditions/cgv"]'));
      
      expect(cguLink.nativeElement.textContent.trim()).toBe('Conditions générales d\'utilisation');
      expect(cgvLink.nativeElement.textContent.trim()).toBe('Conditions générales de vente');
    });

    it('should have proper heading hierarchy', () => {
      // Les titres utilisent des divs avec class footer-title
      const footerTitles = debugElement.queryAll(By.css('.footer-title'));
      expect(footerTitles.length).toBe(4);
      
      footerTitles.forEach(title => {
        expect(title.nativeElement.textContent.trim().length).toBeGreaterThan(0);
      });
    });
  });

  describe('Content Validation', () => {
    it('should have all required content sections', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      
      // Vérifier la présence du contenu principal
      expect(compiled.textContent).toContain('Vacances Tranquilles');
      expect(compiled.textContent).toContain('Services');
      expect(compiled.textContent).toContain('À Propos');
      expect(compiled.textContent).toContain('Légal');
      expect(compiled.textContent).toContain('© 2025 Tous droits réservés');
    });

    it('should have proper company information', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Votre partenaire de confiance');
      expect(compiled.textContent).toContain('depuis 2020');
    });

    it('should have proper legal links text', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Conditions générales d\'utilisation');
      expect(compiled.textContent).toContain('Conditions générales de vente');
    });
  });

  describe('Material Design Integration', () => {
    it('should use Material Design navigation list', () => {
      const matNavList = debugElement.query(By.css('mat-nav-list'));
      expect(matNavList).toBeTruthy();
    });

    it('should use Material Design list items', () => {
      const matListItems = debugElement.queryAll(By.css('a[mat-list-item]'));
      expect(matListItems.length).toBe(2);
    });
  });
  describe('Layout Structure', () => {
    it('should have proper column structure', () => {
      const footerColumns = debugElement.queryAll(By.css('.footer-col'));
      expect(footerColumns.length).toBe(4);
      
      // Vérifier que chaque colonne a un titre
      footerColumns.forEach(column => {
        const title = column.query(By.css('.footer-title'));
        expect(title).toBeTruthy();
      });
    });

    it('should have proper content hierarchy', () => {
      const footer = debugElement.query(By.css('footer'));
      const footerContent = footer.query(By.css('.footer-content'));
      const footerCopyright = footer.query(By.css('.footer-copyright'));
      
      expect(footerContent).toBeTruthy();
      expect(footerCopyright).toBeTruthy();
      
      // Vérifier que le copyright est après le contenu
      const footerChildren = Array.from(footer.nativeElement.children);
      const contentIndex = footerChildren.indexOf(footerContent.nativeElement);
      const copyrightIndex = footerChildren.indexOf(footerCopyright.nativeElement);
      
      expect(copyrightIndex).toBeGreaterThan(contentIndex);
    });
  });

  describe('Text Content', () => {
    it('should have proper line breaks in company description', () => {
      const footerText = debugElement.query(By.css('.footer-text'));
      // Accept <br> with possible Angular attributes
      expect(footerText.nativeElement.innerHTML).toMatch(/<br[^>]*>/);
      expect(footerText.nativeElement.innerHTML.replace(/\s*<br[^>]*>\s*/g, '<br>')).toContain('Votre partenaire de confiance<br>depuis 2020');
      const textContent = footerText.nativeElement.textContent;
      expect(textContent).toContain('Votre partenaire de confiance');
      expect(textContent).toContain('depuis 2020');
    });
  });
});
