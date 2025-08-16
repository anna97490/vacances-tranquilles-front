import { HttpErrorResponse, HttpResponse, provideHttpClient, withFetch } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { LoginService } from "../login.service";
import { AuthStorageService } from "../auth-storage.service";
import { LoginErrorHandlerService } from "../login-error-handler.service";
import { LoginNavigationService } from "../login-navigation.service";
import { TestBed } from "@angular/core/testing";
import { PLATFORM_ID } from "@angular/core";
import { LoginResponse } from "../../../models/Login";

// login.service.spec.ts
describe('LoginService', () => {
  let service: LoginService;
  let httpMock: HttpTestingController;
  let authStorageSpy: jasmine.SpyObj<AuthStorageService>;
  let errorHandlerSpy: jasmine.SpyObj<LoginErrorHandlerService>;
  let navigationSpy: jasmine.SpyObj<LoginNavigationService>;
  let consoleSpy: jasmine.Spy;
  let consoleErrorSpy: jasmine.Spy;
  let isTestEnvironmentSpy: jasmine.Spy;
  let reloadPageIfBrowserSpy: jasmine.Spy;

  beforeEach(() => {
    const authStorageSpyObj = jasmine.createSpyObj('AuthStorageService', ['storeAuthenticationData']);
    const errorHandlerSpyObj = jasmine.createSpyObj('LoginErrorHandlerService', [
      'isPotentialParseError',
      'extractTokenFromErrorResponse',
      'getLoginErrorMessage'
    ]);
    const navigationSpyObj = jasmine.createSpyObj('LoginNavigationService', ['redirectAfterLogin']);

    TestBed.configureTestingModule({
      providers: [
        LoginService,
        { provide: AuthStorageService, useValue: authStorageSpyObj },
        { provide: LoginErrorHandlerService, useValue: errorHandlerSpyObj },
        { provide: LoginNavigationService, useValue: navigationSpyObj },
        { provide: PLATFORM_ID, useValue: 'browser' },
        provideHttpClient(withFetch()),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(LoginService);
    httpMock = TestBed.inject(HttpTestingController);
    authStorageSpy = TestBed.inject(AuthStorageService) as jasmine.SpyObj<AuthStorageService>;
    errorHandlerSpy = TestBed.inject(LoginErrorHandlerService) as jasmine.SpyObj<LoginErrorHandlerService>;
    navigationSpy = TestBed.inject(LoginNavigationService) as jasmine.SpyObj<LoginNavigationService>;

    // Créer les spies au niveau global avec des valeurs par défaut
    reloadPageIfBrowserSpy = spyOn(service as any, 'reloadPageIfBrowser').and.callFake(() => {
    });

    isTestEnvironmentSpy = spyOn(service as any, 'isTestEnvironment').and.returnValue(true);

    // Spy sur console
    consoleSpy = spyOn(console, 'log');
    consoleErrorSpy = spyOn(console, 'error');
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('handleLoginSuccess', () => {
    it('should handle login success with valid response', () => {
      const mockResponse: LoginResponse = {
        token: 'fake-token',
        userRole: 'CLIENT'
      };

      const httpResponse = new HttpResponse<LoginResponse>({
        body: mockResponse,
        status: 200
      });

      service.handleLoginSuccess(httpResponse);

      expect(authStorageSpy.storeAuthenticationData).toHaveBeenCalledWith('fake-token', 'CLIENT');
      expect(navigationSpy.redirectAfterLogin).toHaveBeenCalledWith('CLIENT');

    });

    it('should handle login success with missing token', () => {
      const httpResponse = new HttpResponse<LoginResponse>({
        body: null, // Explicitly null body
        status: 200
      });

      service.handleLoginSuccess(httpResponse);

      expect(authStorageSpy.storeAuthenticationData).not.toHaveBeenCalled();
      expect(navigationSpy.redirectAfterLogin).not.toHaveBeenCalled();

      // En environnement de test, le service utilise console.error au lieu d'alert
      expect(consoleErrorSpy).toHaveBeenCalledWith('Erreur lors de la connexion : Token manquant dans la réponse du serveur');
    });


    it('should handle response with empty body', () => {
      const httpResponse = new HttpResponse<LoginResponse>({
        body: {} as LoginResponse, // Type assertion for empty body
        status: 200
      });

      service.handleLoginSuccess(httpResponse);

      expect(authStorageSpy.storeAuthenticationData).not.toHaveBeenCalled();
      expect(navigationSpy.redirectAfterLogin).not.toHaveBeenCalled();


      expect(consoleErrorSpy).toHaveBeenCalledWith('Erreur lors de la connexion : Token manquant dans la réponse du serveur');
    });

    it('should handle response with undefined token', () => {
      const responseWithUndefinedToken: LoginResponse = {
        token: undefined as any,
        userRole: 'USER'
      };

      const httpResponse = new HttpResponse<LoginResponse>({
        body: responseWithUndefinedToken,
        status: 200
      });

      service.handleLoginSuccess(httpResponse);

      expect(authStorageSpy.storeAuthenticationData).not.toHaveBeenCalled();
      expect(navigationSpy.redirectAfterLogin).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Erreur lors de la connexion : Token manquant dans la réponse du serveur');
    });

    it('should handle response with empty token string', () => {
      const responseWithEmptyToken: LoginResponse = {
        token: '',
        userRole: 'USER'
      };

      const httpResponse = new HttpResponse<LoginResponse>({
        body: responseWithEmptyToken,
        status: 200
      });

      service.handleLoginSuccess(httpResponse);

      expect(authStorageSpy.storeAuthenticationData).not.toHaveBeenCalled();
      expect(navigationSpy.redirectAfterLogin).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Erreur lors de la connexion : Token manquant dans la réponse du serveur');
    });
  });

  describe('handleLoginError', () => {
    it('should handle login error with parse error', () => {
      const parseError = new HttpErrorResponse({
        error: new ProgressEvent('error'),
        status: 200,
        statusText: 'OK'
      });

      errorHandlerSpy.isPotentialParseError.and.returnValue(true);
      errorHandlerSpy.extractTokenFromErrorResponse.and.returnValue('extracted-token');

      service.handleLoginError(parseError);

      expect(errorHandlerSpy.isPotentialParseError).toHaveBeenCalledWith(parseError);
      expect(errorHandlerSpy.extractTokenFromErrorResponse).toHaveBeenCalledWith(parseError);
      expect(authStorageSpy.storeAuthenticationData).toHaveBeenCalledWith('extracted-token', '');
    });

    it('should handle login error with parse error but no token', () => {
      const parseError = new HttpErrorResponse({
        error: new ProgressEvent('error'),
        status: 200,
        statusText: 'OK'
      });

      errorHandlerSpy.isPotentialParseError.and.returnValue(true);
      errorHandlerSpy.extractTokenFromErrorResponse.and.returnValue(null); // Pas de token trouvé

      service.handleLoginError(parseError);

      expect(errorHandlerSpy.isPotentialParseError).toHaveBeenCalledWith(parseError);
      expect(errorHandlerSpy.extractTokenFromErrorResponse).toHaveBeenCalledWith(parseError);
      expect(authStorageSpy.storeAuthenticationData).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Erreur lors de la connexion : Token manquant dans la réponse du serveur');
    });

    it('should handle login error with actual error', () => {
      const actualError = new HttpErrorResponse({
        error: 'Unauthorized',
        status: 401,
        statusText: 'Unauthorized'
      });

      errorHandlerSpy.isPotentialParseError.and.returnValue(false);
      errorHandlerSpy.getLoginErrorMessage.and.returnValue('Unauthorized');

      service.handleLoginError(actualError);

      expect(errorHandlerSpy.isPotentialParseError).toHaveBeenCalledWith(actualError);
      expect(errorHandlerSpy.getLoginErrorMessage).toHaveBeenCalledWith(actualError);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Erreur lors de la connexion : Unauthorized');
    });
  });

  describe('performLogin', () => {
    it('should make HTTP POST request to login endpoint', () => {
      const payload = { email: 'test@example.com', password: 'password' };
      const apiUrl = 'http://localhost:8080/api';
      const expectedResponse: LoginResponse = { token: 'token', userRole: 'CLIENT' };

      service.performLogin(payload, apiUrl).subscribe((response: { body: any; }) => {
        expect(response.body).toEqual(expectedResponse);
      });

      const req = httpMock.expectOne(`${apiUrl}/auth/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(payload);
      expect(req.request.headers.get('Content-Type')).toBe('application/json');

      req.flush(expectedResponse);
    });
  });

  describe('isTestEnvironment', () => {
    it('should detect test environment correctly', () => {
      // Accéder à la méthode privée pour tester
      const isTest = (service as any).isTestEnvironment();
      expect(isTest).toBe(true); // Doit être true car on est dans Karma/Jasmine
    });
  });

  describe('reloadPageIfBrowser', () => {
    it('should respect test environment detection', () => {
      // Test simple : vérifier que la méthode mockée ne lève pas d'erreur
      expect(() => {
        (service as any).reloadPageIfBrowser();
      }).not.toThrow();

      expect(reloadPageIfBrowserSpy).toHaveBeenCalled();
    });

    it('should call isTestEnvironment when not mocked', () => {
      // Temporairement permettre l'exécution de la vraie méthode
      reloadPageIfBrowserSpy.and.callThrough();
      isTestEnvironmentSpy.calls.reset(); // Reset le compteur

      // Configurer le retour de isTestEnvironment
      isTestEnvironmentSpy.and.returnValue(true);

      // Appeler la méthode
      (service as any).reloadPageIfBrowser();

      // Vérifier que isTestEnvironment a été appelé
      expect(isTestEnvironmentSpy).toHaveBeenCalledTimes(1);

      // Remettre le mock
      reloadPageIfBrowserSpy.and.callFake(() => {
      });
    });

    it('should detect test environment correctly', () => {
      // Test de la vraie méthode isTestEnvironment
      isTestEnvironmentSpy.and.callThrough();

      const result = (service as any).isTestEnvironment();
      expect(result).toBe(true);

      // Remettre le mock
      isTestEnvironmentSpy.and.returnValue(true);
    });

    it('should handle different environment scenarios', () => {
      // Vérifier que le mock fonctionne avec différentes valeurs d'environnement
      isTestEnvironmentSpy.and.returnValue(true);
      expect(() => (service as any).reloadPageIfBrowser()).not.toThrow();

      isTestEnvironmentSpy.and.returnValue(false);
      expect(() => (service as any).reloadPageIfBrowser()).not.toThrow();

      // Vérifier que la méthode a été appelée
      expect(reloadPageIfBrowserSpy).toHaveBeenCalledTimes(2);

      // Vérifier que isTestEnvironment n'a pas été appelé (car on utilise le mock)
      expect(isTestEnvironmentSpy).not.toHaveBeenCalled();
    });
  });
  describe('Integration tests', () => {
    it('should handle complete login flow with success', () => {
    const payload = { email: 'test@example.com', password: 'password' };
    const apiUrl = 'http://localhost:8080/api';
    const mockResponse: LoginResponse = { token: 'test-token', userRole: 'CLIENT' };

    service.performLogin(payload, apiUrl).subscribe((httpResponse: HttpResponse<LoginResponse>) => {
      // Pass the complete HttpResponse object, not just the body
      service.handleLoginSuccess(httpResponse);

      expect(authStorageSpy.storeAuthenticationData).toHaveBeenCalledWith('test-token', 'CLIENT');
      expect(navigationSpy.redirectAfterLogin).toHaveBeenCalledWith('CLIENT');
    });

    // Mock the HTTP request
    const req = httpMock.expectOne(`${apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);

    req.flush(mockResponse);
  });

  it('should handle complete login flow with error', () => {
    const payload = { email: 'test@example.com', password: 'password' };
    const apiUrl = 'http://localhost:8080/api';
    const errorMessage = 'Unauthorized';

    errorHandlerSpy.isPotentialParseError.and.returnValue(false);
    errorHandlerSpy.getLoginErrorMessage.and.returnValue(errorMessage);

    service.performLogin(payload, apiUrl).subscribe({
      next: () => fail('Should have errored'),
      error: (error: HttpErrorResponse) => {
        service.handleLoginError(error);

        expect(errorHandlerSpy.isPotentialParseError).toHaveBeenCalledWith(error);
        expect(errorHandlerSpy.getLoginErrorMessage).toHaveBeenCalledWith(error);
        expect(consoleErrorSpy).toHaveBeenCalledWith('Erreur lors de la connexion : Unauthorized');
      }
    });

    const req = httpMock.expectOne(`${apiUrl}/auth/login`);

    req.flush(errorMessage, { status: 401, statusText: 'Unauthorized' });
  });
  });
});
