import { TestBed } from '@angular/core/testing';
import { RegisterErrorHandlerService } from '../register-error-handler.service';
import { HttpErrorResponse } from '@angular/common/http';

describe('RegisterErrorHandlerService', () => {
  let service: RegisterErrorHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegisterErrorHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isPotentialParseError', () => {
    it('should return true for status 200', () => {
      const error = new HttpErrorResponse({ status: 200 });

      const result = service.isPotentialParseError(error);

      expect(result).toBe(true);
    });

    it('should return true for status 201', () => {
      const error = new HttpErrorResponse({ status: 201 });

      const result = service.isPotentialParseError(error);

      expect(result).toBe(true);
    });

    it('should return false for other status codes', () => {
      const error = new HttpErrorResponse({ status: 400 });

      const result = service.isPotentialParseError(error);

      expect(result).toBe(false);
    });
  });

  describe('isSuccessfulButParseFailed', () => {
    it('should return true for status 200', () => {
      const error = new HttpErrorResponse({ status: 200 });

      const result = service.isSuccessfulButParseFailed(error);

      expect(result).toBe(true);
    });

    it('should return true for status 201', () => {
      const error = new HttpErrorResponse({ status: 201 });

      const result = service.isSuccessfulButParseFailed(error);

      expect(result).toBe(true);
    });

    it('should return false for other status codes', () => {
      const error = new HttpErrorResponse({ status: 400 });

      const result = service.isSuccessfulButParseFailed(error);

      expect(result).toBe(false);
    });
  });

  describe('getRegistrationErrorMessage', () => {
    it('should return message for 400 error', () => {
      const error = new HttpErrorResponse({ status: 400 });

      const result = service.getRegistrationErrorMessage(error);

      expect(result).toBeDefined();
    });

    it('should return message for 409 error', () => {
      const error = new HttpErrorResponse({ status: 409 });

      const result = service.getRegistrationErrorMessage(error);

      expect(result).toBe('Email déjà utilisé');
    });

    it('should return message for 422 error', () => {
      const error = new HttpErrorResponse({ status: 422 });

      const result = service.getRegistrationErrorMessage(error);

      expect(result).toContain('Données');
    });

    it('should return default message for unknown error', () => {
      const error = new HttpErrorResponse({ status: 500 });

      const result = service.getRegistrationErrorMessage(error);

      expect(result).toContain('Erreur');
    });

    it('should return message for network error (status 0)', () => {
      const error = new HttpErrorResponse({ status: 0 });
      expect(service.getRegistrationErrorMessage(error)).toBe('Impossible de contacter le serveur');
    });

    it('should return message for 401/403/404 statuses', () => {
      expect(service.getRegistrationErrorMessage(new HttpErrorResponse({ status: 401 }))).toBe('Non autorisé');
      expect(service.getRegistrationErrorMessage(new HttpErrorResponse({ status: 403 }))).toBe('Accès refusé');
      expect(service.getRegistrationErrorMessage(new HttpErrorResponse({ status: 404 }))).toBe('Ressource non trouvée');
    });

    it('should handle null/undefined status as invalid data', () => {
      expect(service.getRegistrationErrorMessage({} as any)).toBe('Données invalides - vérifiez vos informations');
      expect(service.getRegistrationErrorMessage({ status: undefined } as any)).toBe('Données invalides - vérifiez vos informations');
    });

    it('should handle 400 with non-object error body', () => {
      const error = new HttpErrorResponse({ status: 400, error: 'bad request' as any });
      expect(service.getRegistrationErrorMessage(error)).toBe('Données de validation incorrectes');
    });

    it('should handle 400 with missing required field code without message', () => {
      const error = new HttpErrorResponse({ status: 400, error: { code: 'MISSING_REQUIRED_FIELD' } as any });
      expect(service.getRegistrationErrorMessage(error)).toBe('Champ obligatoire manquant');
    });

    it('should handle 400 with empty error object', () => {
      const error = new HttpErrorResponse({ status: 400, error: {} as any });
      expect(service.getRegistrationErrorMessage(error)).toBe('Données de validation incorrectes');
    });
  });

  describe('extractTokenFromErrorResponse', () => {
    beforeEach(() => {
      spyOn(console, 'warn');
    });

    it('should extract token from valid JSON text', () => {
      const error = new HttpErrorResponse({
        error: { text: '{"token":"test-token","userRole":"USER"}' }
      });

      const result = service.extractTokenFromErrorResponse(error);

      expect(result).toBe('test-token');
    });

    it('should return null for JSON without token', () => {
      const error = new HttpErrorResponse({
        error: { text: '{"message":"No token"}' }
      });

      const result = service.extractTokenFromErrorResponse(error);

      expect(result).toBeNull();
    });

    it('should return null for empty error object', () => {
      const error = new HttpErrorResponse({ error: {} });

      const result = service.extractTokenFromErrorResponse(error);

      expect(result).toBeNull();
    });

    it('should handle malformed JSON gracefully', () => {
      const error = new HttpErrorResponse({
        error: { text: 'invalid json' }
      });

      const result = service.extractTokenFromErrorResponse(error);

      expect(result).toBeNull();
    });

    it('should return null for missing text property', () => {
      const error = new HttpErrorResponse({ error: { other: 'value' } });

      const result = service.extractTokenFromErrorResponse(error);

      expect(result).toBeNull();
    });

    it('should return null for invalid JSON text', () => {
      const error = new HttpErrorResponse({
        error: { text: '{"token":}' }
      });

      const result = service.extractTokenFromErrorResponse(error);

      expect(result).toBeNull();
    });

    it('should handle null/undefined inputs', () => {
      expect(service.extractTokenFromErrorResponse(null as any)).toBeNull();
      expect(service.extractTokenFromErrorResponse(undefined as any)).toBeNull();
    });
  });
});
