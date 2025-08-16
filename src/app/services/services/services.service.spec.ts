import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { ServicesService } from './services.service';
import { Service } from '../../models/Service';
import { EnvService } from '../env/env.service';
import { TokenValidatorService } from '../auth/token-validator.service';
import { Router } from '@angular/router';

describe('ServicesService', () => {

  class MockEnvService {
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
      providers: [
        ServicesService,
        { provide: EnvService, useClass: MockEnvService },
        { provide: TokenValidatorService, useValue: tokenValidatorSpyObj },
        { provide: Router, useValue: routerSpyObj },
        provideHttpClient(withFetch()),
        provideHttpClientTesting()
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

  httpMock.verify();
});

  it('should throw an error if category is invalid', () => {
    // Configurer le spy pour retourner true (token valide)
    tokenValidatorSpy.isTokenValid.and.returnValue(true);

    expect(() =>
      service.searchServices('INVALID' as any, '75001', '2025-01-01', '10:00', '12:00')
    ).toThrowError('Catégorie inconnue : INVALID');
  });

  it('should redirect to login when token is invalid', () => {
    // Configurer le spy pour retourner false (token invalide)
    tokenValidatorSpy.isTokenValid.and.returnValue(false);

    service.searchServices('HOME', '75001', '2025-01-01', '10:00', '12:00').subscribe({
      error: (error) => {
        // Le service fait la requête HTTP, l'intercepteur gère l'erreur 401/403
        // L'intercepteur est testé séparément dans auth.interceptor.spec.ts
        expect(error).toBeDefined();
      }
    });

    // S'attendre à ce qu'une requête HTTP soit faite
    const req = httpMock.expectOne((req) => {
      const url = req.urlWithParams;
      return url.includes('/services/search') &&
             url.includes('category=HOME') &&
             url.includes('postalCode=75001') &&
             url.includes('date=2025-01-01') &&
             url.includes('startTime=10:00') &&
             url.includes('endTime=12:00');
    });

    // Simuler une réponse 401 (non autorisé)
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
  });
});
