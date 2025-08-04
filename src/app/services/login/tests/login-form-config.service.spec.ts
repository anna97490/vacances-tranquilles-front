import { TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { LoginFormConfigService } from './../login-form-config.service';

describe('LoginFormConfigService', () => {
  let service: LoginFormConfigService;
  let form: FormGroup;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginFormConfigService);

    // Supprimer tous les logs console pour chaque test
    spyOn(console, 'warn').and.stub();
    spyOn(console, 'error').and.stub();
    spyOn(console, 'log').and.stub();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createLoginForm', () => {
    beforeEach(() => {
      form = service.createLoginForm();
    });

    it('should create form with email and password controls', () => {
      expect(form.get('email')).toBeTruthy();
      expect(form.get('password')).toBeTruthy();
    });

    it('should have required validators on email', () => {
      const emailControl = form.get('email');
      emailControl?.setValue('');
      
      expect(emailControl?.hasError('required')).toBeTruthy();
    });

    it('should have email validator on email field', () => {
      const emailControl = form.get('email');
      emailControl?.setValue('invalid-email');
      
      expect(emailControl?.hasError('email')).toBeTruthy();
    });

    it('should have required validator on password', () => {
      const passwordControl = form.get('password');
      passwordControl?.setValue('');
      
      expect(passwordControl?.hasError('required')).toBeTruthy();
    });

    it('should have minlength validator on password', () => {
      const passwordControl = form.get('password');
      passwordControl?.setValue('123');
      
      expect(passwordControl?.hasError('minlength')).toBeTruthy();
    });

    it('should accept valid email and password', () => {
      form.patchValue({
        email: 'test@example.com',
        password: 'password123'
      });
      
      expect(form.valid).toBeTruthy();
    });
  });

  describe('createLoginPayload', () => {
    beforeEach(() => {
      form = service.createLoginForm();
    });

    it('should create payload with form values', () => {
      form.patchValue({
        email: 'test@example.com',
        password: 'password123'
      });
      
      const payload = service.createLoginPayload(form);
      
      expect(payload).toEqual({
        email: 'test@example.com',
        password: 'password123'
      });
    });

    it('should create payload with empty values', () => {
      const payload = service.createLoginPayload(form);
      
      expect(payload).toEqual({
        email: '',
        password: ''
      });
    });
  });
});