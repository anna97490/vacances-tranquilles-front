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
});
