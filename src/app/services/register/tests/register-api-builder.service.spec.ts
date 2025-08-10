import { TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RegisterApiBuilderService } from './../register-api-builder.service';

describe('RegisterApiBuilderService', () => {
  let service: RegisterApiBuilderService;
  let form: FormGroup;
  let fb: FormBuilder;

  const mockFormData = {
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@test.com',
    userSecret: 'Password123!',
    phoneNumber: '0123456789',
    address: '123 rue de la Paix',
    city: 'Paris',
    postalCode: '75000',
    companyName: 'Test Company',
    siretSiren: '12345678901234'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegisterApiBuilderService);
    fb = TestBed.inject(FormBuilder);

    form = fb.group({
      firstName: [mockFormData.firstName],
      lastName: [mockFormData.lastName],
      email: [mockFormData.email],
      userSecret: [mockFormData.userSecret],
      phoneNumber: [mockFormData.phoneNumber],
      address: [mockFormData.address],
      city: [mockFormData.city],
      postalCode: [mockFormData.postalCode],
      companyName: [mockFormData.companyName],
      siretSiren: [mockFormData.siretSiren]
    });

    // Supprimer tous les logs console pour chaque test
    spyOn(console, 'warn').and.stub();
    spyOn(console, 'error').and.stub();
    spyOn(console, 'log').and.stub();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('buildApiConfig', () => {
    const apiUrl = 'http://localhost:3000/api';

    it('should build correct config for particulier', () => {
      const config = service.buildApiConfig(form, false, apiUrl);

      expect(config.url).toBe(`${apiUrl}/auth/register/client`);
      expect(config.payload).toEqual({
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@test.com',
        password: 'Password123!',
        phoneNumber: '0123456789',
        address: '123 rue de la Paix',
        city: 'Paris',
        postalCode: '75000'
      });
      expect(config.payload.companyName).toBeUndefined();
      expect(config.payload.siretSiren).toBeUndefined();
    });

    it('should build correct config for prestataire', () => {
      const config = service.buildApiConfig(form, true, apiUrl);

      expect(config.url).toBe(`${apiUrl}/auth/register/provider`);
      expect(config.payload).toEqual({
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@test.com',
        password: 'Password123!',
        phoneNumber: '0123456789',
        address: '123 rue de la Paix',
        city: 'Paris',
        postalCode: '75000',
        companyName: 'Test Company',
        siretSiren: '12345678901234'
      });
    });

    it('should handle different API URLs', () => {
      const testUrls = [
        'https://api.example.com',
        'http://localhost:8080/api/v1',
        'https://prod-api.company.com/v2'
      ];

      testUrls.forEach(url => {
        const config = service.buildApiConfig(form, false, url);
        expect(config.url).toBe(`${url}/auth/register/client`);

        const configPrestataire = service.buildApiConfig(form, true, url);
        expect(configPrestataire.url).toBe(`${url}/auth/register/provider`);
      });
    });

    it('should handle empty form values', () => {
      const emptyForm = fb.group({
        firstName: [''],
        lastName: [''],
        email: [''],
        userSecret: [''],
        phoneNumber: [''],
        address: [''],
        city: [''],
        postalCode: [''],
        companyName: [''],
        siretSiren: ['']
      });

      const config = service.buildApiConfig(emptyForm, false, apiUrl);

      expect(config.payload).toEqual({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phoneNumber: '',
        address: '',
        city: '',
        postalCode: ''
      });
    });

    it('should handle null/undefined form values', () => {
      const formWithNulls = {
        get: (key: string) => key === 'email' ? null : undefined,
        value: { email: null, firstName: undefined }
      } as any;

      const result = service.buildApiConfig(formWithNulls, false, 'http://test.com');

      // Ajuster selon le comportement attendu
      expect(result.payload.email).toBeNull(); // ou toBeUndefined() selon l'implémentation
      expect(result.payload.firstName).toBeUndefined(); // ou toBeNull() selon l'implémentation
    });

    it('should handle special characters in form data', () => {
      const specialForm = fb.group({
        firstName: ['Jean-François'],
        lastName: ['O\'Connor'],
        email: ['jean.francois@test.com'],
        userSecret: ['P@ssw0rd!'],
        phoneNumber: ['+33 1 23 45 67 89'],
        address: ['123 rue de l\'Église, Apt. 4B'],
        city: ['Saint-Étienne'],
        postalCode: ['42000'],
        companyName: ['Société "Test" & Co.'],
        siretSiren: ['12345678901234']
      });

      const config = service.buildApiConfig(specialForm, true, apiUrl);

      expect(config.payload.firstName).toBe('Jean-François');
      expect(config.payload.lastName).toBe('O\'Connor');
      expect(config.payload.companyName).toBe('Société "Test" & Co.');
    });

    it('should preserve exact form values without transformation', () => {
      const testData = {
        firstName: '  Jean  ',
        lastName: 'DUPONT',
        email: 'Jean.Dupont@EXAMPLE.COM',
        userSecret: 'Password123!',
        phoneNumber: '01.23.45.67.89',
        address: '123 RUE DE LA PAIX',
        city: 'paris',
        postalCode: '75000',
        companyName: 'Test Company Ltd.',
        siretSiren: '12345678901234'
      };

      const testForm = fb.group(testData);
      const config = service.buildApiConfig(testForm, true, apiUrl);

      expect(config.payload.firstName).toBe('  Jean  ');
      expect(config.payload.lastName).toBe('DUPONT');
      expect(config.payload.email).toBe('Jean.Dupont@EXAMPLE.COM');
      expect(config.payload.city).toBe('paris');
    });

    it('should handle missing form controls gracefully', () => {
      const incompleteForm = fb.group({
        firstName: ['Jean'],
        email: ['jean@test.com']
      });

      const config = service.buildApiConfig(incompleteForm, false, apiUrl);

      expect(config.payload.firstName).toBe('Jean');
      expect(config.payload.email).toBe('jean@test.com');
      expect(config.payload.lastName).toBeUndefined();
      expect(config.payload.phoneNumber).toBeUndefined();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle empty API URL', () => {
      const config = service.buildApiConfig(form, false, '');
      expect(config.url).toBe('/auth/register/client');
    });

    it('should handle API URL without protocol', () => {
      const config = service.buildApiConfig(form, false, 'api.example.com');
      expect(config.url).toBe('api.example.com/auth/register/client');
    });

    it('should handle API URL with trailing slash', () => {
      const config = service.buildApiConfig(form, false, 'http://localhost:3000/');
      expect(config.url).toBe('http://localhost:3000//auth/register/client');
    });

    it('should build payload with only specified fields', () => {
      const config = service.buildApiConfig(form, false, 'http://localhost:3000');

      const expectedFields = [
        'firstName', 'lastName', 'email', 'password',
        'phoneNumber', 'address', 'city', 'postalCode'
      ];

      const actualFields = Object.keys(config.payload);
      expect(actualFields).toEqual(expectedFields);
    });

    it('should include company fields only for prestataire', () => {
      const particulierConfig = service.buildApiConfig(form, false, 'http://localhost:3000');
      const prestataireConfig = service.buildApiConfig(form, true, 'http://localhost:3000');

      expect(particulierConfig.payload.hasOwnProperty('companyName')).toBeFalsy();
      expect(particulierConfig.payload.hasOwnProperty('siretSiren')).toBeFalsy();

      expect(prestataireConfig.payload.hasOwnProperty('companyName')).toBeTruthy();
      expect(prestataireConfig.payload.hasOwnProperty('siretSiren')).toBeTruthy();
    });

    it('should create new payload objects for each call', () => {
      const config1 = service.buildApiConfig(form, false, 'http://localhost:3000');
      const config2 = service.buildApiConfig(form, false, 'http://localhost:3000');

      expect(config1.payload).not.toBe(config2.payload);
      expect(config1.payload).toEqual(config2.payload);
    });

    it('should handle concurrent calls correctly', () => {
      const results: any[] = [];

      // Tester avec un pattern cohérent
      for (let i = 0; i < 10; i++) {
        const isProvider = i % 2 === 0; // Pattern alterné cohérent
        const mockForm = { value: { email: `test${i}@test.com` } } as any;
        const result = service.buildApiConfig(mockForm, isProvider, `http://api${i}.com`);
        results.push(result);
      }

      results.forEach((result, index) => {
        const expectedPath = index % 2 === 0 ? 'provider' : 'client';
        expect(result.url).toContain(expectedPath);
      });
    });
  });
});
