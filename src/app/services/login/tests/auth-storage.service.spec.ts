import { TestBed } from '@angular/core/testing';
import { AuthStorageService } from './../auth-storage.service';

describe('AuthStorageService', () => {
  let service: AuthStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthStorageService);
    
    // Clear localStorage before each test
    localStorage.clear();

    // Supprimer tous les logs console pour chaque test
    spyOn(console, 'warn').and.stub();
    spyOn(console, 'error').and.stub();
    spyOn(console, 'log').and.stub();
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
  });

  describe('getToken', () => {
    it('should return stored token', () => {
      localStorage.setItem('token', 'test-token');
      
      expect(service.getToken()).toBe('test-token');
    });

    it('should return null when no token stored', () => {
      expect(service.getToken()).toBeNull();
    });
  });

  describe('getUserRole', () => {
    it('should return stored user role', () => {
      localStorage.setItem('userRole', 'ADMIN');
      
      expect(service.getUserRole()).toBe('ADMIN');
    });

    it('should return null when no user role stored', () => {
      expect(service.getUserRole()).toBeNull();
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
  });

  describe('clearAuthenticationData', () => {
    it('should remove token and userRole from localStorage', () => {
      localStorage.setItem('token', 'test-token');
      localStorage.setItem('userRole', 'CLIENT');
      
      service.clearAuthenticationData();
      
      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('userRole')).toBeNull();
    });
  });
});