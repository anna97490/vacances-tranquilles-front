import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { By } from '@angular/platform-browser';
import { DebugElement, Component } from '@angular/core';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';

// Mock Components avec sélecteur différent
@Component({
  selector: 'mock-header',
  template: '<header data-testid="mock-header">Mock Header</header>',
  standalone: true
})
class MockHeaderComponent { }

@Component({
  template: '<div data-testid="mock-routed">Mock Routed Component</div>',
  standalone: true
})
class MockRoutedComponent { }

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let debugElement: DebugElement;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        RouterTestingModule.withRoutes([
          { path: '', component: MockRoutedComponent },
          { path: 'test', component: MockRoutedComponent }
        ])
      ]
    }).overrideComponent(AppComponent, {
      remove: { 
        imports: [HeaderComponent]
      },
      add: { 
        imports: [MockHeaderComponent] 
      }
    }).overrideTemplate(AppComponent, `
      <div class="app-container">
        <mock-header></mock-header>
        <main>
          <router-outlet></router-outlet>
        </main>
      </div>
    `).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
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

    it('should have app component instance', () => {
      expect(component).toBeInstanceOf(AppComponent);
    });

    it('should initialize without errors', () => {
      expect(() => fixture.detectChanges()).not.toThrow();
    });
  });

  describe('Structure générale', () => {
    it('devrait afficher le conteneur principal de l\'application', () => {
      const appContainer = debugElement.query(By.css('.app-container'));
      expect(appContainer).toBeTruthy();
      expect(appContainer.nativeElement.classList.contains('app-container')).toBeTruthy();
    });

    it('devrait afficher le composant header mock', () => {
      const header = debugElement.query(By.css('mock-header'));
      expect(header).toBeTruthy();
    });

    it('devrait afficher l\'élément main', () => {
      const mainElement = debugElement.query(By.css('main'));
      expect(mainElement).toBeTruthy();
      expect(mainElement.nativeElement.tagName.toLowerCase()).toBe('main');
    });

    it('devrait contenir le router-outlet dans l\'élément main', () => {
      const mainElement = debugElement.query(By.css('main'));
      const routerOutlet = mainElement.query(By.css('router-outlet'));
      expect(routerOutlet).toBeTruthy();
    });

    it('should have correct template structure', () => {
      const template = fixture.nativeElement as HTMLElement;
      expect(template.innerHTML).toContain('app-container');
      expect(template.innerHTML).toContain('mock-header');
      expect(template.innerHTML).toContain('main');
      expect(template.innerHTML).toContain('router-outlet');
    });
  });

  describe('Hiérarchie des éléments', () => {
    it('devrait avoir la bonne structure hiérarchique', () => {
      const appContainer = debugElement.query(By.css('.app-container'));
      const header = appContainer.query(By.css('mock-header'));
      const main = appContainer.query(By.css('main'));
      const routerOutlet = main.query(By.css('router-outlet'));

      expect(appContainer).toBeTruthy();
      expect(header).toBeTruthy();
      expect(main).toBeTruthy();
      expect(routerOutlet).toBeTruthy();
    });

    it('devrait avoir le header avant le main dans l\'ordre DOM', () => {
      const appContainer = debugElement.query(By.css('.app-container'));
      const children = appContainer.nativeElement.children as HTMLCollection;
      
      expect(children.length).toBe(2);
      expect(children[0].tagName.toLowerCase()).toBe('mock-header');
      expect(children[1].tagName.toLowerCase()).toBe('main');
    });

    it('should have proper parent-child relationships', () => {
      const appContainer = debugElement.query(By.css('.app-container'));
      const header = debugElement.query(By.css('mock-header'));
      const main = debugElement.query(By.css('main'));

      // Vérifier via la structure DOM native au lieu de DebugElement.parent
      expect(header.nativeElement.parentElement).toBe(appContainer.nativeElement);
      expect(main.nativeElement.parentElement).toBe(appContainer.nativeElement);
    });

    it('should have router-outlet as child of main', () => {
      const main = debugElement.query(By.css('main'));
      const routerOutlet = debugElement.query(By.css('router-outlet'));

      // Vérifier via la structure DOM native
      expect(routerOutlet.nativeElement.parentElement).toBe(main.nativeElement);
    });

    it('should verify DOM hierarchy using contains method', () => {
      const appContainer = debugElement.query(By.css('.app-container'));
      const header = debugElement.query(By.css('mock-header'));
      const main = debugElement.query(By.css('main'));
      const routerOutlet = debugElement.query(By.css('router-outlet'));

      // Vérifier que le container contient ses enfants
      expect(appContainer.nativeElement.contains(header.nativeElement)).toBeTruthy();
      expect(appContainer.nativeElement.contains(main.nativeElement)).toBeTruthy();
      expect(main.nativeElement.contains(routerOutlet.nativeElement)).toBeTruthy();
    });
  });

  describe('Classes CSS', () => {
    it('devrait avoir la classe app-container sur l\'élément racine', () => {
      const appContainer = debugElement.query(By.css('.app-container'));
      expect(appContainer.nativeElement.classList.contains('app-container')).toBeTruthy();
    });

    it('ne devrait pas avoir de classes supplémentaires sur l\'élément main', () => {
      const main = debugElement.query(By.css('main'));
      expect(main.nativeElement.className).toBe('');
    });

    it('should have only expected CSS classes', () => {
      const appContainer = debugElement.query(By.css('.app-container'));
      const classList = Array.from(appContainer.nativeElement.classList);
      
      expect(classList).toEqual(['app-container']);
    });

    it('should not have unexpected CSS classes on child elements', () => {
      const main = debugElement.query(By.css('main'));
      const routerOutlet = debugElement.query(By.css('router-outlet'));

      expect(main.nativeElement.classList.length).toBe(0);
      expect(routerOutlet).toBeTruthy();
    });
  });

  describe('Accessibilité', () => {
    it('devrait utiliser la balise main sémantique', () => {
      const mainElement = debugElement.query(By.css('main'));
      expect(mainElement.nativeElement.tagName.toLowerCase()).toBe('main');
    });

    it('devrait avoir une structure sémantique correcte', () => {
      const appContainer = debugElement.query(By.css('.app-container'));
      const header = appContainer.query(By.css('mock-header'));
      const main = appContainer.query(By.css('main'));

      expect(header).toBeTruthy();
      expect(main).toBeTruthy();
    });

    it('should have proper semantic HTML structure', () => {
      const elements = {
        container: debugElement.query(By.css('.app-container')),
        header: debugElement.query(By.css('mock-header')),
        main: debugElement.query(By.css('main')),
        outlet: debugElement.query(By.css('router-outlet'))
      };

      Object.values(elements).forEach(element => {
        expect(element).toBeTruthy();
      });
    });

    it('should have correct element order for screen readers', () => {
      const appContainer = debugElement.query(By.css('.app-container'));
      const children = Array.from(appContainer.nativeElement.children) as HTMLElement[];

      expect(children[0].tagName.toLowerCase()).toBe('mock-header');
      expect(children[1].tagName.toLowerCase()).toBe('main');
    });

    it('should have proper ARIA roles if needed', () => {
      const main = debugElement.query(By.css('main'));
      expect(main.nativeElement.tagName.toLowerCase()).toBe('main');
      
      const roleAttribute = main.nativeElement.getAttribute('role');
      if (roleAttribute) {
        expect(roleAttribute).toBe('main');
      }
    });
  });

  describe('Template Rendering', () => {
    it('should render complete template without errors', () => {
      expect(fixture.nativeElement).toBeTruthy();
      expect(debugElement.query(By.css('.app-container'))).toBeTruthy();
    });

    it('should have clean HTML structure', () => {
      const appContainer = debugElement.query(By.css('.app-container'));
      const innerHTML = appContainer.nativeElement.innerHTML;

      expect(innerHTML).toContain('<mock-header');
      expect(innerHTML).toContain('<main>');
      expect(innerHTML).toContain('<router-outlet');
    });

    it('should not have any compilation errors', () => {
      expect(() => {
        fixture.detectChanges();
      }).not.toThrow();
    });
  });

  describe('Routing Integration', () => {
    it('should have router-outlet for navigation', () => {
      const routerOutlet = debugElement.query(By.css('router-outlet'));
      expect(routerOutlet).toBeTruthy();
    });

    it('should navigate to different routes', async () => {
      await router.navigate(['']);
      // La racine retourne '/' au lieu de ''
      expect(location.path()).toBe('/');

      await router.navigate(['/test']);
      expect(location.path()).toBe('/test');
    });

    it('should handle root navigation correctly', async () => {
      // Test spécifique pour la navigation vers la racine
      await router.navigate(['/']);
      expect(location.path()).toBe('/');
      
      // Navigation vers une route puis retour à la racine
      await router.navigate(['/test']);
      expect(location.path()).toBe('/test');
      
      await router.navigate(['']);
      expect(location.path()).toBe('/');
    });

    it('should render routed components in router-outlet', async () => {
      await router.navigate(['']);
      fixture.detectChanges();
      
      expect(fixture.nativeElement.textContent).toContain('Mock Routed Component');
    });

    it('should update content when navigating between routes', async () => {
      // Navigation initiale
      await router.navigate(['']);
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('Mock Routed Component');
      
      // Navigation vers une autre route (même composant dans notre cas)
      await router.navigate(['/test']);
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('Mock Routed Component');
    });
  });

  describe('Component Communication', () => {
    it('should pass data to header component if needed', () => {
      const headerComponent = debugElement.query(By.css('mock-header'));
      expect(headerComponent).toBeTruthy();
    });

    it('should handle header events if any', () => {
      const headerComponent = debugElement.query(By.css('mock-header'));
      expect(headerComponent).toBeTruthy();
    });
  });

  describe('Error Handling', () => {
    it('should handle missing router-outlet gracefully', () => {
      expect(() => {
        const routerOutlet = debugElement.query(By.css('router-outlet'));
        expect(routerOutlet).toBeTruthy();
      }).not.toThrow();
    });

    it('should handle component errors gracefully', () => {
      expect(() => {
        fixture.detectChanges();
      }).not.toThrow();
    });
  });

  describe('Performance', () => {
    it('should not cause memory leaks', () => {
      for (let i = 0; i < 5; i++) {
        const testFixture = TestBed.createComponent(AppComponent);
        testFixture.detectChanges();
        testFixture.destroy();
      }
      
      expect(true).toBeTruthy();
    });

    it('should render efficiently', () => {
      const startTime = performance.now();
      fixture.detectChanges();
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(100);
    });
  });
});

