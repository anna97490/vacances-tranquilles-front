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
      userSecret: ['', [Validators.required]],
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
        userSecret: 'Password123!',
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
      form.patchValue({
        lastName: 'Dupont',
        email: 'jean@test.com',
        userSecret: 'Password123!',
        phoneNumber: '0123456789',
        address: '123 rue Test',
        city: 'Paris',
        postalCode: '75000'
      });
      form.get('firstName')?.setValue('');
      form.get('firstName')?.markAsTouched();

      const message = service.getValidationErrorMessage(form, false);
      expect(message).toBe('Veuillez remplir tous les champs obligatoires : Prénom');
    });

    it('should return lastName required error', () => {
      form.patchValue({
        firstName: 'Jean',
        email: 'jean@test.com',
        userSecret: 'Password123!',
        phoneNumber: '0123456789',
        address: '123 rue Test',
        city: 'Paris',
        postalCode: '75000'
      });
      form.get('lastName')?.setValue('');
      form.get('lastName')?.markAsTouched();

      const message = service.getValidationErrorMessage(form, false);
      expect(message).toBe('Veuillez remplir tous les champs obligatoires : Nom');
    });

    it('should return email required error', () => {
      form.patchValue({
        firstName: 'Jean',
        lastName: 'Dupont',
        userSecret: 'Password123!',
        phoneNumber: '0123456789',
        address: '123 rue Test',
        city: 'Paris',
        postalCode: '75000'
      });
      form.get('email')?.setValue('');
      form.get('email')?.markAsTouched();

      const message = service.getValidationErrorMessage(form, false);
      expect(message).toBe('Veuillez remplir tous les champs obligatoires : Email');
    });

    it('should return email format error', () => {
      form.patchValue({
        firstName: 'Jean',
        lastName: 'Dupont',
        userSecret: 'Password123!',
        phoneNumber: '0123456789',
        address: '123 rue Test',
        city: 'Paris',
        postalCode: '75000'
      });
      form.get('email')?.setValue('invalid-email');
      form.get('email')?.setErrors({ emailFormat: true });

      const message = service.getValidationErrorMessage(form, false);
      expect(message).toBe('Format d\'email invalide');
    });

    it('should return password required error', () => {
      form.patchValue({
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean@test.com',
        phoneNumber: '0123456789',
        address: '123 rue Test',
        city: 'Paris',
        postalCode: '75000'
      });
      form.get('userSecret')?.setValue('');
      form.get('userSecret')?.markAsTouched();

      const message = service.getValidationErrorMessage(form, false);
      expect(message).toBe('Veuillez remplir tous les champs obligatoires : Mot de passe');
    });

    it('should return password minlength error', () => {
      form.patchValue({
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean@test.com',
        phoneNumber: '0123456789',
        address: '123 rue Test',
        city: 'Paris',
        postalCode: '75000'
      });
      // Simuler l'erreur minLength directement et éviter l'état "champ manquant"
      form.get('userSecret')?.setValue('x');
      form.get('userSecret')?.setErrors({ minLength: true });

      const message = service.getValidationErrorMessage(form, false);
      expect(message).toBe('Le mot de passe doit contenir au moins 8 caractères');
    });

    it('should return password pattern error', () => {
      form.patchValue({
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean@test.com',
        phoneNumber: '0123456789',
        address: '123 rue Test',
        city: 'Paris',
        postalCode: '75000'
      });
      // Simuler les erreurs de complexité et éviter l'état "champ manquant"
      form.get('userSecret')?.setValue('X');
      form.get('userSecret')?.setErrors({ lowercase: true, uppercase: true, number: true, special: true });

      const message = service.getValidationErrorMessage(form, false);
      expect(message).toBe('Le mot de passe doit contenir au moins une minuscule');
    });

    it('should return postal code pattern error', () => {
      form.patchValue({
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean@test.com',
        userSecret: 'Password123!',
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
        userSecret: 'Password123!',
        phoneNumber: '0123456789',
        address: '123 rue Test',
        city: 'Paris',
        postalCode: '75000',
        siretSiren: '12345678901234'
      });

      form.get('companyName')?.setValue('X');
      form.get('companyName')?.setErrors({ required: true });

      const message = service.getValidationErrorMessage(form, true);
      expect(message).toBe('Le nom de l\'entreprise est requis');
    });

    it('should return SIRET required error for prestataire', () => {
      form.patchValue({
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean@test.com',
        userSecret: 'Password123!',
        phoneNumber: '0123456789',
        address: '123 rue Test',
        city: 'Paris',
        postalCode: '75000',
        companyName: 'Test Company'
      });

      // Simuler erreur required sans déclencher "champs manquants"
      form.get('siretSiren')?.setValue('X');
      form.get('siretSiren')?.setErrors({ required: true });

      const message = service.getValidationErrorMessage(form, true);
      expect(message).toBe('Le numéro SIRET/SIREN est requis');
    });

    it('should return SIRET pattern error for prestataire', () => {
      form.patchValue({
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean@test.com',
        userSecret: 'Password123!',
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
        userSecret: 'Password123!',
        phoneNumber: '0123456789',
        address: '123 rue Test',
        city: 'Paris',
        postalCode: '75000'
      });

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

      const classes = service.getFieldClasses(form, 'email');
      expect(classes).toBe('');
    });
  });

  describe('resetPasswordField', () => {
    it('should reset password field value and touch state', () => {
      form.get('userSecret')?.setValue('test-password');
      form.get('userSecret')?.markAsTouched();

      service.resetPasswordField(form);

      expect(form.get('userSecret')?.value).toBe('');
      expect(form.get('userSecret')?.untouched).toBeTruthy();
    });

    it('should handle form without password field gracefully', () => {
      const formWithoutPassword = fb.group({
        email: ['', Validators.required]
      });

      expect(() => service.resetPasswordField(formWithoutPassword)).not.toThrow();
    });
  });

  describe('private methods coverage', () => {
    function runTestCase(controls: any, field: string, error: string, expected: string, service: any) {
      Object.keys(controls).forEach(key => {
        controls[key].setErrors(null);
      });

      controls[field].setErrors({ [error]: true });

      const result = service.checkCommonFieldErrors(controls);
      expect(result).toBe(expected);
    }

    it('should check all common field errors', () => {
      const controls = form.controls;

      const testCases = [
        { field: 'firstName', error: 'required', expected: 'Le prénom est requis' },
        { field: 'lastName', error: 'required', expected: 'Le nom est requis' },
        { field: 'email', error: 'required', expected: 'L\'email est requis' },
        { field: 'email', error: 'emailFormat', expected: 'Format d\'email invalide' },
        { field: 'userSecret', error: 'required', expected: 'Le mot de passe est requis' },
        { field: 'userSecret', error: 'minLength', expected: 'Le mot de passe doit contenir au moins 8 caractères' },
        { field: 'userSecret', error: 'lowercase', expected: 'Le mot de passe doit contenir au moins une minuscule' },
        { field: 'userSecret', error: 'uppercase', expected: 'Le mot de passe doit contenir au moins une majuscule' },
        { field: 'userSecret', error: 'number', expected: 'Le mot de passe doit contenir au moins un chiffre' },
        { field: 'userSecret', error: 'special', expected: 'Le mot de passe doit contenir au moins un caractère spécial' },
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
        userSecret: 'Password123!',
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

      controls['companyName'].setValidators([Validators.required]);
      controls['siretSiren'].setValidators([
        Validators.required,
        Validators.pattern(/^\d{14}$/)
      ]);
      controls['companyName'].updateValueAndValidity();
      controls['siretSiren'].updateValueAndValidity();

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
