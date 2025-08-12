import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let consoleSpy: jasmine.SpyObj<Console>;
  let alertSpy: jasmine.SpyObj<typeof alert>;

  beforeEach(() => {
    const consoleSpyObj = jasmine.createSpyObj('Console', ['log', 'error', 'warn', 'info']);
    const alertSpyObj = spyOn(window, 'alert').and.stub();

    TestBed.configureTestingModule({
      providers: [NotificationService]
    });
    
    service = TestBed.inject(NotificationService);
    consoleSpy = consoleSpyObj;
    alertSpy = alertSpyObj;
    
    // Remplacer console par notre spy
    spyOn(console, 'log').and.callFake(consoleSpy.log);
    spyOn(console, 'error').and.callFake(consoleSpy.error);
    spyOn(console, 'warn').and.callFake(consoleSpy.warn);
    spyOn(console, 'info').and.callFake(consoleSpy.info);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('success', () => {
    it('should log success message', () => {
      service.success('Test success message');
      
      expect(console.log).toHaveBeenCalledWith('✅ Succès: Test success message');
    });

    it('should log success message with custom title', () => {
      service.success('Test success message', 'Custom Title');
      
      expect(console.log).toHaveBeenCalledWith('✅ Custom Title: Test success message');
    });
  });

  describe('error', () => {
    it('should log error message and show alert', () => {
      service.error('Test error message');
      
      expect(console.error).toHaveBeenCalledWith('❌ Erreur: Test error message');
      expect(alert).toHaveBeenCalledWith('Erreur: Test error message');
    });

    it('should log error message with custom title', () => {
      service.error('Test error message', 'Custom Error');
      
      expect(console.error).toHaveBeenCalledWith('❌ Custom Error: Test error message');
      expect(alert).toHaveBeenCalledWith('Custom Error: Test error message');
    });
  });

  describe('warning', () => {
    it('should log warning message and show alert', () => {
      service.warning('Test warning message');
      
      expect(console.warn).toHaveBeenCalledWith('⚠️ Avertissement: Test warning message');
      expect(alert).toHaveBeenCalledWith('Avertissement: Test warning message');
    });

    it('should log warning message with custom title', () => {
      service.warning('Test warning message', 'Custom Warning');
      
      expect(console.warn).toHaveBeenCalledWith('⚠️ Custom Warning: Test warning message');
      expect(alert).toHaveBeenCalledWith('Custom Warning: Test warning message');
    });
  });

  describe('info', () => {
    it('should log info message', () => {
      service.info('Test info message');
      
      expect(console.info).toHaveBeenCalledWith('ℹ️ Information: Test info message');
    });

    it('should log info message with custom title', () => {
      service.info('Test info message', 'Custom Info');
      
      expect(console.info).toHaveBeenCalledWith('ℹ️ Custom Info: Test info message');
    });
  });

  describe('sessionExpired', () => {
    it('should show session expired notification', () => {
      service.sessionExpired();
      
      expect(console.warn).toHaveBeenCalledWith('⚠️ Session expirée: Votre session a expiré. Vous allez être redirigé vers la page de connexion.');
      expect(alert).toHaveBeenCalledWith('Session expirée: Votre session a expiré. Vous allez être redirigé vers la page de connexion.');
    });
  });
});
