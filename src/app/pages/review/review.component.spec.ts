import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { ReviewService } from '../../services/review/review.service';
import { ReservationService, ReservationResponseDTO } from '../../services/reservation/reservation.service';
import { ReviewComponent } from './review.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-footer',
  template: '<div>Mock Footer</div>',
  standalone: true
})
class MockFooterComponent {}

describe('ReviewComponent', () => {
  let component: ReviewComponent;
  let fixture: ComponentFixture<ReviewComponent>;
  let mockReviewService: jasmine.SpyObj<ReviewService>;
  let mockReservationService: jasmine.SpyObj<ReservationService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;

  const mockReservation: ReservationResponseDTO = {
    id: 1,
    status: 'CLOSED',
    reservationDate: '2024-01-15T10:00:00Z',
    startDate: '2024-01-20T10:00:00Z',
    endDate: '2024-01-25T10:00:00Z',
    totalPrice: 500,
    clientId: 1,
    clientName: 'Test Client',
    clientEmail: 'client@test.com',
    providerId: 2,
    providerName: 'Test Provider',
    providerEmail: 'provider@test.com',
    serviceId: 1,
    serviceName: 'Test Service',
    serviceDescription: 'Test service description',
    propertyName: 'Test Property',
    propertyAddress: 'Test Address',
    comments: 'Test comments',
    services: ['Service 1', 'Service 2'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  };

  const mockReviewResponse = {
    id: 1,
    note: 5,
    commentaire: 'Excellent service !',
    reservationId: 1,
    reviewerId: 1,
    reviewedId: 2,
    createdAt: '2024-01-15T10:30:00Z'
  };

  beforeEach(async () => {
    // spies
    const reviewServiceSpy = jasmine.createSpyObj('ReviewService', ['createReview']);
    const reservationServiceSpy = jasmine.createSpyObj('ReservationService', ['getReservationById', 'getAllReservations']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      params: of({}),
      queryParams: of({})
    });

    await TestBed.configureTestingModule({
      imports: [
        ReviewComponent,
        FormsModule
      ],
      providers: [
        provideRouter([]),
        provideHttpClient(withFetch()),
        { provide: ReviewService, useValue: reviewServiceSpy },
        { provide: ReservationService, useValue: reservationServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy }
      ]
    })
      // Remplace le vrai FooterComponent importé par ReviewComponent par notre stub
      .overrideComponent(ReviewComponent, {
        remove: { imports: [FooterComponent] },
        add: { imports: [MockFooterComponent] }
      })
      .compileComponents();

    // IMPORTANT : éviter que des clés en LS modifient le flux de ngOnInit()
    localStorage.clear();

    fixture = TestBed.createComponent(ReviewComponent);
    component = fixture.componentInstance;
    mockReviewService = TestBed.inject(ReviewService) as jasmine.SpyObj<ReviewService>;
    mockReservationService = TestBed.inject(ReservationService) as jasmine.SpyObj<ReservationService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockActivatedRoute = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.stars).toEqual([1, 2, 3, 4, 5]);
    expect(component.rating).toBe(0);
    expect(component.feedback).toBe('');
    expect(component.feedbackError).toBe('');
    expect(component.providerName).toBe('Prestataire');
  });

  it('should set rating correctly', () => {
    component.setRating(4);
    expect(component.rating).toBe(4);
  });

  it('should update feedback on input', () => {
    const event = { target: { value: 'Test feedback' } } as any;
    component.onFeedbackInput(event);
    expect(component.feedback).toBe('Test feedback');
  });

  it('should validate feedback with only numbers', () => {
    component.onFeedbackInput({ target: { value: '12345' } } as any);
    expect(component.feedbackError).toContain('chiffres');
  });

  it('should validate feedback with only punctuation', () => {
    component.onFeedbackInput({ target: { value: '!!!...' } } as any);
    expect(component.feedbackError).toContain('ponctuation');
  });

  it('should validate feedback with dangerous characters', () => {
    component.onFeedbackInput({ target: { value: 'Test <script>' } } as any);
    expect(component.feedbackError).toContain('caractères spéciaux');
  });

  it('should validate feedback with special characters', () => {
    component.onFeedbackInput({ target: { value: 'Test @#$%' } } as any);
    expect(component.feedbackError).toContain('caractères spéciaux');
  });

  it('should clear feedback error for valid input', () => {
    component.feedbackError = 'Previous error';
    component.onFeedbackInput({ target: { value: 'Valid feedback' } } as any);
    expect(component.feedbackError).toBe('');
  });

  it('should not send feedback without rating', () => {
    spyOn(window, 'alert');
    component.rating = 0;
    component.feedback = 'Test feedback';

    component.sendFeedback();

    expect(window.alert).toHaveBeenCalledWith('Veuillez sélectionner une note avant d\'envoyer votre avis.');
    expect(mockReviewService.createReview).not.toHaveBeenCalled();
  });

  it('should not send feedback without comment', () => {
    component.rating = 5;
    component.feedback = '';

    component.sendFeedback();

    expect(component.feedbackError).toBe('Veuillez saisir un commentaire avant d\'envoyer votre avis.');
    expect(mockReviewService.createReview).not.toHaveBeenCalled();
  });

  it('should not send feedback with invalid characters', () => {
    component.rating = 5;
    component.feedback = 'Test <script>';

    component.sendFeedback();

    expect(component.feedbackError).toContain('< et >');
    expect(mockReviewService.createReview).not.toHaveBeenCalled();
  });

  it('should send feedback successfully', () => {
    spyOn(window, 'alert');
    component.rating = 5;
    component.feedback = 'Excellent service';
    component.reservationId = 1;
    component.providerId = 2;
    mockReviewService.createReview.and.returnValue(of(mockReviewResponse));

    component.sendFeedback();

    expect(mockReviewService.createReview).toHaveBeenCalledWith({
      note: 5,
      commentaire: 'Excellent service',
      reservationId: 1,
      reviewerId: 0,
      reviewedId: 0
    });
    expect(window.alert).toHaveBeenCalledWith('Merci pour votre avis !');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should handle review creation error', () => {
    spyOn(window, 'alert');
    component.rating = 5;
    component.feedback = 'Excellent service';
    component.reservationId = 1;
    component.providerId = 2;
    const error = { error: { message: 'Test error' } };
    mockReviewService.createReview.and.returnValue(throwError(() => error));

    component.sendFeedback();

    expect(window.alert).toHaveBeenCalledWith('Erreur lors de l\'envoi de l\'avis: Test error');
  });

  it('should handle review creation error without message', () => {
    spyOn(window, 'alert');
    component.rating = 5;
    component.feedback = 'Excellent service';
    component.reservationId = 1;
    component.providerId = 2;
    const error = { message: 'Network error' };
    mockReviewService.createReview.and.returnValue(throwError(() => error));

    component.sendFeedback();

    expect(window.alert).toHaveBeenCalledWith('Erreur lors de l\'envoi de l\'avis: Network error');
  });

  it('should handle review creation error without error details', () => {
    spyOn(window, 'alert');
    component.rating = 5;
    component.feedback = 'Excellent service';
    component.reservationId = 1;
    component.providerId = 2;
    const error = {};
    mockReviewService.createReview.and.returnValue(throwError(() => error));

    component.sendFeedback();

    expect(window.alert).toHaveBeenCalledWith('Erreur lors de l\'envoi de l\'avis');
  });

  it('should cancel and reset form', () => {
    component.rating = 5;
    component.feedback = 'Test feedback';
    component.feedbackError = 'Test error';

    component.cancel();

    expect(component.rating).toBe(0);
    expect(component.feedback).toBe('');
    expect(component.feedbackError).toBe('');
  });

  it('should load reservation data from route params', () => {
    const routeParams = of({ reservationId: '123' });
    Object.defineProperty(mockActivatedRoute, 'params', { value: routeParams });
    mockReservationService.getReservationById.and.returnValue(of(mockReservation));

    component.ngOnInit();

    expect(mockReservationService.getReservationById).toHaveBeenCalledWith(123);
  });

  it('should load reservation data from query params', () => {
    const routeParams = of({});
    const queryParams = of({ reservationId: '456' });
    Object.defineProperty(mockActivatedRoute, 'params', { value: routeParams });
    Object.defineProperty(mockActivatedRoute, 'queryParams', { value: queryParams });
    mockReservationService.getReservationById.and.returnValue(of(mockReservation));

    component.ngOnInit();

    expect(mockReservationService.getReservationById).toHaveBeenCalledWith(456);
  });

  it('should load first closed reservation when no params provided', () => {
    const routeParams = of({});
    const queryParams = of({});
    Object.defineProperty(mockActivatedRoute, 'params', { value: routeParams });
    Object.defineProperty(mockActivatedRoute, 'queryParams', { value: queryParams });

    const reservations = [mockReservation];
    mockReservationService.getAllReservations.and.returnValue(of(reservations));

    component.ngOnInit();

    expect(mockReservationService.getAllReservations).toHaveBeenCalled();
    expect(component.reservationId).toBe(1);
  });

  it('should handle reservation loading error', () => {
    spyOn(window, 'alert');
    const routeParams = of({ reservationId: '123' });
    Object.defineProperty(mockActivatedRoute, 'params', { value: routeParams });
    mockReservationService.getReservationById.and.returnValue(throwError(() => new Error('Network error')));

    component.ngOnInit();

    expect(window.alert).toHaveBeenCalledWith('Erreur lors du chargement de la réservation.');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should handle non-closed reservation', () => {
    spyOn(window, 'alert');
    const routeParams = of({ reservationId: '123' });
    Object.defineProperty(mockActivatedRoute, 'params', { value: routeParams });
    const nonClosed = { ...mockReservation, status: 'PENDING' as const };
    mockReservationService.getReservationById.and.returnValue(of(nonClosed));

    component.ngOnInit();

    expect(window.alert).toHaveBeenCalledWith('Vous ne pouvez noter que pour une réservation terminée (statut CLOSED).');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should handle no closed reservations found', () => {
    spyOn(window, 'alert');
    const routeParams = of({});
    const queryParams = of({});
    Object.defineProperty(mockActivatedRoute, 'params', { value: routeParams });
    Object.defineProperty(mockActivatedRoute, 'queryParams', { value: queryParams });
    mockReservationService.getAllReservations.and.returnValue(of([]));

    component.ngOnInit();

    expect(window.alert).toHaveBeenCalledWith('Aucune réservation terminée trouvée.');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
  });
});
