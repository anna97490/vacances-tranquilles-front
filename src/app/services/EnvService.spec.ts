import { TestBed } from '@angular/core/testing';
import { EnvService } from './EnvService';

describe('EnvService', () => {
  let service: EnvService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnvService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have apiUrl property', () => {
    expect(service.apiUrl).toBeDefined();
    expect(typeof service.apiUrl).toBe('string');
  });

  it('should have isProduction property', () => {
    expect(service.isProduction).toBeDefined();
    expect(typeof service.isProduction).toBe('boolean');
  });

  it('should log environment configuration in non-production mode', () => {
    spyOn(console, 'log');
    
    // Recreate service to trigger the log
    const newService = new EnvService();
    
    if (!newService.isProduction) {
      expect(console.log).toHaveBeenCalledWith('Environment configuré :', {
        apiUrl: newService.apiUrl,
        isProduction: newService.isProduction
      });
    }
  });
}); 