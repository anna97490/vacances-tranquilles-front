import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { TokenValidatorService } from '../validators/token-validator.service';
import { AuthStorageService } from '../../login/auth-storage.service';
import { UserRole } from '../../../models/User';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let tokenValidatorSpy: jasmine.SpyObj<TokenValidatorService>;
  let authStorageSpy: jasmine.SpyObj<AuthStorageService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  beforeEach(() => {
    const tokenValidatorSpyObj = jasmine.createSpyObj('TokenValidatorService', ['isTokenValid']);
    const authStorageSpyObj = jasmine.createSpyObj('AuthStorageService', ['getUserRole']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: TokenValidatorService, useValue: tokenValidatorSpyObj },
        { provide: AuthStorageService, useValue: authStorageSpyObj },
        { provide: Router, useValue: routerSpyObj }
      ]
    });

    guard = TestBed.inject(AuthGuard);
    tokenValidatorSpy = TestBed.inject(TokenValidatorService) as jasmine.SpyObj<TokenValidatorService>;
    authStorageSpy = TestBed.inject(AuthStorageService) as jasmine.SpyObj<AuthStorageService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    mockRoute = {} as ActivatedRouteSnapshot;
    mockState = { url: '/test' } as RouterStateSnapshot;

    // Configuration par défaut
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('Route /home', () => {
    beforeEach(() => {
      mockState.url = '/home';
    });

    it('should allow access for non-authenticated users', () => {
      tokenValidatorSpy.isTokenValid.and.returnValue(false);

      const result = guard.canActivate(mockRoute, mockState);

      expect(result).toBeTrue();
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });

    it('should redirect PROVIDER users to /profile', () => {
      tokenValidatorSpy.isTokenValid.and.returnValue(true);
      authStorageSpy.getUserRole.and.returnValue(UserRole.PROVIDER);

      const result = guard.canActivate(mockRoute, mockState);

      expect(result).toBeFalse();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/profile']);
    });

    it('should redirect CLIENT users to /service-search', () => {
      tokenValidatorSpy.isTokenValid.and.returnValue(true);
      authStorageSpy.getUserRole.and.returnValue(UserRole.CLIENT);

      const result = guard.canActivate(mockRoute, mockState);

      expect(result).toBeFalse();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/service-search']);
    });

    it('should allow access for authenticated users with unknown role', () => {
      tokenValidatorSpy.isTokenValid.and.returnValue(true);
      authStorageSpy.getUserRole.and.returnValue('UNKNOWN_ROLE');

      const result = guard.canActivate(mockRoute, mockState);

      expect(result).toBeTrue();
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });
  });

  describe('Route /review', () => {
    beforeEach(() => {
      mockState.url = '/review';
      tokenValidatorSpy.isTokenValid.and.returnValue(true);
    });

    it('should allow access for CLIENT users', () => {
      authStorageSpy.getUserRole.and.returnValue(UserRole.CLIENT);

      const result = guard.canActivate(mockRoute, mockState);

      expect(result).toBeTrue();
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });

    it('should redirect PROVIDER users to /profile', () => {
      authStorageSpy.getUserRole.and.returnValue(UserRole.PROVIDER);

      const result = guard.canActivate(mockRoute, mockState);

      expect(result).toBeFalse();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/profile']);
    });

    it('should allow access for users with unknown role', () => {
      authStorageSpy.getUserRole.and.returnValue('UNKNOWN_ROLE');

      const result = guard.canActivate(mockRoute, mockState);

      expect(result).toBeTrue();
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });
  });

  describe('Protected routes', () => {
    beforeEach(() => {
      mockState.url = '/protected-route';
    });

    it('should redirect non-authenticated users to /home', () => {
      tokenValidatorSpy.isTokenValid.and.returnValue(false);

      const result = guard.canActivate(mockRoute, mockState);

      expect(result).toBeFalse();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
    });

    it('should allow access for authenticated CLIENT users', () => {
      tokenValidatorSpy.isTokenValid.and.returnValue(true);
      authStorageSpy.getUserRole.and.returnValue(UserRole.CLIENT);

      const result = guard.canActivate(mockRoute, mockState);

      expect(result).toBeTrue();
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });

    it('should allow access for authenticated PROVIDER users', () => {
      tokenValidatorSpy.isTokenValid.and.returnValue(true);
      authStorageSpy.getUserRole.and.returnValue(UserRole.PROVIDER);

      const result = guard.canActivate(mockRoute, mockState);

      expect(result).toBeTrue();
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });

    it('should allow access for authenticated users with unknown role', () => {
      tokenValidatorSpy.isTokenValid.and.returnValue(true);
      authStorageSpy.getUserRole.and.returnValue('UNKNOWN_ROLE');

      const result = guard.canActivate(mockRoute, mockState);

      expect(result).toBeTrue();
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });
  });

  describe('Edge cases', () => {
    it('should handle null user role gracefully', () => {
      mockState.url = '/test';
      tokenValidatorSpy.isTokenValid.and.returnValue(true);
      authStorageSpy.getUserRole.and.returnValue(null);

      const result = guard.canActivate(mockRoute, mockState);

      expect(result).toBeTrue();
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });

    it('should handle empty string user role gracefully', () => {
      mockState.url = '/test';
      tokenValidatorSpy.isTokenValid.and.returnValue(true);
      authStorageSpy.getUserRole.and.returnValue('');

      const result = guard.canActivate(mockRoute, mockState);

      expect(result).toBeTrue();
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });

    it('should handle different route URLs correctly', () => {
      const testUrls = ['/profile', '/service-search', '/reservations', '/messaging', '/assistance'];

      testUrls.forEach(url => {
        mockState.url = url;
        tokenValidatorSpy.isTokenValid.and.returnValue(true);
        authStorageSpy.getUserRole.and.returnValue(UserRole.CLIENT);

        const result = guard.canActivate(mockRoute, mockState);

        expect(result).toBeTrue();
        expect(routerSpy.navigate).not.toHaveBeenCalled();
      });
    });
  });
});
