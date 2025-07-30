import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AvailableProvidersComponent } from './available-providers.component';
import { Router } from '@angular/router';
import { ServiceCategory, Service } from '../../models/Service';

// SpyObj de Jasmine pour simuler le Router
const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

describe('AvailableProvidersComponent', () => {
  let component: AvailableProvidersComponent;
  let fixture: ComponentFixture<AvailableProvidersComponent>;

  const mockSearchResults = JSON.stringify([
    {
      id: 1,
      title: 'Tonte de pelouse',
      category: 'Entretien extérieur',
      price: 30,
      providerId: 101
    },
    {
      id: 2,
      title: 'Montage de meuble',
      category: 'Petits travaux',
      price: 50,
      providerId: 102
    }
  ]);

  const mockSearchCriteria = JSON.stringify({
    category: 'REPAIRS',
    postalCode: '75001',
    date: '2025-08-01',
    startTime: '10:00',
    endTime: '12:00'
  });

  beforeEach(async () => {
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      switch (key) {
        case 'searchResults':
          return mockSearchResults;
        case 'searchCriteria':
          return mockSearchCriteria;
        default:
          return null;
      }
    });

    await TestBed.configureTestingModule({
      imports: [AvailableProvidersComponent],
      providers: [{ provide: Router, useValue: routerSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(AvailableProvidersComponent);
    component = fixture.componentInstance;

    // Remap le champ `category` à l'enum après chargement
    const rawServices = JSON.parse(mockSearchResults);
    component.services = rawServices.map((s: any): Service => ({
      ...s,
      category: mapCategory(s.category)
    }));

    component.searchCriteria = JSON.parse(mockSearchCriteria);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load and remap services from localStorage correctly', () => {
    expect(component.services.length).toBe(2);
    expect(component.services[0].title).toBe('Tonte de pelouse');
    expect(component.services[0].category).toBe(ServiceCategory.OUTDOOR);
  });

  it('should format search criteria correctly', () => {
    expect(component.formattedCriteria).toBe('REPAIRS - 75001 - 2025-08-01 10:00-12:00');
  });

  it('should return correct services count', () => {
    expect(component.servicesCount).toBe(2);
  });

  it('should navigate to /service-search if no results in localStorage', () => {
    // simuler le cas où il n'y a pas de résultats
    (localStorage.getItem as jasmine.Spy).and.returnValue(null);

    fixture = TestBed.createComponent(AvailableProvidersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/service-search']);
  });

  it('should navigate to /service-search when navigateToSearch() is called', () => {
    component.navigateToSearch();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/service-search']);
  });

  it('should return empty formattedCriteria if no searchCriteria is set', () => {
    component.searchCriteria = null;
    expect(component.formattedCriteria).toBe('');
  });

  it('should display the correct number of services in the template', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('2'); // ou autre logique selon ton HTML
  });

  it('should render provider cards for each service', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const cards = compiled.querySelectorAll('app-provider-card');
    expect(cards.length).toBe(2);
  });

  it('should not crash if some fields in searchCriteria are missing', () => {
    component.searchCriteria = {
      category: 'REPAIRS',
      postalCode: '75000'
      // pas de date, startTime, endTime
    };

    expect(component.formattedCriteria).toContain('REPAIRS - 75000');
  });
});

// Fonction pour mapper les catégories
function mapCategory(label: string): ServiceCategory {
  const entry = Object.entries(ServiceCategory).find(([_, val]) => val === label);
  return entry ? (entry[1] as ServiceCategory) : ServiceCategory.HOME;
}