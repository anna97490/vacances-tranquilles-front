import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { LoginNavigationService } from './../login-navigation.service';

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

    // Supprimer tous les logs console pour chaque test
    spyOn(console, 'warn').and.stub();
    spyOn(console, 'error').and.stub();
    spyOn(console, 'log').and.stub();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('redirectAfterLogin', () => {
    it('should redirect to home by default', () => {
      service.redirectAfterLogin();
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
    });

    it('should redirect to home with userRole parameter', () => {
      service.redirectAfterLogin('CLIENT');
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
    });

    it('should redirect to home with admin role', () => {
      service.redirectAfterLogin('ADMIN');
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
    });
  });

  describe('redirectToRegister', () => {
    it('should redirect to register page', () => {
      service.redirectToRegister();
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/register']);
    });
  });

  describe('redirectToForgotPassword', () => {
    it('should redirect to forgot password page', () => {
      service.redirectToForgotPassword();
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/forgot-password']);
    });
  });
});