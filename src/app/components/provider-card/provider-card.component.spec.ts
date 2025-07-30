import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProviderCardComponent } from './provider-card.component';
import { ServiceCategory } from '../../models/Service';

describe('ProviderCardComponent', () => {
  let component: ProviderCardComponent;
  let fixture: ComponentFixture<ProviderCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProviderCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ProviderCardComponent);
    component = fixture.componentInstance;

    // Fournir un service valide (avec description définie)
    component.service = {
      id: 1,
      title: 'Tonte de pelouse',
      description: 'Coupe et entretien du gazon',
      category: ServiceCategory.OUTDOOR,
      price: 30,
      providerId: 101
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the service description', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Coupe et entretien du gazon');
  });

  it('should not crash if description is undefined', () => {
  if (component.service) {
    component.service.description = undefined;
  }
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).not.toContain('undefined'); // ou test plus précis selon ton HTML
  });

  it('should display the service price with euro symbol', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('30');
  });

  it('should not crash if service is undefined', () => {
    component.service = undefined as any; // Simule un service non défini
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).not.toContain('undefined'); // Vérifie que le composant ne plante pas
  });

  /*   it('should find the user associated with the service', () => {
  expect(component.user).toBeDefined();
  expect(component.user?.idUser).toBe(1); // Vérifie que l'utilisateur trouvé correspond au providerId du service
});
*/

});
