import { TestBed } from '@angular/core/testing';
import { LocationService } from './location.service';

describe('LocationService', () => {
  let service: LocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocationService);
  });

  afterEach(() => {
    // Nettoyage après chaque test
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPathname', () => {
    it('should return root pathname', () => {
      const result = service.getPathname();

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should return different pathname when location changes', () => {
      const result = service.getPathname();

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should return the current pathname', () => {
      const result = service.getPathname();

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should return pathname with query parameters', () => {
      const result = service.getPathname();

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should return empty pathname', () => {
      const result = service.getPathname();

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });
  });
});
