import { User, UserRole } from './User';

describe('UserRole Enum', () => {
  it('should contain the expected roles', () => {
    expect(UserRole.CLIENT).toBe('CLIENT');
    expect(UserRole.PROVIDER).toBe('PROVIDER');
    expect(UserRole.ADMIN).toBe('ADMIN');
  });
});

describe('User class', () => {
  it('should initialize a user with partial data', () => {
    const user = new User({ firstName: 'Alice', lastName: 'Dupont', role: UserRole.CLIENT });
    expect(user.firstName).toBe('Alice');
    expect(user.lastName).toBe('Dupont');
    expect(user.role).toBe(UserRole.CLIENT);
  });

  it('should return true for isProvider() when role is PROVIDER', () => {
    const user = new User({ role: UserRole.PROVIDER });
    expect(user.isProvider()).toBeTrue();
    expect(user.isAdmin()).toBeFalse();
    expect(user.isClient()).toBeFalse();
  });

  it('should return true for isAdmin() when role is ADMIN', () => {
    const user = new User({ role: UserRole.ADMIN });
    expect(user.isAdmin()).toBeTrue();
    expect(user.isProvider()).toBeFalse();
    expect(user.isClient()).toBeFalse();
  });

  it('should return true for isClient() when role is CLIENT', () => {
    const user = new User({ role: UserRole.CLIENT });
    expect(user.isClient()).toBeTrue();
    expect(user.isProvider()).toBeFalse();
    expect(user.isAdmin()).toBeFalse();
  });

  it('should allow optional fields to be undefined', () => {
    const user = new User({ idUser: 42, firstName: 'Bob', role: UserRole.CLIENT });
    expect(user.password).toBeUndefined();
    expect(user.kbisUrl).toBeUndefined();
    expect(user.companyName).toBeUndefined();
  });
});
