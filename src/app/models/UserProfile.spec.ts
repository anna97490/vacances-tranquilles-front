import { UserProfile } from './UserProfile';
import { User, UserRole } from './User';
import { Service, ServiceCategory } from './Service';

describe('UserProfile', () => {
  const mockUser: User = {
    idUser: 1,
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: UserRole.PROVIDER,
    phoneNumber: '1234567890',
    address: '123 Test St',
    city: 'Test City',
    postalCode: 12345,
    description: 'Test description'
  };

  const mockService: Service = {
    id: 1,
    title: 'Test Service',
    description: 'Test Description',
    category: ServiceCategory.HOME,
    price: 50,
    providerId: 1
  };

  it('should create a valid UserProfile', () => {
    const userProfile: UserProfile = {
      user: mockUser,
      services: [mockService]
    };

    expect(userProfile).toBeDefined();
    expect(userProfile.user).toEqual(mockUser);
    expect(userProfile.services).toEqual([mockService]);
  });

  it('should create UserProfile with empty services array', () => {
    const userProfile: UserProfile = {
      user: mockUser,
      services: []
    };

    expect(userProfile.user).toEqual(mockUser);
    expect(userProfile.services).toEqual([]);
    expect(userProfile.services.length).toBe(0);
  });

  it('should create UserProfile with multiple services', () => {
    const secondService: Service = {
      id: 2,
      title: 'Second Service',
      description: 'Second Description',
      category: ServiceCategory.OUTDOOR,
      price: 75,
      providerId: 1
    };

    const userProfile: UserProfile = {
      user: mockUser,
      services: [mockService, secondService]
    };

    expect(userProfile.services.length).toBe(2);
    expect(userProfile.services[0]).toEqual(mockService);
    expect(userProfile.services[1]).toEqual(secondService);
  });

  it('should create UserProfile with client user', () => {
    const clientUser: User = {
      ...mockUser,
      role: UserRole.CLIENT
    };

    const userProfile: UserProfile = {
      user: clientUser,
      services: []
    };

    expect(userProfile.user.role).toBe(UserRole.CLIENT);
    expect(userProfile.user.idUser).toBe(1);
  });

  it('should create UserProfile with admin user', () => {
    const adminUser: User = {
      ...mockUser,
      role: UserRole.ADMIN
    };

    const userProfile: UserProfile = {
      user: adminUser,
      services: []
    };

    expect(userProfile.user.role).toBe(UserRole.ADMIN);
  });

  it('should handle UserProfile with complete user data', () => {
    const completeUser: User = {
      idUser: 999,
      email: 'complete@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      role: UserRole.PROVIDER,
      phoneNumber: '0987654321',
      address: '456 Complete Ave',
      city: 'Complete City',
      postalCode: 54321,
      description: 'Complete user description'
    };

    const userProfile: UserProfile = {
      user: completeUser,
      services: [mockService]
    };

    expect(userProfile.user.idUser).toBe(999);
    expect(userProfile.user.email).toBe('complete@example.com');
    expect(userProfile.user.firstName).toBe('Jane');
    expect(userProfile.user.lastName).toBe('Smith');
    expect(userProfile.user.phoneNumber).toBe('0987654321');
    expect(userProfile.user.address).toBe('456 Complete Ave');
    expect(userProfile.user.city).toBe('Complete City');
    expect(userProfile.user.postalCode).toBe(54321);
    expect(userProfile.user.description).toBe('Complete user description');
  });

  it('should handle UserProfile with different service categories', () => {
    const homeService: Service = {
      ...mockService,
      category: ServiceCategory.HOME
    };

    const outdoorService: Service = {
      ...mockService,
      id: 2,
      category: ServiceCategory.OUTDOOR
    };

    const repairsService: Service = {
      ...mockService,
      id: 3,
      category: ServiceCategory.REPAIRS
    };

    // Act
    const userProfile: UserProfile = {
      user: mockUser,
      services: [homeService, outdoorService, repairsService]
    };

    expect(userProfile.services.length).toBe(3);
    expect(userProfile.services[0].category).toBe(ServiceCategory.HOME);
    expect(userProfile.services[1].category).toBe(ServiceCategory.OUTDOOR);
    expect(userProfile.services[2].category).toBe(ServiceCategory.REPAIRS);
  });

  it('should handle UserProfile with services having different prices', () => {
    const cheapService: Service = {
      ...mockService,
      id: 1,
      price: 10
    };

    const expensiveService: Service = {
      ...mockService,
      id: 2,
      price: 500
    };

    const userProfile: UserProfile = {
      user: mockUser,
      services: [cheapService, expensiveService]
    };

    expect(userProfile.services[0].price).toBe(10);
    expect(userProfile.services[1].price).toBe(500);
  });

  it('should handle UserProfile structure validation', () => {
    const userProfile: UserProfile = {
      user: mockUser,
      services: [mockService]
    };

    expect(userProfile.user).toBeDefined();
    expect(userProfile.services).toBeDefined();
    expect(Array.isArray(userProfile.services)).toBe(true);
    expect(typeof userProfile.user).toBe('object');
  });
});
