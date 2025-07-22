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

  // Configuration des données de test
  const footerData = {
    columns: [
      { title: 'Vacances Tranquilles', hasText: true },
      { title: 'Services', hasText: false },
      { title: 'À Propos', hasText: false },
      { title: 'Légal', hasText: false }
    ],
    legalLinks: [
      { route: '/terms-and-conditions/cgu', text: 'Conditions générales d\'utilisation' },
      { route: '/terms-and-conditions/cgv', text: 'Conditions générales de vente' }
    ],
    companyInfo: {
      name: 'Vacances Tranquilles',
      description: 'Votre partenaire de confiance',
      year: 'depuis 2020'
    },
    copyright: '© 2025 Tous droits réservés'
  };

  // Helpers pour réduire la duplication
  const selectors = {
    footer: 'footer.footer-mockup',
    footerContent: '.footer-content',
    footerCopyright: '.footer-copyright',
    footerCol: '.footer-col',
    footerTitle: '.footer-title',
    footerText: '.footer-text',
    footerLink: '.footer-link',
    matNavList: 'mat-nav-list',
    matListItem: 'a[mat-list-item]',
    routerLink: 'a[routerLink]'
  };

  const getElements = {
    all: (selector: string) => debugElement.queryAll(By.css(selector)),
    single: (selector: string) => debugElement.query(By.css(selector)),
    columns: () => getElements.all(selectors.footerCol),
    legalLinks: () => getElements.all(selectors.footerLink),
    routerLinks: () => getElements.all(selectors.routerLink)
  };

  const expectations = {
    elementExists: (selector: string, shouldExist = true) => {
      const element = getElements.single(selector);
      if (shouldExist) {
        expect(element).toBeTruthy();
      } else {
        expect(element).toBeFalsy();
      }
    },
    elementCount: (selector: string, expectedCount: number) => {
      const elements = getElements.all(selector);
      expect(elements.length).toBe(expectedCount);
    },
    textContent: (selector: string, expectedText: string, exact = true) => {
      const element = getElements.single(selector);
      expect(element).toBeTruthy();
      if (exact) {
        expect(element.nativeElement.textContent.trim()).toBe(expectedText);
      } else {
        expect(element.nativeElement.textContent).toContain(expectedText);
      }
    },
    hasClass: (element: DebugElement, className: string) => {
      expect(element.nativeElement.classList.contains(className)).toBeTruthy();
    },
    hasAttribute: (element: DebugElement, attribute: string, expectedValue?: string) => {
      expect(element.nativeElement.hasAttribute(attribute)).toBeTruthy();
      if (expectedValue) {
        expect(element.nativeElement.getAttribute(attribute)).toBe(expectedValue);
      }
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent, MatListModule],
      providers: [provideRouter([])]
    }).compileComponents();

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
      expectations.elementExists(selectors.footer);
    });
  });

  describe('Footer Structure', () => {
    const structureTests = [
      { selector: selectors.footer, description: 'footer with correct CSS class' },
      { selector: selectors.footerContent, description: 'footer content container' },
      { selector: selectors.footerCopyright, description: 'footer copyright section' }
    ];

    structureTests.forEach(({ selector, description }) => {
      it(`should have ${description}`, () => {
        expectations.elementExists(selector);
      });
    });

    it('should have 4 footer columns', () => {
      expectations.elementCount(selectors.footerCol, 4);
    });
  });

  describe('Footer Columns Content', () => {
    footerData.columns.forEach((columnData, index) => {
      it(`should display ${columnData.title} in column ${index + 1}`, () => {
        const columns = getElements.columns();
        const column = columns[index];
        const title = column.query(By.css(selectors.footerTitle));
        
        expect(title).toBeTruthy();
        expect(title.nativeElement.textContent.trim()).toBe(columnData.title);

        if (columnData.hasText && index === 0) {
          const text = column.query(By.css(selectors.footerText));
          expect(text).toBeTruthy();
          expect(text.nativeElement.textContent).toContain(footerData.companyInfo.description);
          expect(text.nativeElement.textContent).toContain(footerData.companyInfo.year);
        }
      });
    });
  });

  describe('Legal Section', () => {
    const legalTests = [
      {
        description: 'should have mat-nav-list in legal column',
        test: () => {
          const legalColumn = getElements.columns()[3];
          const navList = legalColumn.query(By.css(selectors.matNavList));
          expect(navList).toBeTruthy();
        }
      },
      {
        description: 'should have correct number of legal links',
        test: () => expectations.elementCount(selectors.footerLink, footerData.legalLinks.length)
      },
      {
        description: 'should have mat-list-item directive on legal links',
        test: () => {
          expectations.elementCount(selectors.matListItem, footerData.legalLinks.length);
          getElements.all(selectors.matListItem).forEach(link => {
            expectations.hasAttribute(link, 'mat-list-item');
          });
        }
      }
    ];

    legalTests.forEach(({ description, test }) => {
      it(description, test);
    });

    footerData.legalLinks.forEach((linkData, index) => {
      it(`should display ${linkData.text.split(' ')[0]} link`, () => {
        const linkSelector = `a[routerLink="${linkData.route}"]`;
        const link = getElements.single(linkSelector);
        
        expect(link).toBeTruthy();
        expect(link.nativeElement.textContent.trim()).toBe(linkData.text);
        expectations.hasClass(link, 'footer-link');
        expectations.hasAttribute(link, 'routerLink', linkData.route);
      });
    });

    it('should have disableRipple attribute on legal links', () => {
      getElements.legalLinks().forEach(link => {
        const componentInstance = link.componentInstance;
        if (componentInstance?.disableRipple !== undefined) {
          expect(componentInstance.disableRipple).toBe(true);
        } else {
          const ngReflectAttr = link.nativeElement.getAttribute('ng-reflect-disable-ripple');
          expect(ngReflectAttr).toBe('true');
        }
      });
    });
  });

  describe('Router Links', () => {
    it('should have correct routerLink attributes', () => {
      footerData.legalLinks.forEach(linkData => {
        const link = getElements.single(`a[routerLink="${linkData.route}"]`);
        expectations.hasAttribute(link, 'routerLink', linkData.route);
      });
    });

    it('should have all required router links', () => {
      const routerLinks = getElements.routerLinks();
      expectations.elementCount(selectors.routerLink, footerData.legalLinks.length);
      
      const routes = routerLinks.map(link => link.nativeElement.getAttribute('routerLink'));
      footerData.legalLinks.forEach(linkData => {
        expect(routes).toContain(linkData.route);
      });
    });
  });

  describe('Copyright Section', () => {
    it('should display copyright text', () => {
      expectations.textContent(selectors.footerCopyright, footerData.copyright);
    });

    it('should have correct copyright year', () => {
      expectations.textContent(selectors.footerCopyright, '2025', false);
    });
  });

  describe('CSS Classes', () => {
    const cssTests = [
      { 
        selector: selectors.footer, 
        expectedClasses: ['footer-mockup'],
        description: 'footer elements'
      },
      { 
        selector: selectors.footerContent, 
        expectedClasses: ['footer-content'],
        description: 'footer content'
      },
      { 
        selector: selectors.footerCopyright, 
        expectedClasses: ['footer-copyright'],
        description: 'footer copyright'
      }
    ];

    cssTests.forEach(({ selector, expectedClasses, description }) => {
      it(`should have correct CSS classes on ${description}`, () => {
        const element = getElements.single(selector);
        expectedClasses.forEach(className => {
          expectations.hasClass(element, className);
        });
      });
    });

    const multiElementTests = [
      { selector: selectors.footerCol, className: 'footer-col', count: 4, description: 'footer columns' },
      { selector: selectors.footerTitle, className: 'footer-title', count: 4, description: 'footer titles' },
      { selector: selectors.footerText, className: 'footer-text', count: 1, description: 'footer text' },
      { selector: selectors.footerLink, className: 'footer-link', count: 2, description: 'footer links' }
    ];

    multiElementTests.forEach(({ selector, className, count, description }) => {
      it(`should have correct CSS classes on ${description}`, () => {
        const elements = getElements.all(selector);
        expect(elements.length).toBe(count);
        elements.forEach(element => {
          expectations.hasClass(element, className);
        });
      });
    });
  });

  describe('HTML Structure', () => {
    const structureTests = [
      {
        description: 'should have proper semantic HTML structure',
        test: () => {
          const footer = getElements.single(selectors.footer);
          expect(footer.nativeElement.tagName.toLowerCase()).toBe('footer');
        }
      },
      {
        description: 'should have proper navigation structure',
        test: () => {
          const navList = getElements.single(selectors.matNavList);
          expect(navList).toBeTruthy();
          const navLinks = navList.queryAll(By.css('a'));
          expect(navLinks.length).toBe(footerData.legalLinks.length);
        }
      },
      {
        description: 'should have proper link structure',
        test: () => {
          getElements.routerLinks().forEach(link => {
            expect(link.nativeElement.tagName.toLowerCase()).toBe('a');
            expectations.hasAttribute(link, 'routerLink');
          });
        }
      }
    ];

    structureTests.forEach(({ description, test }) => {
      it(description, test);
    });
  });

  describe('Accessibility', () => {
    it('should have proper link attributes', () => {
      getElements.routerLinks().forEach(link => {
        expectations.hasAttribute(link, 'routerLink');
        expect(link.nativeElement.textContent.trim().length).toBeGreaterThan(0);
      });
    });

    it('should have meaningful link text', () => {
      footerData.legalLinks.forEach(linkData => {
        const link = getElements.single(`a[routerLink="${linkData.route}"]`);
        expect(link.nativeElement.textContent.trim()).toBe(linkData.text);
      });
    });

    it('should have proper heading hierarchy', () => {
      const footerTitles = getElements.all(selectors.footerTitle);
      expect(footerTitles.length).toBe(footerData.columns.length);
      
      footerTitles.forEach(title => {
        expect(title.nativeElement.textContent.trim().length).toBeGreaterThan(0);
      });
    });
  });

  describe('Content Validation', () => {
    it('should have all required content sections', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const requiredTexts = [
        ...footerData.columns.map(col => col.title),
        footerData.copyright
      ];
      
      requiredTexts.forEach(text => {
        expect(compiled.textContent).toContain(text);
      });
    });

    it('should have proper company information', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain(footerData.companyInfo.description);
      expect(compiled.textContent).toContain(footerData.companyInfo.year);
    });

    it('should have proper legal links text', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      footerData.legalLinks.forEach(linkData => {
        expect(compiled.textContent).toContain(linkData.text);
      });
    });
  });

  describe('Material Design Integration', () => {
    const materialTests = [
      { selector: selectors.matNavList, description: 'Material Design navigation list' },
      { selector: selectors.matListItem, count: footerData.legalLinks.length, description: 'Material Design list items' }
    ];

    materialTests.forEach(({ selector, count, description }) => {
      it(`should use ${description}`, () => {
        if (count) {
          expectations.elementCount(selector, count);
        } else {
          expectations.elementExists(selector);
        }
      });
    });
  });

  describe('Layout Structure', () => {
    it('should have proper column structure', () => {
      const footerColumns = getElements.columns();
      expect(footerColumns.length).toBe(footerData.columns.length);
      
      footerColumns.forEach(column => {
        const title = column.query(By.css(selectors.footerTitle));
        expect(title).toBeTruthy();
      });
    });

    it('should have proper content hierarchy', () => {
      const footer = getElements.single(selectors.footer);
      const footerContent = footer.query(By.css(selectors.footerContent));
      const footerCopyright = footer.query(By.css(selectors.footerCopyright));
      
      expect(footerContent).toBeTruthy();
      expect(footerCopyright).toBeTruthy();
      
      const footerChildren = Array.from(footer.nativeElement.children);
      const contentIndex = footerChildren.indexOf(footerContent.nativeElement);
      const copyrightIndex = footerChildren.indexOf(footerCopyright.nativeElement);
      
      expect(copyrightIndex).toBeGreaterThan(contentIndex);
    });
  });

  describe('Text Content', () => {
    it('should have proper line breaks in company description', () => {
      const footerText = getElements.single(selectors.footerText);
      expect(footerText).toBeTruthy();
      
      const element = footerText.nativeElement;
      const innerHTML = element.innerHTML;
      const textContent = element.textContent || '';
      
      // Vérifications simples et sécurisées
      expect(textContent).toContain(footerData.companyInfo.description);
      expect(textContent).toContain(footerData.companyInfo.year);
      
      // Vérification sécurisée de la présence de balises <br>
      const brTagsCount = (innerHTML.match(/<br\b[^>]*>/g) || []).length;
      expect(brTagsCount).toBeGreaterThan(0);
      
      // Alternative encore plus sûre
      const hasBrTag = innerHTML.includes('<br>') || 
                      innerHTML.includes('<br/>') || 
                      /\<br\s*\/?\>/.test(innerHTML);
      expect(hasBrTag).toBe(true);
    });
  });
});