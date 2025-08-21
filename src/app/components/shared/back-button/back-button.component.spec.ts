import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BackButtonComponent } from './back-button.component';

describe('BackButtonComponent', () => {
  let component: BackButtonComponent;
  let fixture: ComponentFixture<BackButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit backClick event when button is clicked', () => {
    spyOn(component.backClick, 'emit');
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    expect(component.backClick.emit).toHaveBeenCalled();
  });

  it('should display SVG icon by default', () => {
    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('should have correct default aria-label', () => {
    const button = fixture.nativeElement.querySelector('button');
    expect(button.getAttribute('aria-label')).toBe('Retour à la page précédente');
  });

  it('should have correct default title', () => {
    const button = fixture.nativeElement.querySelector('button');
    expect(button.getAttribute('title')).toBe('Retour à la page précédente');
  });

  // Tests pour les propriétés personnalisées
  describe('Custom properties', () => {
    it('should use custom aria-label when provided', () => {
      const customAriaLabel = 'Retour à la liste des prestataires';
      component.ariaLabel = customAriaLabel;
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('button');
      expect(button.getAttribute('aria-label')).toBe(customAriaLabel);
    });

    it('should use custom title when provided', () => {
      const customTitle = 'Retour à la page d\'accueil';
      component.title = customTitle;
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('button');
      expect(button.getAttribute('title')).toBe(customTitle);
    });

    it('should update aria-label and title when properties change', () => {
      const newAriaLabel = 'Nouveau aria-label';
      const newTitle = 'Nouveau titre';

      component.ariaLabel = newAriaLabel;
      component.title = newTitle;
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('button');
      expect(button.getAttribute('aria-label')).toBe(newAriaLabel);
      expect(button.getAttribute('title')).toBe(newTitle);
    });
  });

  // Tests pour l'accessibilité
  describe('Accessibility', () => {
    it('should have proper button type', () => {
      const button = fixture.nativeElement.querySelector('button');
      expect(button.getAttribute('type')).toBe('button');
    });

    it('should have aria-hidden on SVG icon', () => {
      const svg = fixture.nativeElement.querySelector('svg');
      expect(svg.getAttribute('aria-hidden')).toBe('true');
    });

    it('should have proper SVG attributes', () => {
      const svg = fixture.nativeElement.querySelector('svg');
      expect(svg.getAttribute('width')).toBe('24');
      expect(svg.getAttribute('height')).toBe('24');
      expect(svg.getAttribute('viewBox')).toBe('0 0 24 24');
      expect(svg.getAttribute('fill')).toBe('none');
      expect(svg.getAttribute('stroke')).toBe('currentColor');
      expect(svg.getAttribute('stroke-width')).toBe('2');
    });

    it('should have proper path element in SVG', () => {
      const path = fixture.nativeElement.querySelector('svg path');
      expect(path).toBeTruthy();
      expect(path.getAttribute('d')).toBe('M19 12H5M12 19l-7-7 7-7');
    });
  });

  // Tests pour les événements
  describe('Event handling', () => {
    it('should emit event only once per click', () => {
      spyOn(component.backClick, 'emit');
      const button = fixture.nativeElement.querySelector('button');

      button.click();
      button.click();
      button.click();

      expect(component.backClick.emit).toHaveBeenCalledTimes(3);
    });

    it('should call onBackClick method when button is clicked', () => {
      spyOn(component, 'onBackClick');
      const button = fixture.nativeElement.querySelector('button');
      
      button.click();
      
      expect(component.onBackClick).toHaveBeenCalled();
    });
  });

  // Tests pour la structure HTML
  describe('HTML structure', () => {
    it('should have proper container structure', () => {
      const container = fixture.nativeElement.querySelector('.back-btn-container');
      expect(container).toBeTruthy();
      
      const button = container.querySelector('.back-btn');
      expect(button).toBeTruthy();
    });

    it('should have proper CSS classes', () => {
      const button = fixture.nativeElement.querySelector('button');
      expect(button.classList.contains('back-btn')).toBeTrue();
    });
  });
});
