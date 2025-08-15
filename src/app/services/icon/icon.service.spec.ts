import { TestBed } from '@angular/core/testing';
import { IconService } from './icon.service';
import { ServiceCategory } from '../../models/Service';

describe('IconService', () => {
  let service: IconService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IconService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getIcon', () => {
    it('should return correct icon for HOME category', () => {
      const icon = service.getIcon(ServiceCategory.HOME);
      expect(icon).toBe('home');
    });

    it('should return correct icon for OUTDOOR category', () => {
      const icon = service.getIcon(ServiceCategory.OUTDOOR);
      expect(icon).toBe('park');
    });

    it('should return correct icon for REPAIRS category', () => {
      const icon = service.getIcon(ServiceCategory.REPAIRS);
      expect(icon).toBe('construction');
    });

    it('should return correct icon for SHOPPING category', () => {
      const icon = service.getIcon(ServiceCategory.SHOPPING);
      expect(icon).toBe('shopping_cart');
    });

    it('should return correct icon for ANIMALS category', () => {
      const icon = service.getIcon(ServiceCategory.ANIMALS);
      expect(icon).toBe('pets');
    });

    it('should return fallback icon for unknown category', () => {
      // Test avec une valeur qui n'existe pas dans l'enum
      const icon = service.getIcon('UNKNOWN_CATEGORY' as ServiceCategory);
      expect(icon).toBe('miscellaneous_services');
    });
  });

  describe('getAvailableCategories', () => {
    it('should return all ServiceCategory values', () => {
      const categories = service.getAvailableCategories();
      
      expect(categories).toContain(ServiceCategory.HOME);
      expect(categories).toContain(ServiceCategory.OUTDOOR);
      expect(categories).toContain(ServiceCategory.REPAIRS);
      expect(categories).toContain(ServiceCategory.SHOPPING);
      expect(categories).toContain(ServiceCategory.ANIMALS);
    });

    it('should return exactly 5 categories', () => {
      const categories = service.getAvailableCategories();
      expect(categories.length).toBe(5);
    });

    it('should return array of strings', () => {
      const categories = service.getAvailableCategories();
      categories.forEach(category => {
        expect(typeof category).toBe('string');
      });
    });

    it('should return unique categories', () => {
      const categories = service.getAvailableCategories();
      const uniqueCategories = new Set(categories);
      expect(uniqueCategories.size).toBe(categories.length);
    });
  });

  describe('Integration tests', () => {
    it('should return valid icons for all available categories', () => {
      const categories = service.getAvailableCategories();
      
      categories.forEach(category => {
        const icon = service.getIcon(category);
        expect(icon).toBeTruthy();
        expect(typeof icon).toBe('string');
        expect(icon.length).toBeGreaterThan(0);
      });
    });

    it('should have consistent mapping between categories and icons', () => {
      // Test que chaque catégorie retourne toujours la même icône
      const category = ServiceCategory.HOME;
      const icon1 = service.getIcon(category);
      const icon2 = service.getIcon(category);
      const icon3 = service.getIcon(category);
      
      expect(icon1).toBe(icon2);
      expect(icon2).toBe(icon3);
      expect(icon1).toBe('home');
    });
  });

  describe('Edge cases', () => {
    it('should handle null/undefined category gracefully', () => {
      // Test avec des valeurs problématiques
      const icon1 = service.getIcon(null as any);
      const icon2 = service.getIcon(undefined as any);
      
      expect(icon1).toBe('miscellaneous_services');
      expect(icon2).toBe('miscellaneous_services');
    });

    it('should handle empty string category', () => {
      const icon = service.getIcon('' as ServiceCategory);
      expect(icon).toBe('miscellaneous_services');
    });
  });
});
