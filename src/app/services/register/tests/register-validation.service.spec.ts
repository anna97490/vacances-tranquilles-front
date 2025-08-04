import { TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterValidationService } from './../register-validation.service';

describe('RegisterValidationService', () => {
  let service: RegisterValidationService;
  let form: FormGroup;
  let fb: FormBuilder;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegisterValidationService);
    fb = TestBed.inject(FormBuilder);
    
    form = fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phoneNumber: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      companyName: [''],
      siretSiren: ['']
    });

    // Supprimer tous les logs console pour chaque test
    spyOn(console, 'warn').and.stub();
    spyOn(console, 'error').and.stub();
    spyOn(console, 'log').and.stub();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isFormValid', () => {
    it('should return true for valid form', () => {
      form.patchValue({
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean@test.com',
        password: 'password123',
        phoneNumber: '0123456789',
        address: '123 rue Test',
        city: 'Paris',
        postalCode: '75000'
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

  describe('getValidationErrorMessage', () => {
    it('should return firstName required error', () => {
      form.get('firstName')?.setValue('');
      form.get('firstName')?.markAsTouched();
      
      const message = service.getValidationErrorMessage(form, false);
      expect(message).toBe('Le prénom est requis');
    });

    it('should return lastName required error', () => {
      form.patchValue({ firstName: 'Jean' });
      form.get('lastName')?.setValue('');
      form.get('lastName')?.markAsTouched();
      
      const message = service.getValidationErrorMessage(form, false);
      expect(message).toBe('Le nom est requis');
    });

    it('should return email required error', () => {
      form.patchValue({ firstName: 'Jean', lastName: 'Dupont' });
      form.get('email')?.setValue('');
      form.get('email')?.markAsTouched();
      
      const message = service.getValidationErrorMessage(form, false);
      expect(message).toBe('L\'email est requis');
    });

    it('should return email format error', () => {
      form.patchValue({ firstName: 'Jean', lastName: 'Dupont' });
      form.get('email')?.setValue('invalid-email');
      
      const message = service.getValidationErrorMessage(form, false);
      expect(message).toBe('Format d\'email invalide');
    });

    it('should return password required error', () => {
      form.patchValue({ 
        firstName: 'Jean', 
        lastName: 'Dupont', 
        email: 'jean@test.com' 
      });
      form.get('password')?.setValue('');
      form.get('password')?.markAsTouched();
      
      const message = service.getValidationErrorMessage(form, false);
      expect(message).toBe('Le mot de passe est requis');
    });

    it('should return password minlength error', () => {
      form.patchValue({ 
        firstName: 'Jean', 
        lastName: 'Dupont', 
        email: 'jean@test.com' 
      });
      form.get('password')?.setValue('123');
      
      const message = service.getValidationErrorMessage(form, false);
      expect(message).toBe('Le mot de passe doit contenir au moins 6 caractères');
    });

    it('should return postal code pattern error', () => {
      form.patchValue({
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean@test.com',
        password: 'password123',
        phoneNumber: '0123456789',
        address: '123 rue Test',
        city: 'Paris'
      });
      form.get('postalCode')?.setValue('123');
      
      const message = service.getValidationErrorMessage(form, false);
      expect(message).toBe('Le code postal doit contenir 5 chiffres');
    });

    it('should return company name error for prestataire', () => {
      form.patchValue({
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean@test.com',
        password: 'password123',
        phoneNumber: '0123456789',
        address: '123 rue Test',
        city: 'Paris',
        postalCode: '75000'
      });
      
      // Add validators for prestataire
      form.get('companyName')?.setValidators([Validators.required]);
      form.get('companyName')?.updateValueAndValidity();
      form.get('companyName')?.setValue('');
      form.get('companyName')?.markAsTouched();
      
      const message = service.getValidationErrorMessage(form, true);
      expect(message).toBe('Le nom de l\'entreprise est requis');
    });

    it('should return SIRET required error for prestataire', () => {
      form.patchValue({
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean@test.com',
        password: 'password123',
        phoneNumber: '0123456789',
        address: '123 rue Test',
        city: 'Paris',
        postalCode: '75000',
        companyName: 'Test Company'
      });
      
      form.get('siretSiren')?.setValidators([Validators.required]);
      form.get('siretSiren')?.updateValueAndValidity();
      form.get('siretSiren')?.setValue('');
      form.get('siretSiren')?.markAsTouched();
      
      const message = service.getValidationErrorMessage(form, true);
      expect(message).toBe('Le numéro SIRET/SIREN est requis');
    });

    it('should return SIRET pattern error for prestataire', () => {
      form.patchValue({
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean@test.com',
        password: 'password123',
        phoneNumber: '0123456789',
        address: '123 rue Test',
        city: 'Paris',
        postalCode: '75000',
        companyName: 'Test Company'
      });
      
      form.get('siretSiren')?.setValidators([
        Validators.required,
        Validators.pattern(/^\d{14}$/)
      ]);
      form.get('siretSiren')?.updateValueAndValidity();
      form.get('siretSiren')?.setValue('123');
      
      const message = service.getValidationErrorMessage(form, true);
      expect(message).toBe('Le SIRET/SIREN doit contenir 14 chiffres');
    });

    it('should return default message when no specific error found', () => {
      form.patchValue({
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean@test.com',
        password: 'password123',
        phoneNumber: '0123456789',
        address: '123 rue Test',
        city: 'Paris',
        postalCode: '75000'
      });
      
      // Force a custom error
      form.get('email')?.setErrors({ 'customError': true });
      
      const message = service.getValidationErrorMessage(form, false);
      expect(message).toBe('Formulaire invalide - vérifiez vos données');
    });
  });

  describe('getFieldClasses', () => {
    it('should return field-error class for invalid touched field', () => {
      form.get('email')?.setValue('');
      form.get('email')?.markAsTouched();
      
      const classes = service.getFieldClasses(form, 'email');
      expect(classes).toBe('field-error');
    });

    it('should return empty string for valid field', () => {
      form.get('email')?.setValue('valid@email.com');
      
      const classes = service.getFieldClasses(form, 'email');
      expect(classes).toBe('');
    });

    it('should return empty string for non-existent field', () => {
      const classes = service.getFieldClasses(form, 'nonExistentField');
      expect(classes).toBe('');
    });

    it('should return empty string for invalid but untouched field', () => {
      form.get('email')?.setValue('');
      // Field is not touched
      
      const classes = service.getFieldClasses(form, 'email');
      expect(classes).toBe('');
    });
  });

  describe('resetPasswordField', () => {
    it('should reset password field value and touch state', () => {
      form.get('password')?.setValue('test-password');
      form.get('password')?.markAsTouched();
      
      service.resetPasswordField(form);
      
      expect(form.get('password')?.value).toBe('');
      expect(form.get('password')?.untouched).toBeTruthy();
    });

    it('should handle form without password field gracefully', () => {
      const formWithoutPassword = fb.group({
        email: ['', Validators.required]
      });
      
      expect(() => service.resetPasswordField(formWithoutPassword)).not.toThrow();
    });
  });

  describe('private methods coverage', () => {
    // Extracted to avoid deep nesting
    function runTestCase(controls: any, field: string, error: string, expected: string, service: any) {
      // Reset all controls
      Object.keys(controls).forEach(key => {
        controls[key].setErrors(null);
      });

      // Set specific error
      controls[field].setErrors({ [error]: true });

      const result = service.checkCommonFieldErrors(controls);
      expect(result).toBe(expected);
    }

    it('should check all common field errors', () => {
      const controls = form.controls;
      
      // Test each field error individually
      const testCases = [
        { field: 'firstName', error: 'required', expected: 'Le prénom est requis' },
        { field: 'lastName', error: 'required', expected: 'Le nom est requis' },
        { field: 'email', error: 'required', expected: 'L\'email est requis' },
        { field: 'email', error: 'email', expected: 'Format d\'email invalide' },
        { field: 'password', error: 'required', expected: 'Le mot de passe est requis' },
        { field: 'password', error: 'minlength', expected: 'Le mot de passe doit contenir au moins 6 caractères' },
        { field: 'phoneNumber', error: 'required', expected: 'Le numéro de téléphone est requis' },
        { field: 'address', error: 'required', expected: 'L\'adresse est requise' },
        { field: 'city', error: 'required', expected: 'La ville est requise' },
        { field: 'postalCode', error: 'required', expected: 'Le code postal est requis' },
        { field: 'postalCode', error: 'pattern', expected: 'Le code postal doit contenir 5 chiffres' }
      ];

      testCases.forEach(({ field, error, expected }) => {
        runTestCase(controls, field, error, expected, service as any);
      });
    });

    it('should return null when no common field errors', () => {
      form.patchValue({
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean@test.com',
        password: 'password123',
        phoneNumber: '0123456789',
        address: '123 rue Test',
        city: 'Paris',
        postalCode: '75000'
      });
      
      const result = (service as any).checkCommonFieldErrors(form.controls);
      expect(result).toBeNull();
    });

    it('should check prestataire field errors', () => {
      const controls = form.controls;
      
      // Add prestataire validators
      controls['companyName'].setValidators([Validators.required]);
      controls['siretSiren'].setValidators([
        Validators.required,
        Validators.pattern(/^\d{14}$/)
      ]);
      controls['companyName'].updateValueAndValidity();
      controls['siretSiren'].updateValueAndValidity();
      
      // Test company name required
      controls['companyName'].setErrors({ 'required': true });
      let result = (service as any).checkPrestataireErrors(controls, true);
      expect(result).toBe('Le nom de l\'entreprise est requis');
      
      // Test SIRET required
      controls['companyName'].setErrors(null);
      controls['siretSiren'].setErrors({ 'required': true });
      result = (service as any).checkPrestataireErrors(controls, true);
      expect(result).toBe('Le numéro SIRET/SIREN est requis');
      
      // Test SIRET pattern
      controls['siretSiren'].setErrors({ 'pattern': true });
      result = (service as any).checkPrestataireErrors(controls, true);
      expect(result).toBe('Le SIRET/SIREN doit contenir 14 chiffres');
    });

    it('should return null for prestataire errors when isPrestataire is false', () => {
      const controls = form.controls;
      controls['companyName'].setErrors({ 'required': true });
      
      const result = (service as any).checkPrestataireErrors(controls, false);
      expect(result).toBeNull();
    });

    it('should return null when no prestataire errors', () => {
      const controls = form.controls;
      controls['companyName'].setErrors(null);
      controls['siretSiren'].setErrors(null);
      
      const result = (service as any).checkPrestataireErrors(controls, true);
      expect(result).toBeNull();
    });
  });
});