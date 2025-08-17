import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RatingStarsComponent } from './rating-stars.component';
import { ReviewService } from '../../../services/review/review.service';
import { Review } from '../../../services/review/review.service';

describe('RatingStarsComponent', () => {
  let component: RatingStarsComponent;
  let fixture: ComponentFixture<RatingStarsComponent>;
  let mockReviewService: jasmine.SpyObj<ReviewService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ReviewService', ['getReviews']);
    mockReviewService = spy;

    await TestBed.configureTestingModule({
      imports: [RatingStarsComponent],
      providers: [
        { provide: ReviewService, useValue: mockReviewService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RatingStarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialisation', () => {
    it('devrait initialiser les propriétés avec les valeurs par défaut', () => {
      expect(component.providerId).toBe(0);
      expect(component.reviews).toEqual([]);
      expect(component.rating).toBe(0);
      expect(component.reviewsCount).toBe(0);
      expect(component.stars).toEqual([0, 1, 2, 3, 4]);
    });
  });

  describe('ngOnInit', () => {
    it('devrait appeler calculateRating lors de l\'initialisation', () => {
      spyOn(component as any, 'calculateRating');
      component.ngOnInit();
      expect((component as any).calculateRating).toHaveBeenCalled();
    });
  });

  describe('ngOnChanges', () => {
    it('devrait appeler calculateRating quand les avis changent', () => {
      spyOn(component as any, 'calculateRating');
      const changes = {
        reviews: {
          currentValue: [{ note: 5 }],
          previousValue: [],
          firstChange: true,
          isFirstChange: () => true
        }
      };
      component.ngOnChanges(changes);
      expect((component as any).calculateRating).toHaveBeenCalled();
    });

    it('devrait appeler calculateRating quand l\'identifiant du prestataire change', () => {
      spyOn(component as any, 'calculateRating');
      const changes = {
        providerId: {
          currentValue: 2,
          previousValue: 1,
          firstChange: true,
          isFirstChange: () => true
        }
      };
      component.ngOnChanges(changes);
      expect((component as any).calculateRating).toHaveBeenCalled();
    });

    it('ne devrait pas appeler calculateRating pour d\'autres changements', () => {
      spyOn(component as any, 'calculateRating');
      const changes = {
        otherProperty: {
          currentValue: 'test',
          previousValue: '',
          firstChange: true,
          isFirstChange: () => true
        }
      };
      component.ngOnChanges(changes);
      expect((component as any).calculateRating).not.toHaveBeenCalled();
    });
  });

  describe('calculateRating', () => {
    beforeEach(() => {
      // Supprimer les logs console pour les tests
      spyOn(console, 'log').and.stub();
    });

    it('devrait calculer la note moyenne correctement avec plusieurs avis', () => {
      const mockReviews: Review[] = [
        { id: 1, note: 4, commentaire: 'Très bien', reservationId: 1, reviewerId: 1, reviewedId: 1, createdAt: '2024-01-01' },
        { id: 2, note: 5, commentaire: 'Excellent', reservationId: 2, reviewerId: 2, reviewedId: 1, createdAt: '2024-01-02' },
        { id: 3, note: 3, commentaire: 'Correct', reservationId: 3, reviewerId: 3, reviewedId: 1, createdAt: '2024-01-03' }
      ];

      component.reviews = mockReviews;
      (component as any).calculateRating();

      expect(component.rating).toBe(4);
      expect(component.reviewsCount).toBe(3);
    });

    it('devrait gérer les notes avec décimales', () => {
      const mockReviews: Review[] = [
        { id: 1, note: 4, commentaire: 'Bien', reservationId: 1, reviewerId: 1, reviewedId: 1, createdAt: '2024-01-01' },
        { id: 2, note: 5, commentaire: 'Excellent', reservationId: 2, reviewerId: 2, reviewedId: 1, createdAt: '2024-01-02' }
      ];

      component.reviews = mockReviews;
      (component as any).calculateRating();

      expect(component.rating).toBe(4.5);
      expect(component.reviewsCount).toBe(2);
    });

    it('devrait mettre la note à 0 quand il n\'y a pas d\'avis', () => {
      component.reviews = [];
      (component as any).calculateRating();

      expect(component.rating).toBe(0);
      expect(component.reviewsCount).toBe(0);
    });

    it('devrait arrondir la note à 1 décimale', () => {
      const mockReviews: Review[] = [
        { id: 1, note: 4, commentaire: 'Bien', reservationId: 1, reviewerId: 1, reviewedId: 1, createdAt: '2024-01-01' },
        { id: 2, note: 4, commentaire: 'Bien', reservationId: 2, reviewerId: 2, reviewedId: 1, createdAt: '2024-01-02' },
        { id: 3, note: 5, commentaire: 'Excellent', reservationId: 3, reviewerId: 3, reviewedId: 1, createdAt: '2024-01-03' }
      ];

      component.reviews = mockReviews;
      (component as any).calculateRating();

      // (4 + 4 + 5) / 3 = 4.333... arrondi à 4.3
      expect(component.rating).toBe(4.3);
    });

    it('devrait logger les informations de débogage', () => {
      const mockReviews: Review[] = [
        { id: 1, note: 4, commentaire: 'Bien', reservationId: 1, reviewerId: 1, reviewedId: 1, createdAt: '2024-01-01' }
      ];

      component.providerId = 123;
      component.reviews = mockReviews;
      (component as any).calculateRating();

    });
  });

  describe('getStarIcon', () => {
    beforeEach(() => {
      component.rating = 3.5;
    });

    it('devrait retourner "star" pour les étoiles pleines', () => {
      expect(component.getStarIcon(0)).toBe('star'); // Position 0 < 3
      expect(component.getStarIcon(1)).toBe('star'); // Position 1 < 3
      expect(component.getStarIcon(2)).toBe('star'); // Position 2 < 3
    });

    it('devrait retourner "star_half" pour la demi-étoile', () => {
      expect(component.getStarIcon(3)).toBe('star_half'); // Position 3 = Math.floor(3.5) et 3.5 % 1 !== 0
    });

    it('devrait retourner "star_border" pour les étoiles vides', () => {
      expect(component.getStarIcon(4)).toBe('star_border'); // Position 4 > Math.floor(3.5)
    });

    it('devrait gérer les notes entières correctement', () => {
      component.rating = 3;

      expect(component.getStarIcon(0)).toBe('star');
      expect(component.getStarIcon(1)).toBe('star');
      expect(component.getStarIcon(2)).toBe('star');
      expect(component.getStarIcon(3)).toBe('star_border'); // Pas de demi-étoile pour note entière
      expect(component.getStarIcon(4)).toBe('star_border');
    });

    it('devrait gérer la note 0 correctement', () => {
      component.rating = 0;

      expect(component.getStarIcon(0)).toBe('star_border');
      expect(component.getStarIcon(1)).toBe('star_border');
      expect(component.getStarIcon(2)).toBe('star_border');
      expect(component.getStarIcon(3)).toBe('star_border');
      expect(component.getStarIcon(4)).toBe('star_border');
    });

    it('devrait gérer la note 5 correctement', () => {
      component.rating = 5;

      expect(component.getStarIcon(0)).toBe('star');
      expect(component.getStarIcon(1)).toBe('star');
      expect(component.getStarIcon(2)).toBe('star');
      expect(component.getStarIcon(3)).toBe('star');
      expect(component.getStarIcon(4)).toBe('star');
    });
  });

  describe('Intégration', () => {
    it('devrait mettre à jour l\'affichage quand les avis changent', () => {
      const initialReviews: Review[] = [
        { id: 1, note: 3, commentaire: 'Correct', reservationId: 1, reviewerId: 1, reviewedId: 1, createdAt: '2024-01-01' }
      ];

      component.reviews = initialReviews;
      component.ngOnChanges({
        reviews: {
          currentValue: initialReviews,
          previousValue: undefined,
          firstChange: true,
          isFirstChange: () => true
        }
      });
      fixture.detectChanges();

      expect(component.rating).toBe(3);
      expect(component.reviewsCount).toBe(1);

      const newReviews: Review[] = [
        { id: 1, note: 4, commentaire: 'Bien', reservationId: 1, reviewerId: 1, reviewedId: 1, createdAt: '2024-01-01' },
        { id: 2, note: 5, commentaire: 'Excellent', reservationId: 2, reviewerId: 2, reviewedId: 1, createdAt: '2024-01-02' }
      ];

      component.reviews = newReviews;
      component.ngOnChanges({
        reviews: {
          currentValue: newReviews,
          previousValue: initialReviews,
          firstChange: false,
          isFirstChange: () => false
        }
      });
      fixture.detectChanges();

      expect(component.rating).toBe(4.5);
      expect(component.reviewsCount).toBe(2);
    });
  });
});
