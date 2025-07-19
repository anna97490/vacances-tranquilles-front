import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HomeComponent } from './home.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}), // ou ce que tu attends comme données
            snapshot: {},
          },
        },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('doit afficher le titre, le sous-titre et le texte d\'introduction', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.title')?.textContent).toContain(component.content.title);
    expect(compiled.querySelector('.subtitle')?.textContent).toContain(component.content.subtitle);
    expect(compiled.querySelector('.intro-text')?.textContent).toContain(component.content.introText);
  });

  it('doit afficher les 3 boutons principaux avec le bon texte', () => {
    const buttons = fixture.debugElement.queryAll(By.css('.cta-buttons .btn'));
    expect(buttons.length).toBe(3);
    expect(buttons[0].nativeElement.textContent).toContain(component.content.btnPrestataire);
    expect(buttons[1].nativeElement.textContent).toContain(component.content.btnParticulier);
    expect(buttons[2].nativeElement.textContent).toContain(component.content.btnConnexion);
  });

  it('doit afficher la section "Pourquoi Nous Choisir" avec 4 cartes', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const featuresTitle = compiled.querySelector('.features-title');
    expect(featuresTitle?.textContent).toContain(component.content.featuresTitle);
    const cards = fixture.debugElement.queryAll(By.css('.feature-card'));
    expect(cards.length).toBe(4);
    cards.forEach((card, i) => {
      expect(card.nativeElement.textContent).toContain(component.content.features[i].title);
      expect(card.nativeElement.textContent).toContain(component.content.features[i].desc);
    });
  });

  it('doit afficher les icônes Material sur chaque carte', () => {
    const icons = fixture.debugElement.queryAll(By.css('.feature-card mat-icon'));
    expect(icons.length).toBe(4);
    icons.forEach((icon, i) => {
      expect(icon.nativeElement.textContent.trim()).toBe(component.content.features[i].icon);
    });
  });
});
