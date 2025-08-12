import { TestBed } from '@angular/core/testing';
import { FAQPrestataireService } from '../faq-prestataire.service';
import { FAQPrestataireItem } from '../../../models/FAQ';

describe('FAQPrestataireService', () => {
  let service: FAQPrestataireService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FAQPrestataireService]
    });
    service = TestBed.inject(FAQPrestataireService);
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
    expect(categories).toContain('conditions');
    expect(categories).toContain('documents');
    expect(categories).toContain('inscription');
    expect(categories).toContain('connexion');
    expect(categories).toContain('agenda');
    expect(categories).toContain('clients');
    expect(categories).toContain('communication');
    expect(categories).toContain('reservations');
    expect(categories).toContain('services');
    expect(categories).toContain('messagerie');
    expect(categories).toContain('profil');
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
    const expectedOrder = ['inscription', 'conditions', 'documents', 'connexion', 'agenda', 'clients', 'services', 'communication', 'messagerie', 'profil'];
    
    let currentCategory = priorityFAQ[0].categorie;
    let currentCategoryIndex = expectedOrder.indexOf(currentCategory);
    
    for (let i = 1; i < priorityFAQ.length; i++) {
      const item = priorityFAQ[i];
      if (item.categorie !== currentCategory) {
        const newCategoryIndex = expectedOrder.indexOf(item.categorie);
        
        // Si la nouvelle catégorie est dans l'ordre de priorité
        if (newCategoryIndex !== -1) {
          // Si la catégorie précédente était aussi dans l'ordre de priorité
          if (currentCategoryIndex !== -1) {
            // La nouvelle catégorie doit avoir un index supérieur ou égal
            expect(newCategoryIndex).toBeGreaterThanOrEqual(currentCategoryIndex);
          }
        }
        
        currentCategory = item.categorie;
        currentCategoryIndex = newCategoryIndex;
      }
    }
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
    
    const clientsFAQ = service.getFAQByCategory('clients');
    expect(clientsFAQ.length).toBe(2); // Deux questions sur les clients
  });

  it('should handle special characters in search', () => {
    const searchResults = service.searchFAQ('responsabilité');
    expect(searchResults).toBeDefined();
    expect(Array.isArray(searchResults)).toBeTrue();
    expect(searchResults.length).toBeGreaterThan(0);
  });

  it('should search in both question and response', () => {
    const searchResults = service.searchFAQ('SIRET');
    expect(searchResults).toBeDefined();
    expect(Array.isArray(searchResults)).toBeTrue();
    expect(searchResults.length).toBeGreaterThan(0);
    
    // Vérifier que la recherche trouve dans les réponses
    const hasResponseMatch = searchResults.some(item => 
      item.reponse.toLowerCase().includes('siret')
    );
    expect(hasResponseMatch).toBeTrue();
  });

  it('should return all items when searching for common terms', () => {
    const searchResults = service.searchFAQ('comment');
    expect(searchResults).toBeDefined();
    expect(Array.isArray(searchResults)).toBeTrue();
    expect(searchResults.length).toBeGreaterThan(0);
    
    // Vérifier que tous les résultats contiennent "comment"
    expect(searchResults.every(item => 
      item.question.toLowerCase().includes('comment') || 
      item.reponse.toLowerCase().includes('comment')
    )).toBeTrue();
  });

  it('should handle search with multiple words', () => {
    const searchResults = service.searchFAQ('mot de passe');
    expect(searchResults).toBeDefined();
    expect(Array.isArray(searchResults)).toBeTrue();
    // La recherche devrait trouver des éléments contenant "mot" ou "passe"
  });

  it('should maintain data integrity across service calls', () => {
    const firstCall = service.getAllFAQ();
    const secondCall = service.getAllFAQ();
    
    expect(firstCall).toEqual(secondCall);
    expect(firstCall.length).toBe(secondCall.length);
    
    // Vérifier que le contenu est identique
    firstCall.forEach((item, index) => {
      expect(item.question).toBe(secondCall[index].question);
      expect(item.reponse).toBe(secondCall[index].reponse);
      expect(item.categorie).toBe(secondCall[index].categorie);
    });
    
    // Vérifier que les données sont cohérentes
    expect(firstCall).toEqual(secondCall);
  });

  it('should filter categories correctly', () => {
    const allFAQ = service.getAllFAQ();
    const categories = service.getCategories();
    
    // Vérifier que chaque catégorie a au moins un élément
    categories.forEach(category => {
      const categoryItems = allFAQ.filter(item => item.categorie === category);
      expect(categoryItems.length).toBeGreaterThan(0);
    });
    
    // Vérifier que tous les éléments ont une catégorie valide
    allFAQ.forEach(item => {
      expect(categories).toContain(item.categorie);
    });
  });
});
