/// <reference types="jasmine" />
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { provideRouter, Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { of, throwError } from 'rxjs';

import { LoginFormComponent } from './login-form.component';
import { EnvService } from '../../services/env/env.service';
import { LoginValidationService } from '../../services/login/login-validation.service';
import { LoginFormConfigService } from '../../services/login/login-form-config.service';
import { LoginService } from '../../services/login/login.service';
import { AuthStorageService } from '../../services/login/auth-storage.service';
import { LoginErrorHandlerService } from '../../services/login/login-error-handler.service';
import { LoginNavigationService } from '../../services/login/login-navigation.service';
// Helper functions for tests
function createWindowSpies() {
  const alertSpy = spyOn(window, 'alert').and.stub();
  const confirmSpy = spyOn(window, 'confirm').and.stub();
  const promptSpy = spyOn(window, 'prompt').and.stub();
  const openSpy = spyOn(window, 'open').and.stub();

  return {
    alert: alertSpy,
    confirm: confirmSpy,
    prompt: promptSpy,
    open: openSpy
  };
}

function verifyNoAlertsShown(spies: ReturnType<typeof createWindowSpies>): void {
  expect(spies.alert).not.toHaveBeenCalled();
  expect(spies.confirm).not.toHaveBeenCalled();
  expect(spies.prompt).not.toHaveBeenCalled();
}

// Mock component pour les tests de navigation
@Component({
  template: '<div>Mock Home Component</div>'
})
class MockHomeComponent { }

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;


  // Services
  let loginValidationService: LoginValidationService;
  let loginService: LoginService;
  let spies: ReturnType<typeof createWindowSpies>;

  // Mock data pour les tests
  const validLoginData = {
    email: 'test@example.com',
    userSecret: 'Password1!'
  };

  const mockLoginResponse = {
    body: {
      token: 'mock-jwt-token',
      userRole: 'CLIENT'
    },
    status: 200,
    statusText: 'OK'
  } as HttpResponse<any>;

  // Mock config pour APP_CONFIG
  const mockAppConfig = {
    apiUrl: 'http://localhost:8080/api'
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
        NoopAnimationsModule
      ],
      providers: [
        FormBuilder,
        EnvService,
        LoginValidationService,
        LoginFormConfigService,
        LoginService,
        AuthStorageService,
        LoginErrorHandlerService,
        LoginNavigationService,
        { provide: 'APP_CONFIG', useValue: mockAppConfig },
        provideRouter([
          { path: 'home', component: MockHomeComponent }
        ]),
        provideHttpClient(withFetch())
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;

    // Injection des services
    loginValidationService = TestBed.inject(LoginValidationService);
    loginService = TestBed.inject(LoginService);

    // Setup des spies window
    spies = createWindowSpies();
  });



  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Validation', () => {
    it('should handle invalid form submission with error summary', fakeAsync(() => {
      // Arrange
      const invalidData = { email: 'invalid-email', userSecret: '' };
      component.form.patchValue(invalidData);

      // Act
      component.onSubmit();
      tick();

      // Assert
      expect(component.form.valid).toBeFalse();
      expect(component.showErrorSummary).toBeTrue();
      // Email message present
      expect(component.errorSummaryItems.some(e => e.label === 'Email' && e.message.includes('Format'))).toBeTrue();
      // Password required present
      expect(component.errorSummaryItems.some(e => e.label === 'Mot de passe')).toBeTrue();
    }));

    it('should validate email format correctly', () => {
      // Arrange
      const emailControl = component.form.get('email');

      // Act & Assert
      emailControl?.setValue('invalid-email');
      expect(emailControl?.errors?.['email']).toBeTruthy();

      emailControl?.setValue('valid@email.com');
      expect(emailControl?.errors?.['email']).toBeFalsy();
    });

    it('should require password field', () => {
      // Arrange
      const userSecretControl = component.form.get('userSecret');

      // Act & Assert
      userSecretControl?.setValue('');
      expect(userSecretControl?.errors?.['required']).toBeTruthy();

      userSecretControl?.setValue('password123');
      expect(userSecretControl?.errors?.['required']).toBeFalsy();
    });

    it('should build error summary and focus first invalid field', fakeAsync(() => {
      component.form.patchValue({ email: 'invalid', userSecret: '' });
      spyOn(component as any, 'focusFirstInvalidField');
      component.onSubmit();
      tick();
      expect(component.showErrorSummary).toBeTrue();
      expect((component as any).focusFirstInvalidField).toHaveBeenCalled();
    }));
  });

  describe('LoginService Integration', () => {
    it('should handle successful login response', fakeAsync(() => {
      // Arrange
      spyOn(loginService, 'performLogin').and.returnValue(of(mockLoginResponse));
      spyOn(loginService, 'handleLoginSuccess');
      component.form.patchValue(validLoginData);

      // Act
      component.onSubmit();
      tick();

      // Assert
      expect(loginService.performLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Password1!'
      }, component.urlApi);
      expect(loginService.handleLoginSuccess).toHaveBeenCalledWith(mockLoginResponse);
      verifyNoAlertsShown(spies);
    }));

    it('should handle login error', fakeAsync(() => {
      // Arrange
      const errorResponse = new HttpErrorResponse({
        error: 'Unauthorized',
        status: 401,
        statusText: 'Unauthorized'
      });
      spyOn(loginService, 'performLogin').and.returnValue(throwError(() => errorResponse));
      component.form.patchValue(validLoginData);

      // Act
      component.onSubmit();
      tick();

      // Assert
      expect(loginService.performLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Password1!'
      }, component.urlApi);
      expect(component.emailError).toBe('Email ou mot de passe incorrect');
      expect(component.passwordError).toBe('Email ou mot de passe incorrect');
      verifyNoAlertsShown(spies);
    }));
  });

  describe('Error Handling Integration', () => {
    it('should handle HTTP 401 errors correctly', fakeAsync(() => {
      // Arrange
      const errorResponse = new HttpErrorResponse({
        error: 'Unauthorized',
        status: 401,
        statusText: 'Unauthorized'
      });
      spyOn(loginService, 'performLogin').and.returnValue(throwError(() => errorResponse));
      component.form.patchValue(validLoginData);

      // Act
      component.onSubmit();
      tick();

      // Assert
      expect(component.emailError).toBe('Email ou mot de passe incorrect');
      expect(component.passwordError).toBe('Email ou mot de passe incorrect');
      verifyNoAlertsShown(spies);
    }));

    it('should handle network errors (status 0)', fakeAsync(() => {
      // Arrange
      const networkError = new HttpErrorResponse({
        error: 'Network Error',
        status: 0,
        statusText: 'Network Error'
      });
      spyOn(loginService, 'performLogin').and.returnValue(throwError(() => networkError));
      component.form.patchValue(validLoginData);

      // Act
      component.onSubmit();
      tick();

      // Assert
      expect(component.apiError).toBe('Impossible de contacter le serveur');
      verifyNoAlertsShown(spies);
    }));

    it('should handle parse error with successful HTTP status', fakeAsync(() => {
      // Arrange
      const parseError = new HttpErrorResponse({
        error: 'Invalid JSON',
        status: 200,
        statusText: 'OK'
      });
      spyOn(loginService, 'performLogin').and.returnValue(throwError(() => parseError));
      component.form.patchValue(validLoginData);

      // Act
      component.onSubmit();
      tick();

      // Assert
      expect(component.apiError).toBe('Erreur de connexion inconnue');
      verifyNoAlertsShown(spies);
    }));

    it('should handle missing token in parse error response', fakeAsync(() => {
      // Arrange
      const parseErrorWithoutToken = new HttpErrorResponse({
        error: 'Invalid JSON',
        status: 200,
        statusText: 'OK'
      });
      spyOn(loginService, 'performLogin').and.returnValue(throwError(() => parseErrorWithoutToken));
      component.form.patchValue(validLoginData);

      // Act
      component.onSubmit();
      tick();

      // Assert
      expect(component.apiError).toBe('Erreur de connexion inconnue');
      verifyNoAlertsShown(spies);
    }));
  });

  describe('Complete Login Flow Integration', () => {
    it('should complete successful login flow end-to-end', fakeAsync(() => {
      // Arrange
      spyOn(loginService, 'performLogin').and.returnValue(of(mockLoginResponse));
      spyOn(loginService, 'handleLoginSuccess');
      component.form.patchValue(validLoginData);

      // Act
      component.onSubmit();
      tick();

      // Assert
      expect(loginService.performLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Password1!'
      }, component.urlApi);
      expect(loginService.handleLoginSuccess).toHaveBeenCalledWith(mockLoginResponse);
      verifyNoAlertsShown(spies);
    }));

    it('should complete error login flow end-to-end', fakeAsync(() => {
      // Arrange
      const errorResponse = new HttpErrorResponse({
        error: 'Server Error',
        status: 500,
        statusText: 'Internal Server Error'
      });
      spyOn(loginService, 'performLogin').and.returnValue(throwError(() => errorResponse));
      component.form.patchValue(validLoginData);

      // Act
      component.onSubmit();
      tick();

      // Assert
      expect(loginService.performLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Password1!'
      }, component.urlApi);
      expect(component.apiError).toBe('Erreur interne du serveur');
      verifyNoAlertsShown(spies);
    }));
  });

  describe('Confirm and Router branches (mocked at service level)', () => {
    it('should hit both success and error paths for performLogin', fakeAsync(() => {
      const successResponse = mockLoginResponse;
      const errorResponse = new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' });

      spyOn(loginService, 'performLogin').and.returnValues(of(successResponse), throwError(() => errorResponse));
      spyOn(loginService, 'handleLoginSuccess');

      component.form.patchValue({ email: 'test@example.com', userSecret: 'Password1!' });
      component.onSubmit();
      tick();
      expect(loginService.handleLoginSuccess).toHaveBeenCalledWith(successResponse);

      component.onSubmit();
      tick();
      expect(component.emailError).toBe('Email ou mot de passe incorrect');
    }));
  });

  describe('Helpers', () => {
    it('should compose consolidated password error text', () => {
      const ctrl = component.form.get('userSecret');
      ctrl?.markAsTouched();
      ctrl?.setErrors({ minLength: true, lowercase: true, uppercase: true, number: true, special: true });
      const text = component.getPasswordErrorText();
      expect(text).toContain('Le mot de passe doit contenir');
    });

    it('should navigate back to home on goBack', () => {
      const router = TestBed.inject(Router);
      const spyNav = spyOn((component as any).router, 'navigate');
      component.goBack();
      expect(spyNav).toHaveBeenCalledWith(['/home']);
    });

    it('should return empty password error when control untouched', () => {
      const ctrl = component.form.get('userSecret');
      ctrl?.setErrors({ minLength: true });
      // untouched → no message
      const text = component.getPasswordErrorText();
      expect(text).toBe('');
    });

    it('should return empty password error when no errors', () => {
      const ctrl = component.form.get('userSecret');
      ctrl?.markAsTouched();
      ctrl?.setErrors(null);
      const text = component.getPasswordErrorText();
      expect(text).toBe('');
    });

    it('should compose message with a single constraint', () => {
      const ctrl = component.form.get('userSecret');
      ctrl?.markAsTouched();
      ctrl?.setErrors({ special: true });
      const text = component.getPasswordErrorText();
      expect(text).toContain('un caractère spécial');
    });
  });

  describe('Error summary variants', () => {
    it('should build summary with only email invalid', fakeAsync(() => {
      const emailCtrl = component.form.get('email');
      emailCtrl?.setValue('invalid');
      const pwdCtrl = component.form.get('userSecret');
      pwdCtrl?.setValue('Password1!');
      component.onSubmit();
      tick();
      expect(component.showErrorSummary).toBeTrue();
      expect(component.errorSummaryItems.length).toBeGreaterThan(0);
      expect(component.errorSummaryItems.some(i => i.id === 'email')).toBeTrue();
      expect(component.errorSummaryItems.some(i => i.id === 'userSecret')).toBeFalse();
    }));

    it('should build summary with only password invalid', fakeAsync(() => {
      const emailCtrl = component.form.get('email');
      emailCtrl?.setValue('valid@email.com');
      const pwdCtrl = component.form.get('userSecret');
      pwdCtrl?.setValue('short');
      component.onSubmit();
      tick();
      expect(component.showErrorSummary).toBeTrue();
      expect(component.errorSummaryItems.some(i => i.id === 'email')).toBeFalse();
      expect(component.errorSummaryItems.some(i => i.id === 'userSecret')).toBeTrue();
    }));
  });
});
