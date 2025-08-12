import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';

import { authInterceptor } from './interceptors.service';

describe('authInterceptor', () => {
  let mockRequest: HttpRequest<any>;
  let mockHandler: HttpHandlerFn;

  beforeEach(() => {
    mockRequest = new HttpRequest('GET', '/api/test');
    mockHandler = (req) => of({} as any);
    
    // Nettoyer le localStorage avant chaque test
    localStorage.clear();
  });

  describe('Authorization header handling', () => {
    it('should add Authorization header when token exists', () => {
      const token = 'test-token';
      localStorage.setItem('token', token);

      let modifiedRequest: HttpRequest<any> | null = null;
      const mockHandlerWithCapture = (req: HttpRequest<any>) => {
        modifiedRequest = req;
        return of({} as any);
      };

      const result = authInterceptor(mockRequest, mockHandlerWithCapture);
      
      result.subscribe(() => {
        expect(modifiedRequest).toBeTruthy();
        expect(modifiedRequest!.headers.has('Authorization')).toBeTruthy();
        expect(modifiedRequest!.headers.get('Authorization')).toBe(`Bearer ${token}`);
      });
    });

    it('should not add Authorization header when no token exists', () => {
      let modifiedRequest: HttpRequest<any> | null = null;
      const mockHandlerWithCapture = (req: HttpRequest<any>) => {
        modifiedRequest = req;
        return of({} as any);
      };

      const result = authInterceptor(mockRequest, mockHandlerWithCapture);
      
      result.subscribe(() => {
        expect(modifiedRequest).toBeTruthy();
        expect(modifiedRequest!.headers.has('Authorization')).toBeFalsy();
      });
    });

    it('should not add Authorization header when token is empty string', () => {
      localStorage.setItem('token', '');

      let modifiedRequest: HttpRequest<any> | null = null;
      const mockHandlerWithCapture = (req: HttpRequest<any>) => {
        modifiedRequest = req;
        return of({} as any);
      };

      const result = authInterceptor(mockRequest, mockHandlerWithCapture);
      
      result.subscribe(() => {
        expect(modifiedRequest).toBeTruthy();
        expect(modifiedRequest!.headers.has('Authorization')).toBeFalsy();
      });
    });

    it('should add Authorization header when token is whitespace (trimmed)', () => {
      localStorage.setItem('token', '   ');

      let modifiedRequest: HttpRequest<any> | null = null;
      const mockHandlerWithCapture = (req: HttpRequest<any>) => {
        modifiedRequest = req;
        return of({} as any);
      };

      const result = authInterceptor(mockRequest, mockHandlerWithCapture);
      
      result.subscribe(() => {
        expect(modifiedRequest).toBeTruthy();
        expect(modifiedRequest!.headers.has('Authorization')).toBeTruthy();
        expect(modifiedRequest!.headers.get('Authorization')).toBe('Bearer    ');
      });
    });

    it('should add Authorization header with different token values', () => {
      const tokens = ['token1', 'long-token-with-special-chars-123', 'Bearer token'];
      
      tokens.forEach(token => {
        localStorage.setItem('token', token);

        let modifiedRequest: HttpRequest<any> | null = null;
        const mockHandlerWithCapture = (req: HttpRequest<any>) => {
          modifiedRequest = req;
          return of({} as any);
        };

        const result = authInterceptor(mockRequest, mockHandlerWithCapture);
        
        result.subscribe(() => {
          expect(modifiedRequest).toBeTruthy();
          expect(modifiedRequest!.headers.has('Authorization')).toBeTruthy();
          expect(modifiedRequest!.headers.get('Authorization')).toBe(`Bearer ${token}`);
        });
      });
    });

    it('should handle null token value', () => {
      localStorage.setItem('token', 'null');

      let modifiedRequest: HttpRequest<any> | null = null;
      const mockHandlerWithCapture = (req: HttpRequest<any>) => {
        modifiedRequest = req;
        return of({} as any);
      };

      const result = authInterceptor(mockRequest, mockHandlerWithCapture);
      
      result.subscribe(() => {
        expect(modifiedRequest).toBeTruthy();
        expect(modifiedRequest!.headers.has('Authorization')).toBeTruthy();
        expect(modifiedRequest!.headers.get('Authorization')).toBe('Bearer null');
      });
    });

    it('should handle undefined token value', () => {
      localStorage.setItem('token', 'undefined');

      let modifiedRequest: HttpRequest<any> | null = null;
      const mockHandlerWithCapture = (req: HttpRequest<any>) => {
        modifiedRequest = req;
        return of({} as any);
      };

      const result = authInterceptor(mockRequest, mockHandlerWithCapture);
      
      result.subscribe(() => {
        expect(modifiedRequest).toBeTruthy();
        expect(modifiedRequest!.headers.has('Authorization')).toBeTruthy();
        expect(modifiedRequest!.headers.get('Authorization')).toBe('Bearer undefined');
      });
    });
  });

  describe('Error handling', () => {
    it('should handle 401 error and clear localStorage', () => {
      localStorage.setItem('token', 'test-token');
      localStorage.setItem('userRole', 'admin');

      const error401 = new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' });
      const mockHandlerWithError = (req: HttpRequest<any>) => throwError(() => error401);

      const result = authInterceptor(mockRequest, mockHandlerWithError);
      
      result.subscribe({
        error: (error) => {
          expect(error).toBe(error401);
          expect(localStorage.getItem('token')).toBeNull();
          expect(localStorage.getItem('userRole')).toBeNull();
        }
      });
    });

    it('should handle 401 error without existing tokens', () => {
      const error401 = new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' });
      const mockHandlerWithError = (req: HttpRequest<any>) => throwError(() => error401);

      const result = authInterceptor(mockRequest, mockHandlerWithError);
      
      result.subscribe({
        error: (error) => {
          expect(error).toBe(error401);
          expect(localStorage.getItem('token')).toBeNull();
          expect(localStorage.getItem('userRole')).toBeNull();
        }
      });
    });

    it('should handle non-401 errors without clearing localStorage', () => {
      localStorage.setItem('token', 'test-token');
      localStorage.setItem('userRole', 'admin');

      const error404 = new HttpErrorResponse({ status: 404, statusText: 'Not Found' });
      const mockHandlerWithError = (req: HttpRequest<any>) => throwError(() => error404);

      const result = authInterceptor(mockRequest, mockHandlerWithError);
      
      result.subscribe({
        error: (error) => {
          expect(error).toBe(error404);
          expect(localStorage.getItem('token')).toBe('test-token');
          expect(localStorage.getItem('userRole')).toBe('admin');
        }
      });
    });

    it('should handle other HTTP errors (403, 500)', () => {
      localStorage.setItem('token', 'test-token');

      const errors = [
        new HttpErrorResponse({ status: 403, statusText: 'Forbidden' }),
        new HttpErrorResponse({ status: 500, statusText: 'Internal Server Error' })
      ];

      errors.forEach(error => {
        const mockHandlerWithError = (req: HttpRequest<any>) => throwError(() => error);

        const result = authInterceptor(mockRequest, mockHandlerWithError);
        
        result.subscribe({
          error: (err) => {
            expect(err).toBe(error);
            expect(localStorage.getItem('token')).toBe('test-token');
          }
        });
      });
    });

    it('should handle network errors without clearing localStorage', () => {
      localStorage.setItem('token', 'test-token');

      const networkError = new HttpErrorResponse({ 
        error: new Error('Network Error'),
        status: 0,
        statusText: 'Network Error'
      });
      const mockHandlerWithError = (req: HttpRequest<any>) => throwError(() => networkError);

      const result = authInterceptor(mockRequest, mockHandlerWithError);
      
      result.subscribe({
        error: (error) => {
          expect(error).toBe(networkError);
          expect(localStorage.getItem('token')).toBe('test-token');
        }
      });
    });
  });

  describe('Request handling', () => {
    it('should handle different HTTP methods', () => {
      const token = 'test-token';
      localStorage.setItem('token', token);

      const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] as const;
      
      methods.forEach(method => {
        const request = new HttpRequest(method as any, '/api/test');
        
        let modifiedRequest: HttpRequest<any> | null = null;
        const mockHandlerWithCapture = (req: HttpRequest<any>) => {
          modifiedRequest = req;
          return of({} as any);
        };

        const result = authInterceptor(request, mockHandlerWithCapture);
        
        result.subscribe(() => {
          expect(modifiedRequest).toBeTruthy();
          expect(modifiedRequest!.method).toBe(method);
          expect(modifiedRequest!.headers.has('Authorization')).toBeTruthy();
          expect(modifiedRequest!.headers.get('Authorization')).toBe(`Bearer ${token}`);
        });
      });
    });

    it('should handle different URLs', () => {
      const token = 'test-token';
      localStorage.setItem('token', token);

      const urls = [
        '/api/users',
        '/api/services',
        '/api/payments',
        'https://external-api.com/data',
        '/assets/config.json'
      ];
      
      urls.forEach(url => {
        const request = new HttpRequest('GET', url);
        
        let modifiedRequest: HttpRequest<any> | null = null;
        const mockHandlerWithCapture = (req: HttpRequest<any>) => {
          modifiedRequest = req;
          return of({} as any);
        };

        const result = authInterceptor(request, mockHandlerWithCapture);
        
        result.subscribe(() => {
          expect(modifiedRequest).toBeTruthy();
          expect(modifiedRequest!.url).toBe(url);
          expect(modifiedRequest!.headers.has('Authorization')).toBeTruthy();
          expect(modifiedRequest!.headers.get('Authorization')).toBe(`Bearer ${token}`);
        });
      });
    });

    it('should handle requests with body', () => {
      const token = 'test-token';
      localStorage.setItem('token', token);

      const body = { name: 'test', value: 123 };
      const request = new HttpRequest('POST', '/api/test', body);

      let modifiedRequest: HttpRequest<any> | null = null;
      const mockHandlerWithCapture = (req: HttpRequest<any>) => {
        modifiedRequest = req;
        return of({} as any);
      };

      const result = authInterceptor(request, mockHandlerWithCapture);
      
      result.subscribe(() => {
        expect(modifiedRequest).toBeTruthy();
        expect(modifiedRequest!.body).toEqual(body);
        expect(modifiedRequest!.headers.has('Authorization')).toBeTruthy();
        expect(modifiedRequest!.headers.get('Authorization')).toBe(`Bearer ${token}`);
      });
    });

    it('should handle requests with query parameters', () => {
      const token = 'test-token';
      localStorage.setItem('token', token);

      const request = new HttpRequest('GET', '/api/test?param1=value1&param2=value2');

      let modifiedRequest: HttpRequest<any> | null = null;
      const mockHandlerWithCapture = (req: HttpRequest<any>) => {
        modifiedRequest = req;
        return of({} as any);
      };

      const result = authInterceptor(request, mockHandlerWithCapture);
      
      result.subscribe(() => {
        expect(modifiedRequest).toBeTruthy();
        expect(modifiedRequest!.url).toBe('/api/test?param1=value1&param2=value2');
        expect(modifiedRequest!.headers.has('Authorization')).toBeTruthy();
        expect(modifiedRequest!.headers.get('Authorization')).toBe(`Bearer ${token}`);
      });
    });

    it('should handle requests with existing headers', () => {
      const token = 'test-token';
      localStorage.setItem('token', token);

      const request = new HttpRequest('GET', '/api/test');

      let modifiedRequest: HttpRequest<any> | null = null;
      const mockHandlerWithCapture = (req: HttpRequest<any>) => {
        modifiedRequest = req;
        return of({} as any);
      };

      const result = authInterceptor(request, mockHandlerWithCapture);
      
      result.subscribe(() => {
        expect(modifiedRequest).toBeTruthy();
        expect(modifiedRequest!.headers.has('Authorization')).toBeTruthy();
        expect(modifiedRequest!.headers.get('Authorization')).toBe(`Bearer ${token}`);
      });
    });
  });

  describe('Integration tests', () => {
    it('should handle successful request with token', () => {
      const token = 'test-token';
      localStorage.setItem('token', token);

      const response = { data: 'success' };
      let modifiedRequest: HttpRequest<any> | null = null;
      const mockHandlerWithCapture = (req: HttpRequest<any>) => {
        modifiedRequest = req;
        return of(response as any);
      };

      const result = authInterceptor(mockRequest, mockHandlerWithCapture);
      
      result.subscribe((data) => {
        expect(data).toEqual(response as any);
        expect(modifiedRequest).toBeTruthy();
        expect(modifiedRequest!.headers.has('Authorization')).toBeTruthy();
        expect(modifiedRequest!.headers.get('Authorization')).toBe(`Bearer ${token}`);
      });
    });

    it('should handle successful request without token', () => {
      const response = { data: 'success' };
      let modifiedRequest: HttpRequest<any> | null = null;
      const mockHandlerWithCapture = (req: HttpRequest<any>) => {
        modifiedRequest = req;
        return of(response as any);
      };

      const result = authInterceptor(mockRequest, mockHandlerWithCapture);
      
      result.subscribe((data) => {
        expect(data).toEqual(response as any);
        expect(modifiedRequest).toBeTruthy();
        expect(modifiedRequest!.headers.has('Authorization')).toBeFalsy();
      });
    });

    it('should handle successful request with token and then 401 error', () => {
      const token = 'test-token';
      localStorage.setItem('token', token);

      // Premier appel réussi
      const response = { data: 'success' };
      let modifiedRequest: HttpRequest<any> | null = null;
      const mockHandlerWithCapture = (req: HttpRequest<any>) => {
        modifiedRequest = req;
        return of(response as any);
      };

      const result1 = authInterceptor(mockRequest, mockHandlerWithCapture);
      
      result1.subscribe((data) => {
        expect(data).toEqual(response as any);
        expect(modifiedRequest).toBeTruthy();
        expect(modifiedRequest!.headers.has('Authorization')).toBeTruthy();
        expect(modifiedRequest!.headers.get('Authorization')).toBe(`Bearer ${token}`);
      });

      // Deuxième appel avec erreur 401
      const error401 = new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' });
      const mockHandlerWithError = (req: HttpRequest<any>) => throwError(() => error401);

      const result2 = authInterceptor(mockRequest, mockHandlerWithError);
      
      result2.subscribe({
        error: (error) => {
          expect(error).toBe(error401);
          expect(localStorage.getItem('token')).toBeNull();
          expect(localStorage.getItem('userRole')).toBeNull();
        }
      });
    });
  });
});
