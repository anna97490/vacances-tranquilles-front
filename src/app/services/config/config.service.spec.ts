import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ConfigService } from './config.service';

describe('ConfigService', () => {
  let service: ConfigService;
  let httpMock: HttpTestingController;

  const mockInitialConfig = { apiUrl: 'http://initial-api/api' };
  const mockLoadedConfig = { apiUrl: 'http://loaded-api/api' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ConfigService,
        { provide: 'APP_CONFIG', useValue: mockInitialConfig }
      ]
    });

    service = TestBed.inject(ConfigService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return apiUrl from injected config', () => {
    expect(service.apiUrl).toBe(mockInitialConfig.apiUrl);
  });

  it('should load config from /assets/config.json', async () => {
    const promise = service.loadConfig();

    const req = httpMock.expectOne('/assets/config.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockLoadedConfig);

    await promise;

    expect(service.apiUrl).toBe(mockLoadedConfig.apiUrl);
  });
});
