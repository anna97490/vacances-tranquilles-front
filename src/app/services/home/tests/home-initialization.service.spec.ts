import { TestBed } from '@angular/core/testing';
import { HomeInitializationService } from '../home-initilization.service';
import { ScriptLoaderService } from '../script-loader.service';
import { BotpressService } from '../chatbot/botpress.service';

describe('HomeInitializationService', () => {
  let service: HomeInitializationService;
  let scriptLoader: jasmine.SpyObj<ScriptLoaderService>;
  let botpressService: jasmine.SpyObj<BotpressService>;

  beforeEach(() => {
    const scriptLoaderSpy = jasmine.createSpyObj('ScriptLoaderService', ['loadScripts', 'cleanupScripts']);
    const botpressServiceSpy = jasmine.createSpyObj('BotpressService', ['waitForBotpress', 'sendWelcomeMessage']);

    TestBed.configureTestingModule({
      providers: [
        HomeInitializationService,
        { provide: ScriptLoaderService, useValue: scriptLoaderSpy },
        { provide: BotpressService, useValue: botpressServiceSpy }
      ]
    });

    service = TestBed.inject(HomeInitializationService);
    scriptLoader = TestBed.inject(ScriptLoaderService) as jasmine.SpyObj<ScriptLoaderService>;
    botpressService = TestBed.inject(BotpressService) as jasmine.SpyObj<BotpressService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize home services successfully', async () => {
    scriptLoader.loadScripts.and.returnValue(Promise.resolve());
    botpressService.waitForBotpress.and.returnValue(Promise.resolve(true));
    botpressService.sendWelcomeMessage.and.returnValue(Promise.resolve());
    spyOn(console, 'log');

    await service.initializeHomeServices();

    expect(scriptLoader.loadScripts).toHaveBeenCalledWith([
      'https://cdn.botpress.cloud/webchat/v3.0/inject.js',
      'https://files.bpcontent.cloud/2025/06/23/13/20250623131622-WAJI2P5Q.js'
    ]);
    expect(botpressService.waitForBotpress).toHaveBeenCalled();
    expect(botpressService.sendWelcomeMessage).toHaveBeenCalled();
  });

  it('should handle script loading error', async () => {
    const error = new Error('Script loading failed');
    scriptLoader.loadScripts.and.returnValue(Promise.reject(error));
    spyOn(console, 'error');

    await service.initializeHomeServices();

    expect(console.error).toHaveBeenCalledWith('Erreur lors de l\'initialisation des services:', error);
  });

  it('should handle botpress timeout', async () => {
    scriptLoader.loadScripts.and.returnValue(Promise.resolve());
    botpressService.waitForBotpress.and.returnValue(Promise.resolve(false));
    spyOn(console, 'warn');

    await service.initializeHomeServices();

    expect(botpressService.sendWelcomeMessage).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalledWith('Timeout: Botpress non disponible');
  });

  it('should handle botpress initialization error', async () => {
    const error = new Error('Botpress initialization failed');
    scriptLoader.loadScripts.and.returnValue(Promise.resolve());
    botpressService.waitForBotpress.and.returnValue(Promise.resolve(true));
    botpressService.sendWelcomeMessage.and.returnValue(Promise.reject(error));
    spyOn(console, 'error');

    await service.initializeHomeServices();

    expect(console.error).toHaveBeenCalledWith('Erreur lors de l\'initialisation de Botpress:', error);
  });

  it('should cleanup scripts', () => {
    service.cleanup();

    expect(scriptLoader.cleanupScripts).toHaveBeenCalled();
  });
});
