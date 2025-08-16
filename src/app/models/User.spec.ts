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

describe('User', () => {
  let user: User;

  beforeEach(() => {
    user = new User();
  });

  it('should create an instance', () => {
    expect(user).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(user.idUser).toBeUndefined();
    expect(user.firstName).toBeUndefined();
    expect(user.lastName).toBeUndefined();
    expect(user.email).toBeUndefined();
    expect(user.role).toBeUndefined();
  });

  it('should initialize with provided data', () => {
    const userData = {
      idUser: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      role: UserRole.CLIENT,
      phoneNumber: '0123456789',
      address: '123 Test Street',
      city: 'Paris',
      postalCode: 75000
    };

    user = new User(userData);

    expect(user.idUser).toBe(1);
    expect(user.firstName).toBe('John');
    expect(user.lastName).toBe('Doe');
    expect(user.email).toBe('john@example.com');
    expect(user.role).toBe(UserRole.CLIENT);
    expect(user.phoneNumber).toBe('0123456789');
    expect(user.address).toBe('123 Test Street');
    expect(user.city).toBe('Paris');
    expect(user.postalCode).toBe(75000);
  });

  it('should handle partial data initialization', () => {
    const partialData = {
      firstName: 'Jane',
      email: 'jane@example.com'
    };

    user = new User(partialData);

    expect(user.firstName).toBe('Jane');
    expect(user.email).toBe('jane@example.com');
    expect(user.lastName).toBeUndefined();
    expect(user.role).toBeUndefined();
  });

  it('should handle provider-specific fields', () => {
    const providerData = {
      idUser: 2,
      firstName: 'Company',
      lastName: 'Name',
      email: 'company@example.com',
      role: UserRole.PROVIDER,
      companyName: 'Test Company',
      siretSiren: '12345678901234',
      rcNumber: 'RC123456',
      kbisUrl: 'https://example.com/kbis.pdf',
      autoEntrepreneurAttestationUrl: 'https://example.com/attestation.pdf',
      insuranceCertificateUrl: 'https://example.com/insurance.pdf'
    };

    user = new User(providerData);

    expect(user.role).toBe(UserRole.PROVIDER);
    expect(user.companyName).toBe('Test Company');
    expect(user.siretSiren).toBe('12345678901234');
    expect(user.rcNumber).toBe('RC123456');
    expect(user.kbisUrl).toBe('https://example.com/kbis.pdf');
    expect(user.autoEntrepreneurAttestationUrl).toBe('https://example.com/attestation.pdf');
    expect(user.insuranceCertificateUrl).toBe('https://example.com/insurance.pdf');
  });

  it('should handle admin role', () => {
    const adminData = {
      idUser: 3,
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      role: UserRole.ADMIN
    };

    user = new User(adminData);

    expect(user.role).toBe(UserRole.ADMIN);
  });

  it('should handle optional fields', () => {
    const userWithOptionalFields = {
      idUser: 4,
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      role: UserRole.CLIENT,
      description: 'Test description',
      reviews: [{ id: 1, note: 5 }]
    };

    user = new User(userWithOptionalFields);

    expect(user.description).toBe('Test description');
    expect(user.reviews).toEqual([{ id: 1, note: 5 }]);
  });

  it('should handle empty constructor', () => {
    const emptyUser = new User();
    expect(emptyUser).toBeTruthy();
    expect(emptyUser.idUser).toBeUndefined();
  });

  it('should handle null/undefined data', () => {
    const nullUser = new User(null as any);
    expect(nullUser).toBeTruthy();
  });
});
