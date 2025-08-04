import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ReservationService } from './reservation.service';
import { Reservation } from './interfaces/reservation.interface';

describe('ReservationService', () => {
  let service: ReservationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReservationService]
    });
    service = TestBed.inject(ReservationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get reservations with filters', () => {
    const mockResponse = {
      content: [
        {
          id: 1,
          status: 'CONFIRMEE',
          reservationDate: '2024-01-15T10:00:00',
          startDate: '2024-02-15T14:00:00',
          endDate: '2024-02-20T10:00:00',
          totalPrice: 850.00,
          customerId: 1,
          providerId: 2,
          serviceId: 1
        }
      ],
      number: 0,
      totalPages: 1,
      totalElements: 1,
      size: 10
    };

    service.getReservations({ search: 'test' }, 1).subscribe(response => {
      expect(response.reservations.length).toBe(1);
      expect(response.pagination.currentPage).toBe(1);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/reservations?page=1&size=10&search=test');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle API errors and return mock data', () => {
    service.getReservations().subscribe(response => {
      expect(response.reservations.length).toBeGreaterThan(0);
      expect(response.pagination).toBeDefined();
    });

    const req = httpMock.expectOne('http://localhost:8080/api/reservations?page=1&size=10');
    req.error(new ErrorEvent('Network error'));
  });

  it('should get reservation by id', () => {
    const mockReservation: Reservation = {
      id: 1,
      status: 'CONFIRMEE',
      reservationDate: '2024-01-15T10:00:00',
      startDate: '2024-02-15T14:00:00',
      endDate: '2024-02-20T10:00:00',
      totalPrice: 850.00,
      customerId: 1,
      providerId: 2,
      serviceId: 1
    };

    service.getReservationById(1).subscribe(reservation => {
      expect(reservation.id).toBe(1);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/reservations/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockReservation);
  });

  it('should create reservation', () => {
    const newReservation: Partial<Reservation> = {
      status: 'EN_ATTENTE',
      startDate: '2024-03-01T14:00:00',
      endDate: '2024-03-05T10:00:00',
      totalPrice: 500.00,
      customerId: 1,
      providerId: 2,
      serviceId: 1
    };

    service.createReservation(newReservation).subscribe();

    const req = httpMock.expectOne('http://localhost:8080/api/reservations');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newReservation);
    req.flush({});
  });

  it('should update reservation', () => {
    const updateData: Partial<Reservation> = {
      status: 'CONFIRMEE'
    };

    service.updateReservation(1, updateData).subscribe();

    const req = httpMock.expectOne('http://localhost:8080/api/reservations/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updateData);
    req.flush({});
  });

  it('should delete reservation', () => {
    service.deleteReservation(1).subscribe();

    const req = httpMock.expectOne('http://localhost:8080/api/reservations/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
}); 