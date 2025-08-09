import { TestBed } from '@angular/core/testing';
import { FAQPrestataireParcoursService } from '../faq-prestataire-parcours.service';

describe('FAQPrestataireParcoursService', () => {
  let service: FAQPrestataireParcoursService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FAQPrestataireParcoursService]
    });
    service = TestBed.inject(FAQPrestataireParcoursService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllQuestions', () => {
    it('should return all questions sorted by order', () => {
      const questions = service.getAllQuestions();
      expect(questions.length).toBeGreaterThan(0);
      
      // Vérifier que les questions sont triées par ordre
      for (let i = 1; i < questions.length; i++) {
        expect(questions[i].ordre).toBeGreaterThanOrEqual(questions[i-1].ordre);
      }
    });
  });

  describe('getQuestionsByCategory', () => {
    it('should return questions for a specific category', () => {
      const inscriptionQuestions = service.getQuestionsByCategory('Inscription / Connexion');
      expect(inscriptionQuestions.length).toBe(3);
      expect(inscriptionQuestions[0].categorie).toBe('Inscription / Connexion');
    });

    it('should return empty array for non-existent category', () => {
      const questions = service.getQuestionsByCategory('Catégorie inexistante');
      expect(questions).toEqual([]);
    });
  });

  describe('getCategories', () => {
    it('should return all unique categories', () => {
      const categories = service.getCategories();
      expect(categories).toContain('Inscription / Connexion');
      expect(categories).toContain('Gestion des services');
      expect(categories).toContain('Création / Gestion des Services');
      expect(categories).toContain('Messagerie');
      expect(categories).toContain('Profil Prestataire');
    });
  });

  describe('searchQuestions', () => {
    it('should find questions containing search term', () => {
      const results = service.searchQuestions('compte');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(q => q.question.toLowerCase().includes('compte'))).toBeTruthy();
    });

    it('should find questions containing answer term', () => {
      const results = service.searchQuestions('formulaire');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(q => q.reponse.toLowerCase().includes('formulaire'))).toBeTruthy();
    });

    it('should return empty array for non-existent term', () => {
      const results = service.searchQuestions('termeinexistant');
      expect(results).toEqual([]);
    });
  });

  describe('getQuestionById', () => {
    it('should return question for valid ID', () => {
      const question = service.getQuestionById('presta-inscription-1');
      expect(question).toBeTruthy();
      expect(question?.question).toBe('Comment créer mon compte prestataire ?');
    });

    it('should return undefined for invalid ID', () => {
      const question = service.getQuestionById('invalid-id');
      expect(question).toBeUndefined();
    });
  });

  describe('getTotalQuestions', () => {
    it('should return correct total count', () => {
      const total = service.getTotalQuestions();
      expect(total).toBe(17); // 17 questions au total
    });
  });

  describe('Question structure', () => {
    it('should have valid question structure', () => {
      const questions = service.getAllQuestions();
      questions.forEach(question => {
        expect(question.id).toBeTruthy();
        expect(question.question).toBeTruthy();
        expect(question.reponse).toBeTruthy();
        expect(question.categorie).toBeTruthy();
        expect(typeof question.ordre).toBe('number');
      });
    });
  });
});
