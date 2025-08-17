import { UpdateUser } from './UpdateUser';

describe('UpdateUser', () => {
  it('should create a valid UpdateUser with all properties', () => {
    const updateUser: UpdateUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: '1234567890',
      address: '123 Main St',
      city: 'Test City',
      postalCode: 12345,
      siretSiren: '12345678901234',
      companyName: 'Test Company',
      rcNumber: 'RC123456',
      kbisUrl: 'https://example.com/kbis.pdf',
      autoEntrepreneurAttestationUrl: 'https://example.com/auto-entrepreneur.pdf',
      insuranceCertificateUrl: 'https://example.com/insurance.pdf',
      description: 'Test description'
    };

    expect(updateUser).toBeDefined();
    expect(updateUser.firstName).toBe('John');
    expect(updateUser.lastName).toBe('Doe');
    expect(updateUser.email).toBe('john.doe@example.com');
    expect(updateUser.phoneNumber).toBe('1234567890');
    expect(updateUser.address).toBe('123 Main St');
    expect(updateUser.city).toBe('Test City');
    expect(updateUser.postalCode).toBe(12345);
    expect(updateUser.siretSiren).toBe('12345678901234');
    expect(updateUser.companyName).toBe('Test Company');
    expect(updateUser.rcNumber).toBe('RC123456');
    expect(updateUser.kbisUrl).toBe('https://example.com/kbis.pdf');
    expect(updateUser.autoEntrepreneurAttestationUrl).toBe('https://example.com/auto-entrepreneur.pdf');
    expect(updateUser.insuranceCertificateUrl).toBe('https://example.com/insurance.pdf');
    expect(updateUser.description).toBe('Test description');
  });

  it('should create UpdateUser with only basic information', () => {
    const updateUser: UpdateUser = {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phoneNumber: '0987654321',
      address: '456 Oak Ave',
      city: 'Another City',
      postalCode: 54321,
      description: 'Basic user description'
    };

    expect(updateUser.firstName).toBe('Jane');
    expect(updateUser.lastName).toBe('Smith');
    expect(updateUser.email).toBe('jane.smith@example.com');
    expect(updateUser.phoneNumber).toBe('0987654321');
    expect(updateUser.address).toBe('456 Oak Ave');
    expect(updateUser.city).toBe('Another City');
    expect(updateUser.postalCode).toBe(54321);
    expect(updateUser.description).toBe('Basic user description');
    expect(updateUser.siretSiren).toBeUndefined();
    expect(updateUser.companyName).toBeUndefined();
    expect(updateUser.rcNumber).toBeUndefined();
    expect(updateUser.kbisUrl).toBeUndefined();
    expect(updateUser.autoEntrepreneurAttestationUrl).toBeUndefined();
    expect(updateUser.insuranceCertificateUrl).toBeUndefined();
  });

  it('should create UpdateUser with only business information', () => {
    const updateUser: UpdateUser = {
      siretSiren: '98765432109876',
      companyName: 'Business Corp',
      rcNumber: 'RC987654',
      kbisUrl: 'https://business.com/kbis.pdf',
      autoEntrepreneurAttestationUrl: 'https://business.com/auto.pdf',
      insuranceCertificateUrl: 'https://business.com/insurance.pdf'
    };

    expect(updateUser.siretSiren).toBe('98765432109876');
    expect(updateUser.companyName).toBe('Business Corp');
    expect(updateUser.rcNumber).toBe('RC987654');
    expect(updateUser.kbisUrl).toBe('https://business.com/kbis.pdf');
    expect(updateUser.autoEntrepreneurAttestationUrl).toBe('https://business.com/auto.pdf');
    expect(updateUser.insuranceCertificateUrl).toBe('https://business.com/insurance.pdf');
    expect(updateUser.firstName).toBeUndefined();
    expect(updateUser.lastName).toBeUndefined();
    expect(updateUser.email).toBeUndefined();
  });

  it('should create UpdateUser with only name update', () => {
    const updateUser: UpdateUser = {
      firstName: 'Updated',
      lastName: 'Name'
    };

    expect(updateUser.firstName).toBe('Updated');
    expect(updateUser.lastName).toBe('Name');
    expect(updateUser.email).toBeUndefined();
    expect(updateUser.phoneNumber).toBeUndefined();
  });

  it('should create UpdateUser with only contact information', () => {
    const updateUser: UpdateUser = {
      email: 'new.email@example.com',
      phoneNumber: '5551234567'
    };

    expect(updateUser.email).toBe('new.email@example.com');
    expect(updateUser.phoneNumber).toBe('5551234567');
    expect(updateUser.firstName).toBeUndefined();
    expect(updateUser.lastName).toBeUndefined();
  });

  it('should create UpdateUser with only address information', () => {
    const updateUser: UpdateUser = {
      address: '789 Pine St',
      city: 'New City',
      postalCode: 67890
    };

    expect(updateUser.address).toBe('789 Pine St');
    expect(updateUser.city).toBe('New City');
    expect(updateUser.postalCode).toBe(67890);
    expect(updateUser.firstName).toBeUndefined();
    expect(updateUser.email).toBeUndefined();
  });

  it('should create UpdateUser with only description', () => {
    const updateUser: UpdateUser = {
      description: 'Updated user description'
    };

    expect(updateUser.description).toBe('Updated user description');
    expect(updateUser.firstName).toBeUndefined();
    expect(updateUser.lastName).toBeUndefined();
    expect(updateUser.email).toBeUndefined();
  });

  it('should create empty UpdateUser', () => {
    const updateUser: UpdateUser = {};

    expect(updateUser).toBeDefined();
    expect(updateUser.firstName).toBeUndefined();
    expect(updateUser.lastName).toBeUndefined();
    expect(updateUser.email).toBeUndefined();
    expect(updateUser.phoneNumber).toBeUndefined();
    expect(updateUser.address).toBeUndefined();
    expect(updateUser.city).toBeUndefined();
    expect(updateUser.postalCode).toBeUndefined();
    expect(updateUser.siretSiren).toBeUndefined();
    expect(updateUser.companyName).toBeUndefined();
    expect(updateUser.rcNumber).toBeUndefined();
    expect(updateUser.kbisUrl).toBeUndefined();
    expect(updateUser.autoEntrepreneurAttestationUrl).toBeUndefined();
    expect(updateUser.insuranceCertificateUrl).toBeUndefined();
    expect(updateUser.description).toBeUndefined();
  });

  it('should handle UpdateUser with special characters', () => {
    const updateUser: UpdateUser = {
      firstName: 'José',
      lastName: 'García-López',
      email: 'jose.garcia-lopez@example.com',
      address: '123 Rue de la Paix, 2ème étage',
      city: 'Saint-Étienne',
      description: 'Description avec des caractères spéciaux: é, à, ç'
    };

    expect(updateUser.firstName).toBe('José');
    expect(updateUser.lastName).toBe('García-López');
    expect(updateUser.email).toBe('jose.garcia-lopez@example.com');
    expect(updateUser.address).toBe('123 Rue de la Paix, 2ème étage');
    expect(updateUser.city).toBe('Saint-Étienne');
    expect(updateUser.description).toBe('Description avec des caractères spéciaux: é, à, ç');
  });

  it('should handle UpdateUser with numeric postal codes', () => {
    const updateUser1: UpdateUser = {
      postalCode: 75001
    };

    const updateUser2: UpdateUser = {
      postalCode: 13000
    };

    const updateUser3: UpdateUser = {
      postalCode: 69000
    };

    expect(updateUser1.postalCode).toBe(75001);
    expect(updateUser2.postalCode).toBe(13000);
    expect(updateUser3.postalCode).toBe(69000);
  });

  it('should handle UpdateUser with long URLs', () => {
    const updateUser: UpdateUser = {
      kbisUrl: 'https://very-long-domain-name.example.com/path/to/very/long/document/kbis-certificate-2024.pdf',
      autoEntrepreneurAttestationUrl: 'https://another-long-domain.example.org/documents/auto-entrepreneur/attestation-2024.pdf',
      insuranceCertificateUrl: 'https://insurance-company.example.net/certificates/user-12345/insurance-certificate-2024.pdf'
    };

    expect(updateUser.kbisUrl).toContain('kbis-certificate-2024.pdf');
    expect(updateUser.autoEntrepreneurAttestationUrl).toContain('attestation-2024.pdf');
    expect(updateUser.insuranceCertificateUrl).toContain('insurance-certificate-2024.pdf');
  });

  it('should validate UpdateUser structure', () => {
    const updateUser: UpdateUser = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com'
    };

    expect(updateUser.firstName).toBeDefined();
    expect(updateUser.lastName).toBeDefined();
    expect(updateUser.email).toBeDefined();
    expect(typeof updateUser.firstName).toBe('string');
    expect(typeof updateUser.lastName).toBe('string');
    expect(typeof updateUser.email).toBe('string');
  });
});
