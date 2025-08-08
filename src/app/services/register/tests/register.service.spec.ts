import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { RegisterService } from './../register.service';
import { RegisterErrorHandlerService } from './../register-error-handler.service';
import { UserTypeDetectorService } from './../user-type-detector.service';
import { ApiConfig, RegisterPayload } from './../../../models/Register';
import { HttpErrorResponse } from '@angular/common/http';

describe('RegisterService', () => {
  let service: RegisterService;
  let httpMock: HttpTestingController;
  let router: jasmine.SpyObj<Router>;
  let errorHandler: jasmine.SpyObj<RegisterErrorHandlerService>;
  let userTypeDetector: jasmine.SpyObj<UserTypeDetectorService>;

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const errorHandlerSpy = jasmine.createSpyObj('RegisterErrorHandlerService', [
      'isSuccessfulButParseFailed',
      'getRegistrationErrorMessage'
    ]);
    // Mise à jour des méthodes spied selon le service refactorisé
    const userTypeDetectorSpy = jasmine.createSpyObj('UserTypeDetectorService', [
      'getPrestataireUserTypeString',
      'getParticulierUserTypeString',
      'detectUserTypeFromUrl',
      'detectUserTypeFromString'
    ]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RegisterService,
        { provide: Router, useValue: routerSpy },
        { provide: RegisterErrorHandlerService, useValue: errorHandlerSpy },
        { provide: UserTypeDetectorService, useValue: userTypeDetectorSpy }
      ]
    });

    service = TestBed.inject(RegisterService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    errorHandler = TestBed.inject(RegisterErrorHandlerService) as jasmine.SpyObj<RegisterErrorHandlerService>;
    userTypeDetector = TestBed.inject(UserTypeDetectorService) as jasmine.SpyObj<UserTypeDetectorService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should perform registration successfully', () => {
    // Arrange
    const payload = new RegisterPayload();
    payload.email = 'test@example.com';
    payload.password = 'Password123!';
    payload.firstName = 'John';
    payload.lastName = 'Doe';

    const apiConfig = new ApiConfig();
    apiConfig.url = 'https://api.example.com/register';
    apiConfig.payload = payload;

    // Act
    service.performRegistration(apiConfig).subscribe((response: any) => {
      expect(response.status).toBe(200);
    });

    // Assert
    const req = httpMock.expectOne('https://api.example.com/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    req.flush('Success', { status: 200, statusText: 'OK' });
  });

  it('should handle registration success for particulier', () => {
    // Arrange
    spyOn(window, 'alert');
    // Utiliser la nouvelle méthode spécifique
    userTypeDetector.getParticulierUserTypeString.and.returnValue('particulier');
    const mockResponse = { status: 200 } as any;

    // Act
    service.handleRegistrationSuccess(mockResponse, false);

    // Assert
    expect(window.alert).toHaveBeenCalledWith('Inscription particulier réussie ! Vous pouvez maintenant vous connecter.');
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
    expect(userTypeDetector.getParticulierUserTypeString).toHaveBeenCalled();
  });

  it('should handle registration success for prestataire', () => {
    // Arrange
    spyOn(window, 'alert');
    // Utiliser la nouvelle méthode spécifique
    userTypeDetector.getPrestataireUserTypeString.and.returnValue('prestataire');
    const mockResponse = { status: 200 } as any;

    // Act
    service.handleRegistrationSuccess(mockResponse, true);

    // Assert
    expect(window.alert).toHaveBeenCalledWith('Inscription prestataire réussie ! Vous pouvez maintenant vous connecter.');
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
    expect(userTypeDetector.getPrestataireUserTypeString).toHaveBeenCalled();
  });

  it('should handle registration error with parse error but success for particulier', () => {
    // Arrange
    spyOn(window, 'alert');
    spyOn(console, 'error');
    const error = new HttpErrorResponse({ status: 200 });
    errorHandler.isSuccessfulButParseFailed.and.returnValue(true);
    // Utiliser la nouvelle méthode spécifique
    userTypeDetector.getParticulierUserTypeString.and.returnValue('particulier');

    // Act
    service.handleRegistrationError(error, false);

    // Assert
    expect(console.error).toHaveBeenCalledWith('Erreur d\'inscription:', error);
    expect(window.alert).toHaveBeenCalledWith('Inscription particulier réussie ! Vous pouvez maintenant vous connecter.');
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
    expect(userTypeDetector.getParticulierUserTypeString).toHaveBeenCalled();
  });

  it('should handle registration error with parse error but success for prestataire', () => {
    // Arrange
    spyOn(window, 'alert');
    spyOn(console, 'error');
    const error = new HttpErrorResponse({ status: 200 });
    errorHandler.isSuccessfulButParseFailed.and.returnValue(true);
    // Utiliser la nouvelle méthode spécifique
    userTypeDetector.getPrestataireUserTypeString.and.returnValue('prestataire');

    // Act
    service.handleRegistrationError(error, true);

    // Assert
    expect(console.error).toHaveBeenCalledWith('Erreur d\'inscription:', error);
    expect(window.alert).toHaveBeenCalledWith('Inscription prestataire réussie ! Vous pouvez maintenant vous connecter.');
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
    expect(userTypeDetector.getPrestataireUserTypeString).toHaveBeenCalled();
  });

  it('should handle registration error with real error', () => {
    // Arrange
    spyOn(window, 'alert');
    spyOn(console, 'error');
    const error = new HttpErrorResponse({ status: 400 });
    errorHandler.isSuccessfulButParseFailed.and.returnValue(false);
    errorHandler.getRegistrationErrorMessage.and.returnValue('Bad Request');

    // Act
    service.handleRegistrationError(error, false);

    // Assert
    expect(console.error).toHaveBeenCalledWith('Erreur d\'inscription:', error);
    expect(window.alert).toHaveBeenCalledWith('Erreur lors de l\'inscription : Bad Request');
    // Pas d'appel aux méthodes userTypeDetector car c'est une vraie erreur
  });

  // Tests additionnels pour couvrir les différents scénarios
  describe('User Type Detection Integration', () => {
    it('should use correct method for particulier registration', () => {
      // Arrange
      spyOn(window, 'alert');
      userTypeDetector.getParticulierUserTypeString.and.returnValue('particulier');
      const mockResponse = { status: 200 } as any;

      // Act
      service.handleRegistrationSuccess(mockResponse, false);

      // Assert
      expect(userTypeDetector.getParticulierUserTypeString).toHaveBeenCalledTimes(1);
      expect(userTypeDetector.getPrestataireUserTypeString).not.toHaveBeenCalled();
    });

    it('should use correct method for prestataire registration', () => {
      // Arrange
      spyOn(window, 'alert');
      userTypeDetector.getPrestataireUserTypeString.and.returnValue('prestataire');
      const mockResponse = { status: 200 } as any;

      // Act
      service.handleRegistrationSuccess(mockResponse, true);

      // Assert
      expect(userTypeDetector.getPrestataireUserTypeString).toHaveBeenCalledTimes(1);
      expect(userTypeDetector.getParticulierUserTypeString).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined response in success handler', () => {
      // Arrange
      spyOn(window, 'alert');
      userTypeDetector.getParticulierUserTypeString.and.returnValue('particulier');

      // Act
      expect(() => {
        service.handleRegistrationSuccess(undefined as any, false);
      }).not.toThrow();

      // Assert
      expect(userTypeDetector.getParticulierUserTypeString).toHaveBeenCalled();
    });

    it('should handle null response in success handler', () => {
      // Arrange
      spyOn(window, 'alert');
      userTypeDetector.getPrestataireUserTypeString.and.returnValue('prestataire');

      // Act
      expect(() => {
        service.handleRegistrationSuccess(null as any, true);
      }).not.toThrow();

      // Assert
      expect(userTypeDetector.getPrestataireUserTypeString).toHaveBeenCalled();
    });
  });
});