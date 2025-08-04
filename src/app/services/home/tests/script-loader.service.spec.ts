import { TestBed } from '@angular/core/testing';
import { Renderer2, RendererFactory2 } from '@angular/core';
import { ScriptLoaderService } from './../script-loader.service';

describe('ScriptLoaderService', () => {
  let service: ScriptLoaderService;
  let mockRenderer: jasmine.SpyObj<Renderer2>;
  let mockRendererFactory: jasmine.SpyObj<RendererFactory2>;

  beforeEach(() => {
    const rendererSpy = jasmine.createSpyObj('Renderer2', ['createElement', 'appendChild']);
    const rendererFactorySpy = jasmine.createSpyObj('RendererFactory2', ['createRenderer']);
    
    rendererFactorySpy.createRenderer.and.returnValue(rendererSpy);

    TestBed.configureTestingModule({
      providers: [
        { provide: RendererFactory2, useValue: rendererFactorySpy }
      ]
    });

    service = TestBed.inject(ScriptLoaderService);
    mockRendererFactory = TestBed.inject(RendererFactory2) as jasmine.SpyObj<RendererFactory2>;
    mockRenderer = mockRendererFactory.createRenderer(null, null) as jasmine.SpyObj<Renderer2>;

    // Supprimer tous les logs console pour chaque test
    spyOn(console, 'warn').and.stub();
    spyOn(console, 'error').and.stub();
    spyOn(console, 'log').and.stub();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('addScript', () => {
    it('should create and append script element', async () => {
      const mockScript = {
        onload: null as any,
        onerror: null as any,
        type: '',
        src: '',
        async: false
      };
      
      mockRenderer.createElement.and.returnValue(mockScript);

      const scriptPromise = service.addScript('test.js');

      // Simulate successful load
      setTimeout(() => {
        if (mockScript.onload) mockScript.onload();
      }, 0);

      await expectAsync(scriptPromise).toBeResolved();

      expect(mockRenderer.createElement).toHaveBeenCalledWith('script');
      expect(mockScript.type).toBe('text/javascript');
      expect(mockScript.src).toBe('test.js');
      expect(mockScript.async).toBe(true);
      expect(mockRenderer.appendChild).toHaveBeenCalledWith(document.body, mockScript);
    });

    it('should handle script load error', async () => {
      const mockScript = {
        onload: null as any,
        onerror: null as any,
        type: '',
        src: '',
        async: false
      };
      
      mockRenderer.createElement.and.returnValue(mockScript);

      const scriptPromise = service.addScript('test.js');

      // Simulate error
      setTimeout(() => {
        if (mockScript.onerror) mockScript.onerror();
      }, 0);

      await expectAsync(scriptPromise).toBeRejectedWithError('Failed to load script: test.js');
    });

    it('should set async to false when specified', async () => {
      const mockScript = {
        onload: null as any,
        onerror: null as any,
        type: '',
        src: '',
        async: false
      };
      
      mockRenderer.createElement.and.returnValue(mockScript);

      const scriptPromise = service.addScript('test.js', false);

      // Simulate successful load
      setTimeout(() => {
        if (mockScript.onload) mockScript.onload();
      }, 0);

      await expectAsync(scriptPromise).toBeResolved();
      expect(mockScript.async).toBe(false);
    });
  });

  describe('loadScripts', () => {
    it('should load multiple scripts in sequence', async () => {
      const scripts = ['script1.js', 'script2.js', 'script3.js'];
      let loadOrder: string[] = [];

      spyOn(service, 'addScript').and.callFake((src: string) => {
        return new Promise(resolve => {
          setTimeout(() => {
            loadOrder.push(src);
            resolve();
          }, 10);
        });
      });

      await service.loadScripts(scripts);

      expect(service.addScript).toHaveBeenCalledTimes(3);
      expect(loadOrder).toEqual(scripts);
    });

    it('should handle empty script array', async () => {
      spyOn(service, 'addScript');

      await service.loadScripts([]);

      expect(service.addScript).not.toHaveBeenCalled();
    });
  });

  describe('isScriptLoaded', () => {
    it('should return true if script exists in DOM', () => {
      spyOn(document, 'querySelector').and.returnValue(document.createElement('script'));

      expect(service.isScriptLoaded('test.js')).toBeTruthy();
      expect(document.querySelector).toHaveBeenCalledWith('script[src="test.js"]');
    });

    it('should return false if script does not exist in DOM', () => {
      spyOn(document, 'querySelector').and.returnValue(null);

      expect(service.isScriptLoaded('test.js')).toBeFalsy();
    });
  });

  describe('cleanupScripts', () => {
    it('should remove all added scripts', () => {
      const mockScript1 = { parentNode: { removeChild: jasmine.createSpy() } };
      const mockScript2 = { parentNode: { removeChild: jasmine.createSpy() } };
      const mockScript3 = { parentNode: null };

      // Add scripts to internal array (simulate previous additions)
      (service as any).scriptElements = [mockScript1, mockScript2, mockScript3];

      service.cleanupScripts();

      expect(mockScript1.parentNode.removeChild).toHaveBeenCalledWith(mockScript1);
      expect(mockScript2.parentNode.removeChild).toHaveBeenCalledWith(mockScript2);
      expect((service as any).scriptElements.length).toBe(0);
    });
  });
});