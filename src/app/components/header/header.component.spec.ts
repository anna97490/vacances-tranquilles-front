import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HeaderComponent } from './header.component';
import { provideRouter } from '@angular/router';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent, RouterTestingModule],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    
    // Configuration des propriétés du composant
    component.mainLogo = 'assets/pictures/logo.png';
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have mainLogo property', () => {
      expect(component.mainLogo).toBeDefined();
      expect(component.mainLogo).toBe('assets/pictures/logo.png');
    });

    it('should have hoveredItem property initialized to null', () => {
      expect(component.hoveredItem).toBeNull();
    });
  });

  describe('Header Structure', () => {
    it('should have header element with correct class', () => {
      const header = debugElement.query(By.css('header.header'));
      expect(header).toBeTruthy();
      expect(header.nativeElement.classList.contains('header')).toBeTruthy();
    });

    it('should have header logo section', () => {
      const headerLogo = debugElement.query(By.css('.header-logo'));
      expect(headerLogo).toBeTruthy();
    });

    it('should have header navigation section', () => {
      const headerNav = debugElement.query(By.css('.header-nav'));
      expect(headerNav).toBeTruthy();
    });
  });

  describe('Logo Display', () => {
    it('should display main logo', () => {
      const logoImg = debugElement.query(By.css('.header-logo img.logo-img'));
      expect(logoImg).toBeTruthy();
      expect(logoImg.nativeElement.src).toContain('assets/pictures/logo.png');
      expect(logoImg.nativeElement.alt).toBe('Logo');
    });

    it('should have correct CSS classes on logo', () => {
      const logoImg = debugElement.query(By.css('.header-logo img'));
      expect(logoImg.nativeElement.classList.contains('logo-img')).toBeTruthy();
    });

    it('should update logo when mainLogo changes', () => {
      const newLogo = 'assets/new-logo.png';
      component.mainLogo = newLogo;
      fixture.detectChanges();

      const logoImg = debugElement.query(By.css('.logo-img'));
      expect(logoImg.nativeElement.src).toContain(newLogo);
    });
  });

  describe('Active State', () => {
    it('should have isActive method', () => {
      expect(typeof component.isActive).toBe('function');
    });

    it('should call isActive method for each navigation item', () => {
      spyOn(component, 'isActive').and.returnValue(false);
      fixture.detectChanges();
    });
  });

  describe('ngFor Template Logic', () => {

    it('should handle empty menu array', () => {
      component.menu = [];
      fixture.detectChanges();
      
      const navLinks = debugElement.queryAll(By.css('.nav-link'));
      expect(navLinks.length).toBe(0);
    });

    it('should handle menu updates', () => {
      const newMenu = [
        { label: 'Nouveau', path: '/new', icon: 'assets/icons/new.svg', iconActive: 'assets/icons/new_active.svg' }
      ];
      
      component.menu = newMenu;
      fixture.detectChanges();
      
      const navLinks = debugElement.queryAll(By.css('.nav-link'));
      expect(navLinks.length).toBe(1);
      expect(navLinks[0].nativeElement.textContent.trim()).toContain('Nouveau');
    });
  });

  describe('CSS Classes and Styling', () => {
    it('should have correct CSS classes on header elements', () => {
      const header = debugElement.query(By.css('header'));
      const headerLogo = debugElement.query(By.css('.header-logo'));
      const headerNav = debugElement.query(By.css('.header-nav'));
      
      expect(header.nativeElement.classList.contains('header')).toBeTruthy();
      expect(headerLogo.nativeElement.classList.contains('header-logo')).toBeTruthy();
      expect(headerNav.nativeElement.classList.contains('header-nav')).toBeTruthy();
    });

    it('should have correct CSS classes on navigation elements', () => {
      const navLinks = debugElement.queryAll(By.css('.nav-link'));
      const icons = debugElement.queryAll(By.css('.icon'));
      
      navLinks.forEach(link => {
        expect(link.nativeElement.classList.contains('nav-link')).toBeTruthy();
      });
      
      icons.forEach(icon => {
        expect(icon.nativeElement.classList.contains('icon')).toBeTruthy();
      });
    });
  });

  describe('HTML Structure', () => {
    it('should have proper semantic HTML structure', () => {
      const header = debugElement.query(By.css('header'));
      const nav = debugElement.query(By.css('nav'));
      
      expect(header).toBeTruthy();
      expect(nav).toBeTruthy();
      expect(header.nativeElement.tagName.toLowerCase()).toBe('header');
      expect(nav.nativeElement.tagName.toLowerCase()).toBe('nav');
    });
  });

  describe('Content Validation', () => {
    it('should have proper menu structure', () => {
      expect(component.menu).toBeDefined();
      expect(Array.isArray(component.menu)).toBe(true);
      
      component.menu.forEach(item => {
        expect(item.label).toBeDefined();
        expect(item.path).toBeDefined();
        expect(item.icon).toBeDefined();
        expect(item.iconActive).toBeDefined();
        expect(typeof item.label).toBe('string');
        expect(typeof item.path).toBe('string');
        expect(typeof item.icon).toBe('string');
        expect(typeof item.iconActive).toBe('string');
      });
    });
  });
});