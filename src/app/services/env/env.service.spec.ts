import { TestBed } from '@angular/core/testing';
import { EnvService } from './env.service';

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

  it('should have stripePublicKey property', () => {
    expect(service.stripePublicKey).toBeDefined();
    expect(typeof service.stripePublicKey).toBe('string');
  });
}); 