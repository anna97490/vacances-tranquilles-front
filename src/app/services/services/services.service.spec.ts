import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ServicesService } from './services.service';
import { Service } from '../../models/Service';
import { ConfigService } from '../config/config.service';

describe('ServicesService', () => {

  class MockConfigService {
  apiUrl = 'http://mock-api/api';
}

  let service: ServicesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
      ServicesService,
      { provide: ConfigService, useClass: MockConfigService }]
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
  const httpMock = TestBed.inject(HttpTestingController);
  const service = TestBed.inject(ServicesService);

  service.searchServices(
    'HOME',
    '75001',
    '2025-01-01',
    '10:00',
    '12:00'
  ).subscribe();

  const req = httpMock.expectOne((req) => {
    const url = req.urlWithParams;
    return url.includes('/services/search') &&
           url.includes('category=HOME') &&
           url.includes('postalCode=75001') &&
           url.includes('date=2025-01-01') &&
           url.includes('startTime=10:00') &&
           url.includes('endTime=12:00');
  });

  expect(req.request.method).toBe('GET');

  // Simule une réponse vide
  req.flush([]);

  httpMock.verify(); // ✅ important pour valider qu'aucune requête oubliée
});

  it('should throw an error if category is invalid', () => {
    expect(() =>
      service.searchServices('INVALID' as any, '75001', '2025-01-01', '10:00', '12:00')
    ).toThrowError('Catégorie inconnue : INVALID');
  });
});
