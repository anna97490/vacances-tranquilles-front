import { RegisterPayload, ApiConfig } from './Register';

describe('Register Models', () => {
  describe('RegisterPayload', () => {
    it('should create RegisterPayload with all required properties', () => {
      const payload = new RegisterPayload();
      payload.firstName = 'John';
      payload.lastName = 'Doe';
      payload.email = 'test@example.com';
      payload.password = 'password123';
      payload.phoneNumber = '0123456789';
      payload.address = '123 Test Street';
      payload.postalCode = '75000';
      payload.city = 'Paris';

      expect(payload.firstName).toBe('John');
      expect(payload.lastName).toBe('Doe');
      expect(payload.email).toBe('test@example.com');
      expect(payload.password).toBe('password123');
      expect(payload.phoneNumber).toBe('0123456789');
      expect(payload.address).toBe('123 Test Street');
      expect(payload.postalCode).toBe('75000');
      expect(payload.city).toBe('Paris');
    });

    it('should create RegisterPayload for prestataire with additional properties', () => {
      const payload = new RegisterPayload();
      payload.firstName = 'Company';
      payload.lastName = 'Name';
      payload.email = 'company@example.com';
      payload.password = 'password123';
      payload.phoneNumber = '0123456789';
      payload.address = '123 Business Street';
      payload.postalCode = '75000';
      payload.city = 'Paris';
      payload.companyName = 'Test Company';
      payload.siretSiren = '12345678901234';

      expect(payload.companyName).toBe('Test Company');
      expect(payload.siretSiren).toBe('12345678901234');
    });
  });

  describe('ApiConfig', () => {
    it('should create ApiConfig with all required properties', () => {
      const config = new ApiConfig();
      config.url = 'https://api.example.com/register';
      
      const payload = new RegisterPayload();
      payload.email = 'test@example.com';
      payload.password = 'password123';
      config.payload = payload;

      expect(config.url).toBe('https://api.example.com/register');
      expect(config.payload).toBeDefined();
      expect(config.payload.email).toBe('test@example.com');
      expect(config.payload.password).toBe('password123');
    });
  });
}); 