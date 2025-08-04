import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LoginService } from './login.service';
import { AuthStorageService } from './auth-storage.service';
import { LoginErrorHandlerService } from './login-error-handler.service';
import { LoginNavigationService } from './login-navigation.service';
import { LoginPayload, LoginResponse } from '../../models/Login';
import { HttpErrorResponse } from '@angular/common/http';

describe('LoginService', () => {
  let service: LoginService;
  let httpMock: HttpTestingController;
  let authStorage: jasmine.SpyObj<AuthStorageService>;
  let errorHandler: jasmine.SpyObj<LoginErrorHandlerService>;
  let navigation: jasmine.SpyObj<LoginNavigationService>;

  beforeEach(() => {
    const authStorageSpy = jasmine.createSpyObj('AuthStorageService', ['storeAuthenticationData']);
    const errorHandlerSpy = jasmine.createSpyObj('LoginErrorHandlerService', [
      'isPotentialParseError',
      'extractTokenFromErrorResponse',
      'getLoginErrorMessage'
    ]);
    const navigationSpy = jasmine.createSpyObj('LoginNavigationService', ['redirectAfterLogin']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        LoginService,
        { provide: AuthStorageService, useValue: authStorageSpy },
        { provide: LoginErrorHandlerService, useValue: errorHandlerSpy },
        { provide: LoginNavigationService, useValue: navigationSpy }
      ]
    });

    service = TestBed.inject(LoginService);
    httpMock = TestBed.inject(HttpTestingController);
    authStorage = TestBed.inject(AuthStorageService) as jasmine.SpyObj<AuthStorageService>;
    errorHandler = TestBed.inject(LoginErrorHandlerService) as jasmine.SpyObj<LoginErrorHandlerService>;
    navigation = TestBed.inject(LoginNavigationService) as jasmine.SpyObj<LoginNavigationService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should perform login successfully', () => {
    // Arrange
    const payload = new LoginPayload();
    payload.email = 'test@example.com';
    payload.password = 'password123';
    const apiUrl = 'https://api.example.com';

    // Act
    service.performLogin(payload, apiUrl).subscribe(response => {
      expect(response.status).toBe(200);
    });

    // Assert
    const req = httpMock.expectOne(`${apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    req.flush({ token: 'test-token', userRole: 'USER' }, { status: 200, statusText: 'OK' });
  });

  it('should handle login success with valid response', () => {
    // Arrange
    spyOn(window, 'alert');
    const response = {
      body: {
        token: 'test-token',
        userRole: 'USER'
      }
    } as any;

    // Act
    service.handleLoginSuccess(response);

    // Assert
    expect(authStorage.storeAuthenticationData).toHaveBeenCalledWith('test-token', 'USER');
    expect(window.alert).toHaveBeenCalledWith('Connexion réussie !');
    expect(navigation.redirectAfterLogin).toHaveBeenCalledWith('USER');
  });

  it('should handle login success with missing token', () => {
    // Arrange
    spyOn(window, 'alert');
    const response = {
      body: {
        userRole: 'USER'
      }
    } as any;

    // Act
    service.handleLoginSuccess(response);

    // Assert
    expect(window.alert).toHaveBeenCalledWith('Erreur lors de la connexion : Token manquant dans la réponse du serveur');
    expect(authStorage.storeAuthenticationData).not.toHaveBeenCalled();
    expect(navigation.redirectAfterLogin).not.toHaveBeenCalled();
  });

  it('should handle login error with parse error', () => {
    // Arrange
    spyOn(window, 'alert');
    spyOn(console, 'error');
    spyOn(console, 'log');
    const error = new HttpErrorResponse({ status: 200 });
    errorHandler.isPotentialParseError.and.returnValue(true);
    errorHandler.extractTokenFromErrorResponse.and.returnValue('test-token');

    // Act
    service.handleLoginError(error);

    // Assert
    expect(console.error).toHaveBeenCalledWith('Erreur de connexion:', error);
    expect(console.log).toHaveBeenCalledWith('Gestion spéciale pour erreur de parsing avec status 200:', error);
    expect(authStorage.storeAuthenticationData).toHaveBeenCalledWith('test-token', '');
    expect(window.alert).toHaveBeenCalledWith('Connexion réussie !');
    expect(navigation.redirectAfterLogin).toHaveBeenCalled();
  });

  it('should handle login error with parse error but no token', () => {
    // Arrange
    spyOn(window, 'alert');
    spyOn(console, 'error');
    spyOn(console, 'log');
    const error = new HttpErrorResponse({ status: 200 });
    errorHandler.isPotentialParseError.and.returnValue(true);
    errorHandler.extractTokenFromErrorResponse.and.returnValue(null);

    // Act
    service.handleLoginError(error);

    // Assert
    expect(console.error).toHaveBeenCalledWith('Erreur de connexion:', error);
    expect(console.log).toHaveBeenCalledWith('Gestion spéciale pour erreur de parsing avec status 200:', error);
    expect(window.alert).toHaveBeenCalledWith('Erreur lors de la connexion : Token manquant dans la réponse du serveur');
    expect(authStorage.storeAuthenticationData).not.toHaveBeenCalled();
  });

  it('should handle login error with actual error', () => {
    // Arrange
    spyOn(window, 'alert');
    spyOn(console, 'error');
    const error = new HttpErrorResponse({ status: 401 });
    errorHandler.isPotentialParseError.and.returnValue(false);
    errorHandler.getLoginErrorMessage.and.returnValue('Unauthorized');

    // Act
    service.handleLoginError(error);

    // Assert
    expect(console.error).toHaveBeenCalledWith('Erreur de connexion:', error);
    expect(errorHandler.getLoginErrorMessage).toHaveBeenCalledWith(error);
    expect(window.alert).toHaveBeenCalledWith('Erreur lors de la connexion : Unauthorized');
  });
}); 