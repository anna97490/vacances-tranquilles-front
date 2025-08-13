import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { authInterceptor } from './auth.interceptor';
import { AuthStorageService } from '../login/auth-storage.service';
import { NotificationService } from '../notification/notification.service';
import { runInInjectionContext } from '@angular/core';

describe('AuthInterceptor', () => {
  let authStorageSpy: jasmine.SpyObj<AuthStorageService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  let mockRequest: HttpRequest<unknown>;
  let mockHandler: HttpHandlerFn;
  let injector: any;

  beforeEach(() => {
<<<<<<< HEAD
    const authSpy = jasmine.createSpyObj('AuthStorageService', ['clearAuthenticationData', 'getToken']);
=======
    const authSpy = jasmine.createSpyObj('AuthStorageService', ['clearAuthenticationData']);
>>>>>>> staging
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const notificationSpy = jasmine.createSpyObj('NotificationService', ['sessionExpired']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthStorageService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj },
        { provide: NotificationService, useValue: notificationSpy }
      ]
    });

    injector = TestBed.inject;
    authStorageSpy = TestBed.inject(AuthStorageService) as jasmine.SpyObj<AuthStorageService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    notificationServiceSpy = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;

<<<<<<< HEAD
    // Configurer les valeurs de retour par défaut pour les méthodes authStorage
    authStorageSpy.getToken.and.returnValue('mock-token');

=======
>>>>>>> staging
    mockRequest = new HttpRequest('GET', '/api/test');
    mockHandler = jasmine.createSpy('mockHandler').and.returnValue(of({}));
  });

  it('should pass through successful requests', (done) => {
    const response = { type: 0, body: { data: 'test' } };
    mockHandler = jasmine.createSpy('mockHandler').and.returnValue(of(response));

    runInInjectionContext(TestBed, () => {
      authInterceptor(mockRequest, mockHandler).subscribe({
        next: (result) => {
          expect(result).toBeDefined();
          expect(result).toEqual(response);
          done();
        },
        error: done.fail
      });
    });
  });

  it('should handle 401 errors by clearing auth data, showing notification and redirecting', (done) => {
    const error = new HttpErrorResponse({ status: 401 });
    mockHandler = jasmine.createSpy('mockHandler').and.returnValue(throwError(() => error));

    runInInjectionContext(TestBed, () => {
      authInterceptor(mockRequest, mockHandler).subscribe({
        next: () => done.fail('Should have thrown an error'),
        error: (err) => {
          expect(authStorageSpy.clearAuthenticationData).toHaveBeenCalled();
          expect(notificationServiceSpy.sessionExpired).toHaveBeenCalled();
          expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/login']);
          expect(err.message).toBe('Session expirée. Veuillez vous reconnecter.');
          done();
        }
      });
    });
  });

  it('should handle 403 errors by clearing auth data, showing notification and redirecting', (done) => {
    const error = new HttpErrorResponse({ status: 403 });
    mockHandler = jasmine.createSpy('mockHandler').and.returnValue(throwError(() => error));

    runInInjectionContext(TestBed, () => {
      authInterceptor(mockRequest, mockHandler).subscribe({
        next: () => done.fail('Should have thrown an error'),
        error: (err) => {
          expect(authStorageSpy.clearAuthenticationData).toHaveBeenCalled();
          expect(notificationServiceSpy.sessionExpired).toHaveBeenCalled();
          expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/login']);
          expect(err.message).toBe('Session expirée. Veuillez vous reconnecter.');
          done();
        }
      });
    });
  });

  it('should pass through other errors without modification', (done) => {
    const error = new HttpErrorResponse({ status: 500 });
    mockHandler = jasmine.createSpy('mockHandler').and.returnValue(throwError(() => error));

    runInInjectionContext(TestBed, () => {
      authInterceptor(mockRequest, mockHandler).subscribe({
        next: () => done.fail('Should have thrown an error'),
        error: (err) => {
          expect(err).toBe(error);
          expect(authStorageSpy.clearAuthenticationData).not.toHaveBeenCalled();
          expect(notificationServiceSpy.sessionExpired).not.toHaveBeenCalled();
          expect(routerSpy.navigate).not.toHaveBeenCalled();
          done();
        }
      });
    });
  });

  it('should handle injection errors gracefully', (done) => {
    // Mock inject to throw an error
    spyOn(TestBed, 'inject').and.throwError('Injection error');
    
    const response = { type: 0, body: { data: 'test' } };
    mockHandler = jasmine.createSpy('mockHandler').and.returnValue(of(response));

    runInInjectionContext(TestBed, () => {
      authInterceptor(mockRequest, mockHandler).subscribe({
        next: (result) => {
          expect(result).toBeDefined();
          expect(result).toEqual(response);
          done();
        },
        error: done.fail
      });
    });
  });

  it('should handle 404 errors without authentication actions', (done) => {
    const error = new HttpErrorResponse({ status: 404 });
    mockHandler = jasmine.createSpy('mockHandler').and.returnValue(throwError(() => error));

    runInInjectionContext(TestBed, () => {
      authInterceptor(mockRequest, mockHandler).subscribe({
        next: () => done.fail('Should have thrown an error'),
        error: (err) => {
          expect(err).toBe(error);
          expect(authStorageSpy.clearAuthenticationData).not.toHaveBeenCalled();
          expect(notificationServiceSpy.sessionExpired).not.toHaveBeenCalled();
          expect(routerSpy.navigate).not.toHaveBeenCalled();
          done();
        }
      });
    });
  });

  it('should handle 400 errors without authentication actions', (done) => {
    const error = new HttpErrorResponse({ status: 400 });
    mockHandler = jasmine.createSpy('mockHandler').and.returnValue(throwError(() => error));

    runInInjectionContext(TestBed, () => {
      authInterceptor(mockRequest, mockHandler).subscribe({
        next: () => done.fail('Should have thrown an error'),
        error: (err) => {
          expect(err).toBe(error);
          expect(authStorageSpy.clearAuthenticationData).not.toHaveBeenCalled();
          expect(notificationServiceSpy.sessionExpired).not.toHaveBeenCalled();
          expect(routerSpy.navigate).not.toHaveBeenCalled();
          done();
        }
      });
    });
  });

  it('should handle 502 errors without authentication actions', (done) => {
    const error = new HttpErrorResponse({ status: 502 });
    mockHandler = jasmine.createSpy('mockHandler').and.returnValue(throwError(() => error));

    runInInjectionContext(TestBed, () => {
      authInterceptor(mockRequest, mockHandler).subscribe({
        next: () => done.fail('Should have thrown an error'),
        error: (err) => {
          expect(err).toBe(error);
          expect(authStorageSpy.clearAuthenticationData).not.toHaveBeenCalled();
          expect(notificationServiceSpy.sessionExpired).not.toHaveBeenCalled();
          expect(routerSpy.navigate).not.toHaveBeenCalled();
          done();
        }
      });
    });
  });

  it('should handle 503 errors without authentication actions', (done) => {
    const error = new HttpErrorResponse({ status: 503 });
    mockHandler = jasmine.createSpy('mockHandler').and.returnValue(throwError(() => error));

    runInInjectionContext(TestBed, () => {
      authInterceptor(mockRequest, mockHandler).subscribe({
        next: () => done.fail('Should have thrown an error'),
        error: (err) => {
          expect(err).toBe(error);
          expect(authStorageSpy.clearAuthenticationData).not.toHaveBeenCalled();
          expect(notificationServiceSpy.sessionExpired).not.toHaveBeenCalled();
          expect(routerSpy.navigate).not.toHaveBeenCalled();
          done();
        }
      });
    });
  });

  it('should handle 504 errors without authentication actions', (done) => {
    const error = new HttpErrorResponse({ status: 504 });
    mockHandler = jasmine.createSpy('mockHandler').and.returnValue(throwError(() => error));

    runInInjectionContext(TestBed, () => {
      authInterceptor(mockRequest, mockHandler).subscribe({
        next: () => done.fail('Should have thrown an error'),
        error: (err) => {
          expect(err).toBe(error);
          expect(authStorageSpy.clearAuthenticationData).not.toHaveBeenCalled();
          expect(notificationServiceSpy.sessionExpired).not.toHaveBeenCalled();
          expect(routerSpy.navigate).not.toHaveBeenCalled();
          done();
        }
      });
    });
  });

  it('should handle 422 errors without authentication actions', (done) => {
    const error = new HttpErrorResponse({ status: 422 });
    mockHandler = jasmine.createSpy('mockHandler').and.returnValue(throwError(() => error));

    runInInjectionContext(TestBed, () => {
      authInterceptor(mockRequest, mockHandler).subscribe({
        next: () => done.fail('Should have thrown an error'),
        error: (err) => {
          expect(err).toBe(error);
          expect(authStorageSpy.clearAuthenticationData).not.toHaveBeenCalled();
          expect(notificationServiceSpy.sessionExpired).not.toHaveBeenCalled();
          expect(routerSpy.navigate).not.toHaveBeenCalled();
          done();
        }
      });
    });
  });

  it('should handle 429 errors without authentication actions', (done) => {
    const error = new HttpErrorResponse({ status: 429 });
    mockHandler = jasmine.createSpy('mockHandler').and.returnValue(throwError(() => error));

    runInInjectionContext(TestBed, () => {
      authInterceptor(mockRequest, mockHandler).subscribe({
        next: () => done.fail('Should have thrown an error'),
        error: (err) => {
          expect(err).toBe(error);
          expect(authStorageSpy.clearAuthenticationData).not.toHaveBeenCalled();
          expect(notificationServiceSpy.sessionExpired).not.toHaveBeenCalled();
          expect(routerSpy.navigate).not.toHaveBeenCalled();
          done();
        }
      });
    });
  });

  it('should handle successful requests with different HTTP methods', (done) => {
    const postRequest = new HttpRequest('POST', '/api/test', { data: 'test' });
    const response = { type: 0, body: { success: true } };
    mockHandler = jasmine.createSpy('mockHandler').and.returnValue(of(response));

    runInInjectionContext(TestBed, () => {
      authInterceptor(postRequest, mockHandler).subscribe({
        next: (result) => {
          expect(result).toBeDefined();
          expect(result).toEqual(response);
          done();
        },
        error: done.fail
      });
    });
  });

  it('should handle successful requests with PUT method', (done) => {
    const putRequest = new HttpRequest('PUT', '/api/test', { data: 'test' });
    const response = { type: 0, body: { updated: true } };
    mockHandler = jasmine.createSpy('mockHandler').and.returnValue(of(response));

    runInInjectionContext(TestBed, () => {
      authInterceptor(putRequest, mockHandler).subscribe({
        next: (result) => {
          expect(result).toBeDefined();
          expect(result).toEqual(response);
          done();
        },
        error: done.fail
      });
    });
  });

  it('should handle successful requests with DELETE method', (done) => {
    const deleteRequest = new HttpRequest('DELETE', '/api/test');
    const response = { type: 0, body: { deleted: true } };
    mockHandler = jasmine.createSpy('mockHandler').and.returnValue(of(response));

    runInInjectionContext(TestBed, () => {
      authInterceptor(deleteRequest, mockHandler).subscribe({
        next: (result) => {
          expect(result).toBeDefined();
          expect(result).toEqual(response);
          done();
        },
        error: done.fail
      });
    });
  });

  it('should handle successful requests with PATCH method', (done) => {
    const patchRequest = new HttpRequest('PATCH', '/api/test', { data: 'test' });
    const response = { type: 0, body: { patched: true } };
    mockHandler = jasmine.createSpy('mockHandler').and.returnValue(of(response));

    runInInjectionContext(TestBed, () => {
      authInterceptor(patchRequest, mockHandler).subscribe({
        next: (result) => {
          expect(result).toBeDefined();
          expect(result).toEqual(response);
          done();
        },
        error: done.fail
      });
    });
  });

  it('should handle successful requests with HEAD method', (done) => {
    const headRequest = new HttpRequest('HEAD', '/api/test');
    const response = { type: 0, body: null };
    mockHandler = jasmine.createSpy('mockHandler').and.returnValue(of(response));

    runInInjectionContext(TestBed, () => {
      authInterceptor(headRequest, mockHandler).subscribe({
        next: (result) => {
          expect(result).toBeDefined();
          expect(result).toEqual(response);
          done();
        },
        error: done.fail
      });
    });
  });

  it('should handle successful requests with OPTIONS method', (done) => {
    const optionsRequest = new HttpRequest('OPTIONS', '/api/test');
    const response = { type: 0, body: { methods: ['GET', 'POST'] } };
    mockHandler = jasmine.createSpy('mockHandler').and.returnValue(of(response));

    runInInjectionContext(TestBed, () => {
      authInterceptor(optionsRequest, mockHandler).subscribe({
        next: (result) => {
          expect(result).toBeDefined();
          expect(result).toEqual(response);
          done();
        },
        error: done.fail
      });
    });
  });

  it('should handle 408 errors without authentication actions', (done) => {
    const error = new HttpErrorResponse({ status: 408 });
    mockHandler = jasmine.createSpy('mockHandler').and.returnValue(throwError(() => error));

    runInInjectionContext(TestBed, () => {
      authInterceptor(mockRequest, mockHandler).subscribe({
        next: () => done.fail('Should have thrown an error'),
        error: (err) => {
          expect(err).toBe(error);
          expect(authStorageSpy.clearAuthenticationData).not.toHaveBeenCalled();
          expect(notificationServiceSpy.sessionExpired).not.toHaveBeenCalled();
          expect(routerSpy.navigate).not.toHaveBeenCalled();
          done();
        }
      });
    });
  });

  it('should handle 409 errors without authentication actions', (done) => {
    const error = new HttpErrorResponse({ status: 409 });
    mockHandler = jasmine.createSpy('mockHandler').and.returnValue(throwError(() => error));

    runInInjectionContext(TestBed, () => {
      authInterceptor(mockRequest, mockHandler).subscribe({
        next: () => done.fail('Should have thrown an error'),
        error: (err) => {
          expect(err).toBe(error);
          expect(authStorageSpy.clearAuthenticationData).not.toHaveBeenCalled();
          expect(notificationServiceSpy.sessionExpired).not.toHaveBeenCalled();
          expect(routerSpy.navigate).not.toHaveBeenCalled();
          done();
        }
      });
    });
  });

  it('should handle 500 errors without authentication actions', (done) => {
    const error = new HttpErrorResponse({ status: 500 });
    mockHandler = jasmine.createSpy('mockHandler').and.returnValue(throwError(() => error));

    runInInjectionContext(TestBed, () => {
      authInterceptor(mockRequest, mockHandler).subscribe({
        next: () => done.fail('Should have thrown an error'),
        error: (err) => {
          expect(err).toBe(error);
          expect(authStorageSpy.clearAuthenticationData).not.toHaveBeenCalled();
          expect(notificationServiceSpy.sessionExpired).not.toHaveBeenCalled();
          expect(routerSpy.navigate).not.toHaveBeenCalled();
          done();
        }
      });
    });
  });

  it('should handle 501 errors without authentication actions', (done) => {
    const error = new HttpErrorResponse({ status: 501 });
    mockHandler = jasmine.createSpy('mockHandler').and.returnValue(throwError(() => error));

    runInInjectionContext(TestBed, () => {
      authInterceptor(mockRequest, mockHandler).subscribe({
        next: () => done.fail('Should have thrown an error'),
        error: (err) => {
          expect(err).toBe(error);
          expect(authStorageSpy.clearAuthenticationData).not.toHaveBeenCalled();
          expect(notificationServiceSpy.sessionExpired).not.toHaveBeenCalled();
          expect(routerSpy.navigate).not.toHaveBeenCalled();
          done();
        }
      });
    });
  });

  it('should handle 505 errors without authentication actions', (done) => {
    const error = new HttpErrorResponse({ status: 505 });
    mockHandler = jasmine.createSpy('mockHandler').and.returnValue(throwError(() => error));

    runInInjectionContext(TestBed, () => {
      authInterceptor(mockRequest, mockHandler).subscribe({
        next: () => done.fail('Should have thrown an error'),
        error: (err) => {
          expect(err).toBe(error);
          expect(authStorageSpy.clearAuthenticationData).not.toHaveBeenCalled();
          expect(notificationServiceSpy.sessionExpired).not.toHaveBeenCalled();
          expect(routerSpy.navigate).not.toHaveBeenCalled();
          done();
        }
      });
    });
  });

  it('should handle requests with different URLs', (done) => {
    const differentRequest = new HttpRequest('GET', '/api/different');
    const response = { type: 0, body: { different: true } };
    mockHandler = jasmine.createSpy('mockHandler').and.returnValue(of(response));

    runInInjectionContext(TestBed, () => {
      authInterceptor(differentRequest, mockHandler).subscribe({
        next: (result) => {
          expect(result).toBeDefined();
          expect(result).toEqual(response);
          done();
        },
        error: done.fail
      });
    });
  });

  it('should handle requests with query parameters', (done) => {
    const queryRequest = new HttpRequest('GET', '/api/test?param=value');
    const response = { type: 0, body: { query: true } };
    mockHandler = jasmine.createSpy('mockHandler').and.returnValue(of(response));

    runInInjectionContext(TestBed, () => {
      authInterceptor(queryRequest, mockHandler).subscribe({
        next: (result) => {
          expect(result).toBeDefined();
          expect(result).toEqual(response);
          done();
        },
        error: done.fail
      });
    });
  });

  it('should handle requests with headers', (done) => {
    const headerRequest = new HttpRequest('GET', '/api/test');
    const response = { type: 0, body: { header: true } };
    mockHandler = jasmine.createSpy('mockHandler').and.returnValue(of(response));

    runInInjectionContext(TestBed, () => {
      authInterceptor(headerRequest, mockHandler).subscribe({
        next: (result) => {
          expect(result).toBeDefined();
          expect(result).toEqual(response);
          done();
        },
        error: done.fail
      });
    });
  });
});
