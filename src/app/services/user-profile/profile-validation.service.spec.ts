import { TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { ProfileValidationService } from './profile-validation.service';

describe('ProfileValidationService', () => {
  let service: ProfileValidationService;
  let form: FormGroup;
  let fb: FormBuilder;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileValidationService);
    fb = TestBed.inject(FormBuilder);

    form = service.createProfileForm();

    // Supprimer tous les logs console pour chaque test
    spyOn(console, 'warn').and.stub();
    spyOn(console, 'error').and.stub();
    spyOn(console, 'log').and.stub();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createProfileForm', () => {
    it('should create form with all required controls', () => {
      const expectedControls = [
        'firstName', 'lastName', 'email', 'phoneNumber', 'city', 'description'
      ];

      expectedControls.forEach(controlName => {
        expect(form.get(controlName)).toBeTruthy();
      });
    });

    it('should have correct validators for required fields', () => {
      const requiredFields = [
        'firstName', 'lastName', 'email', 'phoneNumber', 'city'
      ];

      requiredFields.forEach(fieldName => {
        const control = form.get(fieldName);
        control?.setValue('');
        expect(control?.hasError('required')).toBeTruthy();
      });
    });

    it('should have email validator on email field', () => {
      const emailControl = form.get('email');

      emailControl?.setValue('invalid-email');
      expect(emailControl?.hasError('emailFormat')).toBeTrue();

      emailControl?.setValue('valid@email.com');
      expect(emailControl?.valid).toBeTruthy();
    });

    it('should have phone number validator on phoneNumber field', () => {
      const phoneControl = form.get('phoneNumber');

      phoneControl?.setValue('123');
      expect(phoneControl?.hasError('phoneNumberFormat')).toBeTrue();

      phoneControl?.setValue('0612345678');
      expect(phoneControl?.valid).toBeTruthy();
    });

    it('should have letters only validator on name fields', () => {
      const firstNameControl = form.get('firstName');
      const lastNameControl = form.get('lastName');
      const cityControl = form.get('city');

      // caractères valides
      firstNameControl?.setValue('Jean');
      expect(firstNameControl?.valid).toBeTruthy();

      lastNameControl?.setValue('Doe');
      expect(lastNameControl?.valid).toBeTruthy();

      cityControl?.setValue('Paris');
      expect(cityControl?.valid).toBeTruthy();
    });

    it('should validate email format correctly', () => {
      const emailControl = form.get('email');

      // Emails valides
      const validEmails = [
        'test@email.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
        'user123@test-domain.com'
      ];

      validEmails.forEach(email => {
        emailControl?.setValue(email);
        expect(emailControl?.valid).toBeTruthy();
      });
    });

    it('should validate phone number format correctly', () => {
      const phoneControl = form.get('phoneNumber');

      // Numéros valides
      const validPhones = [
        '0612345678',
        '0123456789',
        '0987654321'
      ];

      validPhones.forEach(phone => {
        phoneControl?.setValue(phone);
        expect(phoneControl?.valid).toBeTruthy();
      });
    });

    it('should handle empty values correctly in validators', () => {
      const firstNameControl = form.get('firstName');
      const emailControl = form.get('email');
      const phoneControl = form.get('phoneNumber');
      const descriptionControl = form.get('description');

      // Test avec des valeurs null/undefined/vides
      firstNameControl?.setValue(null);
      expect(firstNameControl?.hasError('lettersOnly')).toBeFalsy();

      firstNameControl?.setValue(undefined);
      expect(firstNameControl?.hasError('lettersOnly')).toBeFalsy();

      firstNameControl?.setValue('');
      expect(firstNameControl?.hasError('lettersOnly')).toBeFalsy();

      emailControl?.setValue('');
      expect(emailControl?.hasError('emailFormat')).toBeFalsy();

      phoneControl?.setValue('');
      expect(phoneControl?.hasError('phoneNumberFormat')).toBeFalsy();

      descriptionControl?.setValue('');
      expect(descriptionControl?.hasError('maxLength')).toBeFalsy();
    });
  });

  describe('getFieldLabels', () => {
    it('should return correct field labels', () => {
      const labels = service.getFieldLabels();
      
      expect(labels['firstName']).toBe('Prénom');
      expect(labels['lastName']).toBe('Nom');
      expect(labels['email']).toBe('Email');
      expect(labels['phoneNumber']).toBe('Téléphone');
      expect(labels['city']).toBe('Ville');
      expect(labels['description']).toBe('Description');
    });
  });

  describe('getFieldErrorText', () => {
    it('should return empty string for valid field', () => {
      const control = form.get('firstName');
      control?.setValue('John');
      control?.markAsTouched();
      
      const errorText = service.getFieldErrorText('firstName', control!);
      expect(errorText).toBe('');
    });

    it('should return empty string for untouched field', () => {
      const control = form.get('firstName');
      control?.setValue('');
      
      const errorText = service.getFieldErrorText('firstName', control!);
      expect(errorText).toBe('');
    });

    it('should return empty string for null control', () => {
      const errorText = service.getFieldErrorText('firstName', null as any);
      expect(errorText).toBe('');
    });

    it('should return empty string for control without errors', () => {
      const control = form.get('firstName');
      control?.setValue('John');
      control?.markAsTouched();
      
      const errorText = service.getFieldErrorText('firstName', control!);
      expect(errorText).toBe('');
    });

    it('should return required error message', () => {
      const control = form.get('firstName');
      control?.setValue('');
      control?.markAsTouched();
      
      const errorText = service.getFieldErrorText('firstName', control!);
      expect(errorText).toBe('Le prénom est requis');
    });

    it('should return letters only error message', () => {
      const control = form.get('firstName');
      control?.setValue('John123');
      control?.markAsTouched();
      
      const errorText = service.getFieldErrorText('firstName', control!);
      expect(errorText).toBe('Le prénom ne doit contenir que des lettres');
    });

    it('should return email format error message', () => {
      const control = form.get('email');
      control?.setValue('invalid-email');
      control?.markAsTouched();
      
      const errorText = service.getFieldErrorText('email', control!);
      expect(errorText).toBe('Format d\'email invalide');
    });

    it('should return phone number format error message', () => {
      const control = form.get('phoneNumber');
      control?.setValue('123');
      control?.markAsTouched();
      
      const errorText = service.getFieldErrorText('phoneNumber', control!);
      expect(errorText).toBe('Format de numéro de téléphone invalide (ex: 0612345678)');
    });

    it('should return city required error message', () => {
      const control = form.get('city');
      control?.setValue('');
      control?.markAsTouched();
      
      const errorText = service.getFieldErrorText('city', control!);
      expect(errorText).toBe('La ville est requise');
    });

    it('should return city letters only error message', () => {
      const control = form.get('city');
      control?.setValue('Paris123');
      control?.markAsTouched();
      
      const errorText = service.getFieldErrorText('city', control!);
      expect(errorText).toBe('La ville ne doit contenir que des lettres');
    });

    it('should return description max length error message', () => {
      const control = form.get('description');
      control?.setValue('a'.repeat(501));
      control?.markAsTouched();
      
      const errorText = service.getFieldErrorText('description', control!);
      expect(errorText).toBe('La description ne doit pas dépasser 500 caractères');
    });

    it('should return description injection prevention error message', () => {
      const control = form.get('description');
      control?.setValue('Description<script>valide');
      control?.markAsTouched();
      
      const errorText = service.getFieldErrorText('description', control!);
      expect(errorText).toBe('La description ne doit pas contenir de caractères spéciaux dangereux');
    });

    it('should return empty string for unknown field', () => {
      const control = form.get('firstName');
      control?.setValue('');
      control?.markAsTouched();
      
      const errorText = service.getFieldErrorText('unknownField', control!);
      expect(errorText).toBe('');
    });

    it('should handle lastName field errors', () => {
      const control = form.get('lastName');
      
      control?.setValue('');
      control?.markAsTouched();
      expect(service.getFieldErrorText('lastName', control!)).toBe('Le nom est requis');
      
      control?.setValue('Doe123');
      control?.markAsTouched();
      expect(service.getFieldErrorText('lastName', control!)).toBe('Le nom ne doit contenir que des lettres');
    });

    it('should handle email required error', () => {
      const control = form.get('email');
      control?.setValue('');
      control?.markAsTouched();
      
      const errorText = service.getFieldErrorText('email', control!);
      expect(errorText).toBe('L\'email est requis');
    });

    it('should handle phone number required error', () => {
      const control = form.get('phoneNumber');
      control?.setValue('');
      control?.markAsTouched();
      
      const errorText = service.getFieldErrorText('phoneNumber', control!);
      expect(errorText).toBe('Le numéro de téléphone est requis');
    });
  });

  describe('isFormValid', () => {
    it('should return true for valid form', () => {
      form.patchValue({
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean@test.com',
        phoneNumber: '0612345678',
        city: 'Paris',
        description: 'Description valide'
      });

      expect(service.isFormValid(form)).toBeTruthy();
    });

    it('should return false for invalid form', () => {
      form.patchValue({
        firstName: '',
        lastName: 'Dupont',
        email: 'invalid-email'
      });

      expect(service.isFormValid(form)).toBeFalsy();
    });
  });

  describe('markAllFieldsAsTouched', () => {
    it('should mark all fields as touched', () => {
      service.markAllFieldsAsTouched(form);
      
      Object.keys(form.controls).forEach(key => {
        const control = form.get(key);
        expect(control?.touched).toBeTrue();
      });
    });
  });

  describe('test individual validators', () => {
    it('should test lettersOnlyValidator directly', () => {
      const firstNameControl = form.get('firstName');
      
      // Test avec des chiffres
      firstNameControl?.setValue('Jean123');
      firstNameControl?.markAsTouched();
      expect(firstNameControl?.errors).toBeTruthy();
      expect(firstNameControl?.hasError('lettersOnly')).toBeTrue();
      
      // Test avec des caractères valides
      firstNameControl?.setValue('Jean-Pierre');
      expect(firstNameControl?.hasError('lettersOnly')).toBeFalse();
    });

    it('should test phoneNumberValidator directly', () => {
      const phoneControl = form.get('phoneNumber');
      
      // Test avec un numéro invalide
      phoneControl?.setValue('1234567890');
      phoneControl?.markAsTouched();
      expect(phoneControl?.errors).toBeTruthy();
      expect(phoneControl?.hasError('phoneNumberFormat')).toBeTrue();
      
      // Test avec un numéro valide
      phoneControl?.setValue('0612345678');
      expect(phoneControl?.hasError('phoneNumberFormat')).toBeFalse();
    });

    it('should test emailFormatValidator directly', () => {
      const emailControl = form.get('email');
      
      // Test avec un email invalide
      emailControl?.setValue('invalid-email');
      emailControl?.markAsTouched();
      expect(emailControl?.errors).toBeTruthy();
      expect(emailControl?.hasError('emailFormat')).toBeTrue();
      
      // Test avec un email valide
      emailControl?.setValue('test@email.com');
      expect(emailControl?.hasError('emailFormat')).toBeFalse();
    });
  });
});
