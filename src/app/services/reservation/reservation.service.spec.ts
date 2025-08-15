
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

  it('createReservation should call POST /reservations', () => {
    const reservationData = {
      startDate: '2025-08-09',
      endDate: '2025-08-10',
      propertyId: 1,
      services: ['CLEANING'],
      comments: 'Test reservation'
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
    req.flush({}, { status: 204, statusText: 'No Content' });
  });

  it('getReservationStats should call GET /reservations/stats', () => {
    const mockStats = {
      total: 10,
      pending: 3,
      inProgress: 4,
      completed: 2,
      cancelled: 1
    };
    service.getReservationStats().subscribe(stats => {
      expect(stats).toEqual(mockStats);
    });
    const req = httpMock.expectOne(`${apiUrl}/reservations/stats`);
    expect(req.request.method).toBe('GET');
    req.flush(mockStats);
  });

  it('getReservationsWithFilters should handle empty filters', () => {
    service.getReservationsWithFilters({}).subscribe();
    const req = httpMock.expectOne(`${apiUrl}/reservations`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('getReservationsWithFilters should handle multiple filters', () => {
    service.getReservationsWithFilters({
      status: 'PENDING',
      startDate: '2025-08-01',
      endDate: '2025-08-31',
      propertyId: 5
    }).subscribe();
    const req = httpMock.expectOne(`${apiUrl}/reservations?status=PENDING&startDate=2025-08-01&endDate=2025-08-31&propertyId=5`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  describe('Error handling', () => {
    it('should handle getAllReservations error', () => {
      service.getAllReservations().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });
      const req = httpMock.expectOne(`${apiUrl}/reservations`);
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });

    it('should handle getReservationById error', () => {
      service.getReservationById(1).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });
      const req = httpMock.expectOne(`${apiUrl}/reservations/1`);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });

    it('should handle updateReservationStatus error', () => {
      service.updateReservationStatus(1, { status: 'IN_PROGRESS' }).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });
      const req = httpMock.expectOne(`${apiUrl}/reservations/1/status`);
      req.flush('Bad request', { status: 400, statusText: 'Bad Request' });
    });

    it('should handle createReservation error', () => {
      const reservationData = {
        startDate: '2025-08-09',
        endDate: '2025-08-10',
        propertyId: 1,
        services: ['CLEANING']
      };
      service.createReservation(reservationData).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(422);
        }
      });
      const req = httpMock.expectOne(`${apiUrl}/reservations`);
      req.flush('Validation error', { status: 422, statusText: 'Unprocessable Entity' });
    });
  });
});
