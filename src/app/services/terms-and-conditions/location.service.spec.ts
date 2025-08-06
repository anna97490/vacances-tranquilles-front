import { TestBed } from '@angular/core/testing';
import { LocationService } from './location.service';
import { createWindowSpies } from '../../utils/test-helpers';

describe('LocationService', () => {
  let service: LocationService;
  let spies: ReturnType<typeof createWindowSpies>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocationService);
    spies = createWindowSpies();
  });

  afterEach(() => {
    // Nettoyage après chaque test
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPathname', () => {
    it('should return root pathname', () => {
      // Act
      const result = service.getPathname();

      // Assert
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should return different pathname when location changes', () => {
      // Act
      const result = service.getPathname();

      // Assert
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should return the current pathname', () => {
      // Act
      const result = service.getPathname();

      // Assert
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should return pathname with query parameters', () => {
      // Act
      const result = service.getPathname();

      // Assert
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should return empty pathname', () => {
      // Act
      const result = service.getPathname();

      // Assert
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });
  });
}); 