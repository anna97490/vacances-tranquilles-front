import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { RegisterProviderFormComponent } from './register-provider-form.component';
import { ConfigService } from '../../services/config/config.service';
import { RegisterValidationService } from '../../services/register/register-validation.service';
import { RegisterFormConfigService } from '../../services/register/register-form-config.service';
import { UserTypeDetectorService } from '../../services/register/user-type-detector.service';
import { RegisterApiBuilderService } from '../../services/register/register-api-builder.service';
import { RegisterService } from '../../services/register/register.service';

describe('RegisterProviderFormComponent', () => {
  let component: RegisterProviderFormComponent;
  let fixture: ComponentFixture<RegisterProviderFormComponent>;

  // Mocks simples des services
  let configServiceMock: Partial<ConfigService>;
  let validationServiceMock: jasmine.SpyObj<RegisterValidationService>;
  let formConfigServiceMock: jasmine.SpyObj<RegisterFormConfigService>;
  let userTypeDetectorMock: jasmine.SpyObj<UserTypeDetectorService>;
  let apiBuilderMock: jasmine.SpyObj<RegisterApiBuilderService>;
  let registerServiceMock: jasmine.SpyObj<RegisterService>;

  // FormGroup minimal utilisé par le composant
  let testForm: FormGroup;

  beforeEach(async () => {
    testForm = new FormGroup({
      email: new FormControl('test@example.com')
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
        'getPrestataireFormTitle',
        'getPrestataireUserTypeString',
        'detectUserTypeFromUrl',
        'detectUserTypeFromString'
      ]
    );
    userTypeDetectorMock.getPrestataireFormTitle.and.returnValue('Inscription prestataire');
    userTypeDetectorMock.getPrestataireUserTypeString.and.returnValue('PRESTATAIRE');
    userTypeDetectorMock.detectUserTypeFromUrl.and.returnValue(true);
    userTypeDetectorMock.detectUserTypeFromString.and.returnValue(true);

    apiBuilderMock = jasmine.createSpyObj<RegisterApiBuilderService>(
      'RegisterApiBuilderService',
      ['buildApiConfig']
    );
    const minimalPayload = {
      firstName: '',
      lastName: '',
      email: 'test@example.com',
      password: '',
      phoneNumber: '',
      address: '',
      city: '',
      postalCode: ''
    };
    const builtConfig = { url: '/register', payload: minimalPayload } as const;
    apiBuilderMock.buildApiConfig.and.returnValue(builtConfig as any);

    registerServiceMock = jasmine.createSpyObj<RegisterService>(
      'RegisterService',
      ['performRegistration', 'handleRegistrationSuccess', 'handleRegistrationError']
    );
    registerServiceMock.performRegistration.and.returnValue(of(new HttpResponse({ status: 200, body: 'OK' })));
    registerServiceMock.handleRegistrationError.and.returnValue(null);

    await TestBed.configureTestingModule({
      imports: [RegisterProviderFormComponent, ReactiveFormsModule],
      providers: [
        { provide: ConfigService, useValue: configServiceMock },
        { provide: RegisterValidationService, useValue: validationServiceMock },
        { provide: RegisterFormConfigService, useValue: formConfigServiceMock },
        { provide: UserTypeDetectorService, useValue: userTypeDetectorMock },
        { provide: RegisterApiBuilderService, useValue: apiBuilderMock },
        { provide: RegisterService, useValue: registerServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterProviderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form via RegisterFormConfigService and set api url', () => {
    expect(formConfigServiceMock.createRegistrationForm).toHaveBeenCalled();
    expect(formConfigServiceMock.updateValidatorsBasedOnUserType)
      .toHaveBeenCalledWith(testForm, true);
    expect(component.urlApi).toBe('http://api.test');
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

    expect(apiBuilderMock.buildApiConfig)
      .toHaveBeenCalledWith(testForm, true, 'http://api.test');
    expect(registerServiceMock.performRegistration)
      .toHaveBeenCalledWith(jasmine.objectContaining({ url: '/register' }));
    expect(registerServiceMock.handleRegistrationSuccess)
      .toHaveBeenCalledWith(jasmine.any(HttpResponse), true);
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

  it('should expose titles and user type from detector service', () => {
    expect(component.getFormTitle()).toBe('Inscription prestataire');
    expect(component.getUserTypeString()).toBe('PRESTATAIRE');
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


