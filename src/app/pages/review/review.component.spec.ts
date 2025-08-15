import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';

import { ReviewService, ReviewCreateRequest } from '../../services/review/review.service';
import { ReservationService, ReservationResponseDTO } from '../../services/reservation/reservation.service';

// Composant de test sans FooterComponent
@Component({
  selector: 'app-review',
  template: `
    <div>
      <h2>Noter {{ providerName }}</h2>
      <div class="stars">
        <span *ngFor="let star of stars"
              (click)="setRating(star)"
              (keydown)="onStarKeydown($event, star)"
              [class.active]="star <= rating">
          ★
        </span>
      </div>
      <textarea [(ngModel)]="feedback"
                (input)="onFeedbackInput($event)"
                placeholder="Votre commentaire..."></textarea>
      <div *ngIf="feedbackError" class="error">{{ feedbackError }}</div>
      <button (click)="sendFeedback()">Envoyer</button>
      <button (click)="cancel()">Annuler</button>
    </div>
  `,
  standalone: true,
  imports: [FormsModule]
})
class TestReviewComponent {
  stars = [1, 2, 3, 4, 5];
  rating = 0;
  feedback = '';
  feedbackError = '';
  providerName = 'Prestataire';
  reservationId = 0;
  providerId = 0;
  clientId = 0;
  currentUserId = 0;

  constructor(
    private reviewService: ReviewService,
    private reservationService: ReservationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadReservationData();
  }

  private loadReservationData(): void {
    this.route.params.subscribe(params => {
      const reservationId = params['reservationId'];
      if (reservationId) {
        this.reservationId = +reservationId;
        this.loadReservationDetails();
      }
    });

    this.route.queryParams.subscribe(queryParams => {
      const reservationId = queryParams['reservationId'];
      if (reservationId && !this.reservationId) {
        this.reservationId = +reservationId;
        this.loadReservationDetails();
      }
    });

    if (!this.reservationId) {
      this.loadFirstClosedReservation();
    }
  }

  private loadReservationDetails(): void {
    this.reservationService.getReservationById(this.reservationId).subscribe({
      next: (reservation) => {
        if (reservation.status !== 'CLOSED') {
          alert('Vous ne pouvez noter que pour une réservation terminée (statut CLOSED).');
          this.router.navigate(['/home']);
          return;
        }

        this.providerName = reservation.providerName || 'Prestataire';
        this.providerId = reservation.providerId;
        this.clientId = reservation.clientId;

        console.log('Réservation chargée:', {
          id: reservation.id,
          status: reservation.status,
          providerName: reservation.providerName,
          clientName: reservation.clientName
        });
      },
      error: (err) => {
        console.error('Erreur lors du chargement de la réservation:', err);
        alert('Erreur lors du chargement de la réservation.');
        this.router.navigate(['/home']);
      }
    });
  }

