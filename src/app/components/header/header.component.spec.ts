import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { Router, NavigationEnd, NavigationStart, RouterEvent, provideRouter } from '@angular/router';
import { Location } from '@angular/common';
import { Subject } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let routerEvents$: Subject<RouterEvent>;
  let mockRouter: any;
  let mockLocation: any;

  beforeEach(async () => {
    routerEvents$ = new Subject<RouterEvent>();

    mockRouter = {
      events: routerEvents$.asObservable()
    };

    mockLocation = {
      path: jasmine.createSpy().and.returnValue('/home')
    };

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        provideRouter([]),
        { provide: Router, useValue: mockRouter },
        { provide: Location, useValue: mockLocation }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    routerEvents$.complete();
  });

  // -------------------------
  // 📦 TESTS CONSTRUCTEUR
  // -------------------------

  describe('Constructor', () => {
    it('should inject Router and Location dependencies', () => {
      expect(component['router']).toBe(mockRouter);
      expect(component['location']).toBe(mockLocation);
    });

    it('should have router as private property', () => {
      expect(component['router']).toBeDefined();
      expect(component['router']).toBe(mockRouter);
    });

    it('should have location as public property', () => {
      expect(component.location).toBeDefined();
      expect(component.location).toBe(mockLocation);
    });

    it('should initialize with default values', () => {
      const newComponent = TestBed.createComponent(HeaderComponent).componentInstance;
      expect(newComponent.currentPath).toBeDefined();
      expect(newComponent.hoveredItem).toBeNull();
    });
  });

  // -------------------------
  // 📦 TESTS LOGIQUES (.ts)
  // -------------------------

  describe('Logic (TypeScript)', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    describe('ngOnInit', () => {
      it('should initialize currentPath with location.path() value', () => {
        mockLocation.path.and.returnValue('/about');
        component.ngOnInit();
        expect(component.currentPath).toBe('/about');
      });

      it('should default to /home if location.path() returns empty string', () => {
        mockLocation.path.and.returnValue('');
        component.ngOnInit();
        expect(component.currentPath).toBe('/home');
      });

      it('should default to /home if location.path() returns null', () => {
        mockLocation.path.and.returnValue(null);
        component.ngOnInit();
        expect(component.currentPath).toBe('/home');
      });

      it('should default to /home if location.path() returns undefined', () => {
        mockLocation.path.and.returnValue(undefined);
        component.ngOnInit();
        expect(component.currentPath).toBe('/home');
      });

      it('should subscribe to router NavigationEnd events', () => {
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        
        mockLocation.path.and.returnValue('/test');
        routerEvents$.next(new NavigationEnd(1, '/test', '/test'));
        expect(component.currentPath).toBe('/test');
      });

      it('should update currentPath on NavigationEnd event', () => {
        component.ngOnInit();
        
        mockLocation.path.and.returnValue('/services');
        routerEvents$.next(new NavigationEnd(1, '/services', '/services'));
        expect(component.currentPath).toBe('/services');
      });

      it('should fallback to /home if location.path() is empty during NavigationEnd', () => {
        component.ngOnInit();
        
        mockLocation.path.and.returnValue('');
        routerEvents$.next(new NavigationEnd(1, '', ''));
        expect(component.currentPath).toBe('/home');
      });

      it('should ignore non-NavigationEnd events', () => {
        component.ngOnInit();
        component.currentPath = '/initial';
        
        routerEvents$.next(new NavigationStart(1, '/other'));
        expect(component.currentPath).toBe('/initial');
      });

      it('should handle multiple NavigationEnd events', () => {
        component.ngOnInit();
        
        mockLocation.path.and.returnValue('/page1');
        routerEvents$.next(new NavigationEnd(1, '/page1', '/page1'));
        expect(component.currentPath).toBe('/page1');
        
        mockLocation.path.and.returnValue('/page2');
        routerEvents$.next(new NavigationEnd(2, '/page2', '/page2'));
        expect(component.currentPath).toBe('/page2');
      });
    });

    describe('isActive', () => {
      it('should return true when path matches currentPath exactly', () => {
        component.currentPath = '/profil';
        expect(component.isActive('/profil')).toBeTrue();
      });

      it('should return false when path does not match currentPath', () => {
        component.currentPath = '/messagerie';
        expect(component.isActive('/home')).toBeFalse();
      });

      it('should return true for exact match with home path', () => {
        component.currentPath = '/home';
        expect(component.isActive('/home')).toBeTrue();
      });

      it('should return false for partial matches', () => {
        component.currentPath = '/home/profile';
        expect(component.isActive('/home')).toBeFalse();
      });

      it('should return false for empty path when currentPath is not empty', () => {
        component.currentPath = '/home';
        expect(component.isActive('')).toBeFalse();
      });

      it('should return true for empty path when currentPath is empty', () => {
        component.currentPath = '';
        expect(component.isActive('')).toBeTrue();
      });

      it('should handle case sensitivity', () => {
        component.currentPath = '/Home';
        expect(component.isActive('/home')).toBeFalse();
        expect(component.isActive('/Home')).toBeTrue();
      });

      it('should handle paths with query parameters', () => {
        component.currentPath = '/search?q=test';
        expect(component.isActive('/search?q=test')).toBeTrue();
        expect(component.isActive('/search')).toBeFalse();
      });
    });

    describe('getIcon', () => {
      let testItem: any;

      beforeEach(() => {
        testItem = {
          icon: 'default.svg',
          iconActive: 'active.svg',
          path: '/test'
        };
      });

      it('should return iconActive when item is hovered', () => {
        component.hoveredItem = testItem;
        component.currentPath = '/other';
        expect(component.getIcon(testItem)).toBe('active.svg');
      });

      it('should return iconActive when item path is active', () => {
        component.hoveredItem = null;
        component.currentPath = '/test';
        expect(component.getIcon(testItem)).toBe('active.svg');
      });

      it('should return iconActive when item is both hovered and active', () => {
        component.hoveredItem = testItem;
        component.currentPath = '/test';
        expect(component.getIcon(testItem)).toBe('active.svg');
      });

      it('should return default icon when item is not hovered and not active', () => {
        component.hoveredItem = null;
        component.currentPath = '/other';
        expect(component.getIcon(testItem)).toBe('default.svg');
      });

      it('should return default icon when item is hovered but iconActive is missing', () => {
        const itemWithoutActiveIcon = {
          icon: 'default.svg',
          path: '/test'
        };
        component.hoveredItem = itemWithoutActiveIcon;
        component.currentPath = '/other';
        expect(component.getIcon(itemWithoutActiveIcon)).toBe('default.svg');
      });

      it('should return default icon when item is active but iconActive is missing', () => {
        const itemWithoutActiveIcon = {
          icon: 'default.svg',
          path: '/test'
        };
        component.hoveredItem = null;
        component.currentPath = '/test';
        expect(component.getIcon(itemWithoutActiveIcon)).toBe('default.svg');
      });

      it('should return default icon when item is hovered but iconActive is empty string', () => {
        const itemWithEmptyActiveIcon = {
          icon: 'default.svg',
          iconActive: '',
          path: '/test'
        };
        component.hoveredItem = itemWithEmptyActiveIcon;
        component.currentPath = '/other';
        expect(component.getIcon(itemWithEmptyActiveIcon)).toBe('default.svg');
      });

      it('should handle different hovered items', () => {
        const otherItem = {
          icon: 'other.svg',
          iconActive: 'other-active.svg',
          path: '/other'
        };
        
        component.hoveredItem = otherItem;
        component.currentPath = '/different';
        
        expect(component.getIcon(testItem)).toBe('default.svg');
        expect(component.getIcon(otherItem)).toBe('other-active.svg');
      });

      it('should handle item with only icon property', () => {
        const minimalItem = {
          icon: 'minimal.svg',
          path: '/minimal'
        };
        
        component.hoveredItem = minimalItem;
        component.currentPath = '/minimal';
        
        expect(component.getIcon(minimalItem)).toBe('minimal.svg');
      });
    });
  });

  // ------------------------------------------
  // 🎨 TESTS D'INTERFACE (HTML / Template DOM)
  // ------------------------------------------

  describe('Template (HTML/DOM)', () => {
    it('should render logo with correct src', () => {
      const img = fixture.debugElement.query(By.css('.logo-img'));
      expect(img).toBeTruthy();
      expect(img.nativeElement.getAttribute('src')).toBe(component.mainLogo);
    });

    it('should render a nav-link for each menu item', () => {
      const links = fixture.debugElement.queryAll(By.css('.nav-link'));
      expect(links.length).toBe(component.menu.length);
    });

    it('should apply .active class to the active route', () => {
      component.currentPath = '/agenda';
      fixture.detectChanges();
      const links = fixture.debugElement.queryAll(By.css('.nav-link'));
      const active = links.find(el => el.nativeElement.classList.contains('active'));
      expect(active?.nativeElement.textContent).toContain('Agenda');
    });

    it('should display correct labels for all menu items', () => {
      const links = fixture.debugElement.queryAll(By.css('.nav-link'));
      links.forEach((link, i) => {
        expect(link.nativeElement.textContent).toContain(component.menu[i].label);
      });
    });

    it('should set hoveredItem on mouseenter and remove on mouseleave', () => {
      const link = fixture.debugElement.queryAll(By.css('.nav-link'))[0];
      const item = component.menu[0];

      link.triggerEventHandler('mouseenter', {});
      fixture.detectChanges();
      expect(component.hoveredItem).toBe(item);

      link.triggerEventHandler('mouseleave', {});
      fixture.detectChanges();
      expect(component.hoveredItem).toBeNull();
    });

    it('should update icon src based on hoveredItem', () => {
      const item = component.menu[0];
      component.hoveredItem = item;
      fixture.detectChanges();

      const link = fixture.debugElement.queryAll(By.css('.nav-link'))[0];
      const img = link.query(By.css('img.icon'));
      expect(img.nativeElement.getAttribute('src')).toBe(component.getIcon(item));
    });

    it('should respond to NavigationEnd and update active class in template', () => {
      mockLocation.path.and.returnValue('/messagerie');
      routerEvents$.next(new NavigationEnd(1, '', '/messagerie'));
      fixture.detectChanges();

      const links = fixture.debugElement.queryAll(By.css('.nav-link'));
      const active = links.find(el => el.nativeElement.classList.contains('active'));
      expect(active?.nativeElement.textContent).toContain('Messagerie');
    });

    it('should handle empty menu gracefully', () => {
      component.menu = [];
      fixture.detectChanges();
      
      const links = fixture.debugElement.queryAll(By.css('.nav-link'));
      expect(links.length).toBe(0);
    });

    it('should handle null hoveredItem in template', () => {
      component.hoveredItem = null;
      fixture.detectChanges();
      
      expect(() => fixture.detectChanges()).not.toThrow();
    });

    it('should display correct routerLink attributes', () => {
      const links = fixture.debugElement.queryAll(By.css('.nav-link'));
      links.forEach((link, i) => {
        expect(link.nativeElement.getAttribute('routerLink')).toBe(component.menu[i].path);
      });
    });

    it('should have proper HTML structure', () => {
      const header = fixture.debugElement.query(By.css('header'));
      const nav = fixture.debugElement.query(By.css('nav'));
      
      expect(header).toBeTruthy();
      expect(nav).toBeTruthy();
    });
  });

  // -------------------------
  // 📦 TESTS D'INTÉGRATION
  // -------------------------

  describe('Integration Tests', () => {
    it('should work correctly with router navigation and icon changes', () => {
      const testItem = {
        label: 'Test',
        icon: 'test.svg',
        iconActive: 'test-active.svg',
        path: '/test'
      };
      
      component.menu = [testItem];
      component.ngOnInit();
      
      expect(component.getIcon(testItem)).toBe('test.svg');
      
      mockLocation.path.and.returnValue('/test');
      routerEvents$.next(new NavigationEnd(1, '/test', '/test'));
      
      expect(component.getIcon(testItem)).toBe('test-active.svg');
    });

    it('should handle hover state changes during navigation', () => {
      const testItem = {
        icon: 'test.svg',
        iconActive: 'test-active.svg',
        path: '/test'
      };
      
      component.ngOnInit();
      
      component.hoveredItem = testItem;
      expect(component.getIcon(testItem)).toBe('test-active.svg');
      
      mockLocation.path.and.returnValue('/other');
      routerEvents$.next(new NavigationEnd(1, '/other', '/other'));
      
      expect(component.getIcon(testItem)).toBe('test-active.svg');
      
      component.hoveredItem = null;
      expect(component.getIcon(testItem)).toBe('test.svg');
    });

    it('should maintain state consistency across multiple operations', () => {
      const item1 = { icon: 'item1.svg', iconActive: 'item1-active.svg', path: '/item1' };
      const item2 = { icon: 'item2.svg', iconActive: 'item2-active.svg', path: '/item2' };
      
      component.ngOnInit();
      
      expect(component.isActive('/item1')).toBeFalse();
      expect(component.isActive('/item2')).toBeFalse();
      expect(component.getIcon(item1)).toBe('item1.svg');
      expect(component.getIcon(item2)).toBe('item2.svg');
      
      mockLocation.path.and.returnValue('/item1');
      routerEvents$.next(new NavigationEnd(1, '/item1', '/item1'));
      
      expect(component.isActive('/item1')).toBeTrue();
      expect(component.isActive('/item2')).toBeFalse();
      expect(component.getIcon(item1)).toBe('item1-active.svg');
      expect(component.getIcon(item2)).toBe('item2.svg');
      
      component.hoveredItem = item2;
      
      expect(component.getIcon(item1)).toBe('item1-active.svg');
      expect(component.getIcon(item2)).toBe('item2-active.svg');
    });

    it('should handle rapid navigation changes', () => {
      component.ngOnInit();
      
      mockLocation.path.and.returnValue('/page1');
      routerEvents$.next(new NavigationEnd(1, '/page1', '/page1'));
      expect(component.currentPath).toBe('/page1');
      
      mockLocation.path.and.returnValue('/page2');
      routerEvents$.next(new NavigationEnd(2, '/page2', '/page2'));
      expect(component.currentPath).toBe('/page2');
      
      mockLocation.path.and.returnValue('/page3');
      routerEvents$.next(new NavigationEnd(3, '/page3', '/page3'));
      expect(component.currentPath).toBe('/page3');
    });
  });

  // -------------------------
  // 📦 TESTS DE COUVERTURE
  // -------------------------

  describe('Edge Cases and Coverage', () => {
    it('should handle undefined menu items', () => {
      component.menu = undefined as any;
      fixture.detectChanges();
      
      expect(() => fixture.detectChanges()).not.toThrow();
    });

    it('should handle menu items with missing properties', () => {
      const incompleteItem = { label: 'Test' };
      component.menu = [incompleteItem as any];
      fixture.detectChanges();
      
      expect(() => component.getIcon(incompleteItem)).not.toThrow();
    });

    it('should handle router events subscription lifecycle', () => {
      component.ngOnInit();
      expect(component.currentPath).toBeDefined();
      
      // Simuler la destruction du composant
      // component.ngOnDestroy();
      
      // Les événements ne devraient plus affecter le composant
      mockLocation.path.and.returnValue('/should-not-update');
      routerEvents$.next(new NavigationEnd(1, '/should-not-update', '/should-not-update'));
      
      // currentPath ne devrait pas être mis à jour après destruction
      expect(component.currentPath).not.toBe('/should-not-update');
    });

    it('should handle complex paths with special characters', () => {
      const complexPaths = [
        '/user/123/profile',
        '/search?q=test&sort=date',
        '/page#section',
        '/api/v1/users/123',
        '/français/café'
      ];
      
      complexPaths.forEach(path => {
        component.currentPath = path;
        expect(component.isActive(path)).toBeTrue();
        expect(component.isActive(path + '/other')).toBeFalse();
      });
    });
  });
});