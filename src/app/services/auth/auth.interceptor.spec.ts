import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { authInterceptor } from './auth.interceptor';
import { AuthStorageService } from '../login/auth-storage.service';

describe('AuthInterceptor', () => {
  let authStorageSpy: jasmine.SpyObj<AuthStorageService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let mockRequest: HttpRequest<unknown>;
  let mockHandler: HttpHandlerFn;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthStorageService', ['clearAuthenticationData']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthStorageService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj }
      ]
    });

    authStorageSpy = TestBed.inject(AuthStorageService) as jasmine.SpyObj<AuthStorageService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    mockRequest = new HttpRequest('GET', '/api/test');
    mockHandler = jasmine.createSpy('mockHandler').and.returnValue(of({}));
  });

  it('should pass through successful requests', (done) => {
    const response = { data: 'test' };
    mockHandler = jasmine.createSpy('mockHandler').and.returnValue(of(response));

    authInterceptor(mockRequest, mockHandler).subscribe({
      next: (result) => {
        // Vérifier que le résultat est bien passé
        expect(result).toBeDefined();
        done();
      },
      error: done.fail
    });
  });

  it('should handle 401 errors by clearing auth data and redirecting', (done) => {
    const error = new HttpErrorResponse({ status: 401 });
    mockHandler = jasmine.createSpy('mockHandler').and.returnValue(throwError(() => error));

    authInterceptor(mockRequest, mockHandler).subscribe({
      next: () => done.fail('Should have thrown an error'),
      error: (err) => {
        expect(err).toBe(error);
        done();
      }
    });
  });

  it('should handle 403 errors by clearing auth data and redirecting', (done) => {
    const error = new HttpErrorResponse({ status: 403 });
    mockHandler = jasmine.createSpy('mockHandler').and.returnValue(throwError(() => error));

    authInterceptor(mockRequest, mockHandler).subscribe({
      next: () => done.fail('Should have thrown an error'),
      error: (err) => {
        expect(err).toBe(error);
        done();
      }
    });
  });

  it('should pass through other errors without modification', (done) => {
    const error = new HttpErrorResponse({ status: 500 });
    mockHandler = jasmine.createSpy('mockHandler').and.returnValue(throwError(() => error));

    authInterceptor(mockRequest, mockHandler).subscribe({
      next: () => done.fail('Should have thrown an error'),
      error: (err) => {
        expect(err).toBe(error);
        expect(authStorageSpy.clearAuthenticationData).not.toHaveBeenCalled();
        expect(routerSpy.navigate).not.toHaveBeenCalled();
        done();
      }
    });
  });
});
