import { Review } from './Review';

describe('Review', () => {
  let review: Review;

  beforeEach(() => {
    review = new Review({
      id: 1,
      note: 4,
      commentaire: 'Excellent service, très satisfait',
      reservationId: 123,
      reviewerId: 456,
      reviewedId: 789,
      createdAt: new Date('2024-01-15T10:30:00')
    });
  });

  describe('Constructor', () => {
    it('should create a review with provided data', () => {
      expect(review.id).toBe(1);
      expect(review.note).toBe(4);
      expect(review.commentaire).toBe('Excellent service, très satisfait');
      expect(review.reservationId).toBe(123);
      expect(review.reviewerId).toBe(456);
      expect(review.reviewedId).toBe(789);
      expect(review.createdAt).toEqual(new Date('2024-01-15T10:30:00'));
    });

    it('should create an empty review when no data provided', () => {
      const emptyReview = new Review();
      expect(emptyReview.id).toBeUndefined();
      expect(emptyReview.note).toBeUndefined();
      expect(emptyReview.commentaire).toBeUndefined();
    });

    it('should create a review with partial data', () => {
      const partialReview = new Review({ id: 2, note: 5 });
      expect(partialReview.id).toBe(2);
      expect(partialReview.note).toBe(5);
      expect(partialReview.commentaire).toBeUndefined();
    });
  });

  describe('isValidNote', () => {
    it('should return true for valid notes (1-5)', () => {
      for (let i = 1; i <= 5; i++) {
        review.note = i;
        expect(review.isValidNote()).toBe(true);
      }
    });

    it('should return false for invalid notes', () => {
      review.note = 0;
      expect(review.isValidNote()).toBe(false);

      review.note = 6;
      expect(review.isValidNote()).toBe(false);

      review.note = -1;
      expect(review.isValidNote()).toBe(false);
    });
  });

  describe('getStars', () => {
    it('should return correct star array for note 1', () => {
      review.note = 1;
      expect(review.getStars()).toEqual([true, false, false, false, false]);
    });

    it('should return correct star array for note 3', () => {
      review.note = 3;
      expect(review.getStars()).toEqual([true, true, true, false, false]);
    });

    it('should return correct star array for note 5', () => {
      review.note = 5;
      expect(review.getStars()).toEqual([true, true, true, true, true]);
    });

    it('should return all false for note 0', () => {
      review.note = 0;
      expect(review.getStars()).toEqual([false, false, false, false, false]);
    });

    it('should return all true for note greater than 5', () => {
      review.note = 7;
      expect(review.getStars()).toEqual([true, true, true, true, true]);
    });

    it('should return all false for negative note', () => {
      review.note = -3;
      expect(review.getStars()).toEqual([false, false, false, false, false]);
    });
  });

  describe('getNoteText', () => {
    it('should return correct text for each note value', () => {
      const testCases = [
        { note: 1, expected: 'Très mauvais' },
        { note: 2, expected: 'Mauvais' },
        { note: 3, expected: 'Moyen' },
        { note: 4, expected: 'Bon' },
        { note: 5, expected: 'Excellent' }
      ];

      testCases.forEach(({ note, expected }) => {
        review.note = note;
        expect(review.getNoteText()).toBe(expected);
      });
    });

    it('should return "Non évalué" for invalid notes', () => {
      review.note = 0;
      expect(review.getNoteText()).toBe('Non évalué');

      review.note = 6;
      expect(review.getNoteText()).toBe('Non évalué');

      review.note = -1;
      expect(review.getNoteText()).toBe('Non évalué');
    });
  });

  describe('Edge cases', () => {
    it('should handle undefined commentaire', () => {
      review.commentaire = undefined;
      expect(review.commentaire).toBeUndefined();
    });

    it('should handle empty commentaire', () => {
      review.commentaire = '';
      expect(review.commentaire).toBe('');
    });

    it('should handle long commentaire', () => {
      const longComment = 'A'.repeat(1000);
      review.commentaire = longComment;
      expect(review.commentaire).toBe(longComment);
    });
  });
});
