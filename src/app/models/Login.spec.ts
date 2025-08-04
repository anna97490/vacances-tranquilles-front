import { LoginPayload, LoginResponse } from './Login';

describe('Login Models', () => {
  describe('LoginPayload', () => {
    it('should create LoginPayload with all required properties', () => {
      const payload = new LoginPayload();
      payload.email = 'test@example.com';
      payload.password = 'password123';

      expect(payload.email).toBe('test@example.com');
      expect(payload.password).toBe('password123');
    });
  });

  describe('LoginResponse', () => {
    it('should create LoginResponse with all required properties', () => {
      const response = new LoginResponse();
      response.token = 'test-token-123';
      response.userRole = 'USER';
      response['userId'] = 123;
      response['email'] = 'test@example.com';

      expect(response.token).toBe('test-token-123');
      expect(response.userRole).toBe('USER');
      expect(response['userId']).toBe(123);
      expect(response['email']).toBe('test@example.com');
    });
  });
}); 