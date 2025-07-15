import { ComponentFixture, TestBed } from '@angular/core/testing';
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

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;
  let router: Router;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoginFormComponent, // Import du composant standalone
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        RouterTestingModule,
        BrowserAnimationsModule
      ],
      providers: [FormBuilder]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize the form with correct controls', () => {
      expect(component.form).toBeDefined();
      expect(component.form.get('email')).toBeTruthy();
      expect(component.form.get('password')).toBeTruthy();
    });

    it('should set main logo path correctly', () => {
      expect(component.mainLogo).toBe('./assets/pictures/logo.png');
    });
  });

  describe('Template Rendering', () => {
    it('should display main logo', () => {
      const logoImg = debugElement.query(By.css('.logo img'));
      expect(logoImg).toBeTruthy();
      expect(logoImg.nativeElement.src).toContain('assets/pictures/logo.png');
    });

    it('should display welcome title', () => {
      const title = debugElement.query(By.css('h2'));
      expect(title.nativeElement.textContent).toBe('Bienvenue sur Vacances Tranquilles');
    });

    it('should display form field labels correctly', () => {
      const emailLabel = debugElement.query(By.css('label[for="email"]'));
      const passwordLabel = debugElement.query(By.css('label[for="password"]'));
      
      expect(emailLabel.nativeElement.textContent).toBe('Email professionnel');
      expect(passwordLabel.nativeElement.textContent).toBe('Mot de passe');
    });

    it('should display form fields with correct placeholders', () => {
      const emailInput = debugElement.query(By.css('#email'));
      const passwordInput = debugElement.query(By.css('#password'));
      
      expect(emailInput).toBeTruthy();
      expect(passwordInput).toBeTruthy();
      expect(emailInput.nativeElement.placeholder).toBe('entreprise@email.com');
      expect(passwordInput.nativeElement.placeholder).toBe('********');
      expect(passwordInput.nativeElement.type).toBe('password');
    });

    it('should display submit button correctly', () => {
      const submitButton = debugElement.query(By.css('.login-btn'));
      expect(submitButton).toBeTruthy();
      expect(submitButton.nativeElement.textContent.trim()).toBe("S'inscrire");
      expect(submitButton.nativeElement.type).toBe('submit');
    });

    it('should have correct IDs on form fields', () => {
      const emailInput = debugElement.query(By.css('#email'));
      const passwordInput = debugElement.query(By.css('#password'));
      
      expect(emailInput.nativeElement.id).toBe('email');
      expect(passwordInput.nativeElement.id).toBe('password');
    });
  });

  describe('Form Validation', () => {
    it('should validate email field correctly', () => {
      const emailControl = component.form.get('email');
      
      // Test required validation
      emailControl?.setValue('');
      expect(emailControl?.hasError('required')).toBeTruthy();
      
      // Test email format validation
      emailControl?.setValue('invalid-email');
      expect(emailControl?.hasError('email')).toBeTruthy();
      
      // Test valid email
      emailControl?.setValue('test@example.com');
      expect(emailControl?.valid).toBeTruthy();
    });

    it('should validate password field correctly', () => {
      const passwordControl = component.form.get('password');
      
      // Test required validation
      passwordControl?.setValue('');
      expect(passwordControl?.hasError('required')).toBeTruthy();
      
      // Test minimum length validation
      passwordControl?.setValue('123');
      expect(passwordControl?.hasError('minlength')).toBeTruthy();
      
      // Test valid password
      passwordControl?.setValue('password123');
      expect(passwordControl?.valid).toBeTruthy();
    });

    it('should be invalid when form is empty', () => {
      expect(component.form.valid).toBeFalsy();
    });

    it('should be valid when all fields are correctly filled', () => {
      component.form.patchValue({
        email: 'test@example.com',
        password: 'password123'
      });
      
      expect(component.form.valid).toBeTruthy();
    });
  });

  describe('Form Interactions', () => {
    it('should update form values when user types in email field', () => {
      const emailInput = debugElement.query(By.css('#email'));
      
      emailInput.nativeElement.value = 'test@example.com';
      emailInput.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      
      expect(component.form.get('email')?.value).toBe('test@example.com');
    });

    it('should update form values when user types in password field', () => {
      const passwordInput = debugElement.query(By.css('#password'));
      
      passwordInput.nativeElement.value = 'password123';
      passwordInput.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      
      expect(component.form.get('password')?.value).toBe('password123');
    });

    it('should call onSubmit when form is submitted', () => {
      jest.spyOn(component, 'onSubmit');
      const form = debugElement.query(By.css('form'));
      
      form.nativeElement.dispatchEvent(new Event('submit'));
      
      expect(component.onSubmit).toHaveBeenCalled();
    });

    it('should call onSubmit when submit button is clicked', () => {
      jest.spyOn(component, 'onSubmit');
      const submitButton = debugElement.query(By.css('.login-btn'));
      
      submitButton.nativeElement.click();
      
      expect(component.onSubmit).toHaveBeenCalled();
    });
  });

  // describe('Form Submission', () => {
  //   it('should call markAllAsTouched when form is invalid', () => {
  //     jest.spyOn(component.form, 'markAllAsTouched');
  //     jest.spyOn(window, 'alert');
      
  //     component.onSubmit();
      
  //     expect(component.form.markAllAsTouched).toHaveBeenCalled();
  //     expect(window.alert).not.toHaveBeenCalled();
  //   });

  //   it('should show alert when form is valid', () => {
  //     jest.spyOn(window, 'alert');
  //     jest.spyOn(component.form, 'markAllAsTouched');
      
  //     component.form.patchValue({
  //       email: 'test@example.com',
  //       password: 'password123'
  //     });
      
  //     component.onSubmit();
      
  //     expect(window.alert).toHaveBeenCalledWith('Connexion soumise !');
  //     expect(component.form.markAllAsTouched).not.toHaveBeenCalled();
  //   });
  // });

  describe('CSS Classes and Styling', () => {
    it('should have correct CSS classes applied', () => {
      const loginContainer = debugElement.query(By.css('.login-container'));
      const loginHeader = debugElement.query(By.css('.login-header'));
      const loginForm = debugElement.query(By.css('.login-form'));
      
      expect(loginContainer).toBeTruthy();
      expect(loginHeader).toBeTruthy();
      expect(loginForm).toBeTruthy();
    });

    it('should have correct number of form groups', () => {
      const formGroups = debugElement.queryAll(By.css('.form-group'));
      expect(formGroups.length).toBe(2); // email et password
    });

    it('should have correct formControlName attributes', () => {
      const emailInput = debugElement.query(By.css('#email'));
      const passwordInput = debugElement.query(By.css('#password'));
      
      expect(emailInput.nativeElement.getAttribute('formcontrolname')).toBe('email');
      expect(passwordInput.nativeElement.getAttribute('formcontrolname')).toBe('password');
    });

    it('should apply full-width class to form fields', () => {
      const formFields = debugElement.queryAll(By.css('.full-width'));
      expect(formFields.length).toBeGreaterThan(0);
    });
  });

  describe('Material Design Components', () => {
    it('should use Material form fields correctly', () => {
      const matFormFields = debugElement.queryAll(By.css('mat-form-field'));
      expect(matFormFields.length).toBe(2);
      
      matFormFields.forEach(field => {
        expect(field.nativeElement.classList.contains('custom-form-field')).toBeTruthy();
        expect(field.nativeElement.classList.contains('form-field')).toBeTruthy();
        expect(field.nativeElement.getAttribute('appearance')).toBe('outline');
      });
    });

    it('should use Material button correctly', () => {
      const matButton = debugElement.query(By.css('button[mat-flat-button]'));
      expect(matButton).toBeTruthy();
      expect(matButton.nativeElement.getAttribute('color')).toBe('primary');
      expect(matButton.nativeElement.classList.contains('login-btn')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have proper labels associated with inputs', () => {
      const emailLabel = debugElement.query(By.css('label[for="email"]'));
      const passwordLabel = debugElement.query(By.css('label[for="password"]'));
      const emailInput = debugElement.query(By.css('#email'));
      const passwordInput = debugElement.query(By.css('#password'));
      
      expect(emailLabel).toBeTruthy();
      expect(passwordLabel).toBeTruthy();
      expect(emailInput.nativeElement.id).toBe('email');
      expect(passwordInput.nativeElement.id).toBe('password');
    });

    it('should have alt text for logo image', () => {
      const logoImg = debugElement.query(By.css('.logo img'));
      expect(logoImg.nativeElement.hasAttribute('alt')).toBeTruthy();
    });
  });

  describe('Error Handling', () => {
    it('should handle form submission errors gracefully', () => {
      jest.spyOn(component, 'onSubmit').mockImplementation(() => {
        throw new Error('Test error');
      });
      
      const form = debugElement.query(By.css('form'));
      
      expect(() => {
        form.nativeElement.dispatchEvent(new Event('submit'));
      }).not.toThrow();
    });
  });
});