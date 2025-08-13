import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ServicesService } from './services.service';
import { Service } from '../../models/Service';
<<<<<<< HEAD
import { EnvService } from '../env/env.service';
=======
import { ConfigService } from '../config/config.service';
>>>>>>> staging
import { TokenValidatorService } from '../auth/token-validator.service';
import { Router } from '@angular/router';

describe('ServicesService', () => {

<<<<<<< HEAD
  class MockEnvService {
=======
  class MockConfigService {
>>>>>>> staging
    apiUrl = 'http://mock-api/api';
  }

  let service: ServicesService;
  let httpMock: HttpTestingController;
  let tokenValidatorSpy: jasmine.SpyObj<TokenValidatorService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const tokenValidatorSpyObj = jasmine.createSpyObj('TokenValidatorService', ['isTokenValid']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ServicesService,
<<<<<<< HEAD
        { provide: EnvService, useClass: MockEnvService },
=======
        { provide: ConfigService, useClass: MockConfigService },
>>>>>>> staging
        { provide: TokenValidatorService, useValue: tokenValidatorSpyObj },
        { provide: Router, useValue: routerSpyObj }
      ]
    });

    service = TestBed.inject(ServicesService);
    httpMock = TestBed.inject(HttpTestingController);
    tokenValidatorSpy = TestBed.inject(TokenValidatorService) as jasmine.SpyObj<TokenValidatorService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

it('should send GET request with correct parameters', () => {
  // Configurer le spy pour retourner true (token valide)
  tokenValidatorSpy.isTokenValid.and.returnValue(true);
  
  // Configurer localStorage pour avoir un token
  spyOn(localStorage, 'getItem').and.returnValue('mock-token');

  service.searchServices(
    'HOME',
    '75001',
    '2025-01-01',
    '10:00',
    '12:00'
  ).subscribe();

  const req = httpMock.expectOne((req) => {
    const url = req.urlWithParams;
    return url.includes('/services/search') &&
           url.includes('category=HOME') &&
           url.includes('postalCode=75001') &&
           url.includes('date=2025-01-01') &&
           url.includes('startTime=10:00') &&
           url.includes('endTime=12:00');
  });

  expect(req.request.method).toBe('GET');

  // Simule une réponse vide
  req.flush([]);

  httpMock.verify(); // ✅ important pour valider qu'aucune requête oubliée
});

  it('should throw an error if category is invalid', () => {
    // Configurer le spy pour retourner true (token valide)
    tokenValidatorSpy.isTokenValid.and.returnValue(true);
    
    expect(() =>
      service.searchServices('INVALID' as any, '75001', '2025-01-01', '10:00', '12:00')
    ).toThrowError('Catégorie inconnue : INVALID');
  });

<<<<<<< HEAD
  it('should make HTTP request even when token is invalid (interceptor handles auth)', () => {
    // Configurer le spy pour retourner false (token invalide)
    tokenValidatorSpy.isTokenValid.and.returnValue(false);
    
    // Configurer localStorage pour avoir un token
    spyOn(localStorage, 'getItem').and.returnValue('mock-token');

    service.searchServices('HOME', '75001', '2025-01-01', '10:00', '12:00').subscribe();

    const req = httpMock.expectOne((req) => {
      const url = req.urlWithParams;
      return url.includes('/services/search') &&
             url.includes('category=HOME') &&
             url.includes('postalCode=75001') &&
             url.includes('date=2025-01-01') &&
             url.includes('startTime=10:00') &&
             url.includes('endTime=12:00');
    });

    expect(req.request.method).toBe('GET');

    // Simule une réponse vide
    req.flush([]);

    httpMock.verify();
=======
  it('should redirect to login when token is invalid', () => {
    // Configurer le spy pour retourner false (token invalide)
    tokenValidatorSpy.isTokenValid.and.returnValue(false);

    service.searchServices('HOME', '75001', '2025-01-01', '10:00', '12:00').subscribe({
      error: (error) => {
        expect(error.message).toBe('Session expirée. Veuillez vous reconnecter.');
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/login']);
      }
    });
>>>>>>> staging
  });
});
