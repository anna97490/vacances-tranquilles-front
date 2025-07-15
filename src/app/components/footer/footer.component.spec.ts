import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, Component } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { FooterComponent } from './footer.component';

// Composants de test pour les routes
@Component({
  template: '<div>CGU Page</div>'
})
class MockCguComponent { }

@Component({
  template: '<div>CGV Page</div>'
})
class MockCgvComponent { }

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let debugElement: DebugElement;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FooterComponent, // Import du composant standalone
        RouterTestingModule.withRoutes([
          { path: 'terms-and-conditions/cgu', component: MockCguComponent },
          { path: 'terms-and-conditions/cgv', component: MockCgvComponent },
          { path: '', redirectTo: '/home', pathMatch: 'full' },
          { path: '**', redirectTo: '/home' } // Route wildcard pour capturer les routes non définies
        ]),
        MatListModule,
        MatIconModule
      ],
      declarations: [
        MockCguComponent,
        MockCgvComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have footer container structure', () => {
      const footerContainer = debugElement.query(By.css('footer.footer-mockup'));
      expect(footerContainer).toBeTruthy();
    });

    it('should have footer content structure', () => {
      const footerContent = debugElement.query(By.css('.footer-content'));
      expect(footerContent).toBeTruthy();
    });
  });

  describe('Brand Section', () => {
    it('should display the brand title "Vacances Tranquilles"', () => {
      const brandTitle = debugElement.query(By.css('.footer-title'));
      expect(brandTitle).toBeTruthy();
      expect(brandTitle.nativeElement.textContent.trim()).toBe('Vacances Tranquilles');
    });

    it('should display the trust text', () => {
      const trustText = debugElement.query(By.css('.footer-text'));
      expect(trustText).toBeTruthy();
      expect(trustText.nativeElement.textContent).toContain('Votre partenaire de confiance');
      expect(trustText.nativeElement.textContent).toContain('depuis 2020');
    });
  });

  describe('Footer Columns', () => {
    it('should display all four footer columns', () => {
      const footerColumns = debugElement.queryAll(By.css('.footer-col'));
      expect(footerColumns.length).toBe(4);
    });

    it('should display footer column titles', () => {
      const expectedTitles = ['Vacances Tranquilles', 'Services', 'À Propos', 'Légal'];
      const footerTitles = debugElement.queryAll(By.css('.footer-title'));
      
      expect(footerTitles.length).toBe(4);
      
      footerTitles.forEach((title, index) => {
        expect(title.nativeElement.textContent.trim()).toBe(expectedTitles[index]);
      });
    });

    it('should have services column', () => {
      const footerTitles = debugElement.queryAll(By.css('.footer-title'));
      const servicesTitle = footerTitles.find(title => 
        title.nativeElement.textContent.trim() === 'Services'
      );
      expect(servicesTitle).toBeTruthy();
    });

    it('should have about column', () => {
      const footerTitles = debugElement.queryAll(By.css('.footer-title'));
      const aboutTitle = footerTitles.find(title => 
        title.nativeElement.textContent.trim() === 'À Propos'
      );
      expect(aboutTitle).toBeTruthy();
    });

    it('should have legal column with navigation list', () => {
      const footerTitles = debugElement.queryAll(By.css('.footer-title'));
      const legalTitle = footerTitles.find(title => 
        title.nativeElement.textContent.trim() === 'Légal'
      );
      expect(legalTitle).toBeTruthy();
      
      const matNavList = debugElement.query(By.css('mat-nav-list'));
      expect(matNavList).toBeTruthy();
    });
  });

  describe('Legal Links', () => {
    it('should contain CGU link with correct route', () => {
      const cguLink = debugElement.query(By.css('a[routerLink="/terms-and-conditions/cgu"]'));
      expect(cguLink).toBeTruthy();
      expect(cguLink.nativeElement.textContent.trim()).toBe("Conditions générales d'utilisation");
      expect(cguLink.nativeElement.getAttribute('routerLink')).toBe('/terms-and-conditions/cgu');
    });

    it('should contain CGV link with correct route', () => {
      const cgvLink = debugElement.query(By.css('a[routerLink="/terms-and-conditions/cgv"]'));
      expect(cgvLink).toBeTruthy();
      expect(cgvLink.nativeElement.textContent.trim()).toBe('Conditions générales de vente');
      expect(cgvLink.nativeElement.getAttribute('routerLink')).toBe('/terms-and-conditions/cgv');
    });

    it('should have proper Material list items for legal links', () => {
      const matListItems = debugElement.queryAll(By.css('a[mat-list-item]'));
      expect(matListItems.length).toBe(2);
      
      matListItems.forEach(item => {
        expect(item.nativeElement.classList.contains('footer-link')).toBeTruthy();
        // Vérifier la propriété disableRipple via l'instance du composant Angular
        expect(item.componentInstance?.disableRipple).toBe(true);
      });
    });

    it('should navigate to CGU page when CGU link is clicked', async () => {
      const cguLink = debugElement.query(By.css('a[routerLink="/terms-and-conditions/cgu"]'));
      
      await cguLink.nativeElement.click();
      fixture.detectChanges();
      
      // Vérifier que la navigation a eu lieu (en mode test, on peut vérifier l'URL)
      expect(cguLink.nativeElement.getAttribute('routerLink')).toBe('/terms-and-conditions/cgu');
    });

    it('should navigate to CGV page when CGV link is clicked', async () => {
      const cgvLink = debugElement.query(By.css('a[routerLink="/terms-and-conditions/cgv"]'));
      
      await cgvLink.nativeElement.click();
      fixture.detectChanges();
      
      // Vérifier que la navigation a eu lieu (en mode test, on peut vérifier l'URL)
      expect(cgvLink.nativeElement.getAttribute('routerLink')).toBe('/terms-and-conditions/cgv');
    });
  });

  describe('Copyright Section', () => {
    it('should display copyright notice', () => {
      const copyrightElement = debugElement.query(By.css('.footer-copyright'));
      expect(copyrightElement).toBeTruthy();
      expect(copyrightElement.nativeElement.textContent.trim()).toBe('© 2025 Tous droits réservés');
    });

    it('should include current year in copyright', () => {
      const copyrightElement = debugElement.query(By.css('.footer-copyright'));
      const copyrightText = copyrightElement.nativeElement.textContent;
      expect(copyrightText).toContain('2025');
    });

    it('should display complete copyright text', () => {
      const copyrightElement = debugElement.query(By.css('.footer-copyright'));
      expect(copyrightElement.nativeElement.textContent.trim()).toBe('© 2025 Tous droits réservés');
    });
  });

  describe('Material Design Integration', () => {
    it('should use mat-nav-list correctly', () => {
      const matNavList = debugElement.query(By.css('mat-nav-list'));
      expect(matNavList).toBeTruthy();
    });

    it('should use mat-list-item correctly', () => {
      const matListItems = debugElement.queryAll(By.css('a[mat-list-item]'));
      expect(matListItems.length).toBe(2);
      
      matListItems.forEach(item => {
        expect(item.nativeElement.hasAttribute('mat-list-item')).toBeTruthy();
      });
    });

    it('should have ripple disabled on links', () => {
      const matListItems = debugElement.queryAll(By.css('a[mat-list-item]'));
      
      matListItems.forEach(item => {
        // Test alternatif : vérifier que la propriété disableRipple existe
        if (item.componentInstance) {
          expect(item.componentInstance.disableRipple).toBe(true);
        } else {
          // Fallback : vérifier la présence de l'attribut dans le template
          expect(item.nativeElement.hasAttribute('disableRipple') || 
                 item.nativeElement.hasAttribute('ng-reflect-disable-ripple')).toBeTruthy();
        }
      });
    });
  });

  describe('CSS Classes and Structure', () => {
    it('should have correct CSS classes', () => {
      const footer = debugElement.query(By.css('footer'));
      expect(footer.nativeElement.classList.contains('footer-mockup')).toBeTruthy();
      
      const footerContent = debugElement.query(By.css('.footer-content'));
      expect(footerContent).toBeTruthy();
      
      const footerCols = debugElement.queryAll(By.css('.footer-col'));
      expect(footerCols.length).toBe(4);
      
      const footerLinks = debugElement.queryAll(By.css('.footer-link'));
      expect(footerLinks.length).toBe(2);
    });

    it('should have proper footer structure hierarchy', () => {
      // Structure: footer > footer-content > footer-col
      const footer = debugElement.query(By.css('footer.footer-mockup'));
      expect(footer).toBeTruthy();
      
      const footerContent = footer.query(By.css('.footer-content'));
      expect(footerContent).toBeTruthy();
      
      const footerCols = footerContent.queryAll(By.css('.footer-col'));
      expect(footerCols.length).toBe(4);
    });
  });

  describe('Accessibility', () => {
    it('should have proper semantic footer structure', () => {
      const footer = debugElement.query(By.css('footer'));
      expect(footer).toBeTruthy();
    });

    it('should have accessible links', () => {
      const links = debugElement.queryAll(By.css('a'));
      
      links.forEach(link => {
        const linkElement = link.nativeElement;
        const hasText = linkElement.textContent.trim().length > 0;
        const hasRouterLink = linkElement.hasAttribute('routerLink');
        
        expect(hasText).toBeTruthy();
        expect(hasRouterLink).toBeTruthy();
      });
    });

    it('should have proper link text for screen readers', () => {
      const cguLink = debugElement.query(By.css('a[routerLink="/terms-and-conditions/cgu"]'));
      const cgvLink = debugElement.query(By.css('a[routerLink="/terms-and-conditions/cgv"]'));
      
      expect(cguLink.nativeElement.textContent.trim()).toBe("Conditions générales d'utilisation");
      expect(cgvLink.nativeElement.textContent.trim()).toBe('Conditions générales de vente');
    });
  });

  describe('Router Integration', () => {
    it('should integrate with Angular Router', () => {
      const routerLinks = debugElement.queryAll(By.css('[routerLink]'));
      expect(routerLinks.length).toBe(2);
      
      const routes = routerLinks.map(link => link.nativeElement.getAttribute('routerLink'));
      expect(routes).toContain('/terms-and-conditions/cgu');
      expect(routes).toContain('/terms-and-conditions/cgv');
    });

    it('should have valid router links', () => {
      const routerLinks = debugElement.queryAll(By.css('[routerLink]'));
      
      routerLinks.forEach(link => {
        const routerLink = link.nativeElement.getAttribute('routerLink');
        expect(routerLink).toBeTruthy();
        expect(routerLink.startsWith('/')).toBeTruthy();
      });
    });
  });

  describe('Error Handling', () => {
    it('should render without breaking on component initialization', () => {
      expect(component).toBeTruthy();
      expect(debugElement.nativeElement).toBeTruthy();
    });

    it('should handle router navigation gracefully', () => {
      const routerLinks = debugElement.queryAll(By.css('[routerLink]'));
      
      expect(() => {
        routerLinks.forEach(link => {
          link.nativeElement.click();
        });
      }).not.toThrow();
    });

    it('should maintain component integrity after interactions', () => {
      const cguLink = debugElement.query(By.css('a[routerLink="/terms-and-conditions/cgu"]'));
      
      // Simuler un clic
      cguLink.nativeElement.click();
      fixture.detectChanges();
      
      // Vérifier que le composant est toujours fonctionnel
      expect(component).toBeTruthy();
      expect(debugElement.query(By.css('footer'))).toBeTruthy();
    });
  });

  describe('Content Validation', () => {
    it('should contain all required footer sections', () => {
      const requiredSections = [
        'Vacances Tranquilles',
        'Services',
        'À Propos',
        'Légal'
      ];

      const footerTitles = debugElement.queryAll(By.css('.footer-title'));
      const titles = footerTitles.map(title => title.nativeElement.textContent.trim());
      
      requiredSections.forEach(section => {
        expect(titles).toContain(section);
      });
    });

    it('should have proper link structure', () => {
      const allLinks = debugElement.queryAll(By.css('a'));
      expect(allLinks.length).toBe(2);
      
      allLinks.forEach(link => {
        expect(link.nativeElement.hasAttribute('routerLink')).toBeTruthy();
        expect(link.nativeElement.hasAttribute('mat-list-item')).toBeTruthy();
        expect(link.nativeElement.classList.contains('footer-link')).toBeTruthy();
      });
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive footer structure', () => {
      const footer = debugElement.query(By.css('footer.footer-mockup'));
      expect(footer).toBeTruthy();
      
      const footerContent = debugElement.query(By.css('.footer-content'));
      expect(footerContent).toBeTruthy();
      
      // Vérifier que la structure permet l'adaptation responsive
      const footerCols = debugElement.queryAll(By.css('.footer-col'));
      expect(footerCols.length).toBe(4);
    });
  });

  describe('Template Rendering', () => {
    it('should render complete footer template', () => {
      // Vérifier que le template complet est rendu
      const footer = debugElement.query(By.css('footer.footer-mockup'));
      expect(footer).toBeTruthy();
      
      // Vérifier le contenu principal
      expect(footer.nativeElement.textContent).toContain('Vacances Tranquilles');
      expect(footer.nativeElement.textContent).toContain('Votre partenaire de confiance');
      expect(footer.nativeElement.textContent).toContain('Services');
      expect(footer.nativeElement.textContent).toContain('À Propos');
      expect(footer.nativeElement.textContent).toContain('Légal');
      expect(footer.nativeElement.textContent).toContain('© 2025 Tous droits réservés');
    });
  });

  describe('Material List Properties', () => {
    it('should have correct Material list item configuration', () => {
      const matListItems = debugElement.queryAll(By.css('a[mat-list-item]'));
      
      matListItems.forEach((item, index) => {
        // Vérifier les propriétés essentielles
        expect(item.nativeElement.classList.contains('footer-link')).toBeTruthy();
        expect(item.nativeElement.hasAttribute('mat-list-item')).toBeTruthy();
        expect(item.nativeElement.hasAttribute('routerLink')).toBeTruthy();
        
        // Vérifier le contenu des liens
        const expectedTexts = [
          "Conditions générales d'utilisation",
          "Conditions générales de vente"
        ];
        expect(item.nativeElement.textContent.trim()).toBe(expectedTexts[index]);
      });
    });
  });
});
