/// <reference types="jasmine" />
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { DebugElement, Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';

import { LoginFormComponent } from './login-form.component';
import { EnvService } from '../../services/EnvService';
import { LoginValidationService } from '../../services/login/login-validation.service';
import { LoginFormConfigService } from '../../services/login/login-form-config.service';
import { LoginService } from '../../services/login/login.service';
import { AuthStorageService } from '../../services/login/auth-storage.service';
import { LoginErrorHandlerService } from '../../services/login/login-error-handler.service';
import { LoginNavigationService } from '../../services/login/login-navigation.service';
import { createWindowSpies, verifyAlertShown, verifyNoAlertsShown } from '../../utils/test-helpers';

// Mock component pour les tests de navigation
@Component({
  template: '<div>Mock Home Component</div>'
})
class MockHomeComponent { }

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;
  let router: Router;
  let debugElement: DebugElement;
  let httpTestingController: HttpTestingController;
  
  // Services
  let envService: EnvService;
  let loginValidationService: LoginValidationService;
  let loginFormConfigService: LoginFormConfigService;
  let loginService: LoginService;
  let authStorageService: AuthStorageService;
  let loginErrorHandlerService: LoginErrorHandlerService;
  let loginNavigationService: LoginNavigationService;
  let spies: ReturnType<typeof createWindowSpies>;

  // Mock data pour les tests
  const validLoginData = {
    email: 'test@example.com',
    password: 'password123'
  };

  const mockLoginResponse = {
    body: {
      token: 'mock-jwt-token',
      userRole: 'CLIENT'
    },
    status: 200,
    statusText: 'OK'
  } as HttpResponse<any>;

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
        NoopAnimationsModule,
        HttpClientTestingModule
      ],
      declarations: [MockHomeComponent],
      providers: [
        FormBuilder,
        EnvService,
        LoginValidationService,
        LoginFormConfigService,
        LoginService,
        AuthStorageService,
        LoginErrorHandlerService,
        LoginNavigationService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    debugElement = fixture.debugElement;
    httpTestingController = TestBed.inject(HttpTestingController);
    
    // Injection des services
    envService = TestBed.inject(EnvService);
    loginValidationService = TestBed.inject(LoginValidationService);
    loginFormConfigService = TestBed.inject(LoginFormConfigService);
    loginService = TestBed.inject(LoginService);
    authStorageService = TestBed.inject(AuthStorageService);
    loginErrorHandlerService = TestBed.inject(LoginErrorHandlerService);
    loginNavigationService = TestBed.inject(LoginNavigationService);

    // Setup des spies window
    spies = createWindowSpies();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Validation', () => {
    it('should handle invalid form submission', fakeAsync(() => {
      // Arrange
      const invalidData = { email: 'invalid-email', password: '' };
      component.form.patchValue(invalidData);
      
      // Act
      component.onSubmit();
      tick();
      
      // Assert
      expect(component.form.valid).toBeFalsy();
      verifyAlertShown(spies, 'Format d\'email invalide');
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
      const passwordControl = component.form.get('password');
      
      // Act & Assert
      passwordControl?.setValue('');
      expect(passwordControl?.errors?.['required']).toBeTruthy();
      
      passwordControl?.setValue('password123');
      expect(passwordControl?.errors?.['required']).toBeFalsy();
    });
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
      expect(loginService.performLogin).toHaveBeenCalledWith(validLoginData, component.urlApi);
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
      spyOn(loginService, 'handleLoginError');
      spyOn(loginValidationService, 'resetPasswordField');
      component.form.patchValue(validLoginData);
      
      // Act
      component.onSubmit();
      tick();
      
      // Assert
      expect(loginService.performLogin).toHaveBeenCalledWith(validLoginData, component.urlApi);
      expect(loginService.handleLoginError).toHaveBeenCalledWith(errorResponse);
      expect(loginValidationService.resetPasswordField).toHaveBeenCalledWith(component.form);
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
      spyOn(loginService, 'handleLoginError');
      component.form.patchValue(validLoginData);
      
      // Act
      component.onSubmit();
      tick();
      
      // Assert
      expect(loginService.handleLoginError).toHaveBeenCalledWith(errorResponse);
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
      spyOn(loginService, 'handleLoginError');
      component.form.patchValue(validLoginData);
      
      // Act
      component.onSubmit();
      tick();
      
      // Assert
      expect(loginService.handleLoginError).toHaveBeenCalledWith(networkError);
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
      spyOn(loginService, 'handleLoginError');
      component.form.patchValue(validLoginData);
      
      // Act
      component.onSubmit();
      tick();
      
      // Assert
      expect(loginService.handleLoginError).toHaveBeenCalledWith(parseError);
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
      spyOn(loginService, 'handleLoginError');
      component.form.patchValue(validLoginData);
      
      // Act
      component.onSubmit();
      tick();
      
      // Assert
      expect(loginService.handleLoginError).toHaveBeenCalledWith(parseErrorWithoutToken);
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
      expect(loginService.performLogin).toHaveBeenCalledWith(validLoginData, component.urlApi);
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
      spyOn(loginService, 'handleLoginError');
      component.form.patchValue(validLoginData);
      
      // Act
      component.onSubmit();
      tick();
      
      // Assert
      expect(loginService.performLogin).toHaveBeenCalledWith(validLoginData, component.urlApi);
      expect(loginService.handleLoginError).toHaveBeenCalledWith(errorResponse);
      verifyNoAlertsShown(spies);
    }));
  });
});