import { TestBed } from '@angular/core/testing';
import { UserTypeDetectorService } from '../user-type-detector.service';

describe('UserTypeDetectorService', () => {
  let service: UserTypeDetectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserTypeDetectorService);
  });

  describe('detectUserTypeFromUrl', () => {
    it('should detect prestataire from URL', () => {
      // Act
      const result = service.detectUserTypeFromUrl('/register/prestataire');
      
      // Assert
      expect(result).toBe(true);
    });

    it('should detect particulier from URL', () => {
      // Act
      const result = service.detectUserTypeFromUrl('/register/particulier');
      
      // Assert
      expect(result).toBe(false);
    });

    it('should return false for unknown URL', () => {
      // Act
      const result = service.detectUserTypeFromUrl('/register/unknown');
      
      // Assert
      expect(result).toBe(false);
    });

    // Test simplifié sans mocking de window.location
    it('should use window.location.pathname when no parameter provided', () => {
      // Act - Appeler sans paramètre (utilise window.location.pathname réel)
      const result = service.detectUserTypeFromUrl();

      // Assert - Vérifier que la méthode ne plante pas
      expect(typeof result).toBe('boolean');
    });

    it('should handle case sensitivity in URL', () => {
      // Act
      const result = service.detectUserTypeFromUrl('/register/PRESTATAIRE');
      
      // Assert
      expect(result).toBe(false); // La méthode est case-sensitive
    });

    it('should handle URL with multiple segments containing prestataire', () => {
      // Act
      const result = service.detectUserTypeFromUrl('/app/register/prestataire/step1');
      
      // Assert
      expect(result).toBe(true);
    });
  });

  describe('detectUserTypeFromString', () => {
    it('should detect prestataire from string', () => {
      // Act
      const result = service.detectUserTypeFromString('prestataire');

      // Assert
      expect(result).toBe(true);
    });

    it('should detect prestataire from mixed case string', () => {
      // Act
      const result = service.detectUserTypeFromString('PRESTATAIRE');

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

    it('should return false for null string', () => {
      // Act
      const result = service.detectUserTypeFromString(null);

      // Assert
      expect(result).toBe(false);
    });

    it('should return false for undefined string', () => {
      // Act
      const result = service.detectUserTypeFromString(undefined);

      // Assert
      expect(result).toBe(false);
    });

    it('should return false for empty string', () => {
      // Act
      const result = service.detectUserTypeFromString('');

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('Form Title Methods', () => {
    it('should return prestataire title', () => {
      // Act
      const result = service.getPrestataireFormTitle();

      // Assert
      expect(result).toBe('Inscription Prestataire');
    });

    it('should return particulier title', () => {
      // Act
      const result = service.getParticulierFormTitle();

      // Assert
      expect(result).toBe('Inscription Particulier');
    });
  });

  describe('User Type String Methods', () => {
    it('should return prestataire string', () => {
      // Act
      const result = service.getPrestataireUserTypeString();

      // Assert
      expect(result).toBe('prestataire');
    });

    it('should return particulier string', () => {
      // Act
      const result = service.getParticulierUserTypeString();

      // Assert
      expect(result).toBe('particulier');
    });
  });

  describe('Integration Tests', () => {
    it('should work with prestataire URL flow', () => {
      // Act
      const isPrestataire = service.detectUserTypeFromUrl('/register/prestataire');
      const title = isPrestataire ? 
        service.getPrestataireFormTitle() : 
        service.getParticulierFormTitle();
      const typeString = isPrestataire ? 
        service.getPrestataireUserTypeString() : 
        service.getParticulierUserTypeString();

      // Assert
      expect(isPrestataire).toBe(true);
      expect(title).toBe('Inscription Prestataire');
      expect(typeString).toBe('prestataire');
    });

    it('should work with particulier URL flow', () => {
      // Act
      const isPrestataire = service.detectUserTypeFromUrl('/register/particulier');
      const title = isPrestataire ? 
        service.getPrestataireFormTitle() : 
        service.getParticulierFormTitle();
      const typeString = isPrestataire ? 
        service.getPrestataireUserTypeString() : 
        service.getParticulierUserTypeString();

      // Assert
      expect(isPrestataire).toBe(false);
      expect(title).toBe('Inscription Particulier');
      expect(typeString).toBe('particulier');
    });

    it('should work with string detection flow', () => {
      // Test prestataire
      expect(service.detectUserTypeFromString('prestataire')).toBe(true);
      expect(service.detectUserTypeFromString('PRESTATAIRE')).toBe(true);
      expect(service.detectUserTypeFromString('user-prestataire')).toBe(true);
      
      // Test particulier/other
      expect(service.detectUserTypeFromString('particulier')).toBe(false);
      expect(service.detectUserTypeFromString('user')).toBe(false);
      expect(service.detectUserTypeFromString('')).toBe(false);
    });

    // Test simplifié sans mocking
    it('should handle default behavior with window.location', () => {
      // Act - Tester que la méthode fonctionne sans paramètre
      const result = service.detectUserTypeFromUrl();

      // Assert - Vérifier que c'est un boolean valide
      expect(typeof result).toBe('boolean');
      
      // Test complémentaire avec paramètre pour comparaison
      const resultWithParam = service.detectUserTypeFromUrl('/register/prestataire');
      expect(resultWithParam).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle strings containing prestataire as substring', () => {
      // Act & Assert
      expect(service.detectUserTypeFromString('mon-prestataire-service')).toBe(true);
      expect(service.detectUserTypeFromString('prestataire123')).toBe(true);
      expect(service.detectUserTypeFromString('123prestataire')).toBe(true);
    });

    it('should handle empty or root paths', () => {
      // Act & Assert
      expect(service.detectUserTypeFromUrl('')).toBe(false);
      expect(service.detectUserTypeFromUrl('/')).toBe(false);
      expect(service.detectUserTypeFromUrl('/register')).toBe(false);
    });

    it('should handle complex URL paths', () => {
      // Act & Assert
      expect(service.detectUserTypeFromUrl('/fr/register/prestataire')).toBe(true);
      expect(service.detectUserTypeFromUrl('/register/prestataire?step=1')).toBe(true);
      expect(service.detectUserTypeFromUrl('/register/prestataire#section')).toBe(true);
    });

    it('should handle various URL formats', () => {
      // Test différents formats d'URL
      expect(service.detectUserTypeFromUrl('/prestataire')).toBe(true);
      expect(service.detectUserTypeFromUrl('prestataire')).toBe(true);
      expect(service.detectUserTypeFromUrl('/api/prestataire/endpoint')).toBe(true);
      
      // Test négatifs
      expect(service.detectUserTypeFromUrl('/prestataireX')).toBe(true); // Contains prestataire
      expect(service.detectUserTypeFromUrl('/presta')).toBe(false); // Doesn't contain full word
    });

    it('should be consistent between URL and string detection', () => {
      const testCases = [
        'prestataire',
        '/register/prestataire',
        'user-prestataire',
        'particulier',
        '/register/particulier',
        'unknown'
      ];

      testCases.forEach(testCase => {
        const urlResult = service.detectUserTypeFromUrl(testCase);
        const stringResult = service.detectUserTypeFromString(testCase);
        
        // Les deux méthodes devraient donner le même résultat pour la détection de "prestataire"
        if (testCase.toLowerCase().includes('prestataire')) {
          expect(urlResult).toBe(true);
          expect(stringResult).toBe(true);
        } else {
          expect(urlResult).toBe(false);
          expect(stringResult).toBe(false);
        }
      });
    });
  });

  describe('Method Combinations', () => {
    it('should provide consistent results across all methods', () => {
      // Test avec prestataire
      const prestataireUrl = '/register/prestataire';
      const isPrestataireFromUrl = service.detectUserTypeFromUrl(prestataireUrl);
      
      expect(isPrestataireFromUrl).toBe(true);
      expect(service.getPrestataireFormTitle()).toBe('Inscription Prestataire');
      expect(service.getPrestataireUserTypeString()).toBe('prestataire');
      
      // Test avec particulier
      const particulierUrl = '/register/particulier';
      const isPrestataireFromParticulierUrl = service.detectUserTypeFromUrl(particulierUrl);
      
      expect(isPrestataireFromParticulierUrl).toBe(false);
      expect(service.getParticulierFormTitle()).toBe('Inscription Particulier');
      expect(service.getParticulierUserTypeString()).toBe('particulier');
    });
  });
});