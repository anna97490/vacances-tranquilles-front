// ✅ FICHIER TEST CORRIGÉ : register-form.component.spec.ts
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DebugElement, Renderer2 } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RegisterFormComponent } from './register-form.component';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Component } from '@angular/core';

// Mock component pour la redirection
@Component({ template: '' })
class MockLoginComponent { }

describe('RegisterFormComponent', () => {
  let component: RegisterFormComponent;
  let fixture: ComponentFixture<RegisterFormComponent>;
  let router: Router;
  let debugElement: DebugElement;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  // Mock data pour les tests
  const validParticulierData = {
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@test.com',
    phoneNumber: '0123456789',
    address: '123 rue Test',
    city: 'Paris',
    postalCode: '75000',
    password: 'password123'
  };

  const validPrestataireData = {
    ...validParticulierData,
    companyName: 'Test Company',
    siretSiren: '12345678901234'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RegisterFormComponent,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        RouterTestingModule.withRoutes([
          { path: 'auth/login', component: MockLoginComponent }
        ]),
        BrowserAnimationsModule,
        HttpClientTestingModule
      ],
      declarations: [MockLoginComponent],
      providers: [FormBuilder, Renderer2]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterFormComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    debugElement = fixture.debugElement;
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);

    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize the form with correct controls', () => {
      expect(component.form).toBeDefined();
      expect(component.form.get('firstName')).toBeTruthy();
      expect(component.form.get('lastName')).toBeTruthy();
      expect(component.form.get('email')).toBeTruthy();
      expect(component.form.get('phoneNumber')).toBeTruthy();
      expect(component.form.get('address')).toBeTruthy();
      expect(component.form.get('city')).toBeTruthy();
      expect(component.form.get('postalCode')).toBeTruthy();
      expect(component.form.get('password')).toBeTruthy();
      expect(component.form.get('companyName')).toBeTruthy();
      expect(component.form.get('siretSiren')).toBeTruthy();
    });

    it('should set main logo path correctly', () => {
      expect(component.mainLogo).toBe('./assets/pictures/logo.png');
    });

    it('should have correct initial isPrestataire state', () => {
      expect(typeof component.isPrestataire).toBe('boolean');
    });

    it('should update validators based on user type for prestataire', () => {
      component.isPrestataire = true;
      component['updateValidatorsBasedOnUserType']();
      
      const companyNameControl = component.form.get('companyName');
      const siretControl = component.form.get('siretSiren');
      
      expect(companyNameControl?.hasError('required')).toBeTruthy();
      expect(siretControl?.hasError('required')).toBeTruthy();
    });

    it('should clear validators for particulier', () => {
      component.isPrestataire = false;
      component['updateValidatorsBasedOnUserType']();
      
      const companyNameControl = component.form.get('companyName');
      const siretControl = component.form.get('siretSiren');
      
      expect(companyNameControl?.errors).toBeNull();
      expect(siretControl?.errors).toBeNull();
    });
  });

  describe('URL Detection', () => {
    let originalLocation: URL;

    beforeEach(() => {
      originalLocation = new URL(window.location.href);
    });

    afterEach(() => {
      // Restaurer l'URL originale
      if (window.location.href !== originalLocation.href) {
        history.replaceState(null, '', originalLocation.href);
      }
    });

    it('should detect prestataire type from URL', () => {
      // Utiliser history.replaceState pour changer l'URL
      history.replaceState(null, '', '/register/prestataire');

      const newComponent = new RegisterFormComponent(
        TestBed.inject(FormBuilder),
        TestBed.inject(Renderer2),
        TestBed.inject(HttpClient),
        TestBed.inject(Router)
      );

      expect(newComponent.isPrestataire).toBeTruthy();
    });

    it('should detect particulier type from URL', () => {
      history.replaceState(null, '', '/register/particulier');

      const newComponent = new RegisterFormComponent(
        TestBed.inject(FormBuilder),
        TestBed.inject(Renderer2),
        TestBed.inject(HttpClient),
        TestBed.inject(Router)
      );

      expect(newComponent.isPrestataire).toBeFalsy();
    });

    it('should default to particulier for unclear URLs', () => {
      history.replaceState(null, '', '/register');

      const newComponent = new RegisterFormComponent(
        TestBed.inject(FormBuilder),
        TestBed.inject(Renderer2),
        TestBed.inject(HttpClient),
        TestBed.inject(Router)
      );

      expect(newComponent.isPrestataire).toBeFalsy();
    });
  });

  describe('Form Validation', () => {
    it('should validate required fields', () => {
      const requiredFields = ['firstName', 'lastName', 'email', 'phoneNumber', 'address', 'city', 'postalCode', 'password'];
      
      requiredFields.forEach(fieldName => {
        const control = component.form.get(fieldName);
        control?.setValue('');
        expect(control?.hasError('required')).toBeTruthy();
      });
    });

    it('should validate email format', () => {
      const emailControl = component.form.get('email');
      
      emailControl?.setValue('invalid-email');
      expect(emailControl?.hasError('email')).toBeTruthy();
      
      emailControl?.setValue('valid@email.com');
      expect(emailControl?.valid).toBeTruthy();
    });

    it('should validate password minimum length', () => {
      const passwordControl = component.form.get('password');
      
      passwordControl?.setValue('123');
      expect(passwordControl?.hasError('minlength')).toBeTruthy();
      
      passwordControl?.setValue('password123');
      expect(passwordControl?.valid).toBeTruthy();
    });

    it('should validate postal code pattern', () => {
      const postalCodeControl = component.form.get('postalCode');
      
      postalCodeControl?.setValue('123');
      expect(postalCodeControl?.hasError('pattern')).toBeTruthy();
      
      postalCodeControl?.setValue('abcde');
      expect(postalCodeControl?.hasError('pattern')).toBeTruthy();
      
      postalCodeControl?.setValue('75000');
      expect(postalCodeControl?.valid).toBeTruthy();
    });

    it('should validate SIRET pattern for prestataire', () => {
      component.isPrestataire = true;
      component['updateValidatorsBasedOnUserType']();
      
      const siretControl = component.form.get('siretSiren');
      
      siretControl?.setValue('123');
      expect(siretControl?.hasError('pattern')).toBeTruthy();
      
      siretControl?.setValue('abcd1234567890');
      expect(siretControl?.hasError('pattern')).toBeTruthy();
      
      siretControl?.setValue('12345678901234');
      expect(siretControl?.valid).toBeTruthy();
    });

    it('should validate company name for prestataire', () => {
      component.isPrestataire = true;
      component['updateValidatorsBasedOnUserType']();
      
      const companyNameControl = component.form.get('companyName');
      
      companyNameControl?.setValue('');
      expect(companyNameControl?.hasError('required')).toBeTruthy();
      
      companyNameControl?.setValue('Test Company');
      expect(companyNameControl?.valid).toBeTruthy();
    });
  });

  describe('Validation Error Messages', () => {
    it('should return correct error messages for required fields', () => {
      component.form.get('firstName')?.setValue('');
      component.form.get('firstName')?.markAsTouched();
      
      const errorMessage = component['getValidationErrorMessage']();
      expect(errorMessage).toBe('Le prénom est requis');
    });

    it('should return email format error message', () => {
      component.form.patchValue({ firstName: 'Test', lastName: 'Test' });
      component.form.get('email')?.setValue('invalid-email');
      component.form.get('email')?.markAsTouched();
      
      const errorMessage = component['getValidationErrorMessage']();
      expect(errorMessage).toBe('Format d\'email invalide');
    });

    it('should return password length error message', () => {
      component.form.patchValue({ 
        firstName: 'Test', 
        lastName: 'Test', 
        email: 'test@test.com' 
      });
      component.form.get('password')?.setValue('123');
      component.form.get('password')?.markAsTouched();
      
      const errorMessage = component['getValidationErrorMessage']();
      expect(errorMessage).toBe('Le mot de passe doit contenir au moins 6 caractères');
    });

    it('should return company name error for prestataire', () => {
      component.isPrestataire = true;
      component['updateValidatorsBasedOnUserType']();
      
      component.form.patchValue({
        firstName: 'Test',
        lastName: 'Test',
        email: 'test@test.com',
        password: 'password123',
        phoneNumber: '0123456789',
        address: 'Test address',
        city: 'Test city',
        postalCode: '75000'
      });
      
      component.form.get('companyName')?.setValue('');
      component.form.get('companyName')?.markAsTouched();
      
      const errorMessage = component['getValidationErrorMessage']();
      expect(errorMessage).toBe('Le nom de l\'entreprise est requis');
    });

    it('should return SIRET error for prestataire', () => {
      component.isPrestataire = true;
      component['updateValidatorsBasedOnUserType']();
      
      component.form.patchValue({
        firstName: 'Test',
        lastName: 'Test',
        email: 'test@test.com',
        password: 'password123',
        phoneNumber: '0123456789',
        address: 'Test address',
        city: 'Test city',
        postalCode: '75000',
        companyName: 'Test Company'
      });
      
      component.form.get('siretSiren')?.setValue('123');
      component.form.get('siretSiren')?.markAsTouched();
      
      const errorMessage = component['getValidationErrorMessage']();
      expect(errorMessage).toBe('Le SIRET/SIREN doit contenir 14 chiffres');
    });
  });

  describe('API Configuration', () => {
    it('should build correct API config for particulier', () => {
      component.isPrestataire = false;
      component.form.patchValue(validParticulierData);
      
      const apiConfig = component['buildApiConfig']();
      
      expect(apiConfig.url).toBe('http://localhost:8080/api/auth/register/client');
      expect(apiConfig.payload.firstName).toBe('Jean');
      expect(apiConfig.payload.companyName).toBeUndefined();
    });

    it('should build correct API config for prestataire', () => {
      component.isPrestataire = true;
      component.form.patchValue(validPrestataireData);
      
      const apiConfig = component['buildApiConfig']();
      
      expect(apiConfig.url).toBe('http://localhost:8080/api/auth/register/provider');
      expect(apiConfig.payload.firstName).toBe('Jean');
      expect(apiConfig.payload.companyName).toBe('Test Company');
      expect(apiConfig.payload.siretSiren).toBe('12345678901234');
    });
  });

  describe('Form Submission', () => {
    it('should handle invalid form submission', () => {
      spyOn(window, 'alert');
      spyOn(component.form, 'markAllAsTouched');
      
      component.form.patchValue({ firstName: '' }); // Invalid form
      component.onSubmit();
      
      expect(component.form.markAllAsTouched).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('Le prénom est requis');
    });

    it('should handle valid form submission for particulier', fakeAsync(() => {
      spyOn(window, 'alert');
      spyOn(router, 'navigate');
      
      component.isPrestataire = false;
      component.form.patchValue(validParticulierData);
      
      component.onSubmit();
      
      const req = httpTestingController.expectOne('http://localhost:8080/api/auth/register/client');
      expect(req.request.method).toBe('POST');
      expect(req.request.body.firstName).toBe('Jean');
      
      req.flush('Success', { status: 200, statusText: 'OK' });
      tick();
      
      expect(window.alert).toHaveBeenCalledWith('Inscription particulier réussie ! Vous pouvez maintenant vous connecter.');
      expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
    }));

    it('should handle valid form submission for prestataire', fakeAsync(() => {
      spyOn(window, 'alert');
      spyOn(router, 'navigate');
      
      component.isPrestataire = true;
      component['updateValidatorsBasedOnUserType']();
      component.form.patchValue(validPrestataireData);
      
      component.onSubmit();
      
      const req = httpTestingController.expectOne('http://localhost:8080/api/auth/register/provider');
      expect(req.request.method).toBe('POST');
      expect(req.request.body.companyName).toBe('Test Company');
      
      req.flush('Success', { status: 201, statusText: 'Created' });
      tick();
      
      expect(window.alert).toHaveBeenCalledWith('Inscription prestataire réussie ! Vous pouvez maintenant vous connecter.');
      expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
    }));

    it('should handle HTTP error with specific error codes', fakeAsync(() => {
      spyOn(window, 'alert');
      
      component.form.patchValue(validParticulierData);
      component.onSubmit();
      
      const req = httpTestingController.expectOne('http://localhost:8080/api/auth/register/client');
      req.flush('Conflict', { status: 409, statusText: 'Conflict' });
      tick();
      
      expect(window.alert).toHaveBeenCalledWith('Erreur lors de l\'inscription : Un compte avec cet email existe déjà');
    }));

    it('should handle successful registration response', fakeAsync(() => {
      spyOn(window, 'alert');
      spyOn(router, 'navigate');
      
      component.form.patchValue(validParticulierData);
      component.onSubmit();
      
      const req = httpTestingController.expectOne('http://localhost:8080/api/auth/register/client');
      
      // Réponse 200 normale
      req.flush('Registration successful', { status: 200, statusText: 'OK' });
      tick();
      
      expect(window.alert).toHaveBeenCalledWith('Inscription particulier réussie ! Vous pouvez maintenant vous connecter.');
      expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
    }));
  });

  describe('Error Handling', () => {
    it('should get correct error message for different HTTP status codes', () => {
      const errorCodes = [
        { status: 400, expected: 'Données invalides - vérifiez vos informations' },
        { status: 409, expected: 'Un compte avec cet email existe déjà' },
        { status: 422, expected: 'Données de validation incorrectes' },
        { status: 500, expected: 'Erreur interne du serveur' },
        { status: 0, expected: 'Impossible de contacter le serveur' }
      ];

      errorCodes.forEach(({ status, expected }) => {
        const mockError = { status, error: null };
        const message = component['getRegistrationErrorMessage'](mockError as any);
        expect(message).toBe(expected);
      });
    });

    it('should return custom error message from response', () => {
      const mockError = { 
        status: 999, 
        error: { message: 'Custom error message' } 
      };
      
      const message = component['getRegistrationErrorMessage'](mockError as any);
      expect(message).toBe('Custom error message');
    });

    it('should return default error message for unknown status', () => {
      const mockError = { status: 999, error: null };
      const message = component['getRegistrationErrorMessage'](mockError as any);
      expect(message).toBe('Erreur inconnue lors de l\'inscription');
    });
  });

  describe('Template Rendering', () => {
    it('should display main logo', () => {
      const logoImg = debugElement.query(By.css('.logo img'));
      expect(logoImg).toBeTruthy();
      expect(logoImg.nativeElement.src).toContain('assets/pictures/logo.png');
    });

    it('should display welcome header', () => {
      const header = debugElement.query(By.css('h2'));
      expect(header.nativeElement.textContent).toBe('Bienvenue sur Vacances Tranquilles');
    });

    it('should display all common form fields', () => {
      const expectedFields = [
        'firstName', 'lastName', 'email', 'phoneNumber', 
        'address', 'city', 'postalCode', 'password'
      ];

      expectedFields.forEach(fieldName => {
        const input = debugElement.query(By.css(`#${fieldName}`));
        expect(input).toBeTruthy();
      });
    });

    it('should display company fields when isPrestataire is true', () => {
      component.isPrestataire = true;
      fixture.detectChanges();
      
      const companyNameField = debugElement.query(By.css('#companyName'));
      const siretField = debugElement.query(By.css('#siretSiren'));
      
      expect(companyNameField).toBeTruthy();
      expect(siretField).toBeTruthy();
    });

    it('should hide company fields when isPrestataire is false', () => {
      component.isPrestataire = false;
      fixture.detectChanges();
      
      const formRow = debugElement.query(By.css('.form-row'));
      expect(formRow).toBeFalsy();
    });

    it('should display submit button', () => {
      const submitBtn = debugElement.query(By.css('.register-btn'));
      expect(submitBtn).toBeTruthy();
      expect(submitBtn.nativeElement.textContent.trim()).toBe("S'inscrire");
    });

    it('should display login link', () => {
      const loginLink = debugElement.query(By.css('a[routerLink="/auth/login"]'));
      expect(loginLink).toBeTruthy();
      expect(loginLink.nativeElement.textContent).toBe('Se connecter');
    });
  });

  describe('Utility Methods', () => {
    it('should return correct form title for prestataire', () => {
      component.isPrestataire = true;
      expect(component.getFormTitle()).toBe('Inscription Prestataire');
    });

    it('should return correct form title for particulier', () => {
      component.isPrestataire = false;
      expect(component.getFormTitle()).toBe('Inscription Particulier');
    });

    it('should show field for prestataire-only fields when isPrestataire is true', () => {
      component.isPrestataire = true;
      expect(component.shouldShowField('companyName')).toBeTruthy();
      expect(component.shouldShowField('siretSiren')).toBeTruthy();
    });

    it('should hide field for prestataire-only fields when isPrestataire is false', () => {
      component.isPrestataire = false;
      expect(component.shouldShowField('companyName')).toBeFalsy();
      expect(component.shouldShowField('siretSiren')).toBeFalsy();
    });

    it('should always show common fields', () => {
      const commonFields = ['firstName', 'lastName', 'email'];
      
      commonFields.forEach(field => {
        expect(component.shouldShowField(field)).toBeTruthy();
      });
    });

    it('should return correct CSS classes for field validation', () => {
      const emailControl = component.form.get('email');
      emailControl?.setValue('');
      emailControl?.markAsTouched();
      
      expect(component.getFieldClasses('email')).toBe('field-error');
      
      emailControl?.setValue('valid@email.com');
      expect(component.getFieldClasses('email')).toBe('');
    });

    it('should return empty string for non-existent field', () => {
      expect(component.getFieldClasses('nonExistentField')).toBe('');
    });
  });

  describe('Component Lifecycle', () => {
    it('should unsubscribe from router subscription on destroy', () => {
      const mockSubscription = {
        unsubscribe: jasmine.createSpy('unsubscribe')
      };
      
      component['routerSubscription'] = mockSubscription as any;
      component.ngOnDestroy();
      
      expect(mockSubscription.unsubscribe).toHaveBeenCalled();
    });

    it('should handle undefined router subscription on destroy', () => {
      component['routerSubscription'] = undefined;
      expect(() => component.ngOnDestroy()).not.toThrow();
    });
  });

  describe('Form Interactions', () => {
    it('should update form values when user types', () => {
      const emailInput = debugElement.query(By.css('#email'));
      
      emailInput.nativeElement.value = 'test@example.com';
      emailInput.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      
      expect(component.form.get('email')?.value).toBe('test@example.com');
    });

    it('should trigger onSubmit when form is submitted', () => {
      spyOn(component, 'onSubmit');
      const form = debugElement.query(By.css('form'));
      
      form.nativeElement.dispatchEvent(new Event('submit'));
      
      expect(component.onSubmit).toHaveBeenCalled();
    });

    it('should mark fields as touched on blur', () => {
      const emailInput = debugElement.query(By.css('#email'));
      
      emailInput.nativeElement.dispatchEvent(new Event('blur'));
      
      expect(component.form.get('email')?.touched).toBeTruthy();
    });
  });

  describe('Private Method Coverage', () => {
    it('should call isFormValid correctly', () => {
      component.form.patchValue(validParticulierData);
      expect(component['isFormValid']()).toBeTruthy();
      
      component.form.get('email')?.setValue('');
      expect(component['isFormValid']()).toBeFalsy();
    });

    it('should call handleInvalidForm correctly', () => {
      spyOn(window, 'alert');
      spyOn(component.form, 'markAllAsTouched');
      
      component['handleInvalidForm']();
      
      expect(component.form.markAllAsTouched).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalled();
    });

    it('should check isSuccessfulButParseFailed correctly', () => {
      expect(component['isSuccessfulButParseFailed']({ status: 200 } as any)).toBeTruthy();
      expect(component['isSuccessfulButParseFailed']({ status: 201 } as any)).toBeTruthy();
      expect(component['isSuccessfulButParseFailed']({ status: 400 } as any)).toBeFalsy();
    });

    it('should handle handleParseErrorButSuccess correctly', () => {
      spyOn(component, 'showSuccessMessage' as any);
      spyOn(component, 'redirectToLogin' as any);
      
      component['handleParseErrorButSuccess']();
      
      expect(component['showSuccessMessage']).toHaveBeenCalled();
      expect(component['redirectToLogin']).toHaveBeenCalled();
    });
  });
});