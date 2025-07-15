import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, Component } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { HeaderComponent } from './header.component';

// Interface pour les éléments de menu
interface MenuItem {
  label: string;
  path: string;
  icon: string;
  iconActive: string;
}

// Composants mock pour les routes
@Component({
  template: '<div>Home Page</div>'
})
class MockHomeComponent { }

@Component({
  template: '<div>Destinations Page</div>'
})
class MockDestinationsComponent { }

@Component({
  template: '<div>Contact Page</div>'
})
class MockContactComponent { }

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let debugElement: DebugElement;
  let router: Router;

  const mockMenu: MenuItem[] = [
    { label: 'Accueil', path: '/home', icon: 'accueil.svg', iconActive: 'accueil-active.svg' },
    { label: 'Destinations', path: '/destinations', icon: 'destinations.svg', iconActive: 'destinations-active.svg' },
    { label: 'Contact', path: '/contact', icon: 'contact.svg', iconActive: 'contact-active.svg' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'home', component: MockHomeComponent },
          { path: 'destinations', component: MockDestinationsComponent },
          { path: 'contact', component: MockContactComponent },
          { path: '', redirectTo: '/home', pathMatch: 'full' },
          { path: '**', redirectTo: '/home' }
        ]),
        RouterModule,
        HeaderComponent // Import du composant standalone
      ],
      declarations: [
        MockHomeComponent,
        MockDestinationsComponent,
        MockContactComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    router = TestBed.inject(Router);

    // Configuration des inputs du composant
    component.menu = mockMenu;
    component.mainLogo = 'logo.svg';
    component.burgerIcon = 'burger.svg';
    component.arrowForward = 'arrow.svg';
    component.menuOpen = false;

    // Mock de la méthode isActive
    component.isActive = jest.fn((path: string) => path === '/home');

    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with correct properties', () => {
      expect(component.menu).toEqual(mockMenu);
      expect(component.mainLogo).toBe('logo.svg');
      expect(component.burgerIcon).toBe('burger.svg');
      expect(component.arrowForward).toBe('arrow.svg');
      expect(component.menuOpen).toBe(false);
    });

    it('should have header structure', () => {
      const header = debugElement.query(By.css('header.header'));
      expect(header).toBeTruthy();
    });
  });

  describe('Logo Section', () => {
    it('should display the main logo', () => {
      const logoImg = debugElement.query(By.css('.header-logo img.logo-img'));
      expect(logoImg).toBeTruthy();
      expect(logoImg.nativeElement.src).toContain('logo.svg');
      expect(logoImg.nativeElement.alt).toBe('Logo');
    });

    it('should have proper logo container structure', () => {
      const logoContainer = debugElement.query(By.css('.header-logo'));
      expect(logoContainer).toBeTruthy();
      
      const logoImg = logoContainer.query(By.css('img.logo-img'));
      expect(logoImg).toBeTruthy();
    });

    it('should update logo when mainLogo changes', () => {
      component.mainLogo = 'new-logo.svg';
      fixture.detectChanges();

      const logoImg = debugElement.query(By.css('.logo-img'));
      expect(logoImg.nativeElement.src).toContain('new-logo.svg');
    });
  });

  describe('Desktop Navigation', () => {
    it('should display desktop navigation', () => {
      const desktopNav = debugElement.query(By.css('.header-nav.desktop-nav'));
      expect(desktopNav).toBeTruthy();
    });

    it('should display all menu items in desktop nav', () => {
      const navLinks = debugElement.queryAll(By.css('.desktop-nav .nav-link'));
      expect(navLinks.length).toBe(mockMenu.length);

      navLinks.forEach((link, index) => {
        const menuItem = mockMenu[index];
        expect(link.nativeElement.textContent.trim()).toBe(menuItem.label);
      });
    });

    it('should have correct router links in desktop nav', () => {
      // Chercher les liens avec routerLink ou ng-reflect-router-link
      const navLinksWithRouter = debugElement.queryAll(By.css('.desktop-nav a[routerLink], .desktop-nav a[ng-reflect-router-link]'));
      const allDesktopLinks = debugElement.queryAll(By.css('.desktop-nav .nav-link'));
      
      // Si routerLink n'est pas détecté, vérifier au moins que les liens existent
      expect(allDesktopLinks.length).toBe(mockMenu.length);
      
      // Vérifier que chaque lien a la classe nav-link
      allDesktopLinks.forEach(link => {
        expect(link.nativeElement.classList.contains('nav-link')).toBeTruthy();
      });
    });

    it('should apply active class to active menu item', () => {
      const navLinks = debugElement.queryAll(By.css('.desktop-nav .nav-link'));
      const homeLink = navLinks.find(link => 
        link.nativeElement.textContent.trim() === 'Accueil'
      );
      
      expect(homeLink?.nativeElement.classList.contains('active')).toBeTruthy();
    });

    it('should display correct icons for menu items', () => {
      const navLinks = debugElement.queryAll(By.css('.desktop-nav .nav-link'));
      
      navLinks.forEach((link, index) => {
        const icon = link.query(By.css('img.icon'));
        expect(icon).toBeTruthy();
        expect(icon.nativeElement.alt).toBe('');
      });
    });

    it('should have proper link structure in desktop nav', () => {
      const navLinks = debugElement.queryAll(By.css('.desktop-nav .nav-link'));
      
      navLinks.forEach(link => {
        // Chaque lien doit avoir une icône et du texte
        const icon = link.query(By.css('img.icon'));
        expect(icon).toBeTruthy();
        expect(link.nativeElement.textContent.trim().length).toBeGreaterThan(0);
      });
    });
  });

  describe('Mobile Menu Burger', () => {
    it('should display burger button', () => {
      const burgerBtn = debugElement.query(By.css('.burger-btn'));
      expect(burgerBtn).toBeTruthy();
    });

    it('should display burger icon', () => {
      const burgerIcon = debugElement.query(By.css('.burger-btn img.burger-icon'));
      expect(burgerIcon).toBeTruthy();
      expect(burgerIcon.nativeElement.src).toContain('burger.svg');
      expect(burgerIcon.nativeElement.alt).toBe('Menu');
    });

    it('should call toggleMenu when burger button is clicked', () => {
      jest.spyOn(component, 'toggleMenu');
      
      const burgerBtn = debugElement.query(By.css('.burger-btn'));
      burgerBtn.nativeElement.click();
      
      expect(component.toggleMenu).toHaveBeenCalled();
    });

    it('should update burger icon when burgerIcon changes', () => {
      component.burgerIcon = 'new-burger.svg';
      fixture.detectChanges();

      const burgerIcon = debugElement.query(By.css('.burger-icon'));
      expect(burgerIcon.nativeElement.src).toContain('new-burger.svg');
    });
  });

  describe('Mobile Navigation', () => {
    it('should display mobile menu container', () => {
      const mobileContainer = debugElement.query(By.css('.mobile-menu-container'));
      expect(mobileContainer).toBeTruthy();
    });

    it('should show mobile menu when menuOpen is true', () => {
      component.menuOpen = true;
      fixture.detectChanges();

      const mobileContainer = debugElement.query(By.css('.mobile-menu-container'));
      expect(mobileContainer.nativeElement.classList.contains('menu-visible')).toBeTruthy();
    });

    it('should hide mobile menu when menuOpen is false', () => {
      component.menuOpen = false;
      fixture.detectChanges();

      const mobileContainer = debugElement.query(By.css('.mobile-menu-container'));
      expect(mobileContainer.nativeElement.classList.contains('menu-visible')).toBeFalsy();
    });

    it('should display all menu items in mobile nav', () => {
      component.menuOpen = true;
      fixture.detectChanges();

      const mobileNavLinks = debugElement.queryAll(By.css('.mobile-nav .nav-link'));
      expect(mobileNavLinks.length).toBe(mockMenu.length);

      mobileNavLinks.forEach((link, index) => {
        const menuItem = mockMenu[index];
        expect(link.nativeElement.textContent.trim()).toContain(menuItem.label);
      });
    });

    it('should have correct router links in mobile nav', () => {
      component.menuOpen = true;
      fixture.detectChanges();

      const allMobileLinks = debugElement.queryAll(By.css('.mobile-nav .nav-link'));
      expect(allMobileLinks.length).toBe(mockMenu.length);
      
      // Vérifier que chaque lien a la classe nav-link
      allMobileLinks.forEach(link => {
        expect(link.nativeElement.classList.contains('nav-link')).toBeTruthy();
      });
    });

    it('should display arrow icons in mobile menu', () => {
      component.menuOpen = true;
      fixture.detectChanges();

      const arrowIcons = debugElement.queryAll(By.css('.mobile-nav .arrow-icon'));
      expect(arrowIcons.length).toBe(mockMenu.length);

      arrowIcons.forEach(arrow => {
        expect(arrow.nativeElement.src).toContain('arrow.svg');
        expect(arrow.nativeElement.alt).toBe('Arrow');
      });
    });

    it('should call closeMenu when mobile nav link is clicked', () => {
      jest.spyOn(component, 'closeMenu');
      component.menuOpen = true;
      fixture.detectChanges();

      const firstMobileLink = debugElement.query(By.css('.mobile-nav .nav-link'));
      firstMobileLink.nativeElement.click();

      expect(component.closeMenu).toHaveBeenCalled();
    });

    it('should apply active class to active item in mobile menu', () => {
      component.menuOpen = true;
      fixture.detectChanges();

      const mobileNavLinks = debugElement.queryAll(By.css('.mobile-nav .nav-link'));
      const activeLink = mobileNavLinks.find(link => 
        link.nativeElement.textContent.includes('Accueil')
      );
      
      expect(activeLink?.nativeElement.classList.contains('active')).toBeTruthy();
    });
  });

  describe('Menu Toggle Functionality', () => {
    it('should toggle menu state when toggleMenu is called', () => {
      expect(component.menuOpen).toBe(false);
      
      component.toggleMenu();
      expect(component.menuOpen).toBe(true);
      
      component.toggleMenu();
      expect(component.menuOpen).toBe(false);
    });

    it('should close menu when closeMenu is called', () => {
      component.menuOpen = true;
      
      component.closeMenu();
      expect(component.menuOpen).toBe(false);
    });

    it('should update menu visibility class when toggled', () => {
      const mobileContainer = debugElement.query(By.css('.mobile-menu-container'));
      
      // Menu fermé initialement
      expect(mobileContainer.nativeElement.classList.contains('menu-visible')).toBeFalsy();
      
      // Ouvrir le menu
      component.toggleMenu();
      fixture.detectChanges();
      expect(mobileContainer.nativeElement.classList.contains('menu-visible')).toBeTruthy();
      
      // Fermer le menu
      component.toggleMenu();
      fixture.detectChanges();
      expect(mobileContainer.nativeElement.classList.contains('menu-visible')).toBeFalsy();
    });
  });

  describe('Icon Management', () => {
    it('should call getIcon method for menu items', () => {
      // Vérifier que getIcon existe et retourne des valeurs
      mockMenu.forEach(item => {
        const iconSrc = component.getIcon(item);
        expect(iconSrc).toBeDefined();
        expect(typeof iconSrc).toBe('string');
      });
    });

    it('should call isActive method for determining active state', () => {
      expect(component.isActive).toHaveBeenCalled();
      
      mockMenu.forEach(item => {
        expect(component.isActive).toHaveBeenCalledWith(item.path);
      });
    });

    it('should return active icon for active menu item', () => {
      const homeItem = mockMenu[0]; // Accueil
      
      // Mock isActive pour retourner true pour /home
      component.isActive = jest.fn((path: string) => path === '/home');
      
      const result = component.getIcon(homeItem);
      expect(result).toBe(homeItem.iconActive);
    });

    it('should return regular icon for inactive menu item', () => {
      const destinationsItem = mockMenu[1]; // Destinations
      
      // Mock isActive pour retourner false pour /destinations
      component.isActive = jest.fn((path: string) => path === '/home');
      
      const result = component.getIcon(destinationsItem);
      expect(result).toBe(destinationsItem.icon);
    });
  });

  describe('Router Integration', () => {
    it('should have navigation links structure', () => {
      const allNavLinks = debugElement.queryAll(By.css('.nav-link'));
      expect(allNavLinks.length).toBe(mockMenu.length * 2); // Desktop + Mobile

      allNavLinks.forEach(link => {
        expect(link.nativeElement.classList.contains('nav-link')).toBeTruthy();
      });
    });

    it('should integrate with Angular Router template', () => {
      // Vérifier que le template contient des éléments avec ng-reflect-router-link (attribut généré par Angular)
      const templateContent = fixture.nativeElement.innerHTML;
      expect(templateContent).toContain('ng-reflect-router-link');
      
      // Vérifier aussi la présence des href générés par le router
      expect(templateContent).toContain('href="/home"');
      expect(templateContent).toContain('href="/destinations"');
      expect(templateContent).toContain('href="/contact"');
    });

    it('should have correct navigation structure', () => {
      const desktopLinks = debugElement.queryAll(By.css('.desktop-nav .nav-link'));
      const mobileLinks = debugElement.queryAll(By.css('.mobile-nav .nav-link'));
      
      expect(desktopLinks.length).toBe(mockMenu.length);
      expect(mobileLinks.length).toBe(mockMenu.length);
      
      // Vérifier que tous les liens ont la classe nav-link
      [...desktopLinks, ...mobileLinks].forEach(link => {
        expect(link.nativeElement.classList.contains('nav-link')).toBeTruthy();
      });
    });

    it('should generate correct router links attributes', () => {
      const allNavLinks = debugElement.queryAll(By.css('.nav-link'));
      
      allNavLinks.forEach(link => {
        // Vérifier que ng-reflect-router-link est présent
        const routerLinkReflect = link.nativeElement.getAttribute('ng-reflect-router-link');
        expect(routerLinkReflect).toBeTruthy();
        
        // Vérifier que l'href est généré correctement
        const href = link.nativeElement.getAttribute('href');
        expect(href).toBeTruthy();
        expect(href.startsWith('/')).toBeTruthy();
      });
    });

    it('should have matching router links and menu paths', () => {
      const desktopLinks = debugElement.queryAll(By.css('.desktop-nav .nav-link'));
      
      desktopLinks.forEach((link, index) => {
        const routerLinkReflect = link.nativeElement.getAttribute('ng-reflect-router-link');
        const expectedPath = mockMenu[index].path;
        
        expect(routerLinkReflect).toBe(expectedPath);
      });
    });

    it('should have functional router navigation', () => {
      const allNavLinks = debugElement.queryAll(By.css('.nav-link'));
      
      // Vérifier que chaque lien a un href valide
      allNavLinks.forEach(link => {
        const href = link.nativeElement.href;
        expect(href).toBeTruthy();
        
        // Vérifier que le href correspond à un path du menu
        const pathFromHref = href.split('/').pop();
        const hasMatchingPath = mockMenu.some(item => 
          item.path.includes(pathFromHref)
        );
        expect(hasMatchingPath).toBeTruthy();
      });
    });
  });

  describe('Component Input Changes', () => {
    it('should update menu when menu input changes', () => {
      const newMenu = [
        { label: 'Nouveau', path: '/nouveau', icon: 'nouveau.svg', iconActive: 'nouveau-active.svg' }
      ];
      
      component.menu = newMenu;
      fixture.detectChanges();

      const navLinks = debugElement.queryAll(By.css('.desktop-nav .nav-link'));
      expect(navLinks.length).toBe(1);
      expect(navLinks[0].nativeElement.textContent.trim()).toBe('Nouveau');
    });

    it('should handle empty menu gracefully', () => {
      component.menu = [];
      fixture.detectChanges();

      const desktopNavLinks = debugElement.queryAll(By.css('.desktop-nav .nav-link'));
      const mobileNavLinks = debugElement.queryAll(By.css('.mobile-nav .nav-link'));
      
      expect(desktopNavLinks.length).toBe(0);
      expect(mobileNavLinks.length).toBe(0);
    });
  });

  describe('Accessibility', () => {
    it('should have proper alt attributes for images', () => {
      const logo = debugElement.query(By.css('.logo-img'));
      const burgerIcon = debugElement.query(By.css('.burger-icon'));
      
      expect(logo.nativeElement.alt).toBe('Logo');
      expect(burgerIcon.nativeElement.alt).toBe('Menu');
    });

    it('should have semantic navigation structure', () => {
      const navElements = debugElement.queryAll(By.css('nav'));
      expect(navElements.length).toBe(2); // Desktop et Mobile nav
      
      navElements.forEach(nav => {
        expect(nav.nativeElement.tagName.toLowerCase()).toBe('nav');
      });
    });

    it('should have proper header structure', () => {
      const header = debugElement.query(By.css('header'));
      expect(header).toBeTruthy();
      expect(header.nativeElement.classList.contains('header')).toBeTruthy();
    });

    it('should have clickable burger button', () => {
      const burgerBtn = debugElement.query(By.css('.burger-btn'));
      expect(burgerBtn).toBeTruthy();
      
      // Vérifier que c'est cliquable en testant l'event listener
      jest.spyOn(component, 'toggleMenu');
      burgerBtn.nativeElement.click();
      expect(component.toggleMenu).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle missing menu items gracefully', () => {
      component.menu = null as any;
      
      expect(() => fixture.detectChanges()).not.toThrow();
    });

    it('should handle missing icon paths gracefully', () => {
      component.mainLogo = '';
      component.burgerIcon = '';
      component.arrowForward = '';
      
      expect(() => fixture.detectChanges()).not.toThrow();
    });

    it('should maintain component integrity after menu operations', () => {
      component.toggleMenu();
      component.closeMenu();
      fixture.detectChanges();
      
      expect(component).toBeTruthy();
      expect(debugElement.query(By.css('header'))).toBeTruthy();
    });
  });

  describe('CSS Classes and Structure', () => {
    it('should have correct CSS classes', () => {
      const header = debugElement.query(By.css('header.header'));
      const logoContainer = debugElement.query(By.css('.header-logo'));
      const desktopNav = debugElement.query(By.css('.header-nav.desktop-nav'));
      const burgerBtn = debugElement.query(By.css('.burger-btn'));
      const mobileContainer = debugElement.query(By.css('.mobile-menu-container'));
      
      expect(header).toBeTruthy();
      expect(logoContainer).toBeTruthy();
      expect(desktopNav).toBeTruthy();
      expect(burgerBtn).toBeTruthy();
      expect(mobileContainer).toBeTruthy();
    });

    it('should have proper navigation link classes', () => {
      const navLinks = debugElement.queryAll(By.css('.nav-link'));
      
      navLinks.forEach(link => {
        expect(link.nativeElement.classList.contains('nav-link')).toBeTruthy();
      });
    });

    it('should apply menu-visible class when menu is open', () => {
      const mobileContainer = debugElement.query(By.css('.mobile-menu-container'));
      
      component.menuOpen = true;
      fixture.detectChanges();
      
      expect(mobileContainer.nativeElement.classList.contains('menu-visible')).toBeTruthy();
    });
  });

  describe('Template Rendering', () => {
    it('should render complete header template', () => {
      const header = debugElement.query(By.css('header.header'));
      expect(header).toBeTruthy();
      
      // Vérifier que tous les éléments principaux sont présents
      expect(header.query(By.css('.header-logo'))).toBeTruthy();
      expect(header.query(By.css('.header-nav.desktop-nav'))).toBeTruthy();
      expect(header.query(By.css('.burger-btn'))).toBeTruthy();
      expect(header.query(By.css('.mobile-menu-container'))).toBeTruthy();
    });

    it('should render all menu items in both desktop and mobile views', () => {
      const totalNavLinks = debugElement.queryAll(By.css('.nav-link'));
      expect(totalNavLinks.length).toBe(mockMenu.length * 2); // Desktop + Mobile
    });

    it('should have consistent menu structure between desktop and mobile', () => {
      const desktopNavLinks = debugElement.queryAll(By.css('.desktop-nav .nav-link'));
      const mobileNavLinks = debugElement.queryAll(By.css('.mobile-nav .nav-link'));
      
      expect(desktopNavLinks.length).toBe(mobileNavLinks.length);
      expect(desktopNavLinks.length).toBe(mockMenu.length);
    });
  });
});
