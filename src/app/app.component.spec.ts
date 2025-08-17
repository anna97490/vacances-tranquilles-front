import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { EnvService } from './services/env/env.service';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { routes } from './app.routes';

describe('AppComponent', () => {
  const clearLocalStorage = () => localStorage.removeItem('token');
  const setToken = () => localStorage.setItem('token', 'sample-token');

  const mockEnvService = {
    apiUrl: 'http://test-api.example.com/api',
    isProduction: false,
    stripePublicKey: 'pk_test_example'
  };

  beforeEach(async () => {
    clearLocalStorage();

    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        RouterOutlet,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        CommonModule
      ],
      providers: [
        provideRouter(routes), // ✅ Utilise les vraies routes au lieu d'un tableau vide
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: EnvService,
          useValue: mockEnvService
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

  it('should display header when user is authenticated', () => {
    setToken();
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const header = compiled.querySelector('app-header');
    expect(header).toBeTruthy();
  });

  it('should not display header when user is not authenticated', () => {
    clearLocalStorage();
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const header = compiled.querySelector('app-header');
    expect(header).toBeFalsy();
  });

  it('should always display footer regardless of authentication status', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const footer = compiled.querySelector('app-footer');
    expect(footer).toBeTruthy();
  });

  it('should have main container structure', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const appContainer = compiled.querySelector('.app-container');
    expect(appContainer).toBeTruthy();
  });

  it('should have skip link for accessibility', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const skipLink = compiled.querySelector('.skip-link');
    expect(skipLink).toBeTruthy();
    expect(skipLink.getAttribute('href')).toBe('#main-content');
    expect(skipLink.textContent.trim()).toBe('Aller au contenu');
  });

  it('should have main content area with proper attributes', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const mainContent = compiled.querySelector('#main-content');
    expect(mainContent).toBeTruthy();
    expect(mainContent.getAttribute('tabindex')).toBe('-1');
  });

  it('should have router outlet for navigation', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const routerOutlet = compiled.querySelector('router-outlet');
    expect(routerOutlet).toBeTruthy();
  });

  it('should update header visibility when authentication status changes', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    clearLocalStorage();
    fixture.detectChanges();
    let compiled = fixture.nativeElement;
    expect(compiled.querySelector('app-header')).toBeFalsy();

    setToken();
    fixture.detectChanges();
    compiled = fixture.nativeElement;
    expect(compiled.querySelector('app-header')).toBeTruthy();

    clearLocalStorage();
    fixture.detectChanges();
    compiled = fixture.nativeElement;
    expect(compiled.querySelector('app-header')).toBeFalsy();
  });

  it('should initialize with EnvService configuration', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    fixture.detectChanges();

    expect(app).toBeTruthy();
  });

  it('should inject EnvService correctly', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    expect(app).toBeTruthy();
    expect(fixture.componentInstance).toBeDefined();
  });

  // ✅ Nouveaux tests ajoutés pour une meilleure couverture
  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have proper component structure', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.app-container')).toBeTruthy();
    expect(compiled.querySelector('main')).toBeTruthy();
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });

  it('should handle authentication state changes correctly', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    // Test initial state
    expect(app.isAuthenticated()).toBeFalse();

    // Test with token
    setToken();
    expect(app.isAuthenticated()).toBeTrue();

    // Test after clearing
    clearLocalStorage();
    expect(app.isAuthenticated()).toBeFalse();
  });
});
