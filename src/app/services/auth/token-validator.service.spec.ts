import { TestBed } from '@angular/core/testing';
import { TokenValidatorService } from './token-validator.service';
import { AuthStorageService } from '../login/auth-storage.service';

describe('TokenValidatorService', () => {
  let service: TokenValidatorService;
  let authStorageSpy: jasmine.SpyObj<AuthStorageService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('AuthStorageService', ['getToken', 'clearAuthenticationData']);
    
    TestBed.configureTestingModule({
      providers: [
        TokenValidatorService,
        { provide: AuthStorageService, useValue: spy }
      ]
    });
    
    service = TestBed.inject(TokenValidatorService);
    authStorageSpy = TestBed.inject(AuthStorageService) as jasmine.SpyObj<AuthStorageService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isTokenValid', () => {
    it('should return false when no token exists', () => {
      authStorageSpy.getToken.and.returnValue(null);
      
      expect(service.isTokenValid()).toBeFalse();
    });

    it('should return false when token is empty string', () => {
      authStorageSpy.getToken.and.returnValue('');
      
      expect(service.isTokenValid()).toBeFalse();
    });

    it('should return false for invalid token format', () => {
      authStorageSpy.getToken.and.returnValue('invalid-token');
      
      expect(service.isTokenValid()).toBeFalse();
      expect(authStorageSpy.clearAuthenticationData).toHaveBeenCalled();
    });

    it('should return false for expired token', () => {
      // Token expiré (exp: 1000000000 = 2001-09-09)
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjEwMDAwMDAwMDB9.signature';
      authStorageSpy.getToken.and.returnValue(expiredToken);
      
      expect(service.isTokenValid()).toBeFalse();
      expect(authStorageSpy.clearAuthenticationData).toHaveBeenCalled();
    });

    it('should return true for valid token', () => {
      // Token valide avec exp dans le futur (exp: 9999999999 = 2286-11-20)
      const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.signature';
      authStorageSpy.getToken.and.returnValue(validToken);
      
      expect(service.isTokenValid()).toBeTrue();
    });

    it('should return true for token without expiration', () => {
      // Token sans champ exp
      const tokenWithoutExp = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.signature';
      authStorageSpy.getToken.and.returnValue(tokenWithoutExp);
      
      expect(service.isTokenValid()).toBeTrue();
    });
  });

  describe('shouldRedirectToLogin', () => {
    it('should return true when token is invalid', () => {
      authStorageSpy.getToken.and.returnValue(null);
      
      expect(service.shouldRedirectToLogin()).toBeTrue();
    });

    it('should return false when token is valid', () => {
      const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.signature';
      authStorageSpy.getToken.and.returnValue(validToken);
      
      expect(service.shouldRedirectToLogin()).toBeFalse();
    });
  });
});
