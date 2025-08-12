import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideRouter } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EnvService } from './services/env/env.service';

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
          provide: EnvService,
          useValue: {
            apiUrl: 'http://test-api.example.com/api',
            isProduction: false,
            stripePublicKey: 'pk_test_example'
          }
        }
      ]
    }).compileComponents();
  });

  afterEach(() => {
    clearLocalStorage();
  });

  it('should consider unauthenticated when token is absent', () => {
    clearLocalStorage();
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.isAuthenticated()).toBeFalse();
  });

  it('should consider authenticated when token is present', () => {
    setToken();
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.isAuthenticated()).toBeTrue();
  });

  it('should have title set to "frontend"', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toBe('frontend');
  });
});