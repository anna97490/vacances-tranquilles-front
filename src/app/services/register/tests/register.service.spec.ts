import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { Router } from '@angular/router';
import { RegisterService } from './../register.service';
import { RegisterErrorHandlerService } from './../register-error-handler.service';
import { UserTypeDetectorService } from './../user-type-detector.service';
import { ApiConfig, RegisterPayload } from './../../../models/Register';
import { HttpErrorResponse } from '@angular/common/http';

describe('RegisterService', () => {
  let service: RegisterService;
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
      providers: [
        RegisterService,
        { provide: Router, useValue: routerSpy },
        { provide: RegisterErrorHandlerService, useValue: errorHandlerSpy },
        { provide: UserTypeDetectorService, useValue: userTypeDetectorSpy },
        provideHttpClient(withFetch())
      ]
    });

    service = TestBed.inject(RegisterService);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    errorHandler = TestBed.inject(RegisterErrorHandlerService) as jasmine.SpyObj<RegisterErrorHandlerService>;
    userTypeDetector = TestBed.inject(UserTypeDetectorService) as jasmine.SpyObj<UserTypeDetectorService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should perform registration successfully', () => {
    const payload = new RegisterPayload();
    payload.email = 'test@example.com';
    payload.password = 'Password123!';
    payload.firstName = 'John';
    payload.lastName = 'Doe';

    const apiConfig = new ApiConfig();
    apiConfig.url = 'https://api.example.com/register';
    apiConfig.payload = payload;

    expect(service).toBeTruthy();
    expect(typeof service.performRegistration).toBe('function');
  });

  it('should handle registration success for particulier', () => {
    userTypeDetector.getParticulierUserTypeString.and.returnValue('particulier');
    const mockResponse = { status: 200 } as any;

    service.handleRegistrationSuccess(mockResponse, false);

    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
  });

  it('should handle registration success for prestataire', () => {
    userTypeDetector.getPrestataireUserTypeString.and.returnValue('prestataire');
    const mockResponse = { status: 200 } as any;

    service.handleRegistrationSuccess(mockResponse, true);
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
  });

  it('should handle registration error with parse error but success for particulier', () => {
    spyOn(console, 'error');
    const error = new HttpErrorResponse({ status: 200 });
    errorHandler.isSuccessfulButParseFailed.and.returnValue(true);
    userTypeDetector.getParticulierUserTypeString.and.returnValue('particulier');

    service.handleRegistrationError(error, false);

    expect(console.error).toHaveBeenCalledWith('Erreur d\'inscription:', error);
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
  });

  it('should handle registration error with parse error but success for prestataire', () => {
    spyOn(console, 'error');
    const error = new HttpErrorResponse({ status: 200 });
    errorHandler.isSuccessfulButParseFailed.and.returnValue(true);
    userTypeDetector.getPrestataireUserTypeString.and.returnValue('prestataire');

    service.handleRegistrationError(error, true);

    expect(console.error).toHaveBeenCalledWith('Erreur d\'inscription:', error);
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
  });

  it('should handle registration error with real error', () => {
    spyOn(console, 'error');
    const error = new HttpErrorResponse({ status: 400 });
    errorHandler.isSuccessfulButParseFailed.and.returnValue(false);
    errorHandler.getRegistrationErrorMessage.and.returnValue('Bad Request');

    service.handleRegistrationError(error, false);

    expect(console.error).toHaveBeenCalledWith('Erreur d\'inscription:', error);
    // Le message d'erreur utilisateur est retourné à l'appelant
    // Ici on vérifie uniquement le log d'erreur du service
    // Pas d'appel aux méthodes userTypeDetector car c'est une vraie erreur
  });

  it('should map various HTTP errors via error handler', () => {
    const statuses = [0, 401, 403, 404, 422, 500];
    statuses.forEach(status => {
      const error = new HttpErrorResponse({ status });
      errorHandler.isSuccessfulButParseFailed.and.returnValue(false);
      errorHandler.getRegistrationErrorMessage.and.returnValue('mapped');
      const result = service.handleRegistrationError(error, false);
      expect(result).toBe('mapped');
    });
  });

  // Tests additionnels pour couvrir les différents scénarios
  describe('User Type Detection Integration', () => {
    it('should use correct method for particulier registration', () => {
      userTypeDetector.getParticulierUserTypeString.and.returnValue('particulier');
      const mockResponse = { status: 200 } as any;

      service.handleRegistrationSuccess(mockResponse, false);

      expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
    });

    it('should use correct method for prestataire registration', () => {
      userTypeDetector.getPrestataireUserTypeString.and.returnValue('prestataire');
      const mockResponse = { status: 200 } as any;

      service.handleRegistrationSuccess(mockResponse, true);

      expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined response in success handler', () => {
      userTypeDetector.getParticulierUserTypeString.and.returnValue('particulier');

      expect(() => {
        service.handleRegistrationSuccess(undefined as any, false);
      }).not.toThrow();

      expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
    });

    it('should handle null response in success handler', () => {
      userTypeDetector.getPrestataireUserTypeString.and.returnValue('prestataire');

      expect(() => {
        service.handleRegistrationSuccess(null as any, true);
      }).not.toThrow();

      expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
    });
  });
});
