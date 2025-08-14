import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AvailableProvidersComponent } from './available-providers.component';
import { Router, ActivatedRoute } from '@angular/router';
import { Service, ServiceCategory } from '../../models/Service';
import { User, UserRole } from '../../models/User';
import { of, throwError } from 'rxjs';
import { ServicesService } from '../../services/services/services.service';
import { UserInformationService } from '../../services/user-information/user-information.service';

const routerSpy = jasmine.createSpyObj('Router', ['navigate'], {
  events: of({}),
  url: '/test',
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
});

const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
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
});

const servicesServiceSpy = jasmine.createSpyObj('ServicesService', ['searchServices']);
const userInfoServiceSpy = jasmine.createSpyObj('UserInformationService', ['getUserById']);

describe('AvailableProvidersComponent - Full Coverage', () => {
  let component: AvailableProvidersComponent;
  let fixture: ComponentFixture<AvailableProvidersComponent>;

  const mockServices: Service[] = [
    { id: 1, title: 'Tonte', category: ServiceCategory.OUTDOOR, price: 20, providerId: 1 },
    { id: 2, title: 'Plomberie', category: ServiceCategory.REPAIRS, price: 50, providerId: 2 }
  ];

const mockUser: User = new User({
  idUser: 1,
  firstName: 'Alice',
  lastName: 'Martin',
  email: 'alice@example.com',
  phoneNumber: '0612345678',
  address: '10 rue de la République',
  city: 'Lyon',
  postalCode: 69000,
  role: UserRole.PROVIDER,
  companyName: 'ServicesPro',
  siretSiren: '12345678900012',
  rcNumber: 'RC123456789',
  kbisUrl: 'https://example.com/kbis.pdf',
  autoEntrepreneurAttestationUrl: 'https://example.com/auto-entrepreneur.pdf',
  insuranceCertificateUrl: 'https://example.com/assurance.pdf',
  description: 'Prestataire expérimenté dans les services à domicile'
});

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvailableProvidersComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: ServicesService, useValue: servicesServiceSpy },
        { provide: UserInformationService, useValue: userInfoServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailableProvidersComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    localStorage.clear();
    routerSpy.navigate.calls.reset();
    servicesServiceSpy.searchServices.calls.reset();
    userInfoServiceSpy.getUserById.calls.reset();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate if searchCriteria is missing', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    component.ngOnInit();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/service-search']);
  });

  it('should catch JSON.parse error and navigate', () => {
    spyOn(localStorage, 'getItem').and.returnValue('{invalidJson');
    spyOn(console, 'error').and.stub();
    component.ngOnInit();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/service-search']);
  });

  it('should call searchServices and populate services and providers', fakeAsync(() => {
    spyOn(localStorage, 'getItem').and.callFake((key) => {
      if (key === 'searchCriteria') return JSON.stringify({ category: 'REPAIRS', postalCode: '75000', date: '2025-08-01', startTime: '10:00', endTime: '12:00' });
      return null;
    });

    servicesServiceSpy.searchServices.and.returnValue(of(mockServices));
    userInfoServiceSpy.getUserById.and.returnValue(of(mockUser));

    component.ngOnInit();
    tick();

    expect(component.services.length).toBe(2);
    expect(servicesServiceSpy.searchServices).toHaveBeenCalled();
    expect(userInfoServiceSpy.getUserById).toHaveBeenCalledWith(1);
    expect(userInfoServiceSpy.getUserById).toHaveBeenCalledWith(2);
  }));

  it('should handle searchServices error', fakeAsync(() => {
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify({ category: 'REPAIRS', postalCode: '75000' }));
    servicesServiceSpy.searchServices.and.returnValue(throwError(() => new Error('fail')));
    spyOn(console, 'error').and.stub();
    component.ngOnInit();
    tick();
    expect(component.services).toEqual([]);
  }));

  it('should handle getUserById error gracefully', fakeAsync(() => {
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify({ category: 'REPAIRS', postalCode: '75000', date: '2025-08-01', startTime: '10:00', endTime: '12:00' }));
    servicesServiceSpy.searchServices.and.returnValue(of(mockServices));
    userInfoServiceSpy.getUserById.and.returnValue(throwError(() => new Error('fail')));
    spyOn(console, 'error').and.stub();
    component.ngOnInit();
    tick();
    expect(userInfoServiceSpy.getUserById).toHaveBeenCalled();
    // Vérifier qu'un utilisateur minimal est créé en cas d'erreur
    expect(component.providersInfo.get(1)).toBeDefined();
  }));

  it('should return correct formattedCriteria', () => {
    component.searchCriteria = { category: 'HOME', postalCode: '75000', date: '2025-08-01', startTime: '10:00', endTime: '12:00' };
    expect(component.formattedCriteria).toContain('Entretien de la maison');
  });

  it('should return empty formattedCriteria if searchCriteria is null', () => {
    component.searchCriteria = null;
    expect(component.formattedCriteria).toBe('');
  });

  it('should return category label fallback if unknown', () => {
    expect((component as any).getCategoryLabel('UNKNOWN')).toBe('UNKNOWN');
  });

  it('should return undefined if no provider info found', () => {
    expect(component.getProviderInfo(999)).toBeUndefined();
  });

  it('should navigate to /service-search when navigateToSearch is called', () => {
    component.navigateToSearch();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/service-search']);
  });
});
