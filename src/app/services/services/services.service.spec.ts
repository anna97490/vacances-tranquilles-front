import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ServicesService } from './services.service';
import { Service } from '../../models/Service';

describe('ServicesService', () => {
  let service: ServicesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ServicesService]
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
    const mockResponse: Service[] = [];

    const category = 'HOME';
    const postalCode = '75001';
    const date = '2025-01-01';
    const startTime = '10:00';
    const endTime = '12:00';

    service.searchServices(category, postalCode, date, startTime, endTime).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne((request) =>
      request.url === 'http://localhost:8080/api/services/search' &&
      request.params.get('category') === category &&
      request.params.get('postalCode') === postalCode &&
      request.params.get('date') === date &&
      request.params.get('startTime') === startTime &&
      request.params.get('endTime') === endTime &&
      request.headers.has('Authorization')
    );

    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should throw an error if category is invalid', () => {
    expect(() =>
      service.searchServices('INVALID' as any, '75001', '2025-01-01', '10:00', '12:00')
    ).toThrowError('Catégorie inconnue : INVALID');
  });
});
