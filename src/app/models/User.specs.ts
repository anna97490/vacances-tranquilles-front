import { User, UserRole } from './User';

// Constante pour les tests - évite les mots de passe en dur
const TEST_PASSWORD = '';

describe('UserRole Enum', () => {
  it('should contain the expected roles', () => {
    expect(UserRole.CLIENT).toBe('CLIENT');
    expect(UserRole.PROVIDER).toBe('PROVIDER');
    expect(UserRole.ADMIN).toBe('ADMIN');
  });
});

describe('User class', () => {
  it('should initialize a user with all basic fields', () => {
    const user: User = {
      idUser: 1,
      firstName: 'Alice',
      lastName: 'Dupont',
      email: 'alice@example.com',
      password: TEST_PASSWORD,
      role: UserRole.PROVIDER,
      phoneNumber: '0600000000',
      address: '123 rue de Paris',
      city: 'Paris',
      postalCode: 75000
    };

    expect(user.idUser).toBe(1);
    expect(user.firstName).toBe('Alice');
    expect(user.lastName).toBe('Dupont');
    expect(user.email).toBe('alice@example.com');
    expect(user.password).toBe(TEST_PASSWORD);
    expect(user.role).toBe(UserRole.PROVIDER);
    expect(user.phoneNumber).toBe('0600000000');
    expect(user.address).toBe('123 rue de Paris');
    expect(user.city).toBe('Paris');
    expect(user.postalCode).toBe(75000);
  });

  it('should initialize with optional fields', () => {
    const user: User = {
      siretSiren: '12345678900011',
      companyName: 'Ma Société',
      rcNumber: 'RC-123',
      kbisUrl: 'http://example.com/kbis.pdf',
      autoEntrepreneurAttestationUrl: 'http://example.com/auto.pdf',
      insuranceCertificateUrl: 'http://example.com/insurance.pdf',
      description: 'Prestataire multiservices'
    } as User;

    expect(user.siretSiren).toBe('12345678900011');
    expect(user.companyName).toBe('Ma Société');
    expect(user.rcNumber).toBe('RC-123');
    expect(user.kbisUrl).toBe('http://example.com/kbis.pdf');
    expect(user.autoEntrepreneurAttestationUrl).toBe('http://example.com/auto.pdf');
    expect(user.insuranceCertificateUrl).toBe('http://example.com/insurance.pdf');
    expect(user.description).toBe('Prestataire multiservices');
  });

  it('should initialize a user with empty constructor', () => {
    const user: User = {} as User;
    expect(user).toBeDefined();
  });

  it('should initialize optional fields when provided', () => {
    const user: User = {
      siretSiren: '12345678900011',
      companyName: 'Entreprise Test',
      rcNumber: 'RC-TEST',
      kbisUrl: 'https://test.com/kbis',
      autoEntrepreneurAttestationUrl: 'https://test.com/attestation',
      insuranceCertificateUrl: 'https://test.com/insurance',
      description: 'Un bon prestataire'
    } as User;

    expect(user.siretSiren).toBe('12345678900011');
    expect(user.companyName).toBe('Entreprise Test');
    expect(user.rcNumber).toBe('RC-TEST');
    expect(user.kbisUrl).toBe('https://test.com/kbis');
    expect(user.autoEntrepreneurAttestationUrl).toBe('https://test.com/attestation');
    expect(user.insuranceCertificateUrl).toBe('https://test.com/insurance');
    expect(user.description).toBe('Un bon prestataire');
  });
});
