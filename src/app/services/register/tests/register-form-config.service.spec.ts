import { TestBed } from '@angular/core/testing';
import { RegisterFormConfigService } from './../register-form-config.service';

describe('RegisterFormConfigService', () => {
  let service: RegisterFormConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegisterFormConfigService);

    // Supprimer tous les logs console pour chaque test
    spyOn(console, 'warn').and.stub();
    spyOn(console, 'error').and.stub();
    spyOn(console, 'log').and.stub();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Field Utils', () => {
    describe('getFieldLabel', () => {
      it('devrait retourner le label pour companyName si prestataire', () => {
        expect(service.getFieldLabel('companyName', true)).toBe("Nom de l'entreprise");
      });

      it('devrait retourner une chaîne vide pour companyName si non prestataire', () => {
        expect(service.getFieldLabel('companyName', false)).toBe('');
      });

      it('devrait retourner le label pour siretSiren si prestataire', () => {
        expect(service.getFieldLabel('siretSiren', true)).toBe('SIRET/SIREN');
      });

      it('devrait retourner une chaîne vide pour siretSiren si non prestataire', () => {
        expect(service.getFieldLabel('siretSiren', false)).toBe('');
      });

      it('devrait retourner le label standard pour firstName', () => {
        expect(service.getFieldLabel('firstName', false)).toBe('Prénom');
      });

      it('devrait retourner le nom du champ si non trouvé', () => {
        expect(service.getFieldLabel('champInconnu', false)).toBe('champInconnu');
      });
    });

    describe('getFieldPlaceholder', () => {
      it('devrait retourner le placeholder pour companyName si prestataire', () => {
        expect(service.getFieldPlaceholder('companyName', true)).toBe('Votre entreprise');
      });

      it('devrait retourner une chaîne vide pour companyName si non prestataire', () => {
        expect(service.getFieldPlaceholder('companyName', false)).toBe('');
      });

      it('devrait retourner le placeholder pour siretSiren si prestataire', () => {
        expect(service.getFieldPlaceholder('siretSiren', true)).toBe('Numéro SIRET/SIREN');
      });

      it('devrait retourner une chaîne vide pour siretSiren si non prestataire', () => {
        expect(service.getFieldPlaceholder('siretSiren', false)).toBe('');
      });

      it('devrait retourner le placeholder standard pour email', () => {
        expect(service.getFieldPlaceholder('email', false)).toBe('exemple@mail.com');
      });

      it('devrait retourner une chaîne vide pour un champ inconnu', () => {
        expect(service.getFieldPlaceholder('champInconnu', false)).toBe('');
      });
    });

    describe('getFieldType', () => {
      it('devrait retourner "email" pour le champ email', () => {
        expect(service.getFieldType('email', false)).toBe('email');
      });

      it('devrait retourner "password" pour le champ userSecret', () => {
        expect(service.getFieldType('userSecret', false)).toBe('password');
      });

      it('devrait retourner "text" pour le champ siretSiren', () => {
        expect(service.getFieldType('siretSiren', true)).toBe('text');
      });

      it('devrait retourner "text" pour un champ inconnu', () => {
        expect(service.getFieldType('champInconnu', false)).toBe('text');
      });
    });
    describe('getFieldRequired', () => {
      it('devrait retourner true pour companyName si prestataire', () => {
        expect(service.getFieldRequired('companyName', true)).toBe(true);
      });

      it('devrait retourner false pour companyName si non prestataire', () => {
        expect(service.getFieldRequired('companyName', false)).toBe(false);
      });

      it('devrait retourner true pour siretSiren si prestataire', () => {
        expect(service.getFieldRequired('siretSiren', true)).toBe(true);
      });

      it('devrait retourner false pour siretSiren si non prestataire', () => {
        expect(service.getFieldRequired('siretSiren', false)).toBe(false);
      });

      it('devrait retourner true pour un champ inconnu', () => {
        expect(service.getFieldRequired('champInconnu', true)).toBe(true);
        expect(service.getFieldRequired('champInconnu', false)).toBe(true);
      });
    });
  });
  describe('createRegistrationForm', () => {
    it('should create form with all required controls', () => {
      const form = service.createRegistrationForm();

      const expectedControls = [
        'firstName', 'lastName', 'email', 'userSecret',
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
        'firstName', 'lastName', 'email', 'userSecret',
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
      expect(emailControl?.hasError('emailFormat')).toBeTrue();

      emailControl?.setValue('valid@email.com');
      expect(emailControl?.valid).toBeTruthy();
    });

    it('should have minlength validator on userSecret field', () => {
      const form = service.createRegistrationForm();
      const userSecretControl = form.get('userSecret');

      userSecretControl?.setValue('123');
      expect(userSecretControl?.hasError('minlength')).toBeTruthy();

      userSecretControl?.setValue('Password123!');
      expect(userSecretControl?.valid).toBeTruthy();
    });

    it('should have pattern validator on userSecret field', () => {
      const form = service.createRegistrationForm();
      const userSecretControl = form.get('userSecret');

      userSecretControl?.setValue('123');
      expect(userSecretControl?.hasError('minLength')).toBeTrue();

      userSecretControl?.setValue('Password123!');
      expect(userSecretControl?.valid).toBeTruthy();
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

  describe('Validators - parameterized branches', () => {
    it('should validate email format with mixed cases and edge formats', () => {
      const form = service.createRegistrationForm();
      const email = form.get('email');

      const validEmails = [
        'TeSt@ExAmPlE.CoM',
        'name.sur+alias@example-domain.com',
        'a.b@cde.fr'
      ];
      validEmails.forEach(v => {
        email?.setValue(v);
        expect(email?.hasError('emailFormat')).toBeFalse();
      });

      const invalidEmails = [
        'anna@d',
        'nom@',
        '@domaine.com',
        'nom@domaine',
        'inv alid@mail.com'
      ];
      invalidEmails.forEach(v => {
        email?.setValue(v);
        expect(email?.hasError('emailFormat')).toBeTrue();
      });
    });

    it('should validate phone number with boundary cases', () => {
      const form = service.createRegistrationForm();
      const phone = form.get('phoneNumber');

      phone?.setValue('012345678'); // 9 digits
      expect(phone?.hasError('phoneNumberLength')).toBeTrue();

      phone?.setValue('01234567890'); // 11 digits
      expect(phone?.hasError('phoneNumberLength')).toBeTrue();

      phone?.setValue('01 23-45 67-89');
      expect(phone?.errors).toBeNull();

      phone?.setValue('01234abc89');
      expect(phone?.hasError('numbersOnly') || phone?.hasError('phoneNumberLength')).toBeTrue();
    });

    it('should block dangerous characters via injectionPrevention on address and city', () => {
      const form = service.createRegistrationForm();
      const address = form.get('address');
      const city = form.get('city');

      ['<script>', '{x}', 'name&drop', 'street`'].forEach(val => {
        address?.setValue(val);
        expect(address?.hasError('injectionPrevention')).toBeTrue();
      });

      ["O'Hara", 'Saint-Étienne', 'Le-Havre'].forEach(val => {
        city?.setValue(val);
        expect(city?.hasError('lettersOnly')).toBeFalse();
      });

      ['Paris1', 'N@ntes'].forEach(val => {
        city?.setValue(val);
        expect(city?.hasError('lettersOnly') || city?.hasError('injectionPrevention')).toBeTrue();
      });
    });

    it('should flip all password complexity branches', () => {
      const form = service.createRegistrationForm();
      const pwd = form.get('userSecret');

      // Too short
      pwd?.setValue('Aa1!aaa');
      expect(pwd?.hasError('minLength')).toBeTrue();

      // Missing lowercase
      pwd?.setValue('AAAAAAA1!');
      expect(pwd?.hasError('lowercase')).toBeTrue();

      // Missing uppercase
      pwd?.setValue('aaaaaaa1!');
      expect(pwd?.hasError('uppercase')).toBeTrue();

      // Missing number
      pwd?.setValue('Aaaaaaaa!');
      expect(pwd?.hasError('number')).toBeTrue();

      // Missing special
      pwd?.setValue('Aaaaaaaa1');
      expect(pwd?.hasError('special')).toBeTrue();

      // Valid
      pwd?.setValue('Password1!');
      expect(pwd?.errors).toBeNull();
    });

    it('should validate postal code boundaries', () => {
      const form = service.createRegistrationForm();
      const cp = form.get('postalCode');

      ['1234', '123456', '12a45'].forEach(v => {
        cp?.setValue(v);
        expect(cp?.hasError('pattern')).toBeTrue();
      });

      ['00000', '99999', '75000'].forEach(v => {
        cp?.setValue(v);
        expect(cp?.errors).toBeNull();
      });
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

      expect(companyNameControl?.valid).toBeTruthy();
      expect(siretSirenControl?.valid).toBeTruthy();

      service.updateValidatorsBasedOnUserType(form, true);

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
        'firstName', 'lastName', 'email', 'userSecret',
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

  describe('getFieldValidators', () => {
    it('should return correct validators for userSecret field', () => {
      const validators = service.getFieldValidators('userSecret');
      expect(validators.length).toBe(3); // required, minlength, pattern
    });

    it('should return correct validators for email field', () => {
      const validators = service.getFieldValidators('email');
      expect(validators.length).toBe(2); // required, email
    });

    it('should return correct validators for postalCode field', () => {
      const validators = service.getFieldValidators('postalCode');
      expect(validators.length).toBe(2);
    });

    it('should return default validators for unknown field', () => {
      const validators = service.getFieldValidators('unknownField');
      expect(validators.length).toBe(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle form creation multiple times', () => {
      const form1 = service.createRegistrationForm();
      const form2 = service.createRegistrationForm();

      expect(form1).not.toBe(form2);
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
