import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';

import { ReviewService, Review, ReviewCreateRequest } from '../../services/review/review.service';

describe('ReviewService', () => {
  let service: ReviewService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/reviews`;

  const mockReview: Review = {
    id: 1,
    note: 5,
    commentaire: 'Excellent service !',
    reservationId: 123,
    reviewerId: 1,
    reviewedId: 2,
    createdAt: '2024-01-15T10:30:00Z'
  };

  const mockReviewCreateRequest: ReviewCreateRequest = {
    note: 5,
    commentaire: 'Excellent service !',
    reservationId: 123,
    reviewerId: 1,
    reviewedId: 2
  };

  const mockReviews: Review[] = [
    {
      id: 1,
      note: 5,
      commentaire: 'Excellent service !',
      reservationId: 123,
      reviewerId: 1,
      reviewedId: 2,
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      note: 4,
      commentaire: 'Très bon travail',
      reservationId: 124,
      reviewerId: 2,
      reviewedId: 1,
      createdAt: '2024-01-16T14:20:00Z'
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ReviewService,
        provideHttpClient(withFetch()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ReviewService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createReview', () => {
    it('should create a review successfully', () => {
      service.createReview(mockReviewCreateRequest).subscribe((review: Review) => {
        expect(review).toEqual(mockReview);
        expect(review.id).toBe(1);
        expect(review.note).toBe(5);
        expect(review.commentaire).toBe('Excellent service !');
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockReviewCreateRequest);
      req.flush(mockReview);
    });

    it('should handle error when creating review fails', () => {
      const errorMessage = 'Failed to create review';

      service.createReview(mockReviewCreateRequest).subscribe({
        next: () => fail('should have failed with an error'),
        error: (error: any) => {
          expect(error.status).toBe(400);
          expect(error.error).toBe(errorMessage);
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush(errorMessage, { status: 400, statusText: 'Bad Request' });
    });

    it('should create review with minimum required data', () => {
      const minimalRequest: ReviewCreateRequest = {
        note: 1,
        commentaire: '',
        reservationId: 1,
        reviewerId: 1,
        reviewedId: 2
      };

      const minimalReview: Review = {
        id: 3,
        note: 1,
        commentaire: '',
        reservationId: 1,
        reviewerId: 1,
        reviewedId: 2,
        createdAt: '2024-01-17T09:00:00Z'
      };

      service.createReview(minimalRequest).subscribe((review: Review) => {
        expect(review).toEqual(minimalReview);
        expect(review.note).toBe(1);
        expect(review.commentaire).toBe('');
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(minimalRequest);
      req.flush(minimalReview);
    });

    it('should handle validation error when note is invalid', () => {
      const invalidRequest: ReviewCreateRequest = {
        note: 6, // Note invalide (doit être entre 1 et 5)
        commentaire: 'Test comment',
        reservationId: 1,
        reviewerId: 1,
        reviewedId: 2
      };

      service.createReview(invalidRequest).subscribe({
        next: () => fail('should have failed with a validation error'),
        error: (error: any) => {
          expect(error.status).toBe(400);
          expect(error.error).toContain('note');
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush('La note doit être comprise entre 1 et 5', { status: 400, statusText: 'Bad Request' });
    });

    it('should handle conflict error when review already exists', () => {
      service.createReview(mockReviewCreateRequest).subscribe({
        next: () => fail('should have failed with a conflict error'),
        error: (error: any) => {
          expect(error.status).toBe(409);
          expect(error.error).toContain('déjà');
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush('Vous avez déjà créé un avis pour cette réservation', { status: 409, statusText: 'Conflict' });
    });

    it('should handle unauthorized error when user is not authenticated', () => {
      service.createReview(mockReviewCreateRequest).subscribe({
        next: () => fail('should have failed with an unauthorized error'),
        error: (error: any) => {
          expect(error.status).toBe(401);
          expect(error.error).toContain('authentifié');
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush('Utilisateur non authentifié', { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('getReviews', () => {
    it('should return all reviews', () => {
      service.getReviews().subscribe((reviews: Review[]) => {
        expect(reviews).toEqual(mockReviews);
        expect(reviews.length).toBe(2);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockReviews);
    });

    it('should return empty array when no reviews exist', () => {
      service.getReviews().subscribe((reviews: Review[]) => {
        expect(reviews).toEqual([]);
        expect(reviews.length).toBe(0);
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush([]);
    });

    it('should handle error when getting reviews fails', () => {
      service.getReviews().subscribe({
        next: () => fail('should have failed with an error'),
        error: (error: any) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getReviewById', () => {
    it('should return a specific review by id', () => {
      const reviewId = 1;

      service.getReviewById(reviewId).subscribe((review: Review) => {
        expect(review).toEqual(mockReview);
        expect(review.id).toBe(reviewId);
      });

      const req = httpMock.expectOne(`${apiUrl}/${reviewId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockReview);
    });

    it('should handle error when review not found', () => {
      const reviewId = 999;

      service.getReviewById(reviewId).subscribe({
        next: () => fail('should have failed with an error'),
        error: (error: any) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/${reviewId}`);
      req.flush('Review not found', { status: 404, statusText: 'Not Found' });
    });

    it('should handle invalid review id', () => {
      const reviewId = 0;

      service.getReviewById(reviewId).subscribe({
        next: () => fail('should have failed with an error'),
        error: (error: any) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/${reviewId}`);
      req.flush('Invalid review id', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('getReviewsByProviderId', () => {
    it('should return reviews for a specific provider', () => {
      const providerId = 2;
      const providerReviews = mockReviews.filter(review => review.reviewedId === providerId);

      service.getReviewsByProviderId(providerId).subscribe((reviews: Review[]) => {
        expect(reviews).toEqual(providerReviews);
        expect(reviews.length).toBe(1);
        expect(reviews[0].reviewedId).toBe(providerId);
      });

      const req = httpMock.expectOne(`${apiUrl}/provider/${providerId}`);
      expect(req.request.method).toBe('GET');
      req.flush(providerReviews);
    });

    it('should return empty array when provider has no reviews', () => {
      const providerId = 999;

      service.getReviewsByProviderId(providerId).subscribe((reviews: Review[]) => {
        expect(reviews).toEqual([]);
        expect(reviews.length).toBe(0);
      });

      const req = httpMock.expectOne(`${apiUrl}/provider/${providerId}`);
      req.flush([]);
    });

    it('should handle error when getting provider reviews fails', () => {
      const providerId = 1;

      service.getReviewsByProviderId(providerId).subscribe({
        next: () => fail('should have failed with an error'),
        error: (error: any) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/provider/${providerId}`);
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getReviewsWrittenByUser', () => {
    it('should return reviews written by the current user', () => {
      const userReviews = mockReviews.filter(review => review.reviewerId === 1);

      service.getReviewsWrittenByUser().subscribe((reviews: Review[]) => {
        expect(reviews).toEqual(userReviews);
        expect(reviews.length).toBe(1);
        expect(reviews[0].reviewerId).toBe(1);
      });

      const req = httpMock.expectOne(`${apiUrl}/writer`);
      expect(req.request.method).toBe('GET');
      req.flush(userReviews);
    });

    it('should return empty array when user has written no reviews', () => {
      service.getReviewsWrittenByUser().subscribe((reviews: Review[]) => {
        expect(reviews).toEqual([]);
        expect(reviews.length).toBe(0);
      });

      const req = httpMock.expectOne(`${apiUrl}/writer`);
      req.flush([]);
    });

    it('should handle authentication error', () => {
      service.getReviewsWrittenByUser().subscribe({
        next: () => fail('should have failed with an error'),
        error: (error: any) => {
          expect(error.status).toBe(401);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/writer`);
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('getReviewsReceivedByUser', () => {
    it('should return reviews received by the current user', () => {
      const receivedReviews = mockReviews.filter(review => review.reviewedId === 1);

      service.getReviewsReceivedByUser().subscribe((reviews: Review[]) => {
        expect(reviews).toEqual(receivedReviews);
        expect(reviews.length).toBe(1);
        expect(reviews[0].reviewedId).toBe(1);
      });

      const req = httpMock.expectOne(`${apiUrl}/received`);
      expect(req.request.method).toBe('GET');
      req.flush(receivedReviews);
    });

    it('should return empty array when user has received no reviews', () => {
      service.getReviewsReceivedByUser().subscribe((reviews: Review[]) => {
        expect(reviews).toEqual([]);
        expect(reviews.length).toBe(0);
      });

      const req = httpMock.expectOne(`${apiUrl}/received`);
      req.flush([]);
    });

    it('should handle authentication error', () => {
      service.getReviewsReceivedByUser().subscribe({
        next: () => fail('should have failed with an error'),
        error: (error: any) => {
          expect(error.status).toBe(401);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/received`);
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle network error', () => {
      service.getReviews().subscribe({
        next: () => fail('should have failed with an error'),
        error: (error: any) => {
          expect(error.status).toBe(0);
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.error(new ErrorEvent('Network error'));
    });

    it('should handle timeout error', () => {
      service.getReviews().subscribe({
        next: () => fail('should have failed with an error'),
        error: (error: any) => {
          expect(error.status).toBe(408);
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush('Request timeout', { status: 408, statusText: 'Request Timeout' });
    });

    it('should handle malformed JSON response', () => {
      service.getReviews().subscribe({
        next: () => fail('should have failed with an error'),
        error: (error: any) => {
          expect(error).toBeTruthy();
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.error(new ErrorEvent('JSON Parse Error', { message: 'Unexpected token I in JSON at position 0' }));
    });
  });

  describe('data validation', () => {
    it('should validate review data structure', () => {
      const validReview: Review = {
        id: 1,
        note: 5,
        commentaire: 'Test comment',
        reservationId: 1,
        reviewerId: 1,
        reviewedId: 2,
        createdAt: '2024-01-15T10:30:00Z'
      };

      service.getReviewById(1).subscribe((review: Review) => {
        expect(review).toBeDefined();
        expect(review.id).toBeDefined();
        expect(review.note).toBeDefined();
        expect(review.commentaire).toBeDefined();
        expect(review.reservationId).toBeDefined();
        expect(review.reviewerId).toBeDefined();
        expect(review.reviewedId).toBeDefined();
        expect(review.createdAt).toBeDefined();
        expect(typeof review.id).toBe('number');
        expect(typeof review.note).toBe('number');
        expect(typeof review.commentaire).toBe('string');
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      req.flush(validReview);
    });

    it('should handle review with null commentaire', () => {
      const reviewWithNullComment: Review = {
        id: 1,
        note: 3,
        commentaire: null as any,
        reservationId: 1,
        reviewerId: 1,
        reviewedId: 2,
        createdAt: '2024-01-15T10:30:00Z'
      };

      service.getReviewById(1).subscribe((review: Review) => {
        expect(review.commentaire).toBeNull();
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      req.flush(reviewWithNullComment);
    });
  });
});
