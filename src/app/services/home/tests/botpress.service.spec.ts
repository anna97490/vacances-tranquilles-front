import { TestBed } from '@angular/core/testing';
import { BotpressService } from '../chatbot/botpress.service';
import { SecureIdGeneratorService } from '../crypto/secure-id-generator.service';

describe('BotpressService', () => {
  let service: BotpressService;
  let secureIdGeneratorSpy: jasmine.SpyObj<SecureIdGeneratorService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('SecureIdGeneratorService', ['generateSecureRandomId']);
    
    TestBed.configureTestingModule({
      providers: [
        BotpressService,
        { provide: SecureIdGeneratorService, useValue: spy }
      ]
    });
    
    service = TestBed.inject(BotpressService);
    secureIdGeneratorSpy = TestBed.inject(SecureIdGeneratorService) as jasmine.SpyObj<SecureIdGeneratorService>;
    
    // Clean up any existing Botpress
    delete (window as any).botpressWebChat;
  });

  afterEach(() => {
    delete (window as any).botpressWebChat;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('sendWelcomeMessage', () => {
    it('should resolve when botpress is available and message sent successfully', async () => {
      // Arrange
      (window as any).botpressWebChat = { conversationId: 'test-id' };
      spyOn<any>(service, 'sendMessage').and.resolveTo(true);
      
      // Act & Assert
      await expectAsync(service.sendWelcomeMessage()).toBeResolved();
    });

    it('should resolve when botpress is available and custom message sent successfully', async () => {
      // Arrange
      (window as any).botpressWebChat = { conversationId: 'test-id' };
      spyOn<any>(service, 'sendMessage').and.resolveTo(true);
      
      // Act & Assert
      await expectAsync(service.sendWelcomeMessage('Hello')).toBeResolved();
    });
  });

  describe('sendMessage', () => {
    it('should send a message and return true on success', async () => {
      // Arrange
      const fakeResponse = new Response(JSON.stringify({ success: true }), { status: 200 });
      spyOn(window, 'fetch').and.resolveTo(fakeResponse);
      secureIdGeneratorSpy.generateSecureRandomId.and.resolveTo('msg123');

      // Act
      const result = await service['sendMessage']('abc123', 'Hello');

      // Assert
      expect(result).toBeTrue();
      expect(window.fetch).toHaveBeenCalledWith(
        'https://webchat.botpress.cloud/30677914-9ece-488e-b7ad-f2415dad46c3/messages',
        jasmine.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            conversationId: 'abc123',
            payload: { type: 'text', text: 'Hello' },
            metadata: { clientMessageId: 'msg123' }
          })
        })
      );
    });

    it('should return false if fetch throws error', async () => {
      // Arrange
      spyOn(window, 'fetch').and.rejectWith(new Error('Network fail'));
      secureIdGeneratorSpy.generateSecureRandomId.and.resolveTo('msg123');

      // Act
      const result = await service['sendMessage']('abc123', 'Hello');

      // Assert
      expect(result).toBeFalse();
    });

    it('should return false if response is not ok', async () => {
      // Arrange
      const fakeResponse = new Response(null, { status: 500 });
      spyOn(window, 'fetch').and.resolveTo(fakeResponse);
      secureIdGeneratorSpy.generateSecureRandomId.and.resolveTo('msg123');

      // Act
      const result = await service['sendMessage']('abc123', 'Hello');

      // Assert
      expect(result).toBeFalse();
    });

    it('should return false if response.json() throws error', async () => {
      // Arrange
      const fakeResponse = new Response('invalid json', { status: 200 });
      spyOn(window, 'fetch').and.resolveTo(fakeResponse);
      spyOn(fakeResponse, 'json').and.rejectWith(new Error('Invalid JSON'));
      secureIdGeneratorSpy.generateSecureRandomId.and.resolveTo('msg123');

      // Act
      const result = await service['sendMessage']('abc123', 'Hello');

      // Assert
      expect(result).toBeFalse();
    });
  });

  describe('isBotpressAvailable', () => {
    it('should return true when botpressWebChat is available with conversationId', () => {
      // Arrange
      (window as any).botpressWebChat = {
        conversationId: 'test-id'
      };

      // Act
      const result = service.isBotpressAvailable();

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when botpressWebChat is not available', () => {
      // Arrange
      delete (window as any).botpressWebChat;

      // Act
      const result = service.isBotpressAvailable();

      // Assert
      expect(result).toBe(false);
    });

    it('should return false when botpressWebChat exists but has no conversationId', () => {
      // Arrange
      (window as any).botpressWebChat = {};

      // Act
      const result = service.isBotpressAvailable();

      // Assert
      expect(result).toBe(false);
    });

    it('should return false when botpressWebChat exists but conversationId is null', () => {
      // Arrange
      (window as any).botpressWebChat = { conversationId: null };

      // Act
      const result = service.isBotpressAvailable();

      // Assert
      expect(result).toBe(false);
    });

    it('should return false when botpressWebChat exists but conversationId is empty string', () => {
      // Arrange
      (window as any).botpressWebChat = { conversationId: '' };

      // Act
      const result = service.isBotpressAvailable();

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('waitForBotpress', () => {
    it('should return true if botpress becomes available before timeout', async () => {
      // Arrange
      (window as any).botpressWebChat = { conversationId: 'test-id' };

      // Act
      const result = await service.waitForBotpress();

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when botpress does not become available within timeout', async () => {
      // Arrange
      delete (window as any).botpressWebChat;

      // Act
      const result = await service.waitForBotpress(100); // Short timeout

      // Assert
      expect(result).toBe(false);
    });

    it('should return true when botpress becomes available during wait', async () => {
      // Arrange
      delete (window as any).botpressWebChat;
      
      // Act
      const promise = service.waitForBotpress(1000);
      
      // Simulate botpress becoming available after a short delay
      setTimeout(() => {
        (window as any).botpressWebChat = { conversationId: 'test-id' };
      }, 50);
      
      const result = await promise;

      // Assert
      expect(result).toBe(true);
    });
  });
});