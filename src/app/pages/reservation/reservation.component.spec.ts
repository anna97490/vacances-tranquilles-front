import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { ReservationComponent } from './reservation.component';
import { ReservationService, ReservationResponseDTO } from '../../services/reservation/reservation.service';
import { ConversationsService } from '../../services/conversation/conversations.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('ReservationComponent', () => {
  let component: ReservationComponent;
  let fixture: ComponentFixture<ReservationComponent>;

  let reservationServiceMock: jasmine.SpyObj<ReservationService>;
  let conversationsServiceMock: jasmine.SpyObj<ConversationsService>;

  beforeEach(async () => {
    reservationServiceMock = jasmine.createSpyObj<ReservationService>('ReservationService', [
      'getAllReservations',
      'updateReservationStatus',
    ]);

    conversationsServiceMock = jasmine.createSpyObj<ConversationsService>('ConversationsService', [
      'createConversation',
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
      conversationId: undefined,
      createdAt: '2025-08-01',
      updatedAt: '2025-08-01',
    };

    reservationServiceMock.getAllReservations.and.returnValue(of([sample]));

    await TestBed.configureTestingModule({
      imports: [
        ReservationComponent,          // composant standalone
        RouterTestingModule.withRoutes([]), // fournit les providers du router
      ],
      providers: [
        { provide: ReservationService, useValue: reservationServiceMock },
        { provide: ConversationsService, useValue: conversationsServiceMock },
        // ⛔️ NE FOURNIS PAS Router manuellement, RouterTestingModule s'en occupe
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // ngOnInit -> loadReservations()
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should map status labels correctly', () => {
    expect(component.getStatusLabel('PENDING')).toBe('En attente');
    expect(component.getStatusLabel('IN_PROGRESS')).toBe('En cours');
    expect(component.getStatusLabel('CLOSED')).toBe('Clôturée');
    expect(component.getStatusLabel('CANCELLED')).toBe('Annulée');
  });

  it('should map status colors correctly', () => {
    expect(component.getStatusColor('PENDING')).toBe('#f39c12');
    expect(component.getStatusColor('IN_PROGRESS')).toBe('#27ae60');
    expect(component.getStatusColor('CLOSED')).toBe('#3498db');
    expect(component.getStatusColor('CANCELLED')).toBe('#e74c3c');
  });

  it('should use default color and label for unknown status', () => {
    expect(component.getStatusLabel('UNKNOWN_STATUS' as any)).toBe('UNKNOWN_STATUS');
    expect(component.getStatusColor('UNKNOWN_STATUS' as any)).toBe('#6C757D');
  });

  it('should determine user role correctly', () => {
    expect(component.isProvider).toBeTrue();
  });

  it('should load reservations on init', () => {
    expect(reservationServiceMock.getAllReservations).toHaveBeenCalled();
    expect(component.reservations.length).toBe(1);
    expect(component.isLoading).toBeFalse();
  });

  it('should handle loadReservations error', () => {
    reservationServiceMock.getAllReservations.and.returnValue(throwError(() => new Error('network')));

    component.loadReservations();

    expect(component.isLoading).toBeFalse();
    expect(component.error).toContain('Erreur lors du chargement des réservations');
  });

  it('should select reservation correctly', () => {
    const reservation = component.reservations[0];
    component.selectReservation(reservation);
    expect(component.selectedReservation).toBe(reservation);
  });

  it('should close reservation details correctly', () => {
    component.selectedReservation = component.reservations[0];
    component.closeReservationDetails();
    expect(component.selectedReservation).toBeNull();
  });

  it('should navigate to reservation details', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate');

    const reservation = component.reservations[0];
    component.viewReservationDetails(reservation);

    expect(navigateSpy).toHaveBeenCalledWith(['/reservations', reservation.id]);
  });

  it('should check if status can be updated for provider', () => {
    component.isProvider = true;

    expect(component.canUpdateStatus({ status: 'PENDING' } as any)).toBeTrue();
    expect(component.canUpdateStatus({ status: 'IN_PROGRESS' } as any)).toBeTrue();
    expect(component.canUpdateStatus({ status: 'CLOSED' } as any)).toBeFalse();
    expect(component.canUpdateStatus({ status: 'CANCELLED' } as any)).toBeFalse();
  });

  it('should not allow status update for non-provider', () => {
    const alertSpy = spyOn(window, 'alert');
    component.isProvider = false;

    component.updateReservationStatus(1, 'IN_PROGRESS');

    expect(alertSpy).toHaveBeenCalled();
    expect(reservationServiceMock.updateReservationStatus).not.toHaveBeenCalled();
  });

  it('should return available statuses based on current status', () => {
    component.isProvider = true;

    expect(component.getAvailableStatuses({ status: 'PENDING' } as any)).toEqual(['IN_PROGRESS', 'CANCELLED']);
    expect(component.getAvailableStatuses({ status: 'IN_PROGRESS' } as any)).toEqual(['CLOSED']);
    expect(component.getAvailableStatuses({ status: 'CLOSED' } as any)).toEqual([]);
  });

  it('should return empty available statuses for unknown status', () => {
    component.isProvider = true;
    expect(component.getAvailableStatuses({ status: 'UNKNOWN_STATUS' } as any)).toEqual([]);
  });

  it('should update reservation status successfully', () => {
    const alertSpy = spyOn(window, 'alert');
    component.isProvider = true;
    component.reservations = [{ id: 1, status: 'PENDING' } as any];
    component.selectedReservation = { id: 1, status: 'PENDING' } as any;

    const updatedReservation = { id: 1, status: 'IN_PROGRESS' } as any;
    reservationServiceMock.updateReservationStatus.and.returnValue(of(updatedReservation));

    component.updateReservationStatus(1, 'IN_PROGRESS');

    expect(alertSpy).toHaveBeenCalled();
    expect(component.reservations[0].status).toBe('IN_PROGRESS');
    expect(component.selectedReservation?.status).toBe('IN_PROGRESS');
    expect(component.liveMessage).toContain('Statut mis à jour');
  });

  it('should handle status update error', () => {
    const alertSpy = spyOn(window, 'alert');
    component.isProvider = true;

    reservationServiceMock.updateReservationStatus.and.returnValue(throwError(() => new Error('boom')));

    component.updateReservationStatus(1, 'IN_PROGRESS');

    expect(alertSpy).toHaveBeenCalled();
  });

  it('should format date correctly', () => {
    const formattedDate = component.formatDate('2025-08-09');
    expect(formattedDate).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
  });

  it('should format price correctly', () => {
    const formattedPrice = component.formatPrice(120);
    expect(formattedPrice).toContain('120');
    expect(formattedPrice).toContain('€');
  });

  describe('Conversation functionality', () => {
    it('should show conversation button for IN_PROGRESS reservation without conversation', () => {
      const reservation = { status: 'IN_PROGRESS', conversationId: undefined } as any;
      expect(component.shouldShowConversationButton(reservation)).toBeTrue();
    });

    it('should not show conversation button for CLOSED reservation', () => {
      const reservation = { status: 'CLOSED', conversationId: undefined } as any;
      expect(component.shouldShowConversationButton(reservation)).toBeFalse();
    });

    it('should not show conversation button when conversation already exists', () => {
      const reservation = { status: 'IN_PROGRESS', conversationId: 1 } as any;
      expect(component.shouldShowConversationButton(reservation)).toBeFalse();
    });

    it('should get other user ID for client', () => {
      const reservation = { clientId: 53, providerId: 2 } as any;
      expect(component.getOtherUserId(reservation)).toBe(2);
    });

    it('should get other user ID for provider', () => {
      const reservation = { clientId: 1, providerId: 53 } as any;
      expect(component.getOtherUserId(reservation)).toBe(1);
    });

    it('should create conversation successfully', () => {
      const reservation = { id: 1, status: 'IN_PROGRESS', conversationId: undefined } as any;
      const mockConversation = { id: 123, user1Id: 1, user2Id: 2, createdAt: '2024-01-01' };
      conversationsServiceMock.createConversation.and.returnValue(of(mockConversation));

      component.startConversation(reservation);

      expect(conversationsServiceMock.createConversation).toHaveBeenCalledWith(1);
      expect(reservation.conversationId).toBe(123);
      expect(component.liveMessage).toBe('Conversation créée avec succès');
    });

    it('should handle conversation creation error (400)', () => {
      const reservation = { id: 1, status: 'IN_PROGRESS', conversationId: undefined } as any;
      const error = { status: 400, error: { message: 'Validation error' } };
      conversationsServiceMock.createConversation.and.returnValue(throwError(() => error));

      component.startConversation(reservation);

      expect(component.error).toContain('Erreur de validation');
    });

    it('should handle network error in conversation creation', () => {
      const reservation = { id: 1, status: 'IN_PROGRESS', conversationId: undefined } as any;
      const error = { status: 0 };
      conversationsServiceMock.createConversation.and.returnValue(throwError(() => error));

      component.startConversation(reservation);

      expect(component.error).toContain('Impossible de se connecter au serveur');
    });
  });

});
