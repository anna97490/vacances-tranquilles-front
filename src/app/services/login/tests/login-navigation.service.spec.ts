import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { LoginNavigationService } from './../login-navigation.service';
import { UserRole } from '../../../models/User';

describe('LoginNavigationService', () => {
  let service: LoginNavigationService;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    });

    service = TestBed.inject(LoginNavigationService);
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('redirectAfterLogin', () => {
    it('should redirect to home by default when no userRole provided', () => {
      service.redirectAfterLogin();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
    });

    it('should redirect to service-search for CLIENT userRole', () => {
      service.redirectAfterLogin(UserRole.CLIENT);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/service-search']);
    });

    it('should redirect to profile when userRole is PROVIDER', () => {
      service.redirectAfterLogin(UserRole.PROVIDER);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/profile']);
    });

    it('should redirect to home with any other userRole', () => {
      service.redirectAfterLogin('OTHER_ROLE');

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
    });
  });

  describe('redirectToRegister', () => {
    it('should redirect to register page with particulier userType', () => {
      service.redirectToRegister();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/register/particulier']);
    });
  });

  describe('redirectToForgotPassword', () => {
    it('should redirect to forgot password page', () => {
      service.redirectToForgotPassword();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/forgot-password']);
    });
  });
});
