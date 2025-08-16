import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

import { SuccessComponent } from './success.component';
import { EnvService } from '../../services/env/env.service';

describe('SuccessComponent', () => {
  let component: SuccessComponent;
  let fixture: ComponentFixture<SuccessComponent>;
  let httpMock: HttpTestingController;
  let router: jasmine.SpyObj<Router>;
  let activatedRoute: jasmine.SpyObj<ActivatedRoute>;
  let envService: jasmine.SpyObj<EnvService>;

  const mockEnvService = {
    apiUrl: 'http://test-api.example.com/api'
  };

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const getSpy = jasmine.createSpy('get').and.returnValue(null);
    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      snapshot: {
        queryParamMap: {
          get: getSpy
        }
      }
    });

    await TestBed.configureTestingModule({
      imports: [
        SuccessComponent,
        HttpClientTestingModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        CommonModule
      ],
      providers: [
        provideRouter([]),
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: EnvService, useValue: mockEnvService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SuccessComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    activatedRoute = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;
    envService = TestBed.inject(EnvService) as jasmine.SpyObj<EnvService>;

    // Supprimer les logs console pour les tests
    spyOn(console, 'error').and.stub();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.message).toBe('');
    expect(component.messageType).toBe('success');
    expect(component.isLoading).toBe(true);
  });

  describe('ngOnInit', () => {
    it('should handle missing session_id parameter', () => {
      // Arrange
      (activatedRoute.snapshot.queryParamMap.get as jasmine.Spy).and.returnValue(null);

      // Act
      component.ngOnInit();

      // Assert
      expect(component.isLoading).toBe(false);
      expect(component.messageType).toBe('error');
      expect(component.message).toBe('Paramètre de session manquant.');
    });

    it('should call confirmReservation when session_id is present', () => {
      // Arrange
      const sessionId = 'test-session-id';
      (activatedRoute.snapshot.queryParamMap.get as jasmine.Spy).and.returnValue(sessionId);
      spyOn(component as any, 'confirmReservation');

      // Act
      component.ngOnInit();

      // Assert
      expect((component as any).confirmReservation).toHaveBeenCalledWith(sessionId);
    });
  });

  describe('confirmReservation', () => {
    it('should handle successful reservation confirmation', () => {
      // Arrange
      const sessionId = 'test-session-id';

      // Act
      (component as any).confirmReservation(sessionId);

      // Assert
      expect(component.isLoading).toBe(true);

      // Simuler la réponse HTTP
      const req = httpMock.expectOne(`${mockEnvService.apiUrl}/stripe/confirm-reservation`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ sessionId });

      req.flush({});

      // Vérifier les changements après la réponse
      expect(component.isLoading).toBe(false);
      expect(component.messageType).toBe('success');
      expect(component.message).toBe('Réservation confirmée !');
    });

    it('should handle error during reservation confirmation', () => {
      // Arrange
      const sessionId = 'test-session-id';

      // Act
      (component as any).confirmReservation(sessionId);

      // Assert
      expect(component.isLoading).toBe(true);

      // Simuler une erreur HTTP
      const req = httpMock.expectOne(`${mockEnvService.apiUrl}/stripe/confirm-reservation`);
      req.error(new ErrorEvent('Network error'));

      // Vérifier les changements après l'erreur
      expect(component.isLoading).toBe(false);
      expect(component.messageType).toBe('error');
      expect(component.message).toBe('Une erreur est survenue lors de la confirmation.');
    });
  });

  describe('goToReservations', () => {
    it('should navigate to reservations page', () => {
      // Act
      component.goToReservations();

      // Assert
      expect(router.navigate).toHaveBeenCalledWith(['/reservations']);
    });
  });




});
