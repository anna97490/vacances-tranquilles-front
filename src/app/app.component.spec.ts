import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideRouter } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService } from './services/config/config.service';

describe('AppComponent', () => {
  const clearLocalStorage = () => localStorage.removeItem('token');
  const setToken = () => localStorage.setItem('token', 'sample-token');

  beforeEach(async () => {
    clearLocalStorage();

    await TestBed.configureTestingModule({
      imports: [AppComponent, HttpClientTestingModule],
      providers: [
        provideRouter([]),
        {
          provide: ConfigService,
          useValue: {
            loadConfig: () => Promise.resolve()
          }
        }
      ]
    }).compileComponents();
  });

  afterEach(() => {
    clearLocalStorage();
  });

  it('should set isConnected to true if token is not present', () => {
    clearLocalStorage();
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.isConnected).toBeTrue();
  });

  it('should set isConnected to false if token is present', () => {
    setToken();
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.isConnected).toBeFalse();
  });

  it('should have title set to "frontend"', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toBe('frontend');
  });
});