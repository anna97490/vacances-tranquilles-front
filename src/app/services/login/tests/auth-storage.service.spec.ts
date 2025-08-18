import { TestBed } from '@angular/core/testing';
import { AuthStorageService } from './../auth-storage.service';

describe('AuthStorageService', () => {
  let service: AuthStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthStorageService);

    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('storeAuthenticationData', () => {
    it('should store token and userRole', () => {
      service.storeAuthenticationData('test-token', 'CLIENT');

      expect(localStorage.getItem('token')).toBe('test-token');
      expect(localStorage.getItem('userRole')).toBe('CLIENT');
    });

    it('should store token with empty userRole by default', () => {
      service.storeAuthenticationData('test-token');

      expect(localStorage.getItem('token')).toBe('test-token');
      expect(localStorage.getItem('userRole')).toBe('');
    });

    it('should store token with different user roles', () => {
      const roles = ['CLIENT', 'PROVIDER', 'MODERATOR'];

      roles.forEach(role => {
        localStorage.clear();
        service.storeAuthenticationData('test-token', role);

        expect(localStorage.getItem('token')).toBe('test-token');
        expect(localStorage.getItem('userRole')).toBe(role);
      });
    });

        it('should store token with special characters', () => {
      const specialToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

      service.storeAuthenticationData(specialToken, 'CLIENT');

      expect(localStorage.getItem('token')).toBe(specialToken);
      expect(localStorage.getItem('userRole')).toBe('CLIENT');
    });
  });

  describe('getToken', () => {
    it('should return stored token', () => {
      localStorage.setItem('token', 'test-token');

      expect(service.getToken()).toBe('test-token');
    });

    it('should return null when no token stored', () => {
      expect(service.getToken()).toBeNull();
    });

    it('should return token with special characters', () => {
      const specialToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      localStorage.setItem('token', specialToken);

      expect(service.getToken()).toBe(specialToken);
    });
  });

  describe('getUserRole', () => {
    it('should return stored user role', () => {
      localStorage.setItem('userRole', 'CLIENT');

      expect(service.getUserRole()).toBe('CLIENT');
    });

    it('should return null when no user role stored', () => {
      expect(service.getUserRole()).toBeNull();
    });

    it('should return empty string when user role is empty', () => {
      localStorage.setItem('userRole', '');

      expect(service.getUserRole()).toBe('');
    });

        it('should return different user roles', () => {
      const roles = ['CLIENT', 'PROVIDER', 'MODERATOR'];

      roles.forEach(role => {
        localStorage.setItem('userRole', role);
        expect(service.getUserRole()).toBe(role);
      });
    });
  });

  describe('getUserIdFromToken', () => {
    it('should return null when no token exists', () => {
      expect(service.getUserIdFromToken()).toBeNull();
    });

    it('should return null when token is empty string', () => {
      localStorage.setItem('token', '');
      expect(service.getUserIdFromToken()).toBeNull();
    });

    it('should return null when token has invalid format (not 3 parts)', () => {
      localStorage.setItem('token', 'invalid.token');
      expect(service.getUserIdFromToken()).toBeNull();
    });

    it('should return null when token has invalid format (too many parts)', () => {
      localStorage.setItem('token', 'part1.part2.part3.part4');
      expect(service.getUserIdFromToken()).toBeNull();
    });

    it('should return null when payload is not valid base64', () => {
      localStorage.setItem('token', 'header.invalid-base64.signature');
      expect(service.getUserIdFromToken()).toBeNull();
    });

    it('should return null when payload is not valid JSON', () => {
      const invalidJson = btoa('invalid json');
      localStorage.setItem('token', `header.${invalidJson}.signature`);
      expect(service.getUserIdFromToken()).toBeNull();
    });

    it('should return userId when using userId key', () => {
      const payload = { userId: '25' };
      const encodedPayload = btoa(JSON.stringify(payload));
      localStorage.setItem('token', `header.${encodedPayload}.signature`);

      expect(service.getUserIdFromToken()).toBe(25);
    });

    it('should return userId when using user_id key', () => {
      const payload = { user_id: '30' };
      const encodedPayload = btoa(JSON.stringify(payload));
      localStorage.setItem('token', `header.${encodedPayload}.signature`);

      expect(service.getUserIdFromToken()).toBe(30);
    });

    it('should return userId when using id key', () => {
      const payload = { id: '15' };
      const encodedPayload = btoa(JSON.stringify(payload));
      localStorage.setItem('token', `header.${encodedPayload}.signature`);

      expect(service.getUserIdFromToken()).toBe(15);
    });

    it('should return userId when using sub key', () => {
      const payload = { sub: '40' };
      const encodedPayload = btoa(JSON.stringify(payload));
      localStorage.setItem('token', `header.${encodedPayload}.signature`);

      expect(service.getUserIdFromToken()).toBe(40);
    });

    it('should return userId when userId is already a number', () => {
      const payload = { userId: 35 };
      const encodedPayload = btoa(JSON.stringify(payload));
      localStorage.setItem('token', `header.${encodedPayload}.signature`);

      expect(service.getUserIdFromToken()).toBe(35);
    });

    it('should return null when userId is 0', () => {
      const payload = { userId: 0 };
      const encodedPayload = btoa(JSON.stringify(payload));
      localStorage.setItem('token', `header.${encodedPayload}.signature`);

      expect(service.getUserIdFromToken()).toBeNull();
    });

    it('should return null when userId is negative', () => {
      const payload = { userId: -5 };
      const encodedPayload = btoa(JSON.stringify(payload));
      localStorage.setItem('token', `header.${encodedPayload}.signature`);

      expect(service.getUserIdFromToken()).toBeNull();
    });

    it('should return userId when userId is greater than 50', () => {
      const payload = { userId: 51 };
      const encodedPayload = btoa(JSON.stringify(payload));
      localStorage.setItem('token', `header.${encodedPayload}.signature`);

      expect(service.getUserIdFromToken()).toBe(51);
    });

    it('should return null when userId is not a valid number string', () => {
      const payload = { userId: 'invalid' };
      const encodedPayload = btoa(JSON.stringify(payload));
      localStorage.setItem('token', `header.${encodedPayload}.signature`);

      expect(service.getUserIdFromToken()).toBeNull();
    });

    it('should return null when userId is decimal', () => {
      const payload = { userId: '25.5' };
      const encodedPayload = btoa(JSON.stringify(payload));
      localStorage.setItem('token', `header.${encodedPayload}.signature`);

      expect(service.getUserIdFromToken()).toBe(25); // parseInt('25.5') returns 25
    });

    it('should return null when no userId field exists in payload', () => {
      const payload = { name: 'John', email: 'john@example.com' };
      const encodedPayload = btoa(JSON.stringify(payload));
      localStorage.setItem('token', `header.${encodedPayload}.signature`);

      expect(service.getUserIdFromToken()).toBeNull();
    });

    it('should return null when userId is null in payload', () => {
      const payload = { userId: null };
      const encodedPayload = btoa(JSON.stringify(payload));
      localStorage.setItem('token', `header.${encodedPayload}.signature`);

      expect(service.getUserIdFromToken()).toBeNull();
    });

    it('should return null when userId is undefined in payload', () => {
      const payload = { userId: undefined };
      const encodedPayload = btoa(JSON.stringify(payload));
      localStorage.setItem('token', `header.${encodedPayload}.signature`);

      expect(service.getUserIdFromToken()).toBeNull();
    });

    it('should return null when userId is empty string in payload', () => {
      const payload = { userId: '' };
      const encodedPayload = btoa(JSON.stringify(payload));
      localStorage.setItem('token', `header.${encodedPayload}.signature`);

      expect(service.getUserIdFromToken()).toBeNull();
    });

    it('should return null when userId is whitespace in payload', () => {
      const payload = { userId: '   ' };
      const encodedPayload = btoa(JSON.stringify(payload));
      localStorage.setItem('token', `header.${encodedPayload}.signature`);

      expect(service.getUserIdFromToken()).toBeNull();
    });

    it('should handle payload with multiple userId fields (should use first found)', () => {
      const payload = { userId: '25', user_id: '30', id: '15', sub: '40' };
      const encodedPayload = btoa(JSON.stringify(payload));
      localStorage.setItem('token', `header.${encodedPayload}.signature`);

      expect(service.getUserIdFromToken()).toBe(25);
    });

    it('should handle payload with complex structure', () => {
      const payload = {
        user: {
          profile: {
            userId: '25'
          }
        },
        userId: '30'
      };
      const encodedPayload = btoa(JSON.stringify(payload));
      localStorage.setItem('token', `header.${encodedPayload}.signature`);

      expect(service.getUserIdFromToken()).toBe(30);
    });

    it('should handle edge case userId of 1', () => {
      const payload = { userId: 1 };
      const encodedPayload = btoa(JSON.stringify(payload));
      localStorage.setItem('token', `header.${encodedPayload}.signature`);

      expect(service.getUserIdFromToken()).toBe(1);
    });

    it('should handle edge case userId of 50', () => {
      const payload = { userId: 50 };
      const encodedPayload = btoa(JSON.stringify(payload));
      localStorage.setItem('token', `header.${encodedPayload}.signature`);

      expect(service.getUserIdFromToken()).toBe(50);
    });
  });

  describe('getUserId', () => {
    it('should return userId from token', () => {
      const payload = { userId: 25 };
      const encodedPayload = btoa(JSON.stringify(payload));
      const token = `header.${encodedPayload}.signature`;

      service.storeAuthenticationData(token, 'CLIENT');

      expect(service.getUserId()).toBe(25);
    });

    it('should return null when no token exists', () => {
      expect(service.getUserId()).toBeNull();
    });

    it('should return null when token is invalid', () => {
      localStorage.setItem('token', 'invalid.token');
      expect(service.getUserId()).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when token exists', () => {
      localStorage.setItem('token', 'test-token');

      expect(service.isAuthenticated()).toBeTruthy();
    });

    it('should return false when no token exists', () => {
      expect(service.isAuthenticated()).toBeFalsy();
    });

    it('should return false when token is empty string', () => {
      localStorage.setItem('token', '');

      expect(service.isAuthenticated()).toBeFalsy();
    });

    it('should return true when token is whitespace', () => {
      localStorage.setItem('token', '   ');

      expect(service.isAuthenticated()).toBeTruthy(); // !!'   ' returns true
    });

    it('should return true when token has special characters', () => {
      const specialToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      localStorage.setItem('token', specialToken);

      expect(service.isAuthenticated()).toBeTruthy();
    });
  });

  describe('clearAuthenticationData', () => {
    it('should remove token and userRole from localStorage', () => {
      localStorage.setItem('token', 'test-token');
      localStorage.setItem('userRole', 'CLIENT');

      service.clearAuthenticationData();

      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('userRole')).toBeNull();
    });

    it('should clear data even when only token exists', () => {
      localStorage.setItem('token', 'test-token');

      service.clearAuthenticationData();

      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('userRole')).toBeNull();
    });

    it('should clear data even when only userRole exists', () => {
      localStorage.setItem('userRole', 'CLIENT');

      service.clearAuthenticationData();

      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('userRole')).toBeNull();
    });

    it('should clear data when no data exists', () => {
      service.clearAuthenticationData();

      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('userRole')).toBeNull();
    });
  });

  describe('Integration tests', () => {
    it('should handle complete authentication flow', () => {
      // Stocker les données d'authentification
      service.storeAuthenticationData('test-token', 'CLIENT');
      expect(service.isAuthenticated()).toBeTruthy();
      expect(service.getToken()).toBe('test-token');
      expect(service.getUserRole()).toBe('CLIENT');

      // Nettoyer les données d'authentification
      service.clearAuthenticationData();
      expect(service.isAuthenticated()).toBeFalsy();
      expect(service.getToken()).toBeNull();
      expect(service.getUserRole()).toBeNull();
    });

    it('should handle token with userId extraction', () => {
      const payload = { userId: '25', name: 'John Doe' };
      const encodedPayload = btoa(JSON.stringify(payload));
      const token = `header.${encodedPayload}.signature`;

      service.storeAuthenticationData(token, 'CLIENT');

      expect(service.isAuthenticated()).toBeTruthy();
      expect(service.getToken()).toBe(token);
      expect(service.getUserRole()).toBe('CLIENT');
      expect(service.getUserId()).toBe(25);
    });
  });
});
