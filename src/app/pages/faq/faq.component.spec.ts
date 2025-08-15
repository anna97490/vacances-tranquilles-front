import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FAQComponent } from './faq.component';
import { FAQUnifiedService } from '../../services/faq/faq-unified.service';
import { FAQItemWithState, FAQItemFactory } from '../../models/FAQ';
import { of } from 'rxjs';

describe('FAQComponent', () => {
  let component: FAQComponent;
  let fixture: ComponentFixture<FAQComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockFAQUnifiedService: jasmine.SpyObj<FAQUnifiedService>;

  const mockFAQItems = [
    {
      question: 'Question test 1',
      reponse: 'Réponse test 1',
      categorie: 'general',
      tags: ['test', 'general'],
      type: 'general' as const,
      source: 'Général'
    },
    {
      question: 'Question test 2',
      reponse: 'Réponse test 2',
      categorie: 'particulier',
      tags: ['test', 'particulier'],
      type: 'particulier' as const,
      source: 'Particulier'
    },
    {
      question: 'Question test 3',
      reponse: 'Réponse test 3',
      categorie: 'prestataire',
      tags: ['test', 'prestataire'],
      type: 'prestataire' as const,
      source: 'Prestataire'
    }
  ];

  const mockFAQItemsWithState = mockFAQItems.map(item => FAQItemFactory.createFAQItemWithState(item));

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate'], {
      root: {
        url: '/',
        toString: () => '/'
      }
    });
    mockFAQUnifiedService = jasmine.createSpyObj('FAQUnifiedService', ['getAllFAQ']);

    // Configuration du mock pour getAllFAQ
    mockFAQUnifiedService.getAllFAQ.and.returnValue(mockFAQItems);

    await TestBed.configureTestingModule({
      imports: [FAQComponent, NoopAnimationsModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: FAQUnifiedService, useValue: mockFAQUnifiedService },
        { provide: ActivatedRoute, useValue: {
          params: of({}),
          queryParams: of({}),
          snapshot: {},
        } },
        // Configuration du Router pour les RouterLink
        {
          provide: Router,
          useValue: {
            ...mockRouter,
            events: of(),
            navigate: mockRouter.navigate,
            createUrlTree: () => ({ toString: () => '' }),
            serializeUrl: () => ''
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FAQComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.selectedCategory).toBe('all');
    expect(component.searchQuery).toBe('');
  });

  it('should load FAQ items on initialization', () => {
    expect(mockFAQUnifiedService.getAllFAQ).toHaveBeenCalled();
    expect(component.faqItems).toEqual(mockFAQItemsWithState);
    expect(component.filteredFAQItems).toEqual(mockFAQItemsWithState);
  });

  it('should extract categories correctly', () => {
    expect(component.categories).toContain('all');
    expect(component.categories).toContain('general');
    expect(component.categories).toContain('particulier');
    expect(component.categories).toContain('prestataire');
    expect(component.categories.length).toBe(4); // 'all' + 3 categories
  });

  it('should filter by category correctly', () => {
    // Test avec une catégorie spécifique
    component.filterByCategory('general');
    expect(component.selectedCategory).toBe('general');
    expect(component.filteredFAQItems.length).toBe(1);
    expect(component.filteredFAQItems[0].categorie).toBe('general');

    // Test avec 'all'
    component.filterByCategory('all');
    expect(component.selectedCategory).toBe('all');
    expect(component.filteredFAQItems.length).toBe(3);
  });

  it('should filter by category when event object is passed', () => {
    const mockEvent = { value: 'particulier' };
    component.filterByCategory(mockEvent);
    expect(component.selectedCategory).toBe('particulier');
    expect(component.filteredFAQItems.length).toBe(1);
    expect(component.filteredFAQItems[0].categorie).toBe('particulier');
  });

  it('should search FAQ correctly', () => {
    // Recherche par question
    component.resetFilters();
    component.searchFAQ('Question test 1');
    expect(component.searchQuery).toBe('Question test 1');
    expect(component.filteredFAQItems.length).toBe(1);
    expect(component.filteredFAQItems[0].question).toBe('Question test 1');

    // Recherche par réponse
    component.resetFilters();
    component.searchFAQ('Réponse test 2');
    expect(component.filteredFAQItems.length).toBe(1);
    expect(component.filteredFAQItems[0].reponse).toBe('Réponse test 2');

    // Recherche insensible à la casse
    component.resetFilters();
    component.searchFAQ('question test');
    expect(component.filteredFAQItems.length).toBe(3);

    // Recherche avec espaces
    component.resetFilters();
    component.searchFAQ('  test  ');
    expect(component.filteredFAQItems.length).toBe(0);
  });

  it('should search FAQ with question test query', () => {
    component.resetFilters();
    component.searchFAQ('question test');
    expect(component.filteredFAQItems.length).toBe(3);
  });

  it('should apply both category and search filters', () => {
    // D'abord filtrer par catégorie
    component.filterByCategory('general');
    expect(component.filteredFAQItems.length).toBe(1);

    // Puis ajouter une recherche
    component.searchFAQ('test');
    expect(component.filteredFAQItems.length).toBe(1);
    expect(component.filteredFAQItems[0].categorie).toBe('general');
  });

  it('should handle empty search query', () => {
    component.searchFAQ('');
    expect(component.searchQuery).toBe('');
    expect(component.filteredFAQItems.length).toBe(3);
  });

  it('should handle search query with only spaces', () => {
    component.searchFAQ('   ');
    expect(component.searchQuery).toBe('   ');
    expect(component.filteredFAQItems.length).toBe(3);
  });

  it('should reset filters correctly', () => {
    // D'abord appliquer des filtres
    component.selectedCategory = 'test-category';
    component.searchQuery = 'test-query';
    component.filteredFAQItems = []; // Simuler un filtrage

    // Réinitialiser
    component.resetFilters();
    
    expect(component.selectedCategory).toBe('all');
    expect(component.searchQuery).toBe('');
    expect(component.filteredFAQItems).toEqual(component.faqItems);
  });

  it('should navigate to contact form when goToContactForm is called', () => {
    component.goToContactForm();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/contact']);
  });

  it('should track FAQ items by question length', () => {
    const result = component.trackByFn(0, component.faqItems[0]);
    expect(typeof result).toBe('number');
    expect(result).toBe(component.faqItems[0].question.length);
  });

  it('should handle lifecycle hooks correctly', () => {
    // ngOnInit est appelé automatiquement par fixture.detectChanges()
    expect(mockFAQUnifiedService.getAllFAQ).toHaveBeenCalled();
    
    // ngOnDestroy ne fait rien de spécial, mais on peut vérifier qu'il existe
    expect(component.ngOnDestroy).toBeDefined();
  });

  it('should maintain original faqItems when filtering', () => {
    const originalLength = component.faqItems.length;
    
    // Appliquer des filtres
    component.filterByCategory('general');
    component.searchFAQ('test');
    
    // Vérifier que faqItems n'a pas été modifié
    expect(component.faqItems.length).toBe(originalLength);
    expect(component.faqItems).toEqual(mockFAQItemsWithState);
  });

  it('should handle filtering with no results', () => {
    // Recherche qui ne correspond à rien
    component.searchFAQ('xyz123nonexistent');
    expect(component.filteredFAQItems.length).toBe(0);
  });

  it('should handle category filtering with no results', () => {
    // Catégorie qui n'existe pas
    component.filterByCategory('nonexistent-category');
    expect(component.filteredFAQItems.length).toBe(0);
  });

  it('should handle combined filters with no results', () => {
    // Combinaison qui ne donne aucun résultat
    component.filterByCategory('general');
    component.searchFAQ('particulier');
    expect(component.filteredFAQItems.length).toBe(0);
  });

  describe('Edge cases', () => {
    it('should handle empty FAQ items array', () => {
      mockFAQUnifiedService.getAllFAQ.and.returnValue([]);
      component.loadFAQ();
      component.extractCategories();
      
      expect(component.faqItems).toEqual([]);
      expect(component.filteredFAQItems).toEqual([]);
      expect(component.categories).toEqual(['all']);
    });

    it('should handle FAQ items with duplicate categories', () => {
      const duplicateItems = [
        { question: 'Q1', reponse: 'R1', categorie: 'general', tags: [], type: 'general' as const, source: 'Général' },
        { question: 'Q2', reponse: 'R2', categorie: 'general', tags: [], type: 'general' as const, source: 'Général' }
      ];
      
      mockFAQUnifiedService.getAllFAQ.and.returnValue(duplicateItems);
      component.loadFAQ();
      component.extractCategories();
      
      expect(component.categories).toEqual(['all', 'general']);
      expect(component.categories.length).toBe(2);
    });

    it('should handle very long search queries', () => {
      const longQuery = 'a'.repeat(1000);
      component.searchFAQ(longQuery);
      expect(component.searchQuery).toBe(longQuery);
      // Le composant devrait gérer cela sans erreur
    });
  });
});
