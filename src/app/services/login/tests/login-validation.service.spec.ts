import { TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginValidationService } from './../login-validation.service';

describe('LoginValidationService', () => {
  let service: LoginValidationService;
  let form: FormGroup;
  let fb: FormBuilder;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginValidationService);
    fb = TestBed.inject(FormBuilder);
    
    form = fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
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
        email: 'test@example.com',
        password: 'password123'
      });
      
      expect(service.isFormValid(form)).toBeTruthy();
    });

    it('should return false for invalid form', () => {
      form.patchValue({
        email: 'invalid-email',
        password: '123'
      });
      
      expect(service.isFormValid(form)).toBeFalsy();
    });
  });

  describe('getValidationErrorMessage', () => {
    it('should return email required error', () => {
      form.get('email')?.setValue('');
      form.get('email')?.markAsTouched();
      
      const message = service.getValidationErrorMessage(form);
      expect(message).toBe('L\'email est requis');
    });

    it('should return email format error', () => {
      form.get('email')?.setValue('invalid-email');
      form.get('email')?.markAsTouched();
      
      const message = service.getValidationErrorMessage(form);
      expect(message).toBe('Format d\'email invalide');
    });

    it('should return password required error', () => {
      form.get('email')?.setValue('test@example.com');
      form.get('password')?.setValue('');
      form.get('password')?.markAsTouched();
      
      const message = service.getValidationErrorMessage(form);
      expect(message).toBe('Le mot de passe est requis');
    });

    it('should return password minlength error', () => {
      form.get('email')?.setValue('test@example.com');
      form.get('password')?.setValue('123');
      form.get('password')?.markAsTouched();
      
      const message = service.getValidationErrorMessage(form);
      expect(message).toBe('Le mot de passe doit contenir au moins 6 caractères');
    });

    it('should return default error message', () => {
      form.get('email')?.setValue('test@example.com');
      form.get('password')?.setValue('password123');
      form.get('email')?.setErrors({ 'customError': true });
      
      const message = service.getValidationErrorMessage(form);
      expect(message).toBe('Formulaire invalide - vérifiez vos données');
    });
  });

  describe('resetPasswordField', () => {
    it('should reset password field', () => {
      form.get('password')?.setValue('test123');
      form.get('password')?.markAsTouched();
      
      service.resetPasswordField(form);
      
      expect(form.get('password')?.value).toBe('');
      expect(form.get('password')?.touched).toBeFalsy();
    });

    it('should handle missing password field', () => {
      const formWithoutPassword = fb.group({
        email: ['', Validators.required]
      });
      
      expect(() => service.resetPasswordField(formWithoutPassword)).not.toThrow();
    });
  });

  describe('markAllFieldsAsTouched', () => {
    it('should mark all fields as touched', () => {
      form.patchValue({
        email: 'invalid-email',
        password: '123'
      });
      
      service.markAllFieldsAsTouched(form);
      
      expect(form.get('email')?.touched).toBeTruthy();
      expect(form.get('password')?.touched).toBeTruthy();
    });
  });
});