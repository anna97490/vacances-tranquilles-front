import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

import { RegisterFormComponent } from './register-form.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ConfigService } from '../../services/config/config.service';
import { RegisterValidationService } from '../../services/register/register-validation.service';
import { RegisterFormConfigService } from '../../services/register/register-form-config.service';
import { UserTypeDetectorService } from '../../services/register/user-type-detector.service';
import { RegisterApiBuilderService } from '../../services/register/register-api-builder.service';
import { RegisterService } from '../../services/register/register.service';

describe('RegisterFormComponent', () => {
  let component: RegisterFormComponent;
  let fixture: ComponentFixture<RegisterFormComponent>;

  let configServiceMock: Partial<ConfigService>;
  let validationServiceMock: jasmine.SpyObj<RegisterValidationService>;
  let formConfigServiceMock: jasmine.SpyObj<RegisterFormConfigService>;
  let userTypeDetectorMock: jasmine.SpyObj<UserTypeDetectorService>;
  let apiBuilderMock: jasmine.SpyObj<RegisterApiBuilderService>;
  let registerServiceMock: jasmine.SpyObj<RegisterService>;
  let confirmSpy: jasmine.Spy;

  let testForm: FormGroup;

  beforeEach(async () => {
    testForm = new FormGroup({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      email: new FormControl('user@example.com'),
      userSecret: new FormControl(''),
      phoneNumber: new FormControl(''),
      address: new FormControl(''),
      city: new FormControl(''),
      postalCode: new FormControl(''),
      companyName: new FormControl(''),
      siretSiren: new FormControl('')
    });

    configServiceMock = { apiUrl: 'http://api.test' } as ConfigService;

    validationServiceMock = jasmine.createSpyObj<RegisterValidationService>(
      'RegisterValidationService',
      ['isFormValid', 'areAllRequiredFieldsFilled', 'resetPasswordField', 'getFieldClasses']
    );
    validationServiceMock.isFormValid.and.returnValue(false);
    validationServiceMock.areAllRequiredFieldsFilled.and.returnValue(false);
    validationServiceMock.getFieldClasses.and.returnValue('');

    formConfigServiceMock = jasmine.createSpyObj<RegisterFormConfigService>(
      'RegisterFormConfigService',
      [
        'createRegistrationForm',
        'updateValidatorsBasedOnUserType',
        'shouldShowField',
        'getFieldLabel',
        'getFieldPlaceholder',
        'getFieldType',
        'getFieldRequired'
      ]
    );
    formConfigServiceMock.createRegistrationForm.and.returnValue(testForm);
    formConfigServiceMock.updateValidatorsBasedOnUserType.and.stub();
    formConfigServiceMock.shouldShowField.and.returnValue(true);
    formConfigServiceMock.getFieldLabel.and.returnValue('');
    formConfigServiceMock.getFieldPlaceholder.and.returnValue('');
    formConfigServiceMock.getFieldType.and.returnValue('text');
    formConfigServiceMock.getFieldRequired.and.returnValue(true);

    userTypeDetectorMock = jasmine.createSpyObj<UserTypeDetectorService>(
      'UserTypeDetectorService',
      [
        'detectUserTypeFromUrl',
        'detectUserTypeFromString',
        'getPrestataireFormTitle',
        'getParticulierFormTitle',
        'getPrestataireUserTypeString',
        'getParticulierUserTypeString'
      ]
    );
    // Simuler un particulier par défaut
    userTypeDetectorMock.detectUserTypeFromUrl.and.returnValue(false);
    userTypeDetectorMock.getPrestataireFormTitle.and.returnValue('Inscription Prestataire');
    userTypeDetectorMock.getParticulierFormTitle.and.returnValue('Inscription Particulier');
    userTypeDetectorMock.getPrestataireUserTypeString.and.returnValue('prestataire');
    userTypeDetectorMock.getParticulierUserTypeString.and.returnValue('particulier');

    apiBuilderMock = jasmine.createSpyObj<RegisterApiBuilderService>(
      'RegisterApiBuilderService',
      ['buildApiConfig']
    );
    const minimalPayload = {
      firstName: '',
      lastName: '',
      email: 'user@example.com',
      password: '',
      phoneNumber: '',
      address: '',
      city: '',
      postalCode: ''
    };
    apiBuilderMock.buildApiConfig.and.returnValue({ url: '/auth/register/client', payload: minimalPayload } as any);

    registerServiceMock = jasmine.createSpyObj<RegisterService>(
      'RegisterService',
      ['performRegistration', 'handleRegistrationSuccess', 'handleRegistrationError']
    );
    registerServiceMock.performRegistration.and.returnValue(of(new HttpResponse({ status: 200, body: 'OK' })));
    registerServiceMock.handleRegistrationError.and.returnValue(null);

    await TestBed.configureTestingModule({
      imports: [RegisterFormComponent, ReactiveFormsModule, RouterTestingModule, NoopAnimationsModule],
      providers: [
        { provide: ConfigService, useValue: configServiceMock },
        { provide: RegisterValidationService, useValue: validationServiceMock },
        { provide: RegisterFormConfigService, useValue: formConfigServiceMock },
        { provide: UserTypeDetectorService, useValue: userTypeDetectorMock },
        { provide: RegisterApiBuilderService, useValue: apiBuilderMock },
        { provide: RegisterService, useValue: registerServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Spy on native confirm for CGU consent
    confirmSpy = spyOn(window, 'confirm');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should detect user type, init form and set api url', () => {
    expect(userTypeDetectorMock.detectUserTypeFromUrl).toHaveBeenCalled();
    expect(formConfigServiceMock.createRegistrationForm).toHaveBeenCalled();
    expect(formConfigServiceMock.updateValidatorsBasedOnUserType).toHaveBeenCalledWith(testForm, false);
    expect(component.urlApi).toBe('http://api.test');
    expect(component.isPrestataire).toBeFalse();
  });

  it('should not submit when form is invalid', () => {
    validationServiceMock.isFormValid.and.returnValue(false);
    component.onSubmit();
    expect(apiBuilderMock.buildApiConfig).not.toHaveBeenCalled();
    expect(registerServiceMock.performRegistration).not.toHaveBeenCalled();
  });

  it('should submit when form is valid, user accepts CGU, and handle success', () => {
    validationServiceMock.isFormValid.and.returnValue(true);
    registerServiceMock.performRegistration.and.returnValue(of(new HttpResponse({ status: 200, body: 'OK' })));
    confirmSpy.and.returnValue(true);

    component.onSubmit();

    expect(apiBuilderMock.buildApiConfig).toHaveBeenCalledWith(testForm, false, 'http://api.test');
    expect(registerServiceMock.performRegistration).toHaveBeenCalledWith(jasmine.objectContaining({ url: '/auth/register/client' }));
    expect(registerServiceMock.handleRegistrationSuccess).toHaveBeenCalledWith(jasmine.any(HttpResponse), false);
  });

  it('should not submit when user declines CGU', () => {
    validationServiceMock.isFormValid.and.returnValue(true);
    confirmSpy.and.returnValue(false);

    component.onSubmit();

    expect(apiBuilderMock.buildApiConfig).not.toHaveBeenCalled();
    expect(registerServiceMock.performRegistration).not.toHaveBeenCalled();
  });

  it('should handle confirm CGU accept and decline via parameterized tests', () => {
    validationServiceMock.isFormValid.and.returnValue(true);

    [true, false].forEach(choice => {
      confirmSpy.and.returnValue(choice);
      component.onSubmit();
      if (choice) {
        expect(apiBuilderMock.buildApiConfig).toHaveBeenCalled();
      } else {
        expect(apiBuilderMock.buildApiConfig).not.toHaveBeenCalled();
      }
      // reset spies between iterations
      apiBuilderMock.buildApiConfig.calls.reset();
      registerServiceMock.performRegistration.calls.reset();
      registerServiceMock.handleRegistrationSuccess.calls.reset();
    });
  });

  it('should build error summary and focus first invalid field', fakeAsync(() => {
    validationServiceMock.isFormValid.and.returnValue(false);
    const focusSpy = spyOn<any>(component, 'focusFirstInvalidField');
    component.onSubmit();
    tick();
    expect(component.showErrorSummary).toBeTrue();
    expect(focusSpy).toHaveBeenCalled();
  }));

  it('should compose field and password error messages via helpers', () => {
    // Mark controls touched and set errors
    const emailCtrl = component.form.get('email');
    emailCtrl?.markAsTouched();
    emailCtrl?.setErrors({ emailFormat: true });
    expect(component.getFieldErrorText('email')).toContain('Format');

    const pwdCtrl = component.form.get('userSecret');
    pwdCtrl?.markAsTouched();
    pwdCtrl?.setErrors({ minLength: true, lowercase: true });
    expect(component.getPasswordErrorText()).toContain('Le mot de passe doit contenir');
  });

  it('should return empty password error when untouched or no errors', () => {
    const pwdCtrl = component.form.get('userSecret');
    // untouched with errors
    pwdCtrl?.setErrors({ minLength: true });
    expect(component.getPasswordErrorText()).toBe('');
    // touched with no errors
    pwdCtrl?.markAsTouched();
    pwdCtrl?.setErrors(null);
    expect(component.getPasswordErrorText()).toBe('');
  });

  it('should build summary variants for email-only and password-only invalid', fakeAsync(() => {
    // email only invalid (set errors directly to simulate invalid)
    const emailCtrl = component.form.get('email');
    const pwdCtrl = component.form.get('userSecret');
    emailCtrl?.setErrors({ emailFormat: true });
    emailCtrl?.markAsTouched();
    pwdCtrl?.setErrors(null);
    pwdCtrl?.markAsTouched();
    component.onSubmit();
    tick();
    expect(component.showErrorSummary).toBeTrue();
    expect(component.errorSummaryItems.some(i => i.id === 'email')).toBeTrue();
    expect(component.errorSummaryItems.some(i => i.id === 'userSecret')).toBeFalse();

    // reset and test password only invalid
    component.showErrorSummary = false;
    component.errorSummaryItems = [];
    emailCtrl?.setErrors(null);
    emailCtrl?.markAsTouched();
    pwdCtrl?.setErrors({ minLength: true });
    pwdCtrl?.markAsTouched();
    component.onSubmit();
    tick();
    expect(component.showErrorSummary).toBeTrue();
    expect(component.errorSummaryItems.some(i => i.id === 'email')).toBeFalse();
    expect(component.errorSummaryItems.some(i => i.id === 'userSecret')).toBeTrue();
  }));

  describe('Field error text branches', () => {
    interface Case { field: string; errors: any; expectEmpty?: boolean }
    const cases: Case[] = [
      { field: 'firstName', errors: { required: true } },
      { field: 'firstName', errors: { lettersOnly: true } },
      { field: 'firstName', errors: { injectionPrevention: true } },
      { field: 'lastName', errors: { required: true } },
      { field: 'email', errors: { required: true } },
      { field: 'email', errors: { emailFormat: true } },
      { field: 'email', errors: { injectionPrevention: true } },
      { field: 'email', errors: { emailTaken: true } },
      { field: 'phoneNumber', errors: { required: true } },
      { field: 'phoneNumber', errors: { phoneNumberLength: true } },
      { field: 'phoneNumber', errors: { numbersOnly: true } },
      { field: 'phoneNumber', errors: { injectionPrevention: true } },
      { field: 'address', errors: { required: true } },
      { field: 'address', errors: { injectionPrevention: true } },
      { field: 'postalCode', errors: { required: true } },
      { field: 'postalCode', errors: { pattern: true } },
      { field: 'postalCode', errors: { injectionPrevention: true } },
      { field: 'city', errors: { required: true } },
      { field: 'city', errors: { lettersOnly: true } },
      { field: 'city', errors: { injectionPrevention: true } },
      { field: 'companyName', errors: { required: true } },
      { field: 'companyName', errors: { injectionPrevention: true } },
      { field: 'siretSiren', errors: { required: true } },
      { field: 'siretSiren', errors: { pattern: true } },
      { field: 'siretSiren', errors: { injectionPrevention: true } },
      { field: 'unknownField', errors: { required: true }, expectEmpty: true }
    ];

    it('should return appropriate messages for each field error', () => {
      cases.forEach(({ field, errors, expectEmpty }) => {
        const ctrl = component.form.get(field);
        if (ctrl) {
          ctrl.setErrors(errors);
          ctrl.markAsTouched();
        }
        const msg = component.getFieldErrorText(field);
        if (expectEmpty) {
          expect(msg).toBe('');
        } else {
          expect(msg).toBeTruthy();
        }
        // clear for next iteration
        if (ctrl) ctrl.setErrors(null);
      });
    });
  });

  it('should mark email as taken and set apiError on 409 error', () => {
    validationServiceMock.isFormValid.and.returnValue(true);
    confirmSpy.and.returnValue(true);
    registerServiceMock.performRegistration.and.returnValue(throwError(() => new HttpErrorResponse({ status: 409 })));
    registerServiceMock.handleRegistrationError.and.returnValue('Email déjà utilisé');

    component.onSubmit();

    const emailControl = component.form.get('email');
    expect(emailControl?.errors?.['emailTaken']).toBeTrue();
    expect(component.apiError).toBe('Email déjà utilisé');
  });

  it('should delegate resetPasswordField to validation service', () => {
    component.resetPasswordField();
    expect(validationServiceMock.resetPasswordField).toHaveBeenCalledWith(testForm);
  });

  it('should expose titles and user type from detector service (particulier)', () => {
    expect(component.getFormTitle()).toBe('Inscription Particulier');
    expect(component.getUserTypeString()).toBe('particulier');
  });

  it('should return api url from config service', () => {
    expect(component.getApiUrl()).toBe('http://api.test');
  });

  it('should unsubscribe on destroy if subscription exists', () => {
    const unsubscribeSpy = jasmine.createSpy('unsubscribe');
    // @ts-expect-error - accès direct pour test
    component.routerSubscription = { unsubscribe: unsubscribeSpy } as any;
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});


