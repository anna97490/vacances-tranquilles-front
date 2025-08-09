import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfigService } from '../config/config.service';
import { ReservationService } from './reservation.service';

describe('ReservationService (HTTP)', () => {
  let service: ReservationService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://api.test';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ReservationService,
        { provide: ConfigService, useValue: { apiUrl } },
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


