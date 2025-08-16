import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ReservationComponent } from './reservation.component';
import { ReservationService, ReservationResponseDTO } from '../../services/reservation/reservation.service';
import { ConversationsService } from '../../services/conversation/conversations.service';
import { ReviewService } from '../../services/review/review.service';
import { AuthStorageService } from '../../services/login/auth-storage.service';
import { Router, provideRouter } from '@angular/router';

describe('ReservationComponent', () => {
  let component: ReservationComponent;
  let fixture: ComponentFixture<ReservationComponent>;

  let reservationServiceMock: jasmine.SpyObj<ReservationService>;
  let conversationsServiceMock: jasmine.SpyObj<ConversationsService>;
  let reviewServiceMock: jasmine.SpyObj<ReviewService>;
  let authStorageServiceMock: jasmine.SpyObj<AuthStorageService>;

  beforeEach(async () => {
    reservationServiceMock = jasmine.createSpyObj<ReservationService>('ReservationService', [
      'getAllReservations',
      'updateReservationStatus',
    ]);

    conversationsServiceMock = jasmine.createSpyObj<ConversationsService>('ConversationsService', [
      'createConversation',
    ]);

    reviewServiceMock = jasmine.createSpyObj<ReviewService>('ReviewService', [
      'hasReviewForReservation',
    ]);

    authStorageServiceMock = jasmine.createSpyObj<AuthStorageService>('AuthStorageService', [
      'getUserRole',
      'getUserId',
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
    reviewServiceMock.hasReviewForReservation.and.returnValue(of(false));
    authStorageServiceMock.getUserRole.and.returnValue('PROVIDER');
    authStorageServiceMock.getUserId.and.returnValue(1);

    await TestBed.configureTestingModule({
      imports: [
        ReservationComponent,
        HttpClientTestingModule,
      ],
      providers: [
        provideRouter([]),
        { provide: ReservationService, useValue: reservationServiceMock },
        { provide: ConversationsService, useValue: conversationsServiceMock },
        { provide: ReviewService, useValue: reviewServiceMock },
        { provide: AuthStorageService, useValue: authStorageServiceMock },
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

  it('should use default label for unknown status', () => {
    expect(component.getStatusLabel('UNKNOWN_STATUS' as any)).toBe('UNKNOWN_STATUS');
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
