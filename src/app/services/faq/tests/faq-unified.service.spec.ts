import { TestBed } from '@angular/core/testing';
import { FAQUnifiedService } from '../faq-unified.service';
import { FAQGeneralService } from '../faq-general.service';
import { FAQPrestataireService } from '../faq-prestataire.service';
import { FAQParticulierService } from '../faq-particulier.service';

describe('FAQUnifiedService', () => {
  let service: FAQUnifiedService;
  let mockGeneralService: jasmine.SpyObj<FAQGeneralService>;
  let mockPrestataireService: jasmine.SpyObj<FAQPrestataireService>;
  let mockParticulierService: jasmine.SpyObj<FAQParticulierService>;

  const mockGeneralFAQ = [
    {
      question: "Question générale 1",
      reponse: "Réponse générale 1",
      categorie: "general",
      type: "general" as const,
      source: "general"
    },
    {
      question: "Question générale 2",
      reponse: "Réponse générale 2",
      categorie: "services",
      type: "general" as const,
      source: "general"
    }
  ];

  const mockPrestataireFAQ = [
    {
      question: "Question prestataire 1",
      reponse: "Réponse prestataire 1",
      categorie: "inscription",
      type: "prestataire" as const,
      source: "prestataire"
    },
    {
      question: "Question prestataire 2",
      reponse: "Réponse prestataire 2",
      categorie: "connexion",
      type: "prestataire" as const,
      source: "prestataire"
    }
  ];

  const mockParticulierFAQ = [
    {
      question: "Question particulier 1",
      reponse: "Réponse particulier 1",
      categorie: "inscription",
      type: "particulier" as const,
      source: "particulier"
    },
    {
      question: "Question particulier 2",
      reponse: "Réponse particulier 2",
      categorie: "connexion",
      type: "particulier" as const,
      source: "particulier"
    }
  ];

  beforeEach(() => {
    mockGeneralService = jasmine.createSpyObj('FAQGeneralService', ['getAllFAQ', 'getCategories']);
    mockPrestataireService = jasmine.createSpyObj('FAQPrestataireService', ['getAllFAQ', 'getCategories', 'getFAQByPriority']);
    mockParticulierService = jasmine.createSpyObj('FAQParticulierService', ['getAllFAQ', 'getCategories', 'getMostFrequentFAQ']);

    mockGeneralService.getAllFAQ.and.returnValue(mockGeneralFAQ);
    mockPrestataireService.getAllFAQ.and.returnValue(mockPrestataireFAQ);
    mockParticulierService.getAllFAQ.and.returnValue(mockParticulierFAQ);

    mockGeneralService.getCategories.and.returnValue(['general', 'services']);
    mockPrestataireService.getCategories.and.returnValue(['inscription', 'connexion']);
    mockParticulierService.getCategories.and.returnValue(['inscription', 'connexion']);

    // Ajouter les méthodes manquantes
    mockPrestataireService.getFAQByPriority.and.returnValue(mockPrestataireFAQ);
    mockParticulierService.getMostFrequentFAQ.and.returnValue(mockParticulierFAQ);

    TestBed.configureTestingModule({
      providers: [
        FAQUnifiedService,
        { provide: FAQGeneralService, useValue: mockGeneralService },
        { provide: FAQPrestataireService, useValue: mockPrestataireService },
        { provide: FAQParticulierService, useValue: mockParticulierService }
      ]
    });
    service = TestBed.inject(FAQUnifiedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all FAQ items from all services', () => {
    const allFAQ = service.getAllFAQ();
    expect(allFAQ).toBeDefined();
    expect(Array.isArray(allFAQ)).toBeTrue();
    expect(allFAQ.length).toBe(6); // 2 + 2 + 2
    expect(mockGeneralService.getAllFAQ).toHaveBeenCalled();
    expect(mockPrestataireService.getAllFAQ).toHaveBeenCalled();
    expect(mockParticulierService.getAllFAQ).toHaveBeenCalled();
  });

  it('should return FAQ items by type', () => {
    const generalFAQ = service.getFAQByType('general');
    expect(generalFAQ).toBeDefined();
    expect(Array.isArray(generalFAQ)).toBeTrue();
    expect(generalFAQ.length).toBe(2);
    expect(generalFAQ.every(item => item.type === 'general')).toBeTrue();

    const prestataireFAQ = service.getFAQByType('prestataire');
    expect(prestataireFAQ).toBeDefined();
    expect(Array.isArray(prestataireFAQ)).toBeTrue();
    expect(prestataireFAQ.length).toBe(2);
    expect(prestataireFAQ.every(item => item.type === 'prestataire')).toBeTrue();

    const particulierFAQ = service.getFAQByType('particulier');
    expect(particulierFAQ).toBeDefined();
    expect(Array.isArray(particulierFAQ)).toBeTrue();
    expect(particulierFAQ.length).toBe(2);
    expect(particulierFAQ.every(item => item.type === 'particulier')).toBeTrue();
  });

  it('should search across all FAQ items', () => {
    const searchResults = service.searchAllFAQ('inscription');
    expect(searchResults).toBeDefined();
    expect(Array.isArray(searchResults)).toBeTrue();
    // La recherche doit trouver des résultats car 'inscription' est présent dans les catégories
    expect(searchResults.length).toBeGreaterThan(0);
    expect(searchResults.every(item => 
      item.question.toLowerCase().includes('inscription') || 
      item.reponse.toLowerCase().includes('inscription') ||
      item.categorie.toLowerCase().includes('inscription')
    )).toBeTrue();
  });

  it('should return FAQ items by category', () => {
    const inscriptionFAQ = service.getFAQByCategory('inscription');
    expect(inscriptionFAQ).toBeDefined();
    expect(Array.isArray(inscriptionFAQ)).toBeTrue();
    expect(inscriptionFAQ.every(item => item.categorie === 'inscription')).toBeTrue();
  });

  it('should return all categories from all services', () => {
    const allCategories = service.getAllCategories();
    expect(allCategories).toBeDefined();
    expect(Array.isArray(allCategories)).toBeTrue();
    expect(allCategories.length).toBeGreaterThan(0);
    expect(allCategories).toContain('general');
    expect(allCategories).toContain('services');
    expect(allCategories).toContain('inscription');
    expect(allCategories).toContain('connexion');
  });

  it('should return popular FAQ items', () => {
    const popularFAQ = service.getPopularFAQ();
    expect(popularFAQ).toBeDefined();
    expect(Array.isArray(popularFAQ)).toBeTrue();
    expect(popularFAQ.length).toBeGreaterThan(0);
  });

  it('should return FAQ by priority for each type', () => {
    const generalPriority = service.getFAQByPriority('general');
    expect(generalPriority).toBeDefined();
    expect(Array.isArray(generalPriority)).toBeTrue();

    const prestatairePriority = service.getFAQByPriority('prestataire');
    expect(prestatairePriority).toBeDefined();
    expect(Array.isArray(prestatairePriority)).toBeTrue();

    const particulierPriority = service.getFAQByPriority('particulier');
    expect(particulierPriority).toBeDefined();
    expect(Array.isArray(particulierPriority)).toBeTrue();
  });

  it('should return most frequent FAQ items', () => {
    const frequentFAQ = service.getMostFrequentFAQ();
    expect(frequentFAQ).toBeDefined();
    expect(Array.isArray(frequentFAQ)).toBeTrue();
    expect(frequentFAQ.length).toBeGreaterThan(0);
  });

  it('should return FAQ statistics', () => {
    const stats = service.getFAQStats();
    expect(stats).toBeDefined();
    expect(stats.total).toBe(6);
    expect(stats.general).toBe(2);
    expect(stats.prestataire).toBe(2);
    expect(stats.particulier).toBe(2);
    expect(stats.categories).toBeGreaterThan(0);
  });

  it('should filter FAQ items correctly', () => {
    const filteredByType = service.filterFAQ({ type: 'general' });
    expect(filteredByType).toBeDefined();
    expect(Array.isArray(filteredByType)).toBeTrue();
    expect(filteredByType.every(item => item.type === 'general')).toBeTrue();

    const filteredByCategory = service.filterFAQ({ categorie: 'inscription' });
    expect(filteredByCategory).toBeDefined();
    expect(Array.isArray(filteredByCategory)).toBeTrue();
    expect(filteredByCategory.every(item => item.categorie === 'inscription')).toBeTrue();

    // Utiliser 'inscription' qui est présent dans les catégories des données de test
    const filteredBySearch = service.filterFAQ({ search: 'inscription' });
    expect(filteredBySearch).toBeDefined();
    expect(Array.isArray(filteredBySearch)).toBeTrue();
    expect(filteredBySearch.length).toBeGreaterThan(0);
  });

  it('should handle empty filters', () => {
    const allFAQ = service.filterFAQ({});
    expect(allFAQ).toBeDefined();
    expect(Array.isArray(allFAQ)).toBeTrue();
    expect(allFAQ.length).toBe(6);
  });

  it('should combine multiple filters', () => {
    const filtered = service.filterFAQ({ 
      type: 'prestataire', 
      categorie: 'inscription' 
    });
    expect(filtered).toBeDefined();
    expect(Array.isArray(filtered)).toBeTrue();
    expect(filtered.every(item => 
      item.type === 'prestataire' && item.categorie === 'inscription'
    )).toBeTrue();
  });
});
