import { ComponentFixture, TestBed } from '@angular/core/testing';
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

  it('should submit when form is valid and handle success', () => {
    validationServiceMock.isFormValid.and.returnValue(true);
    registerServiceMock.performRegistration.and.returnValue(of(new HttpResponse({ status: 200, body: 'OK' })));

    component.onSubmit();

    expect(apiBuilderMock.buildApiConfig).toHaveBeenCalledWith(testForm, false, 'http://api.test');
    expect(registerServiceMock.performRegistration).toHaveBeenCalledWith(jasmine.objectContaining({ url: '/auth/register/client' }));
    expect(registerServiceMock.handleRegistrationSuccess).toHaveBeenCalledWith(jasmine.any(HttpResponse), false);
  });

  it('should mark email as taken and set apiError on 409 error', () => {
    validationServiceMock.isFormValid.and.returnValue(true);
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


