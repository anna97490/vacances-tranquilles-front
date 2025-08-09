import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { ReservationComponent } from './reservation.component';
import { ReservationService, ReservationResponseDTO } from '../../services/reservation/reservation.service';

@Component({ template: '' })
class DummyDetailComponent {}

describe('ReservationComponent', () => {
  let component: ReservationComponent;
  let fixture: ComponentFixture<ReservationComponent>;

  let reservationServiceMock: jasmine.SpyObj<ReservationService>;

  beforeEach(async () => {
    reservationServiceMock = jasmine.createSpyObj<ReservationService>('ReservationService', [
      'getAllReservations',
      'updateReservationStatus',
    ]);

    const sample: ReservationResponseDTO = {
      id: 1,
      reservationDate: '2025-08-09',
      startDate: '10:00:00',
      endDate: '11:00:00',
      status: 'PENDING',
      totalPrice: 120,
      clientId: 1,
      clientName: 'Jean Dupont',
      clientEmail: 'jean@example.com',
      providerId: 2,
      providerName: 'Prestataire Pro',
      providerEmail: 'pro@example.com',
      serviceId: 10,
      serviceName: 'Service Test',
      serviceDescription: 'Desc',
      paymentId: undefined,
      paymentStatus: undefined,
      propertyName: 'Maison',
      propertyAddress: 'Adresse',
      comments: 'Note',
      services: [],
      createdAt: '2025-08-01',
      updatedAt: '2025-08-01',
    };

    reservationServiceMock.getAllReservations.and.returnValue(of([sample]));

    await TestBed.configureTestingModule({
      imports: [
        ReservationComponent,
        RouterTestingModule.withRoutes([
          { path: 'reservations/:id', component: DummyDetailComponent },
        ]),
      ],
      providers: [
        { provide: ReservationService, useValue: reservationServiceMock },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a link "Voir détails" with a routerLink to the reservation detail', () => {
    fixture.detectChanges();
    const link: HTMLAnchorElement | null = fixture.debugElement.query(By.css('a.profile-btn'))?.nativeElement;
    expect(link).withContext('link should exist').toBeTruthy();
    expect(link?.textContent?.trim()).toBe('Voir détails');
    // href may be absolute depending on test env, check it ends with expected path
    const href = link?.getAttribute('href') || link?.getAttribute('ng-reflect-router-link') || '';
    expect(href).toContain('/reservations/1');
  });

  it('should expose accessible live region and reflect liveMessage', () => {
    component.liveMessage = 'Statut mis à jour: En cours';
    fixture.detectChanges();
    const region = fixture.debugElement.query(By.css('.sr-only[aria-live="polite"]')).nativeElement as HTMLElement;
    expect(region.textContent?.trim()).toBe('Statut mis à jour: En cours');
  });

  it('should mark loading with aria-busy and output aria-live polite', () => {
    component.isLoading = true;
    fixture.detectChanges();
    const container = fixture.debugElement.query(By.css('.loading-container'));
    expect(container.attributes['aria-busy']).toBe('true');
    const output = fixture.debugElement.query(By.css('output[aria-live="polite"]'));
    expect(output).toBeTruthy();
  });

  it('should render error with role alert and aria-live assertive', () => {
    component.error = 'Erreur lors du chargement';
    fixture.detectChanges();
    const error = fixture.debugElement.query(By.css('.error-message'));
    expect(error.attributes['role']).toBe('alert');
    expect(error.attributes['aria-live']).toBe('assertive');
  });

  it('should map status labels and colors and canUpdateStatus branches', () => {
    expect(component.getStatusLabel('PENDING')).toBe('En attente');
    expect(component.getStatusLabel('IN_PROGRESS')).toBe('En cours');
    expect(component.getStatusLabel('CLOSED')).toBe('Clôturée');
    expect(component.getStatusLabel('CANCELLED')).toBe('Annulée');

    expect(component.getStatusColor('PENDING')).toBe('#f39c12');
    // IN_PROGRESS mapped via detail color -> list fallback keeps same meaning
    expect(component.getStatusColor('IN_PROGRESS')).toBe('#27ae60');
    expect(component.getStatusColor('CLOSED')).toBe('#3498db');
    expect(component.getStatusColor('CANCELLED')).toBe('#e74c3c');

    component.isProvider = true;
    expect(component.canUpdateStatus({ status: 'PENDING' } as any)).toBeTrue();
    expect(component.canUpdateStatus({ status: 'IN_PROGRESS' } as any)).toBeTrue();
    expect(component.canUpdateStatus({ status: 'CLOSED' } as any)).toBeFalse();
    expect(component.canUpdateStatus({ status: 'CANCELLED' } as any)).toBeFalse();
  });

  it('should return available statuses based on current status', () => {
    component.isProvider = true;
    expect(component.getAvailableStatuses({ status: 'PENDING' } as any)).toEqual(['IN_PROGRESS', 'CANCELLED']);
    expect(component.getAvailableStatuses({ status: 'IN_PROGRESS' } as any)).toEqual(['CLOSED']);
    expect(component.getAvailableStatuses({ status: 'CLOSED' } as any)).toEqual([]);
  });

  it('should handle loadReservations error branch', () => {
    (TestBed.inject(ReservationService) as jasmine.SpyObj<ReservationService>).getAllReservations.and.returnValue(throwError(() => new Error('network')));
    component.loadReservations();
    expect(component.isLoading).toBeFalse();
    expect(component.error).toContain('Erreur lors du chargement des réservations');
  });

  it('should block updateReservationStatus when not provider and alert', () => {
    const alertSpy = spyOn(window, 'alert');
    component.isProvider = false;
    component.updateReservationStatus(1, 'IN_PROGRESS');
    expect(alertSpy).toHaveBeenCalled();
    expect((TestBed.inject(ReservationService) as jasmine.SpyObj<ReservationService>).updateReservationStatus).not.toHaveBeenCalled();
  });

  it('should update reservation and selected on status update success and announce', () => {
    const alertSpy = spyOn(window, 'alert');
    component.isProvider = true;
    component.reservations = [{ id: 1, status: 'PENDING' } as any];
    component.selectedReservation = { id: 1, status: 'PENDING' } as any;
    (TestBed.inject(ReservationService) as jasmine.SpyObj<ReservationService>).updateReservationStatus.and.returnValue(of({ id: 1, status: 'IN_PROGRESS' } as any));

    component.updateReservationStatus(1, 'IN_PROGRESS');
    expect(alertSpy).toHaveBeenCalled();
    expect(component.reservations[0].status).toBe('IN_PROGRESS');
    expect(component.selectedReservation?.status).toBe('IN_PROGRESS');
    expect(component.liveMessage).toContain('Statut mis à jour');
  });

  it('should alert on status update error branch', () => {
    const alertSpy = spyOn(window, 'alert');
    component.isProvider = true;
    (TestBed.inject(ReservationService) as jasmine.SpyObj<ReservationService>).updateReservationStatus.and.returnValue(throwError(() => new Error('boom')));
    component.updateReservationStatus(1, 'IN_PROGRESS');
    expect(alertSpy).toHaveBeenCalled();
  });

  it('should use default color and label for unknown status', () => {
    expect(component.getStatusLabel('UNKNOWN_STATUS' as any)).toBe('UNKNOWN_STATUS');
    expect(component.getStatusColor('UNKNOWN_STATUS' as any)).toBe('#6C757D');
  });

  it('should return empty available statuses for unknown status', () => {
    component.isProvider = true;
    expect(component.getAvailableStatuses({ status: 'UNKNOWN_STATUS' } as any)).toEqual([]);
  });
});
