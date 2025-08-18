import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ServicesService } from './services.service';
import { Service, ServiceCategory } from '../../models/Service';
import { EnvService } from '../env/env.service';

describe('ServicesService', () => {

  class MockEnvService {
    apiUrl = 'http://mock-api/api';
  }

  let service: ServicesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ServicesService,
        { provide: EnvService, useClass: MockEnvService },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(ServicesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send GET request with correct parameters', () => {
    service.searchServices(
      ServiceCategory.HOME,
      '75001',
      '2025-01-01',
      '10:00',
      '12:00'
    ).subscribe();

    const req = httpMock.expectOne((req) => {
      const url = req.urlWithParams;
      return url.includes('/services/search') &&
             url.includes('category=Entretien%20de%20la%20maison') &&
             url.includes('postalCode=75001') &&
             url.includes('date=2025-01-01') &&
             url.includes('startTime=10:00') &&
             url.includes('endTime=12:00');
    });

    expect(req.request.method).toBe('GET');

    // Simule une réponse vide
    req.flush([]);
  });

  it('should throw an error if category is invalid', () => {
    expect(() =>
      service.searchServices('INVALID' as any, '75001', '2025-01-01', '10:00', '12:00')
    ).toThrowError('Catégorie inconnue : INVALID');
  });

  it('should handle successful response with services', () => {
    const mockServices: Service[] = [
      {
        id: 1,
        title: 'Service Test',
        description: 'Description test',
        category: ServiceCategory.HOME,
        price: 50,
        providerId: 1
      }
    ];

    service.searchServices(ServiceCategory.HOME, '75001', '2025-01-01', '10:00', '12:00').subscribe(services => {
      expect(services).toEqual(mockServices);
    });

    const req = httpMock.expectOne((req) => {
      const url = req.urlWithParams;
      return url.includes('/services/search') &&
             url.includes('category=Entretien%20de%20la%20maison') &&
             url.includes('postalCode=75001') &&
             url.includes('date=2025-01-01') &&
             url.includes('startTime=10:00') &&
             url.includes('endTime=12:00');
    });

    req.flush(mockServices);
  });
});