  private loadFirstClosedReservation(): void {
    this.reservationService.getAllReservations().subscribe({
      next: (reservations) => {
        const closedReservations = reservations.filter(r => r.status === 'CLOSED');

        if (closedReservations.length > 0) {
          const firstReservation = closedReservations[0];
          this.reservationId = firstReservation.id;
          this.providerName = firstReservation.providerName || 'Prestataire';
          this.providerId = firstReservation.providerId;
          this.clientId = firstReservation.clientId;
        } else {
          alert('Aucune réservation terminée trouvée.');
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement des réservations:', err);
        alert('Erreur lors du chargement des réservations.');
        this.router.navigate(['/home']);
      }
    });
  }

  setRating(value: number) {
    this.rating = value;
  }

  onStarKeydown(event: KeyboardEvent, value: number) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.setRating(value);
    }
  }

  onFeedbackInput(event: any) {
    const input = event.target.value;
    this.feedback = input;
    this.validateFeedback();
  }

  private validateFeedback() {
    this.feedbackError = '';

    if (this.feedback.trim().length > 0) {
      const onlyNumbers = /^[0-9\s]+$/;
      if (onlyNumbers.test(this.feedback.trim())) {
        this.feedbackError = 'Le commentaire ne peut pas être constitué uniquement de chiffres.';
        return;
      }

      const onlyPunctuation = /^[!.,;:?()\s]+$/;
      if (onlyPunctuation.test(this.feedback.trim())) {
        this.feedbackError = 'Le commentaire doit contenir du texte et ne peut pas être constitué uniquement de caractères de ponctuation.';
        return;
      }

      const dangerousChars = /[<>]/;
      if (dangerousChars.test(this.feedback)) {
        this.feedbackError = 'Le commentaire ne peut pas contenir les caractères < et >.';
        return;
      }

      const specialChars = /[@#$%^&*()_+\-=\[\]{}"\\|<>\/~]/;
      if (specialChars.test(this.feedback)) {
        this.feedbackError = 'Le commentaire ne peut pas contenir de caractères spéciaux (apostrophe, deux-points et point-virgule autorisés).';
        return;
      }
    }
  }

  sendFeedback() {
    if (this.rating === 0) {
      alert('Veuillez sélectionner une note avant d\'envoyer votre avis.');
      return;
    }

    if (this.feedback.trim().length === 0) {
      this.feedbackError = 'Veuillez saisir un commentaire avant d\'envoyer votre avis.';
      return;
    }

    const invalidChars = /[<>]/;
    if (invalidChars.test(this.feedback)) {
      this.feedbackError = 'Le commentaire ne peut pas contenir les caractères < et >.';
      return;
    }

    const onlyNumbers = /^[0-9\s]+$/;
    if (onlyNumbers.test(this.feedback.trim())) {
      this.feedbackError = 'Le commentaire ne peut pas être constitué uniquement de chiffres.';
      return;
    }

    const onlyPunctuation = /^[!.,;:?()\s]+$/;
    if (onlyPunctuation.test(this.feedback.trim())) {
      this.feedbackError = 'Le commentaire doit contenir du texte et ne peut pas être constitué uniquement de caractères de ponctuation.';
      return;
    }

    const specialChars = /[@#$%^&*()_+\-=\[\]{}"\\|<>\/~]/;
    if (specialChars.test(this.feedback)) {
      this.feedbackError = 'Le commentaire ne peut pas contenir de caractères spéciaux (apostrophe, deux-points et point-virgule autorisés).';
      return;
    }

    if (!this.reservationId || !this.providerId) {
      alert('Erreur : Impossible de récupérer les informations nécessaires. Veuillez réessayer.');
      return;
    }

    const reviewRequest: ReviewCreateRequest = {
      note: this.rating,
      commentaire: this.feedback,
      reservationId: this.reservationId,
      reviewerId: 0,
      reviewedId: 0
    };

    this.reviewService.createReview(reviewRequest).subscribe({
      next: (response: any) => {
        alert('Merci pour votre avis !');
        this.router.navigate(['/home']);
      },
      error: (err: any) => {
        console.error('Erreur lors de l\'envoi de l\'avis:', err);
        let errorMessage = 'Erreur lors de l\'envoi de l\'avis';

        if (err.error && err.error.message) {
          errorMessage += ': ' + err.error.message;
        } else if (err.message) {
          errorMessage += ': ' + err.message;
        }

        alert(errorMessage);
      }
    });
  }

  cancel() {
    this.rating = 0;
    this.feedback = '';
    this.feedbackError = '';
  }
}

describe('ReviewComponent', () => {
  let component: TestReviewComponent;
  let fixture: ComponentFixture<TestReviewComponent>;
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
    const reviewServiceSpy = jasmine.createSpyObj('ReviewService', ['createReview']);
    const reservationServiceSpy = jasmine.createSpyObj('ReservationService', ['getReservationById', 'getAllReservations']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      params: of({}),
      queryParams: of({})
    });

    await TestBed.configureTestingModule({
      imports: [
        TestReviewComponent,
        FormsModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: ReviewService, useValue: reviewServiceSpy },
        { provide: ReservationService, useValue: reservationServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TestReviewComponent);
    component = fixture.componentInstance;
    mockReviewService = TestBed.inject(ReviewService) as jasmine.SpyObj<ReviewService>;
    mockReservationService = TestBed.inject(ReservationService) as jasmine.SpyObj<ReservationService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockActivatedRoute = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize with default values', () => {
      expect(component.stars).toEqual([1, 2, 3, 4, 5]);
      expect(component.rating).toBe(0);
      expect(component.feedback).toBe('');
      expect(component.feedbackError).toBe('');
      expect(component.providerName).toBe('Prestataire');
      expect(component.reservationId).toBe(0);
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

             const mockReservations: ReservationResponseDTO[] = [
         {
           id: 1,
           status: 'CLOSED',
           reservationDate: '2024-01-15T10:00:00Z',
           startDate: '2024-01-20T10:00:00Z',
           endDate: '2024-01-25T10:00:00Z',
           totalPrice: 500,
           clientId: 1,
           clientName: 'Client 1',
           clientEmail: 'client1@test.com',
           providerId: 1,
           providerName: 'Provider 1',
           providerEmail: 'provider1@test.com',
           serviceId: 1,
           serviceName: 'Service 1',
           serviceDescription: 'Service 1 description',
           propertyName: 'Property 1',
           propertyAddress: 'Address 1',
           comments: 'Comments 1',
           services: ['Service 1'],
           createdAt: '2024-01-15T10:00:00Z',
           updatedAt: '2024-01-15T10:00:00Z'
         },
                  {
           id: 2,
           status: 'PENDING',
           reservationDate: '2024-01-16T10:00:00Z',
           startDate: '2024-01-21T10:00:00Z',
           endDate: '2024-01-26T10:00:00Z',
           totalPrice: 600,
           clientId: 1,
           clientName: 'Client 1',
           clientEmail: 'client1@test.com',
           providerId: 2,
           providerName: 'Provider 2',
           providerEmail: 'provider2@test.com',
           serviceId: 2,
           serviceName: 'Service 2',
           serviceDescription: 'Service 2 description',
           propertyName: 'Property 2',
           propertyAddress: 'Address 2',
           comments: 'Comments 2',
           services: ['Service 2'],
           createdAt: '2024-01-16T10:00:00Z',
           updatedAt: '2024-01-16T10:00:00Z'
         }
       ];

      mockReservationService.getAllReservations.and.returnValue(of(mockReservations));

      component.ngOnInit();

      expect(mockReservationService.getAllReservations).toHaveBeenCalled();
      expect(component.reservationId).toBe(1);
      expect(component.providerName).toBe('Provider 1');
    });

    it('should redirect to home when reservation is not CLOSED', () => {
      const routeParams = of({ reservationId: '123' });
      Object.defineProperty(mockActivatedRoute, 'params', { value: routeParams });

             const openReservation: ReservationResponseDTO = { ...mockReservation, status: 'PENDING' };
      mockReservationService.getReservationById.and.returnValue(of(openReservation));

      spyOn(window, 'alert');

      component.ngOnInit();

      expect(window.alert).toHaveBeenCalledWith('Vous ne pouvez noter que pour une réservation terminée (statut CLOSED).');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
    });

    it('should handle error when loading reservation', () => {
      const routeParams = of({ reservationId: '123' });
      Object.defineProperty(mockActivatedRoute, 'params', { value: routeParams });

      mockReservationService.getReservationById.and.returnValue(throwError(() => new Error('Not found')));

      spyOn(window, 'alert');
      spyOn(console, 'error');

      component.ngOnInit();

      expect(console.error).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('Erreur lors du chargement de la réservation.');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
    });
  });

  describe('Rating functionality', () => {
    it('should set rating correctly', () => {
      component.setRating(4);
      expect(component.rating).toBe(4);
    });

    it('should handle star keydown with Enter key', () => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      spyOn(event, 'preventDefault');

      component.onStarKeydown(event, 3);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(component.rating).toBe(3);
    });

    it('should handle star keydown with Space key', () => {
      const event = new KeyboardEvent('keydown', { key: ' ' });
      spyOn(event, 'preventDefault');

      component.onStarKeydown(event, 5);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(component.rating).toBe(5);
    });

    it('should not handle star keydown with other keys', () => {
      const event = new KeyboardEvent('keydown', { key: 'Tab' });
      spyOn(event, 'preventDefault');

      component.onStarKeydown(event, 2);

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(component.rating).toBe(0);
    });
  });

  describe('Feedback validation', () => {
    beforeEach(() => {
      component.reservationId = 1;
      component.providerId = 2;
    });

    it('should validate feedback with valid text', () => {
      const event = { target: { value: 'Excellent service !' } };

      component.onFeedbackInput(event);

      expect(component.feedback).toBe('Excellent service !');
      expect(component.feedbackError).toBe('');
    });

    it('should reject feedback with only numbers', () => {
      const event = { target: { value: '123 456' } };

      component.onFeedbackInput(event);

      expect(component.feedbackError).toBe('Le commentaire ne peut pas être constitué uniquement de chiffres.');
    });

    it('should reject feedback with only punctuation', () => {
      const event = { target: { value: '!!! ...' } };

      component.onFeedbackInput(event);

      expect(component.feedbackError).toBe('Le commentaire doit contenir du texte et ne peut pas être constitué uniquement de caractères de ponctuation.');
    });

    it('should reject feedback with special characters', () => {
      const event = { target: { value: 'Test @#$%' } };

      component.onFeedbackInput(event);

      expect(component.feedbackError).toBe('Le commentaire ne peut pas contenir de caractères spéciaux (apostrophe, deux-points et point-virgule autorisés).');
    });

    it('should reject feedback with dangerous characters', () => {
      const event = { target: { value: 'Test <script>' } };

      component.onFeedbackInput(event);

      expect(component.feedbackError).toBe('Le commentaire ne peut pas contenir les caractères < et >.');
    });

    it('should accept feedback with apostrophe', () => {
      const event = { target: { value: "C'est excellent !" } };

      component.onFeedbackInput(event);

      expect(component.feedbackError).toBe('');
    });

    it('should accept feedback with colon', () => {
      const event = { target: { value: 'Test : très bien' } };

      component.onFeedbackInput(event);

      expect(component.feedbackError).toBe('');
    });

    it('should accept feedback with semicolon', () => {
      const event = { target: { value: 'Test ; très bien' } };

      component.onFeedbackInput(event);

      expect(component.feedbackError).toBe('');
    });

    it('should accept feedback with mixed punctuation and text', () => {
      const event = { target: { value: 'Test ; Test :' } };

      component.onFeedbackInput(event);

      expect(component.feedbackError).toBe('');
    });
  });

  describe('Send feedback', () => {
    beforeEach(() => {
      component.reservationId = 1;
      component.providerId = 2;
      mockReviewService.createReview.and.returnValue(of(mockReviewResponse));
    });

    it('should send feedback successfully with valid data', () => {
      component.rating = 5;
      component.feedback = 'Excellent service !';

      spyOn(window, 'alert');

      component.sendFeedback();

      expect(mockReviewService.createReview).toHaveBeenCalledWith({
        note: 5,
        commentaire: 'Excellent service !',
        reservationId: 1,
        reviewerId: 0,
        reviewedId: 0
      });
      expect(window.alert).toHaveBeenCalledWith('Merci pour votre avis !');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
    });

    it('should show error when no rating selected', () => {
      component.rating = 0;
      component.feedback = 'Test comment';

      spyOn(window, 'alert');

      component.sendFeedback();

      expect(window.alert).toHaveBeenCalledWith('Veuillez sélectionner une note avant d\'envoyer votre avis.');
      expect(mockReviewService.createReview).not.toHaveBeenCalled();
    });

    it('should show error when no feedback provided', () => {
      component.rating = 5;
      component.feedback = '';

      component.sendFeedback();

      expect(component.feedbackError).toBe('Veuillez saisir un commentaire avant d\'envoyer votre avis.');
      expect(mockReviewService.createReview).not.toHaveBeenCalled();
    });

    it('should show error when feedback contains only whitespace', () => {
      component.rating = 5;
      component.feedback = '   ';

      component.sendFeedback();

      expect(component.feedbackError).toBe('Veuillez saisir un commentaire avant d\'envoyer votre avis.');
      expect(mockReviewService.createReview).not.toHaveBeenCalled();
    });

    it('should show error when feedback contains only numbers', () => {
      component.rating = 5;
      component.feedback = '123 456';

      component.sendFeedback();

      expect(component.feedbackError).toBe('Le commentaire ne peut pas être constitué uniquement de chiffres.');
      expect(mockReviewService.createReview).not.toHaveBeenCalled();
    });

    it('should show error when feedback contains only punctuation', () => {
      component.rating = 5;
      component.feedback = '!!! ...';

      component.sendFeedback();

      expect(component.feedbackError).toBe('Le commentaire doit contenir du texte et ne peut pas être constitué uniquement de caractères de ponctuation.');
      expect(mockReviewService.createReview).not.toHaveBeenCalled();
    });

    it('should show error when feedback contains special characters', () => {
      component.rating = 5;
      component.feedback = 'Test @#$%';

      component.sendFeedback();

      expect(component.feedbackError).toBe('Le commentaire ne peut pas contenir de caractères spéciaux (apostrophe, deux-points et point-virgule autorisés).');
      expect(mockReviewService.createReview).not.toHaveBeenCalled();
    });

    it('should show error when feedback contains dangerous characters', () => {
      component.rating = 5;
      component.feedback = 'Test <script>';

      component.sendFeedback();

      expect(component.feedbackError).toBe('Le commentaire ne peut pas contenir les caractères < et >.');
      expect(mockReviewService.createReview).not.toHaveBeenCalled();
    });

    it('should show error when reservationId is missing', () => {
      component.reservationId = 0;
      component.rating = 5;
      component.feedback = 'Test comment';

      spyOn(window, 'alert');

      component.sendFeedback();

      expect(window.alert).toHaveBeenCalledWith('Erreur : Impossible de récupérer les informations nécessaires. Veuillez réessayer.');
      expect(mockReviewService.createReview).not.toHaveBeenCalled();
    });

    it('should show error when providerId is missing', () => {
      component.providerId = 0;
      component.rating = 5;
      component.feedback = 'Test comment';

      spyOn(window, 'alert');

      component.sendFeedback();

      expect(window.alert).toHaveBeenCalledWith('Erreur : Impossible de récupérer les informations nécessaires. Veuillez réessayer.');
      expect(mockReviewService.createReview).not.toHaveBeenCalled();
    });

    it('should handle service error with error message', () => {
      component.rating = 5;
      component.feedback = 'Test comment';

      const errorResponse = {
        error: { message: 'Vous avez déjà créé un avis pour cette réservation' }
      };
      mockReviewService.createReview.and.returnValue(throwError(() => errorResponse));

      spyOn(window, 'alert');
      spyOn(console, 'error');

      component.sendFeedback();

      expect(console.error).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('Erreur lors de l\'envoi de l\'avis: Vous avez déjà créé un avis pour cette réservation');
    });

    it('should handle service error without error message', () => {
      component.rating = 5;
      component.feedback = 'Test comment';

      const errorResponse = new Error('Network error');
      mockReviewService.createReview.and.returnValue(throwError(() => errorResponse));

      spyOn(window, 'alert');
      spyOn(console, 'error');

      component.sendFeedback();

      expect(console.error).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('Erreur lors de l\'envoi de l\'avis: Network error');
    });
  });

  describe('Cancel functionality', () => {
    it('should reset form when cancel is called', () => {
      component.rating = 5;
      component.feedback = 'Test comment';
      component.feedbackError = 'Some error';

      component.cancel();

      expect(component.rating).toBe(0);
      expect(component.feedback).toBe('');
      expect(component.feedbackError).toBe('');
    });
  });

  describe('Edge cases', () => {
    it('should handle empty reservations list', () => {
      const routeParams = of({});
      const queryParams = of({});
      Object.defineProperty(mockActivatedRoute, 'params', { value: routeParams });
      Object.defineProperty(mockActivatedRoute, 'queryParams', { value: queryParams });

      mockReservationService.getAllReservations.and.returnValue(of([]));

      spyOn(window, 'alert');

      component.ngOnInit();

      expect(window.alert).toHaveBeenCalledWith('Aucune réservation terminée trouvée.');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
    });

    it('should handle reservations list with no closed reservations', () => {
      const routeParams = of({});
      const queryParams = of({});
      Object.defineProperty(mockActivatedRoute, 'params', { value: routeParams });
      Object.defineProperty(mockActivatedRoute, 'queryParams', { value: queryParams });

             const mockReservations: ReservationResponseDTO[] = [
         {
           id: 1,
           status: 'PENDING',
           reservationDate: '2024-01-15T10:00:00Z',
           startDate: '2024-01-20T10:00:00Z',
           endDate: '2024-01-25T10:00:00Z',
           totalPrice: 500,
           clientId: 1,
           clientName: 'Client 1',
           clientEmail: 'client1@test.com',
           providerId: 1,
           providerName: 'Provider 1',
           providerEmail: 'provider1@test.com',
           serviceId: 1,
           serviceName: 'Service 1',
           serviceDescription: 'Service 1 description',
           propertyName: 'Property 1',
           propertyAddress: 'Address 1',
           comments: 'Comments 1',
           services: ['Service 1'],
           createdAt: '2024-01-15T10:00:00Z',
           updatedAt: '2024-01-15T10:00:00Z'
         },
         {
           id: 2,
           status: 'PENDING',
           reservationDate: '2024-01-16T10:00:00Z',
           startDate: '2024-01-21T10:00:00Z',
           endDate: '2024-01-26T10:00:00Z',
           totalPrice: 600,
           clientId: 1,
           clientName: 'Client 1',
           clientEmail: 'client1@test.com',
           providerId: 2,
           providerName: 'Provider 2',
           providerEmail: 'provider2@test.com',
           serviceId: 2,
           serviceName: 'Service 2',
           serviceDescription: 'Service 2 description',
           propertyName: 'Property 2',
           propertyAddress: 'Address 2',
           comments: 'Comments 2',
           services: ['Service 2'],
           createdAt: '2024-01-16T10:00:00Z',
           updatedAt: '2024-01-16T10:00:00Z'
         }
       ];

      mockReservationService.getAllReservations.and.returnValue(of(mockReservations));

      spyOn(window, 'alert');

      component.ngOnInit();

      expect(window.alert).toHaveBeenCalledWith('Aucune réservation terminée trouvée.');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
    });

    it('should handle error when loading all reservations', () => {
      const routeParams = of({});
      const queryParams = of({});
      Object.defineProperty(mockActivatedRoute, 'params', { value: routeParams });
      Object.defineProperty(mockActivatedRoute, 'queryParams', { value: queryParams });

      mockReservationService.getAllReservations.and.returnValue(throwError(() => new Error('Server error')));

      spyOn(window, 'alert');
      spyOn(console, 'error');

      component.ngOnInit();

      expect(console.error).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('Erreur lors du chargement des réservations.');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
    });
  });
});
