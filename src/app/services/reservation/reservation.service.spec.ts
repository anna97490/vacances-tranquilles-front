import { provideHttpClient, withFetch } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EnvService } from '../env/env.service';
import { ReservationService } from './reservation.service';

describe('ReservationService (HTTP)', () => {
  let service: ReservationService;
  let httpMock: HttpTestingController;
  let envServiceMock: jasmine.SpyObj<EnvService>;
  const apiUrl = 'http://api.test';

  beforeEach(() => {
    envServiceMock = jasmine.createSpyObj<EnvService>('EnvService', [], {
      apiUrl: apiUrl
    });

    TestBed.configureTestingModule({
      providers: [
        ReservationService,
        { provide: EnvService, useValue: envServiceMock },
        provideHttpClient(withFetch()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ReservationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('getAllReservations should call GET /reservations', () => {
    service.getAllReservations().subscribe();
    const req = httpMock.expectOne(`${apiUrl}/reservations`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('getReservationById should call GET /reservations/:id', () => {
    service.getReservationById(7).subscribe();
    const req = httpMock.expectOne(`${apiUrl}/reservations/7`);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('updateReservationStatus should call PATCH /reservations/:id/status', () => {
    service.updateReservationStatus(9, { status: 'IN_PROGRESS' }).subscribe();
    const req = httpMock.expectOne(`${apiUrl}/reservations/9/status`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ status: 'IN_PROGRESS' });
    req.flush({});
  });

  it('getReservationsWithFilters should build query string', () => {
    service.getReservationsWithFilters({ status: 'PENDING', propertyId: 3 }).subscribe();
    const req = httpMock.expectOne(`${apiUrl}/reservations?status=PENDING&propertyId=3`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });
});


