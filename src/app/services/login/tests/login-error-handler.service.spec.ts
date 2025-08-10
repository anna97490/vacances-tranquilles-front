import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { LoginErrorHandlerService } from './../login-error-handler.service';

describe('LoginErrorHandlerService', () => {
  let service: LoginErrorHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginErrorHandlerService);
    
    // Supprimer tous les logs console pour chaque test
    spyOn(console, 'warn').and.stub();
    spyOn(console, 'error').and.stub();
    spyOn(console, 'log').and.stub();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isPotentialParseError', () => {
    it('should return true for status 200', () => {
      const error = { status: 200 } as HttpErrorResponse;
      expect(service.isPotentialParseError(error)).toBeTruthy();
    });

    it('should return true for status 201', () => {
      const error = { status: 201 } as HttpErrorResponse;
      expect(service.isPotentialParseError(error)).toBeTruthy();
    });

    it('should return false for other status codes', () => {
      const testCases = [401, 403, 404, 500, 0];
      
      testCases.forEach(status => {
        const error = { status } as HttpErrorResponse;
        expect(service.isPotentialParseError(error)).toBeFalsy();
      });
    });
  });

  describe('getLoginErrorMessage', () => {
    const testCases = [
      { status: 401, expected: 'Email ou mot de passe incorrect' },
      { status: 403, expected: 'Accès non autorisé' },
      { status: 404, expected: 'Service de connexion non disponible' },
      { status: 500, expected: 'Erreur interne du serveur' },
      { status: 0, expected: 'Impossible de contacter le serveur' }
    ];

    testCases.forEach(({ status, expected }) => {
      it(`should return correct message for status ${status}`, () => {
        const error = { status, error: null } as HttpErrorResponse;
        expect(service.getLoginErrorMessage(error)).toBe(expected);
      });
    });

    it('should return custom error message from server', () => {
      const error = {
        status: 999,
        error: { message: 'Custom server error' }
      } as HttpErrorResponse;
      
      expect(service.getLoginErrorMessage(error)).toBe('Custom server error');
    });

    it('should return default error message for unknown status', () => {
      const error = { status: 999, error: null } as HttpErrorResponse;
      expect(service.getLoginErrorMessage(error)).toBe('Erreur de connexion inconnue');
    });

    it('should return server message when provided for unknown status', () => {
      const error = { status: 999, error: { message: 'Server says no' } } as HttpErrorResponse;
      expect(service.getLoginErrorMessage(error)).toBe('Server says no');
    });
  });

  describe('robustness for malformed/empty errors', () => {
    it('should handle null/undefined error objects gracefully', () => {
      expect(service.getLoginErrorMessage({} as any)).toBe('Erreur de connexion inconnue');
      expect(service.extractTokenFromErrorResponse({} as any)).toBeNull();
    });

    it('should handle non-JSON error.text strings', () => {
      const error = { error: { text: 'not json' } } as HttpErrorResponse;
      expect(service.extractTokenFromErrorResponse(error)).toBeNull();
    });
  });

  describe('extractTokenFromErrorResponse', () => {
    it('should extract token from error.text JSON', () => {
      const error = {
        error: { text: '{"token":"test-token"}' }
      } as HttpErrorResponse;
      
      expect(service.extractTokenFromErrorResponse(error)).toBe('test-token');
    });

    it('should extract token from error.token directly', () => {
      const error = {
        error: { token: 'direct-token' }
      } as HttpErrorResponse;
      
      expect(service.extractTokenFromErrorResponse(error)).toBe('direct-token');
    });

    it('should return null for invalid JSON', () => {
      const error = {
        error: { text: 'invalid json' }
      } as HttpErrorResponse;
      
      expect(service.extractTokenFromErrorResponse(error)).toBeNull();
      expect(console.warn).toHaveBeenCalled();
    });

    it('should return null when no token found', () => {
      const error = {
        error: { text: '{"message":"success"}' }
      } as HttpErrorResponse;
      
      expect(service.extractTokenFromErrorResponse(error)).toBeNull();
    });

    it('should return null for null token value', () => {
      const error = {
        error: { text: '{"token":null}' }
      } as HttpErrorResponse;
      
      expect(service.extractTokenFromErrorResponse(error)).toBeNull();
    });

    it('should handle missing error object', () => {
      const error = {} as HttpErrorResponse;
      
      expect(service.extractTokenFromErrorResponse(error)).toBeNull();
    });
  });
});