import { TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup } from '@angular/forms';
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

      firstNameControl?.setValue('John123');
      expect(firstNameControl?.hasError('lettersOnly')).toBeTrue();

      lastNameControl?.setValue('Doe456');
      expect(lastNameControl?.hasError('lettersOnly')).toBeTrue();

      firstNameControl?.setValue('Jean-Pierre');
      expect(firstNameControl?.valid).toBeTruthy();

      lastNameControl?.setValue('O\'Connor');
      expect(lastNameControl?.valid).toBeTruthy();
    });

    it('should have description length validator', () => {
      const descriptionControl = form.get('description');

      // Créer une description de plus de 500 caractères
      const longDescription = 'a'.repeat(501);
      descriptionControl?.setValue(longDescription);
      expect(descriptionControl?.hasError('maxLength')).toBeTrue();

      descriptionControl?.setValue('Description valide');
      expect(descriptionControl?.valid).toBeTruthy();
    });
  });

  describe('getFieldLabels', () => {
    it('should return correct field labels', () => {
      const labels = service.getFieldLabels();
      
      expect(labels.firstName).toBe('Prénom');
      expect(labels.lastName).toBe('Nom');
      expect(labels.email).toBe('Email');
      expect(labels.phoneNumber).toBe('Téléphone');
      expect(labels.city).toBe('Ville');
      expect(labels.description).toBe('Description');
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
});
