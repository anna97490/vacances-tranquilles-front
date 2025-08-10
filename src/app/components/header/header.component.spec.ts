import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        {
          provide: Router,
          useValue: {
            events: of({}),
            navigate: jasmine.createSpy('navigate'),
            url: '/home',
            createUrlTree: jasmine.createSpy('createUrlTree').and.returnValue({}),
            parseUrl: jasmine.createSpy('parseUrl').and.returnValue({}),
            serializeUrl: jasmine.createSpy('serializeUrl').and.returnValue(''),
            createUrlTreeFromSegment: jasmine.createSpy('createUrlTreeFromSegment').and.returnValue({}),
            routerState: {
              snapshot: {
                root: {
                  children: []
                }
              }
            }
          }
        },
        {
          provide: ActivatedRoute,
          useValue: {
            url: of([]),
            params: of({}),
            queryParams: of({}),
            fragment: of(''),
            data: of({}),
            outlet: 'primary',
            component: null,
            snapshot: {
              url: [],
              params: {},
              queryParams: {},
              fragment: '',
              data: {},
              outlet: 'primary',
              component: null
            }
          }
        },
        {
          provide: Location,
          useValue: {
            path: jasmine.createSpy('path').and.returnValue('/home')
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct menu items', () => {
    expect(component.menu.length).toBe(5);
    expect(component.menu[0].label).toBe('Accueil');
    expect(component.menu[1].label).toBe('Profil');
    expect(component.menu[2].label).toBe('Mes réservations');
    expect(component.menu[3].label).toBe('Messagerie');
    expect(component.menu[4].label).toBe('Assistance');
  });

  it('should have correct paths for menu items', () => {
    expect(component.menu[0].path).toBe('/home');
    expect(component.menu[1].path).toBe('/profil');
    expect(component.menu[2].path).toBe('/reservations');
    expect(component.menu[3].path).toBe('/messagerie');
    expect(component.menu[4].path).toBe('/assistance');
  });

  it('should have correct icons for menu items', () => {
    expect(component.menu[0].icon).toContain('cottage');
    expect(component.menu[1].icon).toContain('person');
    expect(component.menu[2].icon).toContain('calendar');
    expect(component.menu[3].icon).toContain('chat_bubble');
    expect(component.menu[4].icon).toContain('contact_support');
  });

  it('should have active icons for menu items', () => {
    expect(component.menu[0].iconActive).toContain('FFA101');
    expect(component.menu[1].iconActive).toContain('FFA101');
    expect(component.menu[2].iconActive).toContain('FFA101');
    expect(component.menu[3].iconActive).toContain('FFA101');
    expect(component.menu[4].iconActive).toContain('FFA101');
  });

  it('should initialize with correct logo path', () => {
    expect(component.mainLogo).toBe('assets/pictures/logo.png');
  });

  it('should initialize with hoveredItem as null', () => {
    expect(component.hoveredItem).toBeNull();
  });

  it('should initialize with mobile menu closed', () => {
    expect(component.isMobileMenuOpen).toBe(false);
  });

  it('should return correct icon based on hover state', () => {
    const menuItem = component.menu[0];
    component.hoveredItem = menuItem;

    const icon = component.getIcon(menuItem);
    expect(icon).toBe(menuItem.iconActive);
  });

  it('should return default icon when not hovered', () => {
    const menuItem = component.menu[0];
    component.hoveredItem = null;
    component.currentPath = '/profil';

    const icon = component.getIcon(menuItem);
    expect(icon).toBe(menuItem.icon);
  });

  it('should return active icon when route is active', () => {
    const menuItem = component.menu[0];
    component.currentPath = '/home';
    component.hoveredItem = null;

    const icon = component.getIcon(menuItem);
    expect(icon).toBe(menuItem.iconActive);
  });

  it('should return active icon when both hovered and route is active', () => {
    const menuItem = component.menu[0];
    component.currentPath = '/home';
    component.hoveredItem = menuItem;

    const icon = component.getIcon(menuItem);
    expect(icon).toBe(menuItem.iconActive);
  });

  it('should return default icon when route is not active and not hovered', () => {
    const menuItem = component.menu[0];
    component.currentPath = '/profil';
    component.hoveredItem = null;

    const icon = component.getIcon(menuItem);
    expect(icon).toBe(menuItem.icon);
  });

  it('should clear localStorage and navigate on logout without triggering real reload', () => {
    const clearSpy = spyOn(localStorage, 'clear');
    (component as any).router = router;
    jasmine.clock().install();
    try {
      component.logout();
      expect(clearSpy).toHaveBeenCalled();
      expect((router.navigate as jasmine.Spy)).toHaveBeenCalledWith(['/home']);
    } finally {
      jasmine.clock().uninstall();
    }
  });

  // Tests pour le burger menu
  it('should toggle mobile menu when toggleMobileMenu is called', () => {
    expect(component.isMobileMenuOpen).toBe(false);

    component.toggleMobileMenu();
    expect(component.isMobileMenuOpen).toBe(true);

    component.toggleMobileMenu();
    expect(component.isMobileMenuOpen).toBe(false);
  });

  it('should close mobile menu when closeMobileMenu is called', () => {
    component.isMobileMenuOpen = true;

    component.closeMobileMenu();
    expect(component.isMobileMenuOpen).toBe(false);
  });

  it('should prevent body scroll when mobile menu is open', () => {
    const originalOverflow = document.body.style.overflow;

    component.toggleMobileMenu();
    expect(document.body.style.overflow).toBe('hidden');

    component.toggleMobileMenu();
    expect(document.body.style.overflow).toBe('');

    // Restaurer l'état original
    document.body.style.overflow = originalOverflow;
  });

  it('should restore body scroll when mobile menu is closed', () => {
    const originalOverflow = document.body.style.overflow;
    component.isMobileMenuOpen = true;

    component.closeMobileMenu();
    expect(document.body.style.overflow).toBe('');

    // Restaurer l'état original
    document.body.style.overflow = originalOverflow;
  });

  it('should close mobile menu on escape key', () => {
    component.isMobileMenuOpen = true;

    component.onEscapeKey();
    expect(component.isMobileMenuOpen).toBe(false);
  });

  it('should close mobile menu when clicking outside', () => {
    component.isMobileMenuOpen = true;

    const mockEvent = {
      target: document.createElement('div')
    } as unknown as Event;

    component.onDocumentClick(mockEvent);
    expect(component.isMobileMenuOpen).toBe(false);
  });

  it('should not close mobile menu when clicking inside menu', () => {
    component.isMobileMenuOpen = true;

    const mockMenuElement = document.createElement('div');
    mockMenuElement.className = 'mobile-menu-container';
    const mockEvent = {
      target: mockMenuElement
    } as unknown as Event;

    component.onDocumentClick(mockEvent);
    expect(component.isMobileMenuOpen).toBe(true);
  });

  it('should not close mobile menu when clicking burger button', () => {
    component.isMobileMenuOpen = true;

    const mockBurgerElement = document.createElement('button');
    mockBurgerElement.className = 'burger-btn';
    const mockEvent = {
      target: mockBurgerElement
    } as unknown as Event;

    component.onDocumentClick(mockEvent);
    expect(component.isMobileMenuOpen).toBe(true);
  });

  it('should render burger button in template', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const burgerButton = compiled.querySelector('.burger-btn');
    expect(burgerButton).toBeTruthy();
  });

  it('should render mobile menu container in template', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const mobileMenu = compiled.querySelector('.mobile-menu-container');
    expect(mobileMenu).toBeTruthy();
  });

  it('should render mobile navigation in template', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const mobileNav = compiled.querySelector('.mobile-nav');
    expect(mobileNav).toBeTruthy();
  });

  it('should render all menu items in mobile navigation', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const mobileNavLinks = compiled.querySelectorAll('.mobile-nav .nav-link');
    expect(mobileNavLinks.length).toBe(component.menu.length + 1); // +1 for logout
  });

  it('should render desktop navigation in template', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const desktopNav = compiled.querySelector('.desktop-nav');
    expect(desktopNav).toBeTruthy();
  });

  it('should render all menu items in desktop navigation', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const desktopNavLinks = compiled.querySelectorAll('.desktop-nav .nav-link');
    expect(desktopNavLinks.length).toBe(component.menu.length + 1); // +1 for logout
  });
});
