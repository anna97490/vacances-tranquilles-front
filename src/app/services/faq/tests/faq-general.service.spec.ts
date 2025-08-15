import { TestBed } from '@angular/core/testing';
import { FAQGeneralService } from '../faq-general.service';

describe('FAQGeneralService', () => {
  let service: FAQGeneralService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FAQGeneralService]
    });
    service = TestBed.inject(FAQGeneralService);
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
    const generalFAQ = service.getFAQByCategory('general');
    expect(generalFAQ).toBeDefined();
    expect(Array.isArray(generalFAQ)).toBeTrue();
    expect(generalFAQ.every(item => item.categorie === 'general')).toBeTrue();
  });

  it('should return empty array for non-existent category', () => {
    const nonExistentFAQ = service.getFAQByCategory('non-existent');
    expect(nonExistentFAQ).toBeDefined();
    expect(Array.isArray(nonExistentFAQ)).toBeTrue();
    expect(nonExistentFAQ.length).toBe(0);
  });

  it('should search FAQ items correctly', () => {
    const searchResults = service.searchFAQ('vacances');
    expect(searchResults).toBeDefined();
    expect(Array.isArray(searchResults)).toBeTrue();
    expect(searchResults.every(item => 
      item.question.toLowerCase().includes('vacances') || 
      item.reponse.toLowerCase().includes('vacances')
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
    expect(categories).toContain('general');
    expect(categories).toContain('services');
    expect(categories).toContain('tarifs');
    expect(categories).toContain('assistance');
    expect(categories).toContain('reservation');
    expect(categories).toContain('annulation');
    expect(categories).toContain('evaluation');
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
});
