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

  // Configuration centralisée des données de test
  const testData = {
    paths: {
      home: '/home',
      about: '/about',
      services: '/services',
      agenda: '/agenda',
      messagerie: '/messagerie',
      profil: '/profil',
      test: '/test',
      empty: '',
      complex: [
        '/user/123/profile',
        '/search?q=test&sort=date',
        '/page#section',
        '/api/v1/users/123',
        '/français/café'
      ]
    },
    items: {
      default: {
        icon: 'default.svg',
        iconActive: 'active.svg',
        path: '/test',
        label: 'Test'
      },
      withoutActive: {
        icon: 'default.svg',
        path: '/test',
        label: 'Test'
      },
      emptyActive: {
        icon: 'default.svg',
        iconActive: '',
        path: '/test',
        label: 'Test'
      },
      minimal: {
        icon: 'minimal.svg',
        path: '/minimal',
        label: 'Minimal'
      },
      incomplete: {
        label: 'Test'
      }
    }
  };

  // Helpers pour réduire la duplication
  const testHelpers = {
    createTestItem: (overrides = {}) => ({
      ...testData.items.default,
      ...overrides
    }),
    
    setCurrentPath: (path: string) => {
      component.currentPath = path;
      fixture.detectChanges();
    },
    
    triggerNavigation: (path: string) => {
      mockLocation.path.and.returnValue(path);
      routerEvents$.next(new NavigationEnd(1, path, path));
    },
    
    getElementBySelector: (selector: string) => 
      fixture.debugElement.query(By.css(selector)),
    
    getAllElementsBySelector: (selector: string) => 
      fixture.debugElement.queryAll(By.css(selector)),
    
    expectPathToBeActive: (path: string, shouldBeActive = true) => {
      expect(component.isActive(path)).toBe(shouldBeActive);
    },
    
    expectIconToBe: (item: any, expectedIcon: string) => {
      expect(component.getIcon(item)).toBe(expectedIcon);
    },
    
    simulateHover: (item: any, isHovered = true) => {
      component.hoveredItem = isHovered ? item : null;
      fixture.detectChanges();
    },
    
    expectElementToHaveClass: (element: any, className: string, shouldHave = true) => {
      const hasClass = element.nativeElement.classList.contains(className);
      expect(hasClass).toBe(shouldHave);
    }
  };

  // Configuration de test paramétrée
  const createParameterizedTests = (testCases: any[], testFunction: Function) => {
    testCases.forEach(testCase => {
      const description = typeof testCase === 'object' ? testCase.description : testCase;
      it(description, () => testFunction(testCase));
    });
  };

  beforeEach(async () => {
    routerEvents$ = new Subject<RouterEvent>();

    mockRouter = {
      events: routerEvents$.asObservable()
    };

    mockLocation = {
      path: jasmine.createSpy().and.returnValue(testData.paths.home)
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

  describe('Constructor & Initialization', () => {
    const constructorTests = [
      {
        description: 'should inject Router and Location dependencies',
        test: () => {
          expect(component['router']).toBe(mockRouter);
          expect(component['location']).toBe(mockLocation);
        }
      },
      {
        description: 'should have router as private property',
        test: () => {
          expect(component['router']).toBeDefined();
          expect(component['router']).toBe(mockRouter);
        }
      },
      {
        description: 'should have location as public property',
        test: () => {
          expect(component.location).toBeDefined();
          expect(component.location).toBe(mockLocation);
        }
      },
      {
        description: 'should initialize with default values',
        test: () => {
          const newComponent = TestBed.createComponent(HeaderComponent).componentInstance;
          expect(newComponent.currentPath).toBeDefined();
          expect(newComponent.hoveredItem).toBeNull();
        }
      }
    ];

    constructorTests.forEach(({ description, test }) => {
      it(description, test);
    });

    it('should create the component', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('ngOnInit', () => {
    const pathInitializationTests = [
      { path: testData.paths.about, expected: testData.paths.about },
      { path: '', expected: testData.paths.home },
      { path: null, expected: testData.paths.home },
      { path: undefined, expected: testData.paths.home }
    ];

    createParameterizedTests(
      pathInitializationTests.map(test => ({
        description: `should initialize currentPath correctly for path: ${test.path}`,
        ...test
      })),
      ({ path, expected }: { path: string | null | undefined; expected: string }) => {
        mockLocation.path.and.returnValue(path);
        component.ngOnInit();
        expect(component.currentPath).toBe(expected);
      }
    );

    const navigationTests = [
      {
        description: 'should update currentPath on NavigationEnd event',
        test: () => {
          component.ngOnInit();
          testHelpers.triggerNavigation(testData.paths.services);
          expect(component.currentPath).toBe(testData.paths.services);
        }
      },
      {
        description: 'should fallback to /home if location.path() is empty during NavigationEnd',
        test: () => {
          component.ngOnInit();
          testHelpers.triggerNavigation('');
          expect(component.currentPath).toBe(testData.paths.home);
        }
      },
      {
        description: 'should ignore non-NavigationEnd events',
        test: () => {
          component.ngOnInit();
          component.currentPath = '/initial';
          routerEvents$.next(new NavigationStart(1, '/other'));
          expect(component.currentPath).toBe('/initial');
        }
      },
      {
        description: 'should handle multiple NavigationEnd events',
        test: () => {
          component.ngOnInit();
          testHelpers.triggerNavigation('/page1');
          expect(component.currentPath).toBe('/page1');
          testHelpers.triggerNavigation('/page2');
          expect(component.currentPath).toBe('/page2');
        }
      }
    ];

    navigationTests.forEach(({ description, test }) => {
      it(description, test);
    });
  });

  describe('isActive Method', () => {
    const activeTests = [
      { currentPath: testData.paths.profil, testPath: testData.paths.profil, expected: true },
      { currentPath: testData.paths.messagerie, testPath: testData.paths.home, expected: false },
      { currentPath: testData.paths.home, testPath: testData.paths.home, expected: true },
      { currentPath: '/home/profile', testPath: testData.paths.home, expected: false },
      { currentPath: testData.paths.home, testPath: '', expected: false },
      { currentPath: '', testPath: '', expected: true },
      { currentPath: '/Home', testPath: '/home', expected: false },
      { currentPath: '/Home', testPath: '/Home', expected: true },
      { currentPath: '/search?q=test', testPath: '/search?q=test', expected: true },
      { currentPath: '/search?q=test', testPath: '/search', expected: false }
    ];

    createParameterizedTests(
      activeTests.map(test => ({
        description: `should return ${test.expected} when currentPath is "${test.currentPath}" and testing "${test.testPath}"`,
        ...test
      })),
      ({ currentPath, testPath, expected }: { currentPath: string; testPath: string; expected: boolean }) => {
        component.currentPath = currentPath;
        expect(component.isActive(testPath)).toBe(expected);
      }
    );
  });

  describe('getIcon Method', () => {
    const iconTests = [
      {
        description: 'should return iconActive when item is hovered',
        setup: () => {
          const item = testHelpers.createTestItem();
          testHelpers.simulateHover(item);
          testHelpers.setCurrentPath('/other');
          return { item, expected: item.iconActive };
        }
      },
      {
        description: 'should return iconActive when item path is active',
        setup: () => {
          const item = testHelpers.createTestItem();
          testHelpers.simulateHover(null);
          testHelpers.setCurrentPath(item.path);
          return { item, expected: item.iconActive };
        }
      },
      {
        description: 'should return iconActive when item is both hovered and active',
        setup: () => {
          const item = testHelpers.createTestItem();
          testHelpers.simulateHover(item);
          testHelpers.setCurrentPath(item.path);
          return { item, expected: item.iconActive };
        }
      },
      {
        description: 'should return default icon when item is not hovered and not active',
        setup: () => {
          const item = testHelpers.createTestItem();
          testHelpers.simulateHover(null);
          testHelpers.setCurrentPath('/other');
          return { item, expected: item.icon };
        }
      },
      {
        description: 'should return default icon when item is hovered but iconActive is missing',
        setup: () => {
          const item = testData.items.withoutActive;
          testHelpers.simulateHover(item);
          testHelpers.setCurrentPath('/other');
          return { item, expected: item.icon };
        }
      },
      {
        description: 'should return default icon when item is active but iconActive is missing',
        setup: () => {
          const item = testData.items.withoutActive;
          testHelpers.simulateHover(null);
          testHelpers.setCurrentPath(item.path);
          return { item, expected: item.icon };
        }
      },
      {
        description: 'should return default icon when iconActive is empty string',
        setup: () => {
          const item = testData.items.emptyActive;
          testHelpers.simulateHover(item);
          testHelpers.setCurrentPath('/other');
          return { item, expected: item.icon };
        }
      }
    ];

    iconTests.forEach(({ description, setup }) => {
      it(description, () => {
        const { item, expected } = setup();
        testHelpers.expectIconToBe(item, expected);
      });
    });

    it('should handle different hovered items', () => {
      const item1 = testHelpers.createTestItem();
      const item2 = testHelpers.createTestItem({
        icon: 'other.svg',
        iconActive: 'other-active.svg',
        path: '/other'
      });
      
      testHelpers.simulateHover(item2);
      testHelpers.setCurrentPath('/different');
      
      testHelpers.expectIconToBe(item1, item1.icon);
      testHelpers.expectIconToBe(item2, item2.iconActive);
    });
  });

  describe('Template Rendering', () => {
    const templateTests = [
      {
        description: 'should render logo with correct src',
        test: () => {
          const img = testHelpers.getElementBySelector('.logo-img');
          expect(img).toBeTruthy();
          expect(img.nativeElement.getAttribute('src')).toBe(component.mainLogo);
        }
      },
      {
        description: 'should render a nav-link for each menu item',
        test: () => {
          const links = testHelpers.getAllElementsBySelector('.nav-link');
          expect(links.length).toBe(component.menu.length);
        }
      },
      {
        description: 'should display correct labels for all menu items',
        test: () => {
          const links = testHelpers.getAllElementsBySelector('.nav-link');
          links.forEach((link, i) => {
            expect(link.nativeElement.textContent).toContain(component.menu[i].label);
          });
        }
      },
      {
        description: 'should display correct routerLink attributes',
        test: () => {
          const links = testHelpers.getAllElementsBySelector('.nav-link');
          links.forEach((link, i) => {
            expect(link.nativeElement.getAttribute('routerLink')).toBe(component.menu[i].path);
          });
        }
      }
    ];

    templateTests.forEach(({ description, test }) => {
      it(description, test);
    });

    it('should apply .active class to the active route', () => {
      testHelpers.setCurrentPath(testData.paths.agenda);
      const links = testHelpers.getAllElementsBySelector('.nav-link');
      const active = links.find(el => el.nativeElement.classList.contains('active'));
      expect(active?.nativeElement.textContent).toContain('Agenda');
    });

    describe('Hover Interactions', () => {
      it('should set hoveredItem on mouseenter and remove on mouseleave', () => {
        const link = testHelpers.getAllElementsBySelector('.nav-link')[0];
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
        testHelpers.simulateHover(item);

        const link = testHelpers.getAllElementsBySelector('.nav-link')[0];
        const img = link.query(By.css('img.icon'));
        expect(img.nativeElement.getAttribute('src')).toBe(component.getIcon(item));
      });
    });

    describe('Navigation Integration', () => {
      it('should respond to NavigationEnd and update active class in template', () => {
        testHelpers.triggerNavigation(testData.paths.messagerie);
        fixture.detectChanges();

        const links = testHelpers.getAllElementsBySelector('.nav-link');
        const active = links.find(el => el.nativeElement.classList.contains('active'));
        expect(active?.nativeElement.textContent).toContain('Messagerie');
      });
    });
  });

  describe('Integration Tests', () => {
    it('should work correctly with router navigation and icon changes', () => {
      const testItem = testHelpers.createTestItem({
        icon: 'test.svg',
        iconActive: 'test-active.svg',
        path: testData.paths.test
      });
      
      component.menu = [testItem];
      component.ngOnInit();
      
      testHelpers.expectIconToBe(testItem, testItem.icon);
      testHelpers.triggerNavigation(testData.paths.test);
      testHelpers.expectIconToBe(testItem, testItem.iconActive);
    });

    it('should handle hover state changes during navigation', () => {
      const testItem = testHelpers.createTestItem();
      component.ngOnInit();
      
      testHelpers.simulateHover(testItem);
      testHelpers.expectIconToBe(testItem, testItem.iconActive);
      
      testHelpers.triggerNavigation('/other');
      testHelpers.expectIconToBe(testItem, testItem.iconActive);
      
      testHelpers.simulateHover(null);
      testHelpers.expectIconToBe(testItem, testItem.icon);
    });

    it('should maintain state consistency across multiple operations', () => {
      const item1 = testHelpers.createTestItem({ path: '/item1' });
      const item2 = testHelpers.createTestItem({ path: '/item2' });
      
      component.ngOnInit();
      
      testHelpers.expectPathToBeActive('/item1', false);
      testHelpers.expectPathToBeActive('/item2', false);
      testHelpers.expectIconToBe(item1, item1.icon);
      testHelpers.expectIconToBe(item2, item2.icon);
      
      testHelpers.triggerNavigation('/item1');
      
      testHelpers.expectPathToBeActive('/item1', true);
      testHelpers.expectPathToBeActive('/item2', false);
      testHelpers.expectIconToBe(item1, item1.iconActive);
      testHelpers.expectIconToBe(item2, item2.icon);
      
      testHelpers.simulateHover(item2);
      
      testHelpers.expectIconToBe(item1, item1.iconActive);
      testHelpers.expectIconToBe(item2, item2.iconActive);
    });
  });

  describe('Edge Cases', () => {
    const edgeCaseTests = [
      {
        description: 'should handle undefined menu items',
        test: () => {
          component.menu = undefined as any;
          expect(() => fixture.detectChanges()).not.toThrow();
        }
      },
      {
        description: 'should handle menu items with missing properties',
        test: () => {
          const incompleteItem = testData.items.incomplete;
          component.menu = [incompleteItem as any];
          fixture.detectChanges();
          expect(() => component.getIcon(incompleteItem)).not.toThrow();
        }
      },
      {
        description: 'should handle empty menu gracefully',
        test: () => {
          component.menu = [];
          fixture.detectChanges();
          const links = testHelpers.getAllElementsBySelector('.nav-link');
          expect(links.length).toBe(0);
        }
      },
      {
        description: 'should handle null hoveredItem in template',
        test: () => {
          testHelpers.simulateHover(null);
          expect(() => fixture.detectChanges()).not.toThrow();
        }
      }
    ];

    edgeCaseTests.forEach(({ description, test }) => {
      it(description, test);
    });

    it('should handle complex paths with special characters', () => {
      testData.paths.complex.forEach(path => {
        component.currentPath = path;
        testHelpers.expectPathToBeActive(path, true);
        testHelpers.expectPathToBeActive(path + '/other', false);
      });
    });

    it('should handle rapid navigation changes', () => {
      component.ngOnInit();
      
      const paths = ['/page1', '/page2', '/page3'];
      paths.forEach((path, index) => {
        testHelpers.triggerNavigation(path);
        expect(component.currentPath).toBe(path);
      });
    });
  });

  describe('HTML Structure', () => {
    it('should have proper HTML structure', () => {
      const header = testHelpers.getElementBySelector('header');
      const nav = testHelpers.getElementBySelector('nav');
      
      expect(header).toBeTruthy();
      expect(nav).toBeTruthy();
    });
  });
});