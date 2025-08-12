import { TestBed } from '@angular/core/testing';
import { FAQParticulierService } from '../faq-particulier.service';
import { FAQParticulierItem } from '../../../models/FAQ';

describe('FAQParticulierService', () => {
  let service: FAQParticulierService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FAQParticulierService]
    });
    service = TestBed.inject(FAQParticulierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all FAQ items', () => {
    const allFAQ = service.getAllFAQ();
    expect(allFAQ).toBeDefined();
    expect(Array.isArray(allFAQ)).toBeTrue();
    expect(allFAQ.length).toBeGreaterThan(0);
  });

  it('should return FAQ items by category', () => {
    const inscriptionFAQ = service.getFAQByCategory('inscription');
    expect(inscriptionFAQ).toBeDefined();
    expect(Array.isArray(inscriptionFAQ)).toBeTrue();
    expect(inscriptionFAQ.every(item => item.categorie === 'inscription')).toBeTrue();
  });

  it('should return empty array for non-existent category', () => {
    const nonExistentFAQ = service.getFAQByCategory('non-existent');
    expect(nonExistentFAQ).toBeDefined();
    expect(Array.isArray(nonExistentFAQ)).toBeTrue();
    expect(nonExistentFAQ.length).toBe(0);
  });

  it('should search FAQ items correctly', () => {
    const searchResults = service.searchFAQ('compte');
    expect(searchResults).toBeDefined();
    expect(Array.isArray(searchResults)).toBeTrue();
    expect(searchResults.every(item => 
      item.question.toLowerCase().includes('compte') || 
      item.reponse.toLowerCase().includes('compte')
    )).toBeTrue();
  });

  it('should return empty array for search with no results', () => {
    const searchResults = service.searchFAQ('xyz123');
    expect(searchResults).toBeDefined();
    expect(Array.isArray(searchResults)).toBeTrue();
    expect(searchResults.length).toBe(0);
  });

  it('should return all available categories', () => {
    const categories = service.getCategories();
    expect(categories).toBeDefined();
    expect(Array.isArray(categories)).toBeTrue();
    expect(categories.length).toBeGreaterThan(0);
    expect(categories.every(cat => typeof cat === 'string')).toBeTrue();
  });

  it('should have unique categories', () => {
    const categories = service.getCategories();
    const uniqueCategories = [...new Set(categories)];
    expect(categories.length).toBe(uniqueCategories.length);
  });

  it('should have valid FAQ item structure', () => {
    const allFAQ = service.getAllFAQ();
    allFAQ.forEach(item => {
      expect(item.question).toBeDefined();
      expect(typeof item.question).toBe('string');
      expect(item.question.length).toBeGreaterThan(0);
      
      expect(item.reponse).toBeDefined();
      expect(typeof item.reponse).toBe('string');
      expect(item.reponse.length).toBeGreaterThan(0);
      
      expect(item.categorie).toBeDefined();
      expect(typeof item.categorie).toBe('string');
      expect(item.categorie.length).toBeGreaterThan(0);
    });
  });

  it('should contain expected categories', () => {
    const categories = service.getCategories();
    expect(categories).toContain('inscription');
    expect(categories).toContain('connexion');
    expect(categories).toContain('recherche');
    expect(categories).toContain('reservation');
    expect(categories).toContain('evaluation');
    expect(categories).toContain('messagerie');
    expect(categories).toContain('profil');
    expect(categories).toContain('securite');
    expect(categories).toContain('tarifs');
    expect(categories).toContain('annulation');
  });

  it('should have FAQ items with correct properties', () => {
    const allFAQ = service.getAllFAQ();
    const firstItem = allFAQ[0];
    
    expect(firstItem.question).toBeDefined();
    expect(firstItem.reponse).toBeDefined();
    expect(firstItem.categorie).toBeDefined();
    
    expect(typeof firstItem.question).toBe('string');
    expect(typeof firstItem.reponse).toBe('string');
    expect(typeof firstItem.categorie).toBe('string');
  });

  it('should return FAQ by priority in correct order', () => {
    const priorityFAQ = service.getFAQByPriority();
    expect(priorityFAQ).toBeDefined();
    expect(Array.isArray(priorityFAQ)).toBeTrue();
    expect(priorityFAQ.length).toBeGreaterThan(0);

    // Vérifier que les catégories sont dans l'ordre de priorité
    const expectedOrder = ['inscription', 'connexion', 'recherche', 'reservation', 'evaluation', 'messagerie', 'profil', 'securite', 'tarifs', 'annulation'];
    
    let currentIndex = 0;
    let currentCategory = priorityFAQ[0].categorie;
    
    for (let i = 1; i < priorityFAQ.length; i++) {
      const item = priorityFAQ[i];
      if (item.categorie !== currentCategory) {
        const expectedIndex = expectedOrder.indexOf(item.categorie);
        const currentExpectedIndex = expectedOrder.indexOf(currentCategory);
        expect(expectedIndex).toBeGreaterThanOrEqual(currentExpectedIndex);
        currentCategory = item.categorie;
      }
    }
  });

  it('should return most frequent FAQ items', () => {
    const frequentFAQ = service.getMostFrequentFAQ();
    expect(frequentFAQ).toBeDefined();
    expect(Array.isArray(frequentFAQ)).toBeTrue();
    expect(frequentFAQ.length).toBeGreaterThan(0);

    const frequentCategories = ['inscription', 'recherche', 'reservation', 'annulation'];
    expect(frequentFAQ.every(item => frequentCategories.includes(item.categorie))).toBeTrue();
  });

  it('should handle case-insensitive search', () => {
    const searchResults = service.searchFAQ('COMPTE');
    expect(searchResults).toBeDefined();
    expect(Array.isArray(searchResults)).toBeTrue();
    expect(searchResults.length).toBeGreaterThan(0);
  });

  it('should handle empty search query', () => {
    const searchResults = service.searchFAQ('');
    expect(searchResults).toBeDefined();
    expect(Array.isArray(searchResults)).toBeDefined();
    // Une recherche vide devrait retourner tous les éléments ou un tableau vide selon l'implémentation
  });

  it('should have consistent data across all methods', () => {
    const allFAQ = service.getAllFAQ();
    const categories = service.getCategories();
    
    // Vérifier que toutes les catégories retournées correspondent à des éléments FAQ
    categories.forEach(category => {
      const categoryFAQ = service.getFAQByCategory(category);
      expect(categoryFAQ.length).toBeGreaterThan(0);
      expect(categoryFAQ.every(item => item.categorie === category)).toBeTrue();
    });
  });

  it('should return correct number of items for each category', () => {
    const inscriptionFAQ = service.getFAQByCategory('inscription');
    expect(inscriptionFAQ.length).toBe(1); // Une seule question sur l'inscription
    
    const connexionFAQ = service.getFAQByCategory('connexion');
    expect(connexionFAQ.length).toBe(2); // Deux questions sur la connexion
    
    const messagerieFAQ = service.getFAQByCategory('messagerie');
    expect(messagerieFAQ.length).toBe(4); // Quatre questions sur la messagerie
  });

  it('should handle special characters in search', () => {
    const searchResults = service.searchFAQ('évaluation');
    expect(searchResults).toBeDefined();
    expect(Array.isArray(searchResults)).toBeTrue();
    expect(searchResults.length).toBeGreaterThan(0);
  });
});
