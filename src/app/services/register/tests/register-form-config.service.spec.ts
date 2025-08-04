import { TestBed } from '@angular/core/testing';
import { FormBuilder, Validators } from '@angular/forms';
import { RegisterFormConfigService } from './../register-form-config.service';

describe('RegisterFormConfigService', () => {
  let service: RegisterFormConfigService;
  let fb: FormBuilder;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegisterFormConfigService);
    fb = TestBed.inject(FormBuilder);

    // Supprimer tous les logs console pour chaque test
    spyOn(console, 'warn').and.stub();
    spyOn(console, 'error').and.stub();
    spyOn(console, 'log').and.stub();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createRegistrationForm', () => {
    it('should create form with all required controls', () => {
      const form = service.createRegistrationForm();
      
      const expectedControls = [
        'firstName', 'lastName', 'email', 'password',
        'phoneNumber', 'address', 'city', 'postalCode',
        'companyName', 'siretSiren'
      ];
      
      expectedControls.forEach(controlName => {
        expect(form.get(controlName)).toBeTruthy();
      });
    });

    it('should have correct validators for required fields', () => {
      const form = service.createRegistrationForm();
      
      const requiredFields = [
        'firstName', 'lastName', 'email', 'password',
        'phoneNumber', 'address', 'city', 'postalCode'
      ];
      
      requiredFields.forEach(fieldName => {
        const control = form.get(fieldName);
        control?.setValue('');
        expect(control?.hasError('required')).toBeTruthy();
      });
    });

    it('should have email validator on email field', () => {
      const form = service.createRegistrationForm();
      const emailControl = form.get('email');
      
      emailControl?.setValue('invalid-email');
      expect(emailControl?.hasError('email')).toBeTruthy();
      
      emailControl?.setValue('valid@email.com');
      expect(emailControl?.valid).toBeTruthy();
    });

    it('should have minlength validator on password field', () => {
      const form = service.createRegistrationForm();
      const passwordControl = form.get('password');
      
      passwordControl?.setValue('123');
      expect(passwordControl?.hasError('minlength')).toBeTruthy();
      
      passwordControl?.setValue('password123');
      expect(passwordControl?.valid).toBeTruthy();
    });

    it('should have pattern validator on postalCode field', () => {
      const form = service.createRegistrationForm();
      const postalCodeControl = form.get('postalCode');
      
      postalCodeControl?.setValue('123');
      expect(postalCodeControl?.hasError('pattern')).toBeTruthy();
      
      postalCodeControl?.setValue('abc12');
      expect(postalCodeControl?.hasError('pattern')).toBeTruthy();
      
      postalCodeControl?.setValue('75000');
      expect(postalCodeControl?.valid).toBeTruthy();
    });

    it('should have no validators on companyName and siretSiren initially', () => {
      const form = service.createRegistrationForm();
      
      const companyNameControl = form.get('companyName');
      const siretSirenControl = form.get('siretSiren');
      
      companyNameControl?.setValue('');
      siretSirenControl?.setValue('');
      
      expect(companyNameControl?.valid).toBeTruthy();
      expect(siretSirenControl?.valid).toBeTruthy();
    });
  });

  describe('updateValidatorsBasedOnUserType', () => {
    let form: any;

    beforeEach(() => {
      form = service.createRegistrationForm();
    });

    it('should add validators for prestataire fields when isPrestataire is true', () => {
      service.updateValidatorsBasedOnUserType(form, true);
      
      const companyNameControl = form.get('companyName');
      const siretSirenControl = form.get('siretSiren');
      
      companyNameControl?.setValue('');
      siretSirenControl?.setValue('');
      
      expect(companyNameControl?.hasError('required')).toBeTruthy();
      expect(siretSirenControl?.hasError('required')).toBeTruthy();
    });

    it('should add pattern validator for SIRET when isPrestataire is true', () => {
      service.updateValidatorsBasedOnUserType(form, true);
      
      const siretSirenControl = form.get('siretSiren');
      
      siretSirenControl?.setValue('123');
      expect(siretSirenControl?.hasError('pattern')).toBeTruthy();
      
      siretSirenControl?.setValue('abc12345678901');
      expect(siretSirenControl?.hasError('pattern')).toBeTruthy();
      
      siretSirenControl?.setValue('12345678901234');
      expect(siretSirenControl?.valid).toBeTruthy();
    });

    it('should clear validators when isPrestataire is false', () => {
      // First add validators
      service.updateValidatorsBasedOnUserType(form, true);
      
      // Then clear them
      service.updateValidatorsBasedOnUserType(form, false);
      
      const companyNameControl = form.get('companyName');
      const siretSirenControl = form.get('siretSiren');
      
      companyNameControl?.setValue('');
      siretSirenControl?.setValue('');
      
      expect(companyNameControl?.valid).toBeTruthy();
      expect(siretSirenControl?.valid).toBeTruthy();
    });

    it('should update validity after changing validators', () => {
      const companyNameControl = form.get('companyName');
      const siretSirenControl = form.get('siretSiren');
      
      // Set invalid values
      companyNameControl?.setValue('');
      siretSirenControl?.setValue('');
      
      // Initially should be valid (no validators)
      expect(companyNameControl?.valid).toBeTruthy();
      expect(siretSirenControl?.valid).toBeTruthy();
      
      // Add validators
      service.updateValidatorsBasedOnUserType(form, true);
      
      // Should now be invalid
      expect(companyNameControl?.valid).toBeFalsy();
      expect(siretSirenControl?.valid).toBeFalsy();
    });

    it('should handle null controls gracefully', () => {
      const mockForm = {
        get: jasmine.createSpy('get').and.returnValue(null)
      };
      
      expect(() => service.updateValidatorsBasedOnUserType(mockForm as any, true))
        .not.toThrow();
    });
  });

  describe('shouldShowField', () => {
    it('should return true for prestataire-only fields when isPrestataire is true', () => {
      expect(service.shouldShowField('companyName', true)).toBeTruthy();
      expect(service.shouldShowField('siretSiren', true)).toBeTruthy();
    });

    it('should return false for prestataire-only fields when isPrestataire is false', () => {
      expect(service.shouldShowField('companyName', false)).toBeFalsy();
      expect(service.shouldShowField('siretSiren', false)).toBeFalsy();
    });

    it('should return true for common fields regardless of user type', () => {
      const commonFields = [
        'firstName', 'lastName', 'email', 'password',
        'phoneNumber', 'address', 'city', 'postalCode'
      ];
      
      commonFields.forEach(field => {
        expect(service.shouldShowField(field, true)).toBeTruthy();
        expect(service.shouldShowField(field, false)).toBeTruthy();
      });
    });

    it('should return true for unknown fields', () => {
      expect(service.shouldShowField('unknownField', true)).toBeTruthy();
      expect(service.shouldShowField('unknownField', false)).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle form creation multiple times', () => {
      const form1 = service.createRegistrationForm();
      const form2 = service.createRegistrationForm();
      
      expect(form1).not.toBe(form2); // Different instances
      expect(Object.keys(form1.controls)).toEqual(Object.keys(form2.controls));
    });

    it('should handle validator updates multiple times', () => {
      const form = service.createRegistrationForm();
      
      // Multiple updates should work
      service.updateValidatorsBasedOnUserType(form, true);
      service.updateValidatorsBasedOnUserType(form, false);
      service.updateValidatorsBasedOnUserType(form, true);
      
      const companyNameControl = form.get('companyName');
      companyNameControl?.setValue('');
      
      expect(companyNameControl?.hasError('required')).toBeTruthy();
    });

    it('should validate SIRET with exact 14 digits', () => {
      const form = service.createRegistrationForm();
      service.updateValidatorsBasedOnUserType(form, true);
      
      const siretControl = form.get('siretSiren');
      
      // Test edge cases for SIRET pattern
      const testCases = [
        { value: '1234567890123', valid: false }, // 13 digits
        { value: '12345678901234', valid: true },  // 14 digits
        { value: '123456789012345', valid: false }, // 15 digits
        { value: '12345678901abc', valid: false },  // contains letters
        { value: '00000000000000', valid: true },   // all zeros
        { value: '99999999999999', valid: true }    // all nines
      ];
      
      testCases.forEach(({ value, valid }) => {
        siretControl?.setValue(value);
        expect(siretControl?.valid).toBe(valid);
      });
    });
  });
});