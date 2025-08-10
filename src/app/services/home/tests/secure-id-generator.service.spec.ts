import { TestBed } from '@angular/core/testing';
import { SecureIdGeneratorService } from '../crypto/secure-id-generator.service';

describe('SecureIdGeneratorService', () => {
  let service: SecureIdGeneratorService;
  let originalCrypto: Crypto;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SecureIdGeneratorService);

    // Sauvegarder le crypto original
    originalCrypto = window.crypto;

    // Supprimer tous les logs console pour chaque test
    spyOn(console, 'warn').and.stub();
    spyOn(console, 'error').and.stub();
    spyOn(console, 'log').and.stub();
  });

  afterEach(() => {
    // Restaurer le crypto original
    Object.defineProperty(window, 'crypto', {
      value: originalCrypto,
      writable: true,
      configurable: true
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('generateSecureRandomId', () => {
    // Test de base avec Web Crypto API
    it('should generate secure ID using Web Crypto API', async () => {
      const getRandomValuesSpy = jasmine.createSpy('getRandomValues').and.callFake((array: Uint8Array) => {
        for (let i = 0; i < array.length; i++) {
          array[i] = i + 1;
        }
      });

      Object.defineProperty(window, 'crypto', {
        value: { getRandomValues: getRandomValuesSpy },
        writable: true,
        configurable: true
      });

      const result = await service.generateSecureRandomId('test', 8);

      expect(result).toMatch(/^test-[a-z0-9]{8}$/);
      expect(getRandomValuesSpy).toHaveBeenCalled();
    });

    // Test avec valeurs par défaut
    it('should use default parameters when none provided', async () => {
      const getRandomValuesSpy = jasmine.createSpy('getRandomValues').and.callFake((array: Uint8Array) => {
        for (let i = 0; i < array.length; i++) {
          array[i] = i + 1;
        }
      });

      Object.defineProperty(window, 'crypto', {
        value: { getRandomValues: getRandomValuesSpy },
        writable: true,
        configurable: true
      });

      const result = await service.generateSecureRandomId();

      expect(result).toMatch(/^id-[a-z0-9]+$/);
      expect(result.startsWith('id-')).toBe(true);
    });

    // Test pour couvrir la branche else du if (typeof window !== 'undefined' && window.crypto)
    it('should use secure fallback when window crypto conditions fail', async () => {
      // Simuler l'échec de la condition en supprimant crypto
      delete (window as any).crypto;

      const result = await service.generateSecureRandomId('test', 8);

      expect(result).toMatch(/^test-[a-z0-9]+$/);
    });

    // Test alternatif pour couvrir le cas où window n'existe pas
    it('should handle missing window object gracefully', async () => {
      // Forcer l'erreur dans generateWebCryptoId pour déclencher le catch
      const mockCrypto = {
        getRandomValues: jasmine.createSpy('getRandomValues').and.throwError('Crypto unavailable')
      };

      Object.defineProperty(window, 'crypto', {
        value: mockCrypto,
        writable: true,
        configurable: true
      });

      const result = await service.generateSecureRandomId('fallback', 8);

      expect(result).toMatch(/^fallback-[a-z0-9]+$/);
    });

    // Test pour couvrir le cas où window.crypto est undefined
    it('should use secure fallback when window.crypto is undefined', async () => {
      // Supprimer crypto temporairement
      delete (window as any).crypto;

      const result = await service.generateSecureRandomId('test', 8);

      expect(result).toMatch(/^test-[a-z0-9]+$/);
    });

    // Test pour forcer l'exception dans generateWebCryptoId et tester le catch
    it('should catch error in generateWebCryptoId and use fallback', async () => {
      const mockCrypto = {
        getRandomValues: jasmine.createSpy('getRandomValues').and.throwError('getRandomValues failed')
      };

      Object.defineProperty(window, 'crypto', {
        value: mockCrypto,
        writable: true,
        configurable: true
      });

      const result = await service.generateSecureRandomId('test', 8);

      expect(result).toMatch(/^test-[a-z0-9]+$/);
    });

    // Test pour couvrir différentes longueurs dans generateSecureFallbackId
    it('should generate secure fallback IDs of different lengths', async () => {
      // Supprimer crypto pour forcer le fallback
      delete (window as any).crypto;

      const shortResult = await service.generateSecureRandomId('short', 4);
      const longResult = await service.generateSecureRandomId('long', 20);

      expect(shortResult).toMatch(/^short-[a-z0-9]{4}$/);
      expect(longResult.length).toBeLessThanOrEqual(25); // long- (5) + 20 max
      expect(longResult.startsWith('long-')).toBe(true);
    });

    // Test edge case pour Math.ceil dans generateWebCryptoId
    it('should handle odd lengths correctly in Web Crypto method', async () => {
      const getRandomValuesSpy = jasmine.createSpy('getRandomValues').and.callFake((array: Uint8Array) => {
        for (let i = 0; i < array.length; i++) {
          array[i] = i + 1;
        }
      });

      Object.defineProperty(window, 'crypto', {
        value: { getRandomValues: getRandomValuesSpy },
        writable: true,
        configurable: true
      });

      const result = await service.generateSecureRandomId('odd', 7);
      expect(result).toMatch(/^odd-[a-z0-9]{7}$/);
    });

    // Test pour vérifier que collectEntropySources couvre toutes les branches
    it('should collect entropy sources with various navigator states', async () => {
      // Mock des propriétés navigator qui peuvent être undefined
      const originalHardware = navigator.hardwareConcurrency;
      const originalTouch = navigator.maxTouchPoints;
      const originalCookie = navigator.cookieEnabled;
      const originalOnline = navigator.onLine;

      // Test avec des valeurs undefined/null
      Object.defineProperty(navigator, 'hardwareConcurrency', { value: undefined, configurable: true });
      Object.defineProperty(navigator, 'maxTouchPoints', { value: undefined, configurable: true });
      Object.defineProperty(navigator, 'cookieEnabled', { value: false, configurable: true });
      Object.defineProperty(navigator, 'onLine', { value: false, configurable: true });

      delete (window as any).crypto;

      const result = await service.generateSecureRandomId('entropy', 8);

      expect(result).toMatch(/^entropy-[a-z0-9]+$/);

      // Restaurer les valeurs originales
      Object.defineProperty(navigator, 'hardwareConcurrency', { value: originalHardware, configurable: true });
      Object.defineProperty(navigator, 'maxTouchPoints', { value: originalTouch, configurable: true });
      Object.defineProperty(navigator, 'cookieEnabled', { value: originalCookie, configurable: true });
      Object.defineProperty(navigator, 'onLine', { value: originalOnline, configurable: true });
    });

    // Test pour couvrir generateCryptoSubtleFallback directement
    it('should use generateCryptoSubtleFallback when called directly', async () => {
      const generateKeySpy = jasmine.createSpy('generateKey').and.returnValue(
        Promise.resolve({ type: 'secret' } as CryptoKey)
      );
      const exportKeySpy = jasmine.createSpy('exportKey').and.returnValue(
        Promise.resolve(new Uint8Array([97, 98, 99, 100, 101, 102, 103, 104]).buffer)
      );

      const mockCrypto = {
        subtle: {
          generateKey: generateKeySpy,
          exportKey: exportKeySpy
        }
      };

      Object.defineProperty(window, 'crypto', {
        value: mockCrypto,
        writable: true,
        configurable: true
      });

      // Appeler directement la méthode generateCryptoSubtleFallback
      const result = await (service as any).generateCryptoSubtleFallback('test', 8);

      expect(result).toMatch(/^test-[a-z0-9]+$/);
      expect(generateKeySpy).toHaveBeenCalled();
      expect(exportKeySpy).toHaveBeenCalled();
    });

    // Test pour couvrir l'erreur dans generateCryptoSubtleFallback - generateKey fails
    it('should handle generateKey error in generateCryptoSubtleFallback', async () => {
      const generateKeySpy = jasmine.createSpy('generateKey').and.throwError('Key generation failed');

      const mockCrypto = {
        subtle: {
          generateKey: generateKeySpy,
          exportKey: jasmine.createSpy('exportKey')
        }
      };

      Object.defineProperty(window, 'crypto', {
        value: mockCrypto,
        writable: true,
        configurable: true
      });

      try {
        await (service as any).generateCryptoSubtleFallback('test', 8);
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.message).toBe('Key generation failed');
        expect(generateKeySpy).toHaveBeenCalled();
      }
    });

    // Test pour couvrir le cas où exportKey échoue dans generateCryptoSubtleFallback
    it('should handle exportKey failure in generateCryptoSubtleFallback', async () => {
      const generateKeySpy = jasmine.createSpy('generateKey').and.returnValue(
        Promise.resolve({ type: 'secret' } as CryptoKey)
      );
      const exportKeySpy = jasmine.createSpy('exportKey').and.throwError('Export failed');

      const mockCrypto = {
        subtle: {
          generateKey: generateKeySpy,
          exportKey: exportKeySpy
        }
      };

      Object.defineProperty(window, 'crypto', {
        value: mockCrypto,
        writable: true,
        configurable: true
      });

      try {
        await (service as any).generateCryptoSubtleFallback('test', 8);
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.message).toBe('Export failed');
        expect(generateKeySpy).toHaveBeenCalled();
        expect(exportKeySpy).toHaveBeenCalled();
      }
    });

    // Test pour s'assurer que subtleGenerateKey est couvert
    it('should call subtleGenerateKey with correct parameters', async () => {
      const generateKeySpy = jasmine.createSpy('generateKey').and.returnValue(
        Promise.resolve({ type: 'secret' } as CryptoKey)
      );

      const mockCrypto = {
        subtle: {
          generateKey: generateKeySpy,
          exportKey: jasmine.createSpy('exportKey').and.returnValue(
            Promise.resolve(new Uint8Array([1, 2, 3, 4]).buffer)
          )
        }
      };

      Object.defineProperty(window, 'crypto', {
        value: mockCrypto,
        writable: true,
        configurable: true
      });

      await (service as any).generateCryptoSubtleFallback('test', 8);

      expect(generateKeySpy).toHaveBeenCalledWith(
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt']
      );
    });

    it('should handle odd lengths correctly in crypto subtle method', async () => {
      const mockCrypto = {
        subtle: {
          generateKey: jasmine.createSpy('generateKey').and.returnValue(
            Promise.resolve({ type: 'secret' } as CryptoKey)
          ),
          exportKey: jasmine.createSpy('exportKey').and.returnValue(
            Promise.resolve(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]).buffer)
          )
        }
      };

      Object.defineProperty(window, 'crypto', {
        value: mockCrypto,
        writable: true,
        configurable: true
      });

      const result = await (service as any).generateCryptoSubtleFallback('subtle', 9);
      expect(result).toMatch(/^subtle-[a-z0-9]+$/);
    });

    // Test pour vérifier le comportement avec des valeurs d'entropie extrêmes
    it('should handle extreme entropy values in calculateHashes', async () => {
      delete (window as any).crypto;

      // Mock performance pour des valeurs extrêmes
      const originalNow = performance.now;
      performance.now = jasmine.createSpy('now').and.returnValue(Number.MAX_SAFE_INTEGER);

      const result = await service.generateSecureRandomId('extreme', 8);

      expect(result).toMatch(/^extreme-[a-z0-9]+$/);

      // Restaurer
      performance.now = originalNow;
    });

    // Test pour vérifier le formatage correct des IDs
    it('should format IDs correctly with padStart in Web Crypto', async () => {
      const getRandomValuesSpy = jasmine.createSpy('getRandomValues').and.callFake((array: Uint8Array) => {
        // Valeurs qui génèrent des caractères courts en base 36
        for (let i = 0; i < array.length; i++) {
          array[i] = 1; // Génère "01" avec padStart
        }
      });

      Object.defineProperty(window, 'crypto', {
        value: { getRandomValues: getRandomValuesSpy },
        writable: true,
        configurable: true
      });

      const result = await service.generateSecureRandomId('pad', 4);
      expect(result).toMatch(/^pad-[a-z0-9]{4}$/);
    });

    // Test pour vérifier que le slice fonctionne correctement
    it('should slice ID to correct length in all methods', async () => {
      // Test avec Web Crypto
      const getRandomValuesSpy = jasmine.createSpy('getRandomValues').and.callFake((array: Uint8Array) => {
        for (let i = 0; i < array.length; i++) {
          array[i] = 255; // Valeur maximale pour générer plus de caractères
        }
      });

      Object.defineProperty(window, 'crypto', {
        value: { getRandomValues: getRandomValuesSpy },
        writable: true,
        configurable: true
      });

      const webCryptoResult = await service.generateSecureRandomId('web', 6);
      expect(webCryptoResult).toMatch(/^web-[a-z0-9]{6}$/);

      // Test avec crypto subtle
      const mockCrypto = {
        subtle: {
          generateKey: jasmine.createSpy('generateKey').and.returnValue(
            Promise.resolve({ type: 'secret' } as CryptoKey)
          ),
          exportKey: jasmine.createSpy('exportKey').and.returnValue(
            // Buffer avec beaucoup de données pour tester le slice
            Promise.resolve(new Uint8Array([255, 255, 255, 255, 255, 255, 255, 255, 255, 255]).buffer)
          )
        }
      };

      Object.defineProperty(window, 'crypto', {
        value: mockCrypto,
        writable: true,
        configurable: true
      });

      const subtleResult = await (service as any).generateCryptoSubtleFallback('subtle', 5);
      expect(subtleResult).toMatch(/^subtle-[a-z0-9]{5}$/);

      // Test avec fallback
      delete (window as any).crypto;
      const fallbackResult = await service.generateSecureRandomId('fallback', 7);
      expect(fallbackResult).toMatch(/^fallback-[a-z0-9]{7}$/);
    });

    // Test pour vérifier les calculs de hash avec index
    it('should calculate hashes with index multiplication correctly', async () => {
      delete (window as any).crypto;

      // Utiliser des valeurs d'entropie connues pour tester les calculs
      spyOn(service as any, 'collectEntropySources').and.returnValue([1, 2, 3, 4, 5]);

      const result = await service.generateSecureRandomId('hash', 8);
      expect(result).toMatch(/^hash-[a-z0-9]+$/);
    });

    // Test pour vérifier la génération avec une très petite longueur
    it('should handle very small lengths', async () => {
      delete (window as any).crypto;

      const result = await service.generateSecureRandomId('tiny', 1);
      expect(result).toMatch(/^tiny-[a-z0-9]$/);
    });

    // Test pour vérifier la génération avec une longueur zéro
    it('should handle zero length', async () => {
      delete (window as any).crypto;

      const result = await service.generateSecureRandomId('zero', 0);
      expect(result).toBe('zero-');
    });
  });

  // Tests des méthodes privées via l'interface publique
  describe('Private methods coverage', () => {
    it('should cover all branches in collectEntropySources', async () => {
      // Test avec toutes les propriétés définies
      delete (window as any).crypto;

      // Forcer des valeurs spécifiques pour couvrir les branches ||
      const originalHardware = navigator.hardwareConcurrency;
      const originalTouch = navigator.maxTouchPoints;

      Object.defineProperty(navigator, 'hardwareConcurrency', { value: 8, configurable: true });
      Object.defineProperty(navigator, 'maxTouchPoints', { value: 5, configurable: true });

      const result1 = await service.generateSecureRandomId('full', 8);
      expect(result1).toMatch(/^full-[a-z0-9]+$/);

      // Test avec valeurs nulles pour couvrir les || fallbacks
      Object.defineProperty(navigator, 'hardwareConcurrency', { value: null, configurable: true });
      Object.defineProperty(navigator, 'maxTouchPoints', { value: null, configurable: true });

      const result2 = await service.generateSecureRandomId('null', 8);
      expect(result2).toMatch(/^null-[a-z0-9]+$/);

      // Restaurer
      Object.defineProperty(navigator, 'hardwareConcurrency', { value: originalHardware, configurable: true });
      Object.defineProperty(navigator, 'maxTouchPoints', { value: originalTouch, configurable: true });
    });

    it('should cover bit operations in calculateHashes', async () => {
      delete (window as any).crypto;

      // Mock pour retourner des valeurs qui testent les opérations bit à bit
      spyOn(service as any, 'collectEntropySources').and.returnValue([
        0x000000ff, // Test value & 0xff
        0x0000ff00, // Test (value >> 8) & 0xff
        0xffffffff, // Test valeur maximale
        0x00000000  // Test valeur minimale
      ]);

      const result = await service.generateSecureRandomId('bits', 8);
      expect(result).toMatch(/^bits-[a-z0-9]+$/);
    });
  });
});
