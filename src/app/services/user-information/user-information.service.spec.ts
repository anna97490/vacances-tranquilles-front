import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserInformationService } from './user-information.service';
import { User, UserRole } from '../../models/User';
<<<<<<< HEAD
import { EnvService } from '../env/env.service';
=======
>>>>>>> staging

describe('UserInformationService', () => {
  let service: UserInformationService;
  let httpMock: HttpTestingController;
<<<<<<< HEAD
  let envService: EnvService;

  const mockEnvService = {
    apiUrl: 'http://test-api.example.com/api'
  };
=======

  const mockConfig = { apiUrl: 'http://localhost:8080/api' };
>>>>>>> staging

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UserInformationService,
<<<<<<< HEAD
        { provide: EnvService, useValue: mockEnvService }
=======
        { provide: 'APP_CONFIG', useValue: mockConfig }
>>>>>>> staging
      ]
    });

    service = TestBed.inject(UserInformationService);
    httpMock = TestBed.inject(HttpTestingController);
<<<<<<< HEAD
    envService = TestBed.inject(EnvService);
=======
>>>>>>> staging
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get user by id', () => {
    // Simule un token valide
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      return key === 'token' ? 'mock-token' : null;
    });

    const mockUser = new User({
      idUser: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      role: UserRole.PROVIDER,
      phoneNumber: '0123456789',
      address: '123 Main St',
      city: 'Paris',
      postalCode: 75001,
      companyName: 'John Services',
      siretSiren: '12345678901234'
    });

    service.getUserById(1).subscribe(user => {
      expect(user).toEqual(mockUser);
    });

<<<<<<< HEAD
    const req = httpMock.expectOne('http://test-api.example.com/api/users/1');
=======
    const req = httpMock.expectOne('http://localhost:8080/api/users/1');
>>>>>>> staging
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.has('Authorization')).toBeTrue(); // ✅ devrait maintenant passer
    req.flush(mockUser);
  });


  it('should get user profile', () => {
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      return key === 'token' ? 'mock-token' : null;
    });

    const mockUser = new User({
      idUser: 6,
      firstName: 'Client',
      lastName: 'Test',
      email: 'client@test.com',
      role: UserRole.CLIENT,
      phoneNumber: '0123456789',
      address: '456 Client St',
      city: 'Paris',
      postalCode: 75002,
    });

    service.getUserProfile().subscribe(user => {
      expect(user).toEqual(mockUser);
    });

<<<<<<< HEAD
    const req = httpMock.expectOne('http://test-api.example.com/api/users/profile');
=======
    const req = httpMock.expectOne('http://localhost:8080/api/users/profile');
>>>>>>> staging
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.has('Authorization')).toBeTrue();
    req.flush(mockUser);
  });

  it('should get users by ids', () => {
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      return key === 'token' ? 'mock-token' : null;
    });

    const mockUsers: User[] = [
      new User({
        idUser: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: UserRole.PROVIDER,
        phoneNumber: '0123456789',
        address: '123 Main St',
        city: 'Paris',
        postalCode: 75001,
        companyName: 'John Services',
        siretSiren: '12345678901234'
      }),
      new User({
        idUser: 2,
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        role: UserRole.PROVIDER,
        phoneNumber: '0987654321',
        address: '789 Provider St',
        city: 'Lyon',
        postalCode: 69001,
        companyName: 'Jane Services',
        siretSiren: '98765432109876'
      })
    ];

    const userIds = [1, 2];

    service.getUsersByIds(userIds).subscribe(users => {
      expect(users).toEqual(mockUsers);
    });

<<<<<<< HEAD
    const req = httpMock.expectOne('http://test-api.example.com/api/users/batch');
=======
    const req = httpMock.expectOne('http://localhost:8080/api/users/batch');
>>>>>>> staging
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ userIds });
    expect(req.request.headers.has('Authorization')).toBeTrue(); // ✅ devrait passer maintenant
    req.flush(mockUsers);
  });

  it('should use fallback token when localStorage token is missing', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);

    const mockUser = new User({
      idUser: 3,
      firstName: 'Fallback',
      lastName: 'User',
      email: 'fallback@example.com',
      role: UserRole.CLIENT,
      phoneNumber: '0123000000',
      address: 'Nowhere',
      city: 'Paris',
      postalCode: 75000
    });

    service.getUserById(3).subscribe(user => {
      expect(user).toEqual(mockUser);
    });

<<<<<<< HEAD
    const req = httpMock.expectOne('http://test-api.example.com/api/users/3');
=======
    const req = httpMock.expectOne('http://localhost:8080/api/users/3');
>>>>>>> staging
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.has('Authorization')).toBeFalse();

    req.flush(mockUser);
  });

  it('should handle 404 error on getUserById', () => {
    service.getUserById(999).subscribe({
      next: () => fail('Should have failed with 404'),
      error: (error) => {
        expect(error.status).toBe(404);
        expect(error.statusText).toBe('Not Found');
      }
    });

<<<<<<< HEAD
    const req = httpMock.expectOne('http://test-api.example.com/api/users/999');
=======
    const req = httpMock.expectOne('http://localhost:8080/api/users/999');
>>>>>>> staging
    req.flush('User not found', { status: 404, statusText: 'Not Found' });
  });
});