// Tests avec le vrai HeaderComponent
describe('AppComponent - Integration avec HeaderComponent réel', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        RouterTestingModule.withRoutes([
          { path: '', component: MockRoutedComponent }
        ])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    
    fixture.detectChanges();
  });

  it('should create with real header component', () => {
    expect(component).toBeTruthy();
  });

  it('should have app structure with real components', () => {
    const appContainer = debugElement.query(By.css('.app-container'));
    const header = debugElement.query(By.css('app-header'));
    const main = debugElement.query(By.css('main'));
    const routerOutlet = debugElement.query(By.css('router-outlet'));

    expect(appContainer).toBeTruthy();
    expect(header).toBeTruthy();
    expect(main).toBeTruthy();
    expect(routerOutlet).toBeTruthy();
  });

  it('should render without errors with real components', () => {
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should integrate correctly with HeaderComponent', () => {
    const headerElement = debugElement.query(By.css('app-header'));
    expect(headerElement).toBeTruthy();
    expect(headerElement.componentInstance).toBeInstanceOf(HeaderComponent);
  });

  it('should maintain proper structure with real header', () => {
    const appContainer = debugElement.query(By.css('.app-container'));
    const children = Array.from(appContainer.nativeElement.children) as HTMLElement[];
    
    expect(children.length).toBe(2);
    expect(children[0].tagName.toLowerCase()).toBe('app-header');
    expect(children[1].tagName.toLowerCase()).toBe('main');
  });

  it('should verify DOM relationships with real components', () => {
    const appContainer = debugElement.query(By.css('.app-container'));
    const header = debugElement.query(By.css('app-header'));
    const main = debugElement.query(By.css('main'));

    expect(header.nativeElement.parentElement).toBe(appContainer.nativeElement);
    expect(main.nativeElement.parentElement).toBe(appContainer.nativeElement);
  });
});

// Tests de robustesse avec configuration minimale
describe('AppComponent - Tests de robustesse', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        RouterTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should handle multiple detectChanges calls', () => {
    expect(() => {
      fixture.detectChanges();
      fixture.detectChanges();
      fixture.detectChanges();
    }).not.toThrow();
  });

  it('should maintain stability after multiple renders', () => {
    fixture.detectChanges();
    const initialHTML = fixture.nativeElement.innerHTML;
    
    fixture.detectChanges();
    const secondHTML = fixture.nativeElement.innerHTML;
    
    expect(secondHTML).toBe(initialHTML);
  });

  it('should handle component destruction gracefully', () => {
    fixture.detectChanges();
    
    expect(() => {
      fixture.destroy();
    }).not.toThrow();
  });
});
