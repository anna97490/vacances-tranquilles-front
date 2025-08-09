import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthStorageService } from '../../services/login/auth-storage.service';
import { ReservationDetailComponent } from './reservation-detail.component';
import { ReservationService, ReservationResponseDTO } from '../../services/reservation/reservation.service';

describe('ReservationDetailComponent', () => {
  let component: ReservationDetailComponent;
  let fixture: ComponentFixture<ReservationDetailComponent>;

  let reservationServiceMock: jasmine.SpyObj<ReservationService>;
  let authStorageMock: jasmine.SpyObj<AuthStorageService>;

  beforeEach(async () => {
    reservationServiceMock = jasmine.createSpyObj<ReservationService>('ReservationService', [
      'getReservationById',
      'updateReservationStatus',
    ]);
    authStorageMock = jasmine.createSpyObj<AuthStorageService>('AuthStorageService', [
      'getUserRole', 'getToken', 'isAuthenticated', 'storeAuthenticationData', 'clearAuthenticationData'
    ]);
    authStorageMock.getUserRole.and.returnValue('PROVIDER');

    const dto: ReservationResponseDTO = {
      id: 42,
      reservationDate: '2025-08-09',
      startDate: '09:00:00',
      endDate: '10:00:00',
      status: 'PENDING',
      totalPrice: 80,
      clientId: 1,
      clientName: 'Jean Dupont',
      clientEmail: 'jean@example.com',
      providerId: 2,
      providerName: 'Prestataire Pro',
      providerEmail: 'pro@example.com',
      serviceId: 10,
      serviceName: 'Service Test',
      serviceDescription: 'Desc',
      propertyName: 'Maison',
      propertyAddress: 'Adresse',
      paymentId: undefined,
      paymentStatus: undefined,
      comments: 'Note',
      services: [],
      createdAt: '2025-08-01',
      updatedAt: '2025-08-01',
    };

    reservationServiceMock.getReservationById.and.returnValue(of(dto));

    await TestBed.configureTestingModule({
      imports: [ReservationDetailComponent],
      providers: [
        { provide: ReservationService, useValue: reservationServiceMock },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: new Map([['id', '42']]) } } },
        { provide: AuthStorageService, useValue: authStorageMock },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display loading with aria-busy and output aria-live', () => {
    component.isLoading = true;
    fixture.detectChanges();
    const container = fixture.debugElement.query(By.css('.loading-container'));
    expect(container.attributes['aria-busy']).toBe('true');
    const output = fixture.debugElement.query(By.css('output[aria-live="polite"]'));
    expect(output).toBeTruthy();
  });

  it('should show action buttons when status is PENDING and have type button', () => {
    component.isLoading = false;
    component.isProvider = true;
    component.reservation = {
      id: 42,
      status: 'PENDING',
    } as any;
    fixture.detectChanges();
    const buttons = fixture.debugElement.queryAll(By.css('.actions-section .profile-btn'));
    expect(buttons.length).toBe(2);
    expect(buttons[0].attributes['type']).toBe('button');
    expect(buttons[1].attributes['type']).toBe('button');
  });

  it('should announce live message after status update', () => {
    component.isProvider = true;
    component.reservation = { id: 42, status: 'PENDING' } as any;
    reservationServiceMock.updateReservationStatus.and.returnValue(of({ ...component.reservation, status: 'IN_PROGRESS' } as any));
    component.updateStatus('IN_PROGRESS');
    fixture.detectChanges();
    expect(component.liveMessage).toContain('Statut mis à jour');
  });

  it('should map status labels and colors correctly', () => {
    expect(component.getStatusLabel('PENDING')).toBe('En attente');
    expect(component.getStatusLabel('IN_PROGRESS')).toBe('En cours');
    expect(component.getStatusLabel('CANCELLED')).toBe('Annulée');
    expect(component.getStatusLabel('CLOSED')).toBe('Clôturée');

    expect(component.getStatusColor('PENDING')).toBe('#f39c12');
    expect(component.getStatusColor('IN_PROGRESS')).toBe('#27ae60');
    expect(component.getStatusColor('CANCELLED')).toBe('#e74c3c');
    expect(component.getStatusColor('CLOSED')).toBe('#3498db');
  });

  it('should handle missing id branch in loadReservationDetails', () => {
    // Simuler un ID manquant en remplaçant la route le temps du test
    const route = TestBed.inject(ActivatedRoute) as any;
    route.snapshot.paramMap = new Map();
    component.isLoading = true;
    component.error = null;
    (component as any).reservation = null;
    component.loadReservationDetails();
    expect(component.isLoading).toBeFalse();
    expect(component.error).toContain('ID de réservation manquant');
  });

  it('should set error on getReservationById error branch', () => {
    const route = TestBed.inject(ActivatedRoute) as any;
    route.snapshot.paramMap = new Map([[ 'id', '42' ]]);
    (TestBed.inject(ReservationService) as jasmine.SpyObj<ReservationService>).getReservationById.and.returnValue(throwError(() => new Error('fail')));
    // Call ngOnInit->loadReservationDetails again
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.error).toContain('Erreur lors du chargement des détails');
  });

  it('should early-return in updateStatus when no reservation id', () => {
    const service = TestBed.inject(ReservationService) as jasmine.SpyObj<ReservationService>;
    component.reservation = null as any;
    component.updateStatus('IN_PROGRESS');
    expect(service.updateReservationStatus).not.toHaveBeenCalled();
  });

  it('should set error when updateStatus fails', () => {
    const service = TestBed.inject(ReservationService) as jasmine.SpyObj<ReservationService>;
    component.isProvider = true;
    component.reservation = { id: 123, status: 'PENDING' } as any;
    service.updateReservationStatus.and.returnValue(throwError(() => new Error('fail')));
    component.updateStatus('IN_PROGRESS');
    expect(component.isUpdating).toBeFalse();
    expect(component.error).toContain('Impossible de mettre à jour le statut');
  });

  it('should format dates and times with fallbacks', () => {
    expect(component.formatDate('invalid-date')).toBe('invalid-date');
    expect(component.formatDate('2025-08-09')).toBeTruthy();
    expect(component.formatTime('14:30:15')).toBe('14:30');
    expect(component.formatTime('bad')).toBe('bad');
  });

  it('should return default color and label for unknown status', () => {
    expect(component.getStatusLabel('UNKNOWN' as any)).toBe('UNKNOWN');
    expect(component.getStatusColor('UNKNOWN' as any)).toBe('#95a5a6');
  });
});
