import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

import { RegisterFormComponent } from './register-form.component';
import { provideRouter } from '@angular/router';
import { EnvService } from '../../services/env/env.service';
import { RegisterValidationService } from '../../services/register/register-validation.service';
import { RegisterFormConfigService } from '../../services/register/register-form-config.service';
import { UserTypeDetectorService } from '../../services/register/user-type-detector.service';
import { RegisterApiBuilderService } from '../../services/register/register-api-builder.service';
import { RegisterService } from '../../services/register/register.service';

describe('RegisterFormComponent', () => {
  let component: RegisterFormComponent;
  let fixture: ComponentFixture<RegisterFormComponent>;

  let envServiceMock: Partial<EnvService>;
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

    envServiceMock = {
      apiUrl: 'http://api.test',
      isProduction: false
    } as EnvService;

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
         'getFieldRequired',
         'getRegistrationFields',
         'getFieldLabels'
       ]
     );
         formConfigServiceMock.createRegistrationForm.and.returnValue(testForm);
     formConfigServiceMock.updateValidatorsBasedOnUserType.and.stub();
     formConfigServiceMock.shouldShowField.and.callFake((fieldName: string, isPrestataire: boolean) => {
       const prestataireOnly = ['companyName', 'siretSiren'];
       return prestataireOnly.includes(fieldName) ? isPrestataire : true;
     });
     formConfigServiceMock.getFieldLabel.and.callFake((fieldName: string, isPrestataire: boolean) => {
       const labels: Record<string, string> = {
         firstName: 'Prénom',
         lastName: 'Nom',
         email: 'Email',
         userSecret: 'Mot de passe',
         phoneNumber: 'Téléphone',
         address: 'Adresse',
         city: 'Ville',
         postalCode: 'Code postal',
         companyName: isPrestataire ? "Nom de l'entreprise" : '',
         siretSiren: isPrestataire ? 'SIRET' : ''
       };
       return labels[fieldName] || fieldName;
     });
     formConfigServiceMock.getFieldPlaceholder.and.callFake((fieldName: string, isPrestataire: boolean) => {
       const placeholders: Record<string, string> = {
         firstName: 'Jean',
         lastName: 'Dupont',
         email: 'exemple@mail.com',
         userSecret: '********',
         phoneNumber: '0601020304',
         address: '123 rue Exemple',
         city: 'Paris',
         postalCode: '75000',
         companyName: isPrestataire ? 'Votre entreprise' : '',
         siretSiren: isPrestataire ? 'Numéro SIRET (14 chiffres)' : ''
       };
       return placeholders[fieldName] || '';
     });
     formConfigServiceMock.getFieldType.and.callFake((fieldName: string) => {
       const types: Record<string, string> = {
         email: 'email',
         userSecret: 'password',
         siretSiren: 'text'
       };
       return types[fieldName] || 'text';
     });
     formConfigServiceMock.getFieldRequired.and.callFake((fieldName: string, isPrestataire: boolean) => {
       if (fieldName === 'companyName' || fieldName === 'siretSiren') {
         return isPrestataire;
       }
       return true;
     });
     formConfigServiceMock.getRegistrationFields.and.callFake((isPrestataire: boolean) => {
       if (isPrestataire) {
         return ['firstName', 'lastName', 'companyName', 'siretSiren', 'email', 'phoneNumber', 'address', 'postalCode', 'city', 'userSecret'];
       } else {
         return ['firstName', 'lastName', 'email', 'phoneNumber', 'address', 'postalCode', 'city', 'userSecret'];
       }
     });
     formConfigServiceMock.getFieldLabels.and.returnValue({
       firstName: 'Prénom',
       lastName: 'Nom',
       email: 'Email',
       userSecret: 'Mot de passe',
       phoneNumber: 'Téléphone',
       address: 'Adresse',
       city: 'Ville',
       postalCode: 'Code postal',
       companyName: "Nom de l'entreprise",
       siretSiren: 'SIRET'
     });

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
      imports: [RegisterFormComponent, ReactiveFormsModule, NoopAnimationsModule],
      providers: [
        { provide: EnvService, useValue: envServiceMock },
        { provide: RegisterValidationService, useValue: validationServiceMock },
        { provide: RegisterFormConfigService, useValue: formConfigServiceMock },
        { provide: UserTypeDetectorService, useValue: userTypeDetectorMock },
        { provide: RegisterApiBuilderService, useValue: apiBuilderMock },
        { provide: RegisterService, useValue: registerServiceMock },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

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
    pwdCtrl?.setErrors({ minLength: true });
    expect(component.getPasswordErrorText()).toBe('');
    pwdCtrl?.markAsTouched();
    pwdCtrl?.setErrors(null);
    expect(component.getPasswordErrorText()).toBe('');
  });

  it('should build summary variants for email-only and password-only invalid', fakeAsync(() => {
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

  it('should unsubscribe on destroy if subscription exists', () => {
    const unsubscribeSpy = jasmine.createSpy('unsubscribe');
    // @ts-expect-error - accès direct pour test
    component.routerSubscription = { unsubscribe: unsubscribeSpy } as any;
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });

  it('should handle missing fields detection', () => {
    // Test avec des champs manquants
    const emailCtrl = component.form.get('email');
    emailCtrl?.setValue('');
    emailCtrl?.markAsTouched();

    expect(component.hasMissingFields()).toBeTrue();
    expect(component.getMissingFieldsText()).toContain('Email');
  });

  it('should handle no missing fields', () => {
    // Utiliser le mock existant au lieu de créer un nouveau spy
    validationServiceMock.areAllRequiredFieldsFilled.and.returnValue(true);

    // Remplir tous les champs requis
    component.form.patchValue({
      firstName: 'John',
      lastName: 'Doe',
      userSecret: 'Password123!',
      phoneNumber: '0123456789',
      address: '123 Test Street',
      city: 'Test City',
      postalCode: '12345'
    });
    // L'email a déjà une valeur par défaut 'user@example.com'

    // Vérifier que le mock est bien appelé avec les bons paramètres
    expect(component.hasMissingFields()).toBeFalse();
    expect(validationServiceMock.areAllRequiredFieldsFilled).toHaveBeenCalledWith(component.form, false);
    expect(component.getMissingFieldsText()).toBe('');
  });

  it('should handle missing fields for prestataire', () => {
    userTypeDetectorMock.detectUserTypeFromUrl.and.returnValue(true);
    // Réinitialiser le composant avec les nouveaux mocks
    fixture = TestBed.createComponent(RegisterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const emailCtrl = component.form.get('email');
    emailCtrl?.setValue('');
    emailCtrl?.markAsTouched();

    expect(component.hasMissingFields()).toBeTrue();
    expect(component.getMissingFieldsText()).toContain('Email');
  });

  it('should focus field when focusField is called', () => {
    const focusSpy = spyOn(document, 'getElementById').and.returnValue({
      focus: jasmine.createSpy('focus')
    } as any);

    component.focusField('testField');

    expect(focusSpy).toHaveBeenCalledWith('testField');
  });

  it('should handle focusField when element is null', () => {
    spyOn(document, 'getElementById').and.returnValue(null);

    expect(() => component.focusField('nonexistent')).not.toThrow();
  });

  it('should navigate back to home', () => {
    const navigateSpy = spyOn(component['router'], 'navigate');

    component.goBack();

    expect(navigateSpy).toHaveBeenCalledWith(['/home']);
  });

  it('should handle error summary building for prestataire', () => {
    userTypeDetectorMock.detectUserTypeFromUrl.and.returnValue(true);
    // Réinitialiser le composant avec les nouveaux mocks
    fixture = TestBed.createComponent(RegisterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const companyNameCtrl = component.form.get('companyName');
    companyNameCtrl?.setErrors({ required: true });
    companyNameCtrl?.markAsTouched();

    validationServiceMock.isFormValid.and.returnValue(false);
    component.onSubmit();

    expect(component.showErrorSummary).toBeTrue();
    expect(component.errorSummaryItems.some(item => item.id === 'companyName')).toBeTrue();
  });

  it('should handle password error text with multiple constraints', () => {
    const pwdCtrl = component.form.get('userSecret');
    pwdCtrl?.setErrors({ minLength: true, uppercase: true, number: true });
    pwdCtrl?.markAsTouched();

    const errorText = component.getPasswordErrorText();
    expect(errorText).toContain('Le mot de passe doit contenir');
    expect(errorText).toContain('au moins 8 caractères');
    expect(errorText).toContain('une majuscule');
    expect(errorText).toContain('un chiffre');
  });

  it('should handle password error text with single constraint', () => {
    const pwdCtrl = component.form.get('userSecret');
    pwdCtrl?.setErrors({ lowercase: true });
    pwdCtrl?.markAsTouched();

    const errorText = component.getPasswordErrorText();
    expect(errorText).toBe('Le mot de passe doit contenir une minuscule');
  });

  it('should handle password error text with required error', () => {
    const pwdCtrl = component.form.get('userSecret');
    pwdCtrl?.setErrors({ required: true });
    pwdCtrl?.markAsTouched();

    const errorText = component.getPasswordErrorText();
    expect(errorText).toBe('Le mot de passe est requis');
  });

  it('should handle buildErrorSummary with no errors', () => {
    // Réinitialiser le formulaire sans erreurs
    component.form.patchValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      userSecret: 'Password123!',
      phoneNumber: '0123456789',
      address: '123 Test Street',
      city: 'Test City',
      postalCode: '12345'
    });

    validationServiceMock.isFormValid.and.returnValue(false);
    component.onSubmit();

    expect(component.errorSummaryItems.length).toBe(0);
  });

  it('should handle buildErrorSummary with multiple errors', () => {
    // Créer plusieurs erreurs
    const firstNameCtrl = component.form.get('firstName');
    const emailCtrl = component.form.get('email');
    const pwdCtrl = component.form.get('userSecret');

    firstNameCtrl?.setErrors({ required: true });
    firstNameCtrl?.markAsTouched();
    emailCtrl?.setErrors({ emailFormat: true });
    emailCtrl?.markAsTouched();
    pwdCtrl?.setErrors({ minLength: true });
    pwdCtrl?.markAsTouched();

    validationServiceMock.isFormValid.and.returnValue(false);
    component.onSubmit();

    expect(component.errorSummaryItems.length).toBeGreaterThan(0);
    expect(component.errorSummaryItems.some(item => item.id === 'firstName')).toBeTrue();
    expect(component.errorSummaryItems.some(item => item.id === 'email')).toBeTrue();
    expect(component.errorSummaryItems.some(item => item.id === 'userSecret')).toBeTrue();
  });

  it('should handle buildErrorSummary for prestataire with company fields', () => {
    userTypeDetectorMock.detectUserTypeFromUrl.and.returnValue(true);
    // Réinitialiser le composant avec les nouveaux mocks
    fixture = TestBed.createComponent(RegisterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const companyNameCtrl = component.form.get('companyName');
    const siretCtrl = component.form.get('siretSiren');

    companyNameCtrl?.setErrors({ required: true });
    companyNameCtrl?.markAsTouched();
    siretCtrl?.setErrors({ pattern: true });
    siretCtrl?.markAsTouched();

    validationServiceMock.isFormValid.and.returnValue(false);
    component.onSubmit();

    expect(component.errorSummaryItems.some(item => item.id === 'companyName')).toBeTrue();
    expect(component.errorSummaryItems.some(item => item.id === 'siretSiren')).toBeTrue();
  });

  it('should handle focusFirstInvalidField with error summary items', () => {
    const focusSpy = spyOn(component, 'focusField');
    component.errorSummaryItems = [{ id: 'testField', label: 'Test', message: 'Error' }];

    // @ts-expect-error - accès direct pour test
    component.focusFirstInvalidField();

    expect(focusSpy).toHaveBeenCalledWith('testField');
  });

  it('should handle focusFirstInvalidField with empty error summary', () => {
    const focusSpy = spyOn(component, 'focusField');
    component.errorSummaryItems = [];

    // @ts-expect-error - accès direct pour test
    component.focusFirstInvalidField();

    expect(focusSpy).not.toHaveBeenCalled();
  });

  it('should handle getMissingFields with empty values', () => {
    // Vider tous les champs
    component.form.patchValue({
      firstName: '',
      lastName: '',
      email: '',
      userSecret: '',
      phoneNumber: '',
      address: '',
      city: '',
      postalCode: ''
    });

    const missingFields = component.getMissingFieldsText();
    expect(missingFields).toContain('Prénom');
    expect(missingFields).toContain('Nom');
    expect(missingFields).toContain('Email');
    expect(missingFields).toContain('Mot de passe');
    expect(missingFields).toContain('Téléphone');
    expect(missingFields).toContain('Adresse');
    expect(missingFields).toContain('Ville');
    expect(missingFields).toContain('Code postal');
  });

  it('should handle getMissingFields with whitespace values', () => {
    // Remplir avec des espaces
    component.form.patchValue({
      firstName: '   ',
      lastName: '   ',
      email: '   ',
      userSecret: '   ',
      phoneNumber: '   ',
      address: '   ',
      city: '   ',
      postalCode: '   '
    });

    const missingFields = component.getMissingFieldsText();
    expect(missingFields).toContain('Prénom');
    expect(missingFields).toContain('Nom');
    expect(missingFields).toContain('Email');
    expect(missingFields).toContain('Mot de passe');
    expect(missingFields).toContain('Téléphone');
    expect(missingFields).toContain('Adresse');
    expect(missingFields).toContain('Ville');
    expect(missingFields).toContain('Code postal');
  });

    it('should handle getMissingFields for prestataire with additional fields', () => {
    userTypeDetectorMock.detectUserTypeFromUrl.and.returnValue(true);
    // Réinitialiser le composant avec les nouveaux mocks
    fixture = TestBed.createComponent(RegisterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Vider les champs spécifiques au prestataire
    component.form.patchValue({
      companyName: '',
      siretSiren: ''
    });

    const missingFields = component.getMissingFieldsText();
    expect(missingFields).toContain("Nom de l'entreprise");
    expect(missingFields).toContain('SIRET');
  });

  it('should handle registration error without status', () => {
    validationServiceMock.isFormValid.and.returnValue(true);
    confirmSpy.and.returnValue(true);
    registerServiceMock.performRegistration.and.returnValue(throwError(() => new Error('Network error')));
    registerServiceMock.handleRegistrationError.and.returnValue('Erreur réseau');

    component.onSubmit();

    expect(component.apiError).toBe('Erreur réseau');
  });

  it('should handle registration error with null response', () => {
    validationServiceMock.isFormValid.and.returnValue(true);
    confirmSpy.and.returnValue(true);
    registerServiceMock.performRegistration.and.returnValue(throwError(() => null));
    registerServiceMock.handleRegistrationError.and.returnValue('Erreur inconnue');

    component.onSubmit();

    expect(component.apiError).toBe('Erreur inconnue');
  });

  it('should handle registration success without error', () => {
    validationServiceMock.isFormValid.and.returnValue(true);
    confirmSpy.and.returnValue(true);
    registerServiceMock.performRegistration.and.returnValue(of(new HttpResponse({ status: 200, body: 'OK' })));
    registerServiceMock.handleRegistrationError.and.returnValue(null);

    component.onSubmit();

    expect(component.apiError).toBeNull();
  });
});


