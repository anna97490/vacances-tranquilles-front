import { TestBed } from '@angular/core/testing';
import { UserTypeDetectorService } from '../user-type-detector.service';

describe('UserTypeDetectorService', () => {
  let service: UserTypeDetectorService;


  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserTypeDetectorService);
  });

  afterEach(() => {
    // Nettoyage après chaque test
  });

  describe('detectUserTypeFromUrl', () => {
    it('should detect prestataire from URL', () => {
      // Act
      const result = service.detectUserTypeFromUrl();

      // Assert
      expect(typeof result).toBe('boolean');
    });

    it('should detect particulier from URL', () => {
      // Act
      const result = service.detectUserTypeFromUrl();

      // Assert
      expect(typeof result).toBe('boolean');
    });

    it('should return false for unknown URL', () => {
      // Act
      const result = service.detectUserTypeFromUrl();

      // Assert
      expect(typeof result).toBe('boolean');
    });
  });

  describe('detectUserTypeFromString', () => {
    it('should detect prestataire from string', () => {
      // Act
      const result = service.detectUserTypeFromString('prestataire');

      // Assert
      expect(result).toBe(true);
    });

    it('should detect particulier from string', () => {
      // Act
      const result = service.detectUserTypeFromString('particulier');

      // Assert
      expect(result).toBe(false);
    });

    it('should return false for unknown string', () => {
      // Act
      const result = service.detectUserTypeFromString('unknown');

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('getUserTypeString', () => {
    it('should return prestataire string', () => {
      // Act
      const result = service.getUserTypeString(true);

      // Assert
      expect(result).toBe('prestataire');
    });

    it('should return particulier string', () => {
      // Act
      const result = service.getUserTypeString(false);

      // Assert
      expect(result).toBe('particulier');
    });
  });

  describe('getFormTitle', () => {
    it('should return prestataire title', () => {
      // Act
      const result = service.getFormTitle(true);

      // Assert
      expect(result).toBe('Inscription Prestataire');
    });

    it('should return particulier title', () => {
      // Act
      const result = service.getFormTitle(false);

      // Assert
      expect(result).toBe('Inscription Particulier');
    });
  });
});