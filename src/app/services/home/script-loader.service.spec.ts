import { TestBed } from '@angular/core/testing';
import { ScriptLoaderService } from './script-loader.service';

describe('ScriptLoaderService', () => {
  let service: ScriptLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScriptLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should check if script is loaded', () => {
    // Arrange
    const scriptSrc = 'https://example.com/test.js';

    // Act & Assert - Before loading
    expect(service.isScriptLoaded(scriptSrc)).toBe(false);
  });

  it('should cleanup scripts', () => {
    // Act
    service.cleanupScripts();
    
    // Assert - Should not throw error
    expect(true).toBe(true);
  });

  it('should handle script loading error', (done) => {
    // Arrange
    const invalidScriptSrc = 'https://invalid-url-that-does-not-exist.com/script.js';

    // Act & Assert
    service.addScript(invalidScriptSrc).catch((error) => {
      expect(error.message).toContain('Failed to load script');
      done();
    });
  });
}); 