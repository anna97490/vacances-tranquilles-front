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
      (window as any).botpressWebChat = { conversationId: 'test-id' };
      spyOn<any>(service, 'sendMessage').and.returnValue(Promise.resolve(true));

      await expectAsync(service.sendWelcomeMessage()).toBeResolved();
    });

    it('should resolve when botpress is available and custom message sent successfully', async () => {
      (window as any).botpressWebChat = { conversationId: 'test-id' };
      spyOn<any>(service, 'sendMessage').and.returnValue(Promise.resolve(true));

      await expectAsync(service.sendWelcomeMessage('Hello')).toBeResolved();
    });
  });

  describe('sendMessage', () => {
    it('should send a message and return true on success', async () => {
      const fakeResponse = new Response(JSON.stringify({ success: true }), { status: 200 });
      spyOn(window, 'fetch').and.resolveTo(fakeResponse);
      secureIdGeneratorSpy.generateSecureRandomId.and.resolveTo('msg123');

      const result = await service['sendMessage']('abc123', 'Hello');

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
      spyOn(window, 'fetch').and.rejectWith(new Error('Network fail'));
      secureIdGeneratorSpy.generateSecureRandomId.and.resolveTo('msg123');

      const result = await service['sendMessage']('abc123', 'Hello');

      expect(result).toBeFalse();
    });

    it('should return false if response is not ok', async () => {
      const fakeResponse = new Response(null, { status: 500 });
      spyOn(window, 'fetch').and.resolveTo(fakeResponse);
      secureIdGeneratorSpy.generateSecureRandomId.and.resolveTo('msg123');

      const result = await service['sendMessage']('abc123', 'Hello');

      expect(result).toBeFalse();
    });

    it('should return false if response.json() throws error', async () => {
      const fakeResponse = new Response('invalid json', { status: 200 });
      spyOn(window, 'fetch').and.resolveTo(fakeResponse);
      spyOn(fakeResponse, 'json').and.rejectWith(new Error('Invalid JSON'));
      secureIdGeneratorSpy.generateSecureRandomId.and.resolveTo('msg123');

      const result = await service['sendMessage']('abc123', 'Hello');

      expect(result).toBeFalse();
    });
  });

  describe('isBotpressAvailable', () => {
    it('should return true when botpressWebChat is available with conversationId', () => {
      (window as any).botpressWebChat = {
        conversationId: 'test-id'
      };

      const result = service.isBotpressAvailable();

      expect(result).toBe(true);
    });

    it('should return false when botpressWebChat is not available', () => {
      delete (window as any).botpressWebChat;

      const result = service.isBotpressAvailable();

      expect(result).toBe(false);
    });

    it('should return false when botpressWebChat exists but has no conversationId', () => {
      (window as any).botpressWebChat = {};

      const result = service.isBotpressAvailable();

      expect(result).toBe(false);
    });

    it('should return false when botpressWebChat exists but conversationId is null', () => {
      (window as any).botpressWebChat = { conversationId: null };

      const result = service.isBotpressAvailable();

      expect(result).toBe(false);
    });

    it('should return false when botpressWebChat exists but conversationId is empty string', () => {
      (window as any).botpressWebChat = { conversationId: '' };

      const result = service.isBotpressAvailable();
      expect(result).toBe(false);
    });
  });

  describe('waitForBotpress', () => {
    it('should return true if botpress becomes available before timeout', async () => {
      (window as any).botpressWebChat = { conversationId: 'test-id' };

      const result = await service.waitForBotpress();

      expect(result).toBe(true);
    });

    it('should return false when botpress does not become available within timeout', async () => {
      delete (window as any).botpressWebChat;

      const result = await service.waitForBotpress(100);

      expect(result).toBe(false);
    });

    it('should return true when botpress becomes available during wait', async () => {
      delete (window as any).botpressWebChat;

      const promise = service.waitForBotpress(1000);

      setTimeout(() => {
        (window as any).botpressWebChat = { conversationId: 'test-id' };
      }, 50);

      const result = await promise;

      expect(result).toBe(true);
    });
  });
});
