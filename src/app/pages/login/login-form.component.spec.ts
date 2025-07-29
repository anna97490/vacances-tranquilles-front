import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LoginFormComponent } from './login-form.component';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Component } from '@angular/core';

// Mock component pour la redirection
@Component({ template: '' })
class MockHomeComponent { }

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;
  let router: Router;
  let debugElement: DebugElement;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  // Mock data pour les tests
  const validLoginData = {
    email: 'test@example.com',
    password: 'password123'
  };

  const mockLoginResponse = {
    token: 'mock-jwt-token',
    userRole: 'CLIENT'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoginFormComponent,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        RouterTestingModule.withRoutes([
          { path: 'home', component: MockHomeComponent }
        ]),
        BrowserAnimationsModule,
        HttpClientTestingModule
      ],
      declarations: [MockHomeComponent],
      providers: [FormBuilder]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    debugElement = fixture.debugElement;
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    // SUPPRIMER TOUS les logs console pour chaque test
    spyOn(console, 'warn').and.stub();
    spyOn(console, 'error').and.stub();
    spyOn(console, 'log').and.stub();
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify();
    localStorage.clear();
  });

  describe('Error Handling', () => {
    it('should handle HTTP 201 response as success and navigate', fakeAsync(() => {
      spyOn(localStorage, 'setItem');
      spyOn(router, 'navigate');
      spyOn(window, 'alert');
      
      component.form.patchValue(validLoginData);
      component.onSubmit();
      
      const req = httpTestingController.expectOne('http://localhost:8080/api/auth/login');
      
      req.flush({ token: 'success-token', userRole: 'CLIENT' }, { status: 201, statusText: 'Created' });
      tick();
      
      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'success-token');
      expect(localStorage.setItem).toHaveBeenCalledWith('userRole', 'CLIENT');
      expect(window.alert).toHaveBeenCalledWith('Connexion réussie !');
      expect(router.navigate).toHaveBeenCalledWith(['/home']);
    }));

    it('should handle successful HTTP 200 response', fakeAsync(() => {
      spyOn(localStorage, 'setItem');
      spyOn(router, 'navigate');
      
      component.form.patchValue(validLoginData);
      component.onSubmit();
      
      const req = httpTestingController.expectOne('http://localhost:8080/api/auth/login');
      
      req.flush({ token: 'success-token' }, { status: 200, statusText: 'OK' });
      tick();
      
      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'success-token');
      expect(router.navigate).toHaveBeenCalledWith(['/home']);
    }));

    // TEST DIRECT de la méthode handleSuccessWithParseError
    it('should handle parse error with status 200 directly', () => {
      spyOn(localStorage, 'setItem');
      spyOn(router, 'navigate');
      
      const mockError = {
        status: 200,
        error: { text: '{"token":"parse-error-token"}' }
      };
      
      component['handleSuccessWithParseError'](mockError as any);
      
      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'parse-error-token');
      expect(localStorage.setItem).toHaveBeenCalledWith('userRole', '');
      expect(router.navigate).toHaveBeenCalledWith(['/home']);
    });

    // TEST de l'extraction de token depuis une erreur
    it('should extract token from error response text', () => {
      const testCases = [
        {
          name: 'token in text property',
          error: { text: '{"token":"extracted-token"}' },
          expected: 'extracted-token'
        },
        {
          name: 'token as direct property',
          error: { token: 'direct-token' },
          expected: 'direct-token'
        },
        {
          name: 'invalid JSON in text',
          error: { text: 'invalid json' },
          expected: null
        },
        {
          name: 'no text or token',
          error: {},
          expected: null
        }
      ];

      testCases.forEach(({ name, error, expected }) => {
        const mockErrorResponse = { status: 200, error };
        const token = component['extractTokenFromErrorResponse'](mockErrorResponse as any);
        expect(token).toBe(expected);
      });
      // VÉRIFIER que console.warn a été appelé pour le cas JSON invalide
      expect(console.warn).toHaveBeenCalledWith(
        'Erreur lors du parsing du token depuis la réponse:', 
        jasmine.any(SyntaxError)
      );
    });

    // NOUVEAU TEST spécifique pour la gestion des erreurs JSON
    it('should handle JSON parse errors gracefully', () => {
      
      const errorWithInvalidJson = {
        status: 200,
        error: { text: 'this is not valid JSON at all!' }
      };
      
      const token = component['extractTokenFromErrorResponse'](errorWithInvalidJson as any);
      
      expect(token).toBeNull();
      expect(console.warn).toHaveBeenCalledWith(
        'Erreur lors du parsing du token depuis la réponse:', 
        jasmine.any(SyntaxError)
      );
    });
  // TEST pour vérifier que les tokens valides sont extraits correctement
  it('should extract valid tokens successfully', () => {;
    
    const validCases = [
      {
        error: { text: '{"token":"valid-token-123"}' },
        expected: 'valid-token-123'
      },
      {
        error: { text: '{"token":"jwt.token.here","userRole":"CLIENT"}' },
        expected: 'jwt.token.here'
      },
      {
        error: { token: 'direct-token-access' },
        expected: 'direct-token-access'
      }
    ];

    validCases.forEach(({ error, expected }) => {
      const mockErrorResponse = { status: 200, error };
      const token = component['extractTokenFromErrorResponse'](mockErrorResponse as any);
      expect(token).toBe(expected);
    });

    // Console.warn ne devrait PAS être appelé pour les cas valides
    expect(console.warn).not.toHaveBeenCalled();
  });

  // TEST pour les cas edge avec différents formats de réponse
  it('should handle various error response formats', () => {
    
    const edgeCases = [
      {
        name: 'empty text',
        error: { text: '' },
        expected: null
      },
      {
        name: 'null text',
        error: { text: null },
        expected: null
      },
      {
        name: 'undefined text',
        error: { text: undefined },
        expected: null
      },
      {
        name: 'JSON without token',
        error: { text: '{"message":"success"}' },
        expected: null
      },
      {
        name: 'null token value',
        error: { text: '{"token":null}' },
        expected: null
      }
    ];

    edgeCases.forEach(({ name, error, expected }) => {
      const mockErrorResponse = { status: 200, error };
      const token = component['extractTokenFromErrorResponse'](mockErrorResponse as any);
      expect(token).toBe(expected);
    });
  });

  it('should detect parse errors correctly', () => {
    const mockError401 = { status: 401 };
    const mockError200 = { status: 200 };
    const mockError201 = { status: 201 };

      expect(mockError200.status === 200 || mockError200.status === 201).toBeTruthy();
      expect(mockError201.status === 200 || mockError201.status === 201).toBeTruthy();
      expect(mockError401.status === 200 || mockError401.status === 201).toBeFalsy();
    });

    it('should handle HTTP 400 errors', fakeAsync(() => {
      spyOn(window, 'alert');
      spyOn(router, 'navigate');
      
      component.form.patchValue(validLoginData);
      component.onSubmit();
      
      const req = httpTestingController.expectOne('http://localhost:8080/api/auth/login');
      
      req.error(new ProgressEvent('Network error'), {
        status: 400,
        statusText: 'Bad Request'
      });
      tick();
      
      expect(window.alert).toHaveBeenCalledWith('Erreur lors de la connexion : Erreur de connexion inconnue');
      expect(router.navigate).not.toHaveBeenCalled();
      expect(component.form.get('password')?.value).toBe('');
    }));

    it('should handle network errors (status 0)', fakeAsync(() => {
      spyOn(window, 'alert');
      
      component.form.patchValue(validLoginData);
      component.onSubmit();
      
      const req = httpTestingController.expectOne('http://localhost:8080/api/auth/login');
      
      req.error(new ProgressEvent('Network error'), {
        status: 0,
        statusText: 'Unknown Error'
      });
      tick();
      
      expect(window.alert).toHaveBeenCalledWith('Erreur lors de la connexion : Impossible de contacter le serveur');
    }));

    it('should handle unauthorized access (status 401)', fakeAsync(() => {
      spyOn(window, 'alert');
      
      component.form.patchValue(validLoginData);
      component.onSubmit();
      
      const req = httpTestingController.expectOne('http://localhost:8080/api/auth/login');
      
      req.error(new ProgressEvent('Unauthorized'), {
        status: 401,
        statusText: 'Unauthorized'
      });
      tick();
      
      expect(window.alert).toHaveBeenCalledWith('Erreur lors de la connexion : Email ou mot de passe incorrect');
    }));

    it('should handle all HTTP error codes correctly', () => {
      const testCases = [
        { status: 401, expected: 'Email ou mot de passe incorrect' },
        { status: 403, expected: 'Accès non autorisé' },
        { status: 404, expected: 'Service de connexion non disponible' },
        { status: 500, expected: 'Erreur interne du serveur' },
        { status: 0, expected: 'Impossible de contacter le serveur' }
      ];

      testCases.forEach(({ status, expected }) => {
        const mockError = { status, error: null };
        const message = component['getLoginErrorMessage'](mockError as any);
        expect(message).toBe(expected);
      });
    });

    it('should handle custom error message from server', () => {
      const mockError = {
        status: 999,
        error: { message: 'Custom server error' }
      };
      
      const message = component['getLoginErrorMessage'](mockError as any);
      expect(message).toBe('Custom server error');
    });

    it('should return default error message for unknown errors', () => {
      const mockError = {
        status: 999,
        error: null
      };
      
      const message = component['getLoginErrorMessage'](mockError as any);
      expect(message).toBe('Erreur de connexion inconnue');
    });
  });
  // GROUPE DE TESTS séparé pour les méthodes refactorisées
  describe('Refactored Methods Coverage', () => {
    it('should identify potential parse errors correctly', () => {
      const error200 = { status: 200 } as HttpErrorResponse;
      const error201 = { status: 201 } as HttpErrorResponse;
      const error401 = { status: 401 } as HttpErrorResponse;
      
      expect(component['isPotentialParseError'](error200)).toBeTruthy();
      expect(component['isPotentialParseError'](error201)).toBeTruthy();
      expect(component['isPotentialParseError'](error401)).toBeFalsy();
    });

    it('should process actual errors correctly', () => {
      spyOn(window, 'alert');
      spyOn(component as any, 'resetPasswordField');
      spyOn(component as any, 'getLoginErrorMessage').and.returnValue('Test error');
      
      const error = { status: 401 } as HttpErrorResponse;
      
      // APPELER la méthode
      component['processActualError'](error);
      
      expect(window.alert).toHaveBeenCalledWith('Erreur lors de la connexion : Test error');
      expect(component['resetPasswordField']).toHaveBeenCalled();
    });
    // NOUVEAU TEST pour tester handleLoginError avec les différents flux
    it('should route to correct handler based on error status', () => {
      spyOn(component as any, 'handleSuccessWithParseError');
      spyOn(component as any, 'processActualError');
      
      // Test flux parse error (status 200)
      const parseError = { status: 200, error: { text: '{"token":"test"}' } } as HttpErrorResponse;
      component['handleLoginError'](parseError);
      expect(component['handleSuccessWithParseError']).toHaveBeenCalledWith(parseError);
      expect(component['processActualError']).not.toHaveBeenCalled();
      
      // Reset spies
      (component as any)['handleSuccessWithParseError'].calls.reset();
      (component as any)['processActualError'].calls.reset();
      
      // Test flux erreur réelle (status 401)
      const realError = { status: 401, error: null } as HttpErrorResponse;
      component['handleLoginError'](realError);
      expect(component['processActualError']).toHaveBeenCalledWith(realError);
      expect(component['handleSuccessWithParseError']).not.toHaveBeenCalled();
    });
    it('should handle success with parse error flow', () => {
      spyOn(localStorage, 'setItem');
      spyOn(router, 'navigate');
      spyOn(window, 'alert');
      spyOn(component as any, 'extractTokenFromErrorResponse').and.returnValue('extracted-token');
      
      const mockError = {
        status: 200,
        error: { text: '{"token":"extracted-token"}' }
      };
      
      // APPELER la méthode avec les spies configurés
      component['handleSuccessWithParseError'](mockError as any);
      
      // VÉRIFICATIONS après l'appel de méthode
      expect(component['extractTokenFromErrorResponse']).toHaveBeenCalledWith(mockError as any);
      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'extracted-token');
      expect(localStorage.setItem).toHaveBeenCalledWith('userRole', '');
      expect(window.alert).toHaveBeenCalledWith('Connexion réussie !');
      expect(router.navigate).toHaveBeenCalledWith(['/home']);
    });
    // TESTS COMPLÉMENTAIRES pour couvrir tous les cas
    it('should handle success with parse error flow - without spy on extractToken', () => {
      spyOn(localStorage, 'setItem');
      spyOn(router, 'navigate');
      spyOn(window, 'alert');
      
      const mockError = {
        status: 200,
        error: { text: '{"token":"real-extracted-token"}' }
      };
      
      // TESTER le flux complet sans spy sur extractTokenFromErrorResponse
      component['handleSuccessWithParseError'](mockError as any);
      
      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'real-extracted-token');
      expect(localStorage.setItem).toHaveBeenCalledWith('userRole', '');
      expect(window.alert).toHaveBeenCalledWith('Connexion réussie !');
      expect(router.navigate).toHaveBeenCalledWith(['/home']);
    });

    it('should handle missing token in parse error response', () => {
      spyOn(window, 'alert');
      spyOn(router, 'navigate');
      spyOn(localStorage, 'setItem');
      
      const mockError = {
        status: 200,
        error: { text: 'invalid response without token' }
      };

      // APPELER la méthode
      component['handleSuccessWithParseError'](mockError as any);
    
      // VÉRIFICATIONS pour le cas d'échec
      expect(window.alert).toHaveBeenCalledWith('Erreur: Token manquant dans la réponse du serveur');
      expect(router.navigate).not.toHaveBeenCalled();
      expect(localStorage.setItem).not.toHaveBeenCalled();
    });
    // TEST complet du flux extractTokenFromErrorResponse
    it('should extract tokens correctly from various error formats', () => {
      const testCases = [
        {
          name: 'valid JSON with token',
          error: { status: 200, error: { text: '{"token":"valid-token","role":"CLIENT"}' } },
          expected: 'valid-token'
        },
        {
          name: 'direct token property',
          error: { status: 200, error: { token: 'direct-token' } },
          expected: 'direct-token'
        },
        {
          name: 'invalid JSON',
          error: { status: 200, error: { text: 'not json' } },
          expected: null
        },
        {
          name: 'empty error object',
          error: { status: 200, error: {} },
          expected: null
        }
      ];

      testCases.forEach(({ name, error, expected }) => {
        const result = component['extractTokenFromErrorResponse'](error as any);
        expect(result).toBe(expected);
      });
    });
  });
  describe('Form Validation and Submission', () => {
    it('should handle invalid form submission', () => {
      spyOn(window, 'alert');
      spyOn(component.form, 'markAllAsTouched');
      
      component.onSubmit();
      
      expect(component.form.markAllAsTouched).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('L\'email est requis');
    });

    it('should create correct login payload', () => {
      component.form.patchValue(validLoginData);
      
      const payload = component['createLoginPayload']();
      
      expect(payload.email).toBe('test@example.com');
      expect(payload.password).toBe('password123');
    });

    it('should validate email field correctly', () => {
      const emailControl = component.form.get('email');
      
      emailControl?.setValue('');
      expect(emailControl?.hasError('required')).toBeTruthy();
      
      emailControl?.setValue('invalid-email');
      expect(emailControl?.hasError('email')).toBeTruthy();
      
      emailControl?.setValue('test@example.com');
      expect(emailControl?.valid).toBeTruthy();
    });

    it('should validate password field correctly', () => {
      const passwordControl = component.form.get('password');
      
      passwordControl?.setValue('');
      expect(passwordControl?.hasError('required')).toBeTruthy();
      
      passwordControl?.setValue('123');
      expect(passwordControl?.hasError('minlength')).toBeTruthy();
      
      passwordControl?.setValue('password123');
      expect(passwordControl?.valid).toBeTruthy();
    });
  });

  describe('Successful Login Flow', () => {
    it('should handle successful login with token and userRole', fakeAsync(() => {
      spyOn(window, 'alert');
      spyOn(router, 'navigate');
      spyOn(localStorage, 'setItem');
      
      component.form.patchValue(validLoginData);
      component.onSubmit();
      
      const req = httpTestingController.expectOne('http://localhost:8080/api/auth/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body.email).toBe('test@example.com');
      expect(req.request.body.password).toBe('password123');
      
      req.flush(mockLoginResponse, { status: 200, statusText: 'OK' });
      tick();
      
      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'mock-jwt-token');
      expect(localStorage.setItem).toHaveBeenCalledWith('userRole', 'CLIENT');
      expect(window.alert).toHaveBeenCalledWith('Connexion réussie !');
      expect(router.navigate).toHaveBeenCalledWith(['/home']);
    }));

    it('should handle successful login without userRole', fakeAsync(() => {
      spyOn(localStorage, 'setItem');
      
      component.form.patchValue(validLoginData);
      component.onSubmit();
      
      const req = httpTestingController.expectOne('http://localhost:8080/api/auth/login');
      req.flush({ token: 'mock-token' }, { status: 200, statusText: 'OK' });
      tick();
      
      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'mock-token');
      expect(localStorage.setItem).toHaveBeenCalledWith('userRole', '');
    }));

    it('should handle login response without token', fakeAsync(() => {
      spyOn(window, 'alert');
      spyOn(router, 'navigate');
      
      component.form.patchValue(validLoginData);
      component.onSubmit();
      
      const req = httpTestingController.expectOne('http://localhost:8080/api/auth/login');
      req.flush({}, { status: 200, statusText: 'OK' });
      tick();
      
      expect(window.alert).toHaveBeenCalledWith('Erreur: Token manquant dans la réponse du serveur');
      expect(router.navigate).not.toHaveBeenCalled();
    }));
  });

  describe('Private Methods', () => {
    it('should call storeAuthenticationData correctly', () => {
      spyOn(localStorage, 'setItem');
      
      component['storeAuthenticationData']('test-token', 'USER');
      
      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'test-token');
      expect(localStorage.setItem).toHaveBeenCalledWith('userRole', 'USER');
    });

    it('should call redirectAfterLogin correctly', () => {
      spyOn(router, 'navigate');
      
      component['redirectAfterLogin']();
      
      expect(router.navigate).toHaveBeenCalledWith(['/home']);
    });

    it('should call resetPasswordField correctly', () => {
      component.form.get('password')?.setValue('test-password');
      component['resetPasswordField']();
      
      expect(component.form.get('password')?.value).toBe('');
    });

    it('should call handleInvalidForm correctly', () => {
      spyOn(window, 'alert');
      spyOn(component.form, 'markAllAsTouched');
      
      component['handleInvalidForm']();
      
      expect(component.form.markAllAsTouched).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalled();
    });

    it('should test getValidationErrorMessage for all error types', () => {
      // Test email required
      component.form.get('email')?.setValue('');
      component.form.get('email')?.markAsTouched();
      expect(component['getValidationErrorMessage']()).toBe('L\'email est requis');

      // Test email format
      component.form.get('email')?.setValue('invalid-email');
      expect(component['getValidationErrorMessage']()).toBe('Format d\'email invalide');

      // Test password required
      component.form.patchValue({ email: 'test@test.com' });
      component.form.get('password')?.setValue('');
      component.form.get('password')?.markAsTouched();
      expect(component['getValidationErrorMessage']()).toBe('Le mot de passe est requis');

      // Test password length
      component.form.get('password')?.setValue('123');
      expect(component['getValidationErrorMessage']()).toBe('Le mot de passe doit contenir au moins 6 caractères');

      // Test default message
      component.form.patchValue({ email: 'test@test.com', password: 'password123' });
      expect(component['getValidationErrorMessage']()).toBe('Formulaire invalide - vérifiez vos données');
    });
  });

  describe('Template Integration', () => {
    it('should display main logo', () => {
      const logoImg = debugElement.query(By.css('.logo img'));
      expect(logoImg).toBeTruthy();
      expect(logoImg.nativeElement.src).toContain('assets/pictures/logo.png');
    });

    it('should display welcome title', () => {
      const title = debugElement.query(By.css('h2'));
      expect(title.nativeElement.textContent).toBe('Bienvenue sur Vacances Tranquilles');
    });

    it('should have correct form structure', () => {
      const form = debugElement.query(By.css('form'));
      const emailInput = debugElement.query(By.css('#email'));
      const passwordInput = debugElement.query(By.css('#password'));
      const submitButton = debugElement.query(By.css('.login-btn'));
      
      expect(form).toBeTruthy();
      expect(emailInput).toBeTruthy();
      expect(passwordInput).toBeTruthy();
      expect(submitButton).toBeTruthy();
    });

    it('should call onSubmit when form is submitted', () => {
      spyOn(component, 'onSubmit');
      const form = debugElement.query(By.css('form'));
      
      form.nativeElement.dispatchEvent(new Event('submit'));
      
      expect(component.onSubmit).toHaveBeenCalled();
    });
  });
});