import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TermsAndConditionsComponent } from './terms-and-conditions.component';
import { provideRouter } from '@angular/router';

describe('TermsAndConditionsComponent', () => {
  let component: TermsAndConditionsComponent;
  let fixture: ComponentFixture<TermsAndConditionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TermsAndConditionsComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(TermsAndConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set isCGU to true if path includes "/cgu"', () => {
    spyOnProperty(window, 'location').and.returnValue({ pathname: '/cgu' } as Location);
    const testComponent = new TermsAndConditionsComponent();
    expect(testComponent.isCGU).toBeTrue();
    expect(testComponent.isCGV).toBeFalse();
  });

  it('should set isCGV to true if path includes "/cgv"', () => {
    spyOnProperty(window, 'location').and.returnValue({ pathname: '/cgv' } as Location);
    const testComponent = new TermsAndConditionsComponent();
    expect(testComponent.isCGV).toBeTrue();
    expect(testComponent.isCGU).toBeFalse();
  });

  it('getContent returns CGU content when isCGU is true', () => {
    component.isCGU = true;
    expect(component.getContent()).toEqual(component.cguContent);
  });

  it('getContent returns CGV content when isCGV is true', () => {
    component.isCGV = true;
    expect(component.getContent()).toEqual(component.cgvContent);
  });

  it('getContent returns empty object when neither CGU nor CGV is true', () => {
    component.isCGU = false;
    component.isCGV = false;
    expect(component.getContent()).toEqual({ title: '', date: '', sections: [] });
  });

  it('isArray returns true for an array', () => {
    expect(component.isArray(['val1', 'val2'])).toBeTrue();
  });

  it('isArray returns false for a string', () => {
    expect(component.isArray('notAnArray')).toBeFalse();
  });

  it('should display CGU when isShowingCGU returns true', () => {
    spyOn(component, 'isShowingCGU').and.returnValue(true);
    spyOn(component, 'isShowingCGV').and.returnValue(false);
    (component as any).cguContent.sections = [
      { title: 'CGU Section', content: [{ text: 'Texte CGU' }] }
    ];
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain('Conditions Générales d\'Utilisation');
    expect(compiled.querySelector('h3')?.textContent).toContain('CGU Section');
    expect(compiled.querySelector('p')?.textContent).toContain('Texte CGU');
  });

  it('should display CGV when isShowingCGV returns true', () => {
    spyOn(component, 'isShowingCGU').and.returnValue(false);
    spyOn(component, 'isShowingCGV').and.returnValue(true);
    (component as any).cgvContent.sections = [
      { title: 'CGV Section', content: [{ text: 'Texte CGV' }] }
    ];
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain('Conditions Générales de Vente');
    expect(compiled.querySelector('h3')?.textContent).toContain('CGV Section');
    expect(compiled.querySelector('p')?.textContent).toContain('Texte CGV');
  });

  it('should display fallback when neither CGU nor CGV is shown', () => {
    spyOn(component, 'isShowingCGU').and.returnValue(false);
    spyOn(component, 'isShowingCGV').and.returnValue(false);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('p')?.textContent).toContain('Aucune condition à afficher.');
  });
});
