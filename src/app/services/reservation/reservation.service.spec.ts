import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EnvService } from '../env/env.service';
import { ReservationService } from './reservation.service';

describe('ReservationService (HTTP)', () => {
  let service: ReservationService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://api.test';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ReservationService,
        { provide: EnvService, useValue: { apiUrl } },
        provideHttpClient(),
        provideHttpClientTesting(),
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

  it('getReservationsWithFilters should handle empty filters', () => {
    service.getReservationsWithFilters({}).subscribe();
    const req = httpMock.expectOne(`${apiUrl}/reservations`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('getReservationsWithFilters should handle all filter types', () => {
    service.getReservationsWithFilters({
      status: 'PENDING',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      propertyId: 3
    }).subscribe();
    const req = httpMock.expectOne(`${apiUrl}/reservations?status=PENDING&startDate=2024-01-01&endDate=2024-01-31&propertyId=3`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('createReservation should call POST /reservations', () => {
    const reservationData = {
      startDate: '2024-01-15T10:00:00',
      endDate: '2024-01-15T12:00:00',
      propertyId: 123,
      services: ['Entretien', 'Nettoyage']
    };
    service.createReservation(reservationData).subscribe();
    const req = httpMock.expectOne(`${apiUrl}/reservations`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(reservationData);
    req.flush({});
  });

  it('deleteReservation should call DELETE /reservations/:id', () => {
    service.deleteReservation(5).subscribe();
    const req = httpMock.expectOne(`${apiUrl}/reservations/5`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('getReservationStats should call GET /reservations/stats', () => {
    service.getReservationStats().subscribe();
    const req = httpMock.expectOne(`${apiUrl}/reservations/stats`);
    expect(req.request.method).toBe('GET');
    req.flush({ total: 10, pending: 5, inProgress: 3, completed: 1, cancelled: 1 });
  });
});


