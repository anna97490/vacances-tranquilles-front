import { Service, ServiceCategory } from './Service';

describe('Service', () => {
  let service: Service;

  beforeEach(() => {
    service = new Service();
  });

  it('should create an instance', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(service.id).toBeUndefined();
    expect(service.title).toBeUndefined();
    expect(service.description).toBeUndefined();
    expect(service.category).toBeUndefined();
    expect(service.price).toBeUndefined();
  });

  it('should initialize with provided data', () => {
    const serviceData = {
      id: 1,
      title: 'Test Service',
      description: 'Test Description',
      category: ServiceCategory.HOME,
      price: 50.0,
      providerId: 123
    };

    Object.assign(service, serviceData);

    expect(service.id).toBe(1);
    expect(service.title).toBe('Test Service');
    expect(service.description).toBe('Test Description');
    expect(service.category).toBe(ServiceCategory.HOME);
    expect(service.price).toBe(50.0);
    expect(service.providerId).toBe(123);
  });

  it('should handle partial data initialization', () => {
    const partialData = {
      title: 'Partial Service',
      price: 25.0
    };

    Object.assign(service, partialData);

    expect(service.title).toBe('Partial Service');
    expect(service.price).toBe(25.0);
    expect(service.description).toBeUndefined();
    expect(service.category).toBeUndefined();
  });

  it('should handle all service categories', () => {
    const categories = Object.values(ServiceCategory);

    categories.forEach(category => {
      const testService = new Service();
      Object.assign(testService, { category });
      expect(testService.category).toBe(category);
    });
  });

  it('should handle empty constructor', () => {
    const emptyService = new Service();
    expect(emptyService).toBeTruthy();
    expect(emptyService.id).toBeUndefined();
  });

  it('should handle service with description', () => {
    const serviceWithDescription = {
      id: 2,
      title: 'Full Service',
      description: 'Complete service description',
      category: ServiceCategory.OUTDOOR,
      price: 75.5,
      providerId: 456
    };

    Object.assign(service, serviceWithDescription);

    expect(service.id).toBe(2);
    expect(service.title).toBe('Full Service');
    expect(service.description).toBe('Complete service description');
    expect(service.category).toBe(ServiceCategory.OUTDOOR);
    expect(service.price).toBe(75.5);
    expect(service.providerId).toBe(456);
  });
});
