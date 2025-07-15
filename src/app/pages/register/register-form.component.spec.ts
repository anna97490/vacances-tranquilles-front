import { ComponentFixture, TestBed } from '@angular/core/testing';
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

describe('RegisterFormComponent', () => {
  let component: RegisterFormComponent;
  let fixture: ComponentFixture<RegisterFormComponent>;
  let router: Router;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RegisterFormComponent, // Import du composant standalone
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        RouterTestingModule,
        BrowserAnimationsModule
      ],
      providers: [FormBuilder, Renderer2]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterFormComponent);
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
      expect(component.form.get('companyName')).toBeTruthy();
      expect(component.form.get('siret')).toBeTruthy();
      expect(component.form.get('email')).toBeTruthy();
      expect(component.form.get('phone')).toBeTruthy();
      expect(component.form.get('address')).toBeTruthy();
      expect(component.form.get('postalCode')).toBeTruthy();
      expect(component.form.get('password')).toBeTruthy();
    });

    it('should detect user type from URL', () => {
      // Mock window.location.pathname
      Object.defineProperty(window, 'location', {
        value: { pathname: '/register/prestataire' },
        writable: true
      });
      
      const newComponent = new RegisterFormComponent(TestBed.inject(FormBuilder), TestBed.inject(Renderer2));
      expect(newComponent.isPrestataire).toBeTruthy();
    });

    it('should set isPrestataire to false for regular user registration', () => {
      Object.defineProperty(window, 'location', {
        value: { pathname: '/register' },
        writable: true
      });
      
      const newComponent = new RegisterFormComponent(TestBed.inject(FormBuilder), TestBed.inject(Renderer2));
      expect(newComponent.isPrestataire).toBeFalsy();
    });

    it('should set main logo path correctly', () => {
      expect(component.mainLogo).toBe('./assets/pictures/logo.png');
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

    it('should validate SIRET field correctly', () => {
      const siretControl = component.form.get('siret');
      
      // Test required validation
      siretControl?.setValue('');
      expect(siretControl?.hasError('required')).toBeTruthy();
      
      // Test pattern validation - wrong length
      siretControl?.setValue('123456789');
      expect(siretControl?.hasError('pattern')).toBeTruthy();
      
      // Test pattern validation - non-numeric
      siretControl?.setValue('12345678901abc');
      expect(siretControl?.hasError('pattern')).toBeTruthy();
      
      // Test valid SIRET
      siretControl?.setValue('12345678901234');
      expect(siretControl?.valid).toBeTruthy();
    });

    it('should validate postal code field correctly', () => {
      const postalCodeControl = component.form.get('postalCode');
      
      // Test required validation
      postalCodeControl?.setValue('');
      expect(postalCodeControl?.hasError('required')).toBeTruthy();
      
      // Test pattern validation - wrong length
      postalCodeControl?.setValue('123');
      expect(postalCodeControl?.hasError('pattern')).toBeTruthy();
      
      // Test pattern validation - non-numeric
      postalCodeControl?.setValue('abcde');
      expect(postalCodeControl?.hasError('pattern')).toBeTruthy();
      
      // Test valid postal code
      postalCodeControl?.setValue('75000');
      expect(postalCodeControl?.valid).toBeTruthy();
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

    it('should validate required fields', () => {
      const requiredFields = ['companyName', 'siret', 'email', 'phone', 'address', 'postalCode', 'password'];
      
      requiredFields.forEach(fieldName => {
        const control = component.form.get(fieldName);
        control?.setValue('');
        expect(control?.hasError('required')).toBeTruthy();
      });
    });
  });

  describe('Form Submission', () => {
    // it('should call markAllAsTouched when form is invalid', () => {
    //   jest.spyOn(component.form, 'markAllAsTouched');
    //   jest.spyOn(window, 'alert');
      
    //   // Form should be invalid initially
    //   component.onSubmit();
      
    //   expect(component.form.markAllAsTouched).toHaveBeenCalled();
    //   expect(window.alert).not.toHaveBeenCalled();
    // });

    it('should show alert when form is valid', () => {
      jest.spyOn(window, 'alert');
      jest.spyOn(component.form, 'markAllAsTouched');
      
      // Fill form with valid data
      component.form.patchValue({
        companyName: 'Test Company',
        siret: '12345678901234',
        email: 'test@example.com',
        phone: '0123456789',
        address: '123 rue Test',
        postalCode: '75000',
        password: 'password123'
      });
      
      component.onSubmit();
      
      expect(window.alert).toHaveBeenCalledWith('Inscription soumise !');
      expect(component.form.markAllAsTouched).not.toHaveBeenCalled();
    });

    it('should trigger onSubmit when form is submitted', () => {
      jest.spyOn(component, 'onSubmit');
      const form = debugElement.query(By.css('form'));
      
      form.nativeElement.dispatchEvent(new Event('submit'));
      
      expect(component.onSubmit).toHaveBeenCalled();
    });
  });

  describe('Template Rendering', () => {
    it('should display company fields when isPrestataire is true', () => {
      component.isPrestataire = true;
      fixture.detectChanges();
      
      const formRow = debugElement.query(By.css('.form-row'));
      const companyNameField = debugElement.query(By.css('#companyName'));
      const siretField = debugElement.query(By.css('#siret'));
      
      expect(formRow).toBeTruthy();
      expect(companyNameField).toBeTruthy();
      expect(siretField).toBeTruthy();
    });

    it('should hide company fields when isPrestataire is false', () => {
      component.isPrestataire = false;
      fixture.detectChanges();
      
      const formRow = debugElement.query(By.css('.form-row'));
      
      expect(formRow).toBeFalsy();
    });

    it('should display main logo', () => {
      const logoImg = debugElement.query(By.css('.logo img'));
      expect(logoImg).toBeTruthy();
      expect(logoImg.nativeElement.src).toContain('assets/pictures/logo.png');
    });

    it('should display all form fields with correct labels', () => {
      const expectedFields = [
        { id: 'email', label: 'Email professionnel' },
        { id: 'phone', label: 'Téléphone' },
        { id: 'address', label: 'Adresse du siège' },
        { id: 'postalCode', label: 'Code postal' },
        { id: 'password', label: 'Mot de passe' }
      ];

      expectedFields.forEach(field => {
        const input = debugElement.query(By.css(`#${field.id}`));
        const label = debugElement.query(By.css(`label[for="${field.id}"]`));
        
        expect(input).toBeTruthy();
        expect(label).toBeTruthy();
        expect(label.nativeElement.textContent).toBe(field.label);
      });
    });

    it('should display company fields with correct labels when isPrestataire is true', () => {
      component.isPrestataire = true;
      fixture.detectChanges();

      const companyFields = [
        { id: 'companyName', label: "Nom de l'entreprise" },
        { id: 'siret', label: 'SIRET' }
      ];

      companyFields.forEach(field => {
        const input = debugElement.query(By.css(`#${field.id}`));
        const label = debugElement.query(By.css(`label[for="${field.id}"]`));
        
        expect(input).toBeTruthy();
        expect(label).toBeTruthy();
        expect(label.nativeElement.textContent).toBe(field.label);
      });
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

  describe('Component Lifecycle', () => {
    it('should unsubscribe from router subscription on destroy', () => {
      // Mock subscription
      component['routerSubscription'] = {
        unsubscribe: jest.fn()
      };
      
      component.ngOnDestroy();
      
      expect(component['routerSubscription'].unsubscribe).toHaveBeenCalled();
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

    it('should mark fields as touched on blur', () => {
      const emailInput = debugElement.query(By.css('#email'));
      
      emailInput.nativeElement.dispatchEvent(new Event('blur'));
      
      expect(component.form.get('email')?.touched).toBeTruthy();
    });
  });

  // describe('Error Handling', () => {
  //   it('should handle renderer errors gracefully', () => {
  //     // Mock Renderer2 to throw error
  //     const mockRenderer = {
  //       ...TestBed.inject(Renderer2),
  //       listen: jest.fn().mockImplementation(() => {
  //         throw new Error('Renderer error');
  //       })
  //     };

  //     // expect(() => {
  //     //   new RegisterFormComponent(TestBed.inject(FormBuilder), mockRenderer);
  //     // }).not.toThrow();
  //   });
  // });

  describe('Accessibility', () => {
    it('should have proper form field associations', () => {
      const inputs = debugElement.queryAll(By.css('input[id]'));
      
      inputs.forEach(input => {
        const id = input.nativeElement.id;
        const label = debugElement.query(By.css(`label[for="${id}"]`));
        expect(label).toBeTruthy();
      });
    });

    it('should have proper button type for submission', () => {
      const submitBtn = debugElement.query(By.css('.register-btn'));
      expect(submitBtn.nativeElement.type).toBe('submit');
    });
  });
});