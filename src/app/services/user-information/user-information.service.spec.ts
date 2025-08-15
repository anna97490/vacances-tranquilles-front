import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserInformationService } from './user-information.service';
import { User, UserRole } from '../../models/User';
import { Service, ServiceCategory } from '../../models/Service';
import { UpdateUserDTO } from '../../models/UpdateUserDTO';
import { UserProfileDTO } from '../../models/UserProfileDTO';
import { EnvService } from '../env/env.service';
import { MOCK_USER_PROVIDER, MOCK_USER_ADMIN, MOCK_SERVICES } from '../../utils/test-mocks';

describe('UserInformationService', () => {
  let service: UserInformationService;
  let httpMock: HttpTestingController;
  let envService: EnvService;

  const mockEnvService = {
    apiUrl: 'http://test-api.example.com/api'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UserInformationService,
        { provide: EnvService, useValue: mockEnvService }
      ]
    });

    service = TestBed.inject(UserInformationService);
    httpMock = TestBed.inject(HttpTestingController);
    envService = TestBed.inject(EnvService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUserById', () => {
    it('should get user by id with token', () => {
      // Simule un token valide
      spyOn(localStorage, 'getItem').and.callFake((key: string) => {
        return key === 'token' ? 'mock-token' : null;
      });

      const mockUser: User = MOCK_USER_PROVIDER;

      service.getUserById(1).subscribe(user => {
        expect(user).toEqual(mockUser);
      });

      const req = httpMock.expectOne('http://test-api.example.com/api/users/1');
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.has('Authorization')).toBeTrue();
      req.flush(mockUser);
    });

    it('should get user by id without token', () => {
      spyOn(localStorage, 'getItem').and.returnValue(null);
      spyOn(console, 'warn').and.stub();

              const mockUser: User = MOCK_USER_PROVIDER;

      service.getUserById(1).subscribe(user => {
        expect(user).toEqual(mockUser);
      });

      const req = httpMock.expectOne('http://test-api.example.com/api/users/1');
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

      const req = httpMock.expectOne('http://test-api.example.com/api/users/999');
      req.flush('User not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getUserProfile', () => {
    it('should get user profile with token', () => {
      spyOn(localStorage, 'getItem').and.callFake((key: string) => {
        return key === 'token' ? 'mock-token' : null;
      });

      const mockUser: User = {
        idUser: 6,
        firstName: 'Client',
        lastName: 'Test',
        email: 'client@test.com',
        role: UserRole.CLIENT,
        phoneNumber: '0123456789',
        address: '456 Client St',
        city: 'Paris',
        postalCode: 75002,
      };

      service.getUserProfile().subscribe(user => {
        expect(user).toEqual(mockUser);
      });

      const req = httpMock.expectOne('http://test-api.example.com/api/users/profile');
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.has('Authorization')).toBeTrue();
      req.flush(mockUser);
    });

    it('should get user profile without token', () => {
      spyOn(localStorage, 'getItem').and.returnValue(null);
      spyOn(console, 'warn').and.stub();

              const mockUser: User = {
          idUser: 6,
          firstName: 'Client',
          lastName: 'Test',
          email: 'client@test.com',
          role: UserRole.CLIENT,
          phoneNumber: '0123456789',
          address: '123 Test Street',
          city: 'Test City',
          postalCode: 12345
        };

      service.getUserProfile().subscribe(user => {
        expect(user).toEqual(mockUser);
      });

      const req = httpMock.expectOne('http://test-api.example.com/api/users/profile');
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.has('Authorization')).toBeFalse();
      req.flush(mockUser);
    });
  });

  describe('getUsersByIds', () => {
    it('should get users by ids with token', () => {
      spyOn(localStorage, 'getItem').and.callFake((key: string) => {
        return key === 'token' ? 'mock-token' : null;
      });

      const mockUsers: User[] = [MOCK_USER_PROVIDER, MOCK_USER_ADMIN];

      const userIds = [1, 2];

      service.getUsersByIds(userIds).subscribe(users => {
        expect(users).toEqual(mockUsers);
      });

      const req = httpMock.expectOne('http://test-api.example.com/api/users/batch');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ userIds });
      expect(req.request.headers.has('Authorization')).toBeTrue();
      req.flush(mockUsers);
    });

    it('should get users by ids without token', () => {
      spyOn(localStorage, 'getItem').and.returnValue(null);
      spyOn(console, 'warn').and.stub();

              const mockUsers: User[] = [
          {
            idUser: 1,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            role: UserRole.PROVIDER
          } as User
        ];

      const userIds = [1];

      service.getUsersByIds(userIds).subscribe(users => {
        expect(users).toEqual(mockUsers);
      });

      const req = httpMock.expectOne('http://test-api.example.com/api/users/batch');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ userIds });
      expect(req.request.headers.has('Authorization')).toBeFalse();
      req.flush(mockUsers);
    });
  });

  describe('updateUserProfile', () => {
    it('should update user profile with token', () => {
      spyOn(localStorage, 'getItem').and.callFake((key: string) => {
        return key === 'token' ? 'mock-token' : null;
      });

      const updateDTO: UpdateUserDTO = {
        firstName: 'Updated',
        lastName: 'Name',
        email: 'updated@example.com',
        phoneNumber: '0987654321'
      };

              const mockResponse: UserProfileDTO = {
          user: {
            idUser: 1,
            firstName: 'Updated',
            lastName: 'Name',
            email: 'updated@example.com',
            role: UserRole.PROVIDER
          } as User,
          services: []
        };

      service.updateUserProfile(updateDTO).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('http://test-api.example.com/api/users/profile');
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(updateDTO);
      expect(req.request.headers.has('Authorization')).toBeTrue();
      req.flush(mockResponse);
    });

    it('should update user profile without token', () => {
      spyOn(localStorage, 'getItem').and.returnValue(null);
      spyOn(console, 'warn').and.stub();

      const updateDTO: UpdateUserDTO = {
        firstName: 'Updated',
        lastName: 'Name'
      };

              const mockResponse: UserProfileDTO = {
          user: {
            idUser: 1,
            firstName: 'Updated',
            lastName: 'Name',
            role: UserRole.PROVIDER
          } as User,
          services: []
        };

      service.updateUserProfile(updateDTO).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('http://test-api.example.com/api/users/profile');
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(updateDTO);
      expect(req.request.headers.has('Authorization')).toBeFalse();
      req.flush(mockResponse);
    });
  });

  describe('getUserProfileWithServices', () => {
    it('should get user profile with services with token', () => {
      spyOn(localStorage, 'getItem').and.callFake((key: string) => {
        return key === 'token' ? 'mock-token' : null;
      });

      const mockService = MOCK_SERVICES[0];

              const mockResponse: UserProfileDTO = {
          user: {
            idUser: 1,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            role: UserRole.PROVIDER
          } as User,
          services: [mockService]
        };

      service.getUserProfileWithServices().subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('http://test-api.example.com/api/users/profile');
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.has('Authorization')).toBeTrue();
      req.flush(mockResponse);
    });

    it('should get user profile with services without token', () => {
      spyOn(localStorage, 'getItem').and.returnValue(null);
      spyOn(console, 'warn').and.stub();

              const mockResponse: UserProfileDTO = {
          user: {
            idUser: 1,
            firstName: 'John',
            lastName: 'Doe',
            role: UserRole.PROVIDER
          } as User,
          services: []
        };

      service.getUserProfileWithServices().subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('http://test-api.example.com/api/users/profile');
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.has('Authorization')).toBeFalse();
      req.flush(mockResponse);
    });
  });

  describe('getMyServices', () => {
    it('should get my services with token', () => {
      spyOn(localStorage, 'getItem').and.callFake((key: string) => {
        return key === 'token' ? 'mock-token' : null;
      });
      spyOn(console, 'log').and.stub();

      const mockService1 = new Service();
      mockService1.id = 1;
      mockService1.title = 'Service 1';
      mockService1.description = 'Description 1';
      mockService1.category = ServiceCategory.HOME;
      mockService1.price = 50;
      mockService1.providerId = 1;

      const mockService2 = new Service();
      mockService2.id = 2;
      mockService2.title = 'Service 2';
      mockService2.description = 'Description 2';
      mockService2.category = ServiceCategory.OUTDOOR;
      mockService2.price = 75;
      mockService2.providerId = 1;

      const mockServices: Service[] = [mockService1, mockService2];

      service.getMyServices().subscribe(services => {
        expect(services).toEqual(mockServices);
      });

      const req = httpMock.expectOne('http://test-api.example.com/api/services/my-services');
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.has('Authorization')).toBeTrue();
      req.flush(mockServices);
    });

    it('should get my services without token', () => {
      spyOn(localStorage, 'getItem').and.returnValue(null);
      spyOn(console, 'warn').and.stub();
      spyOn(console, 'log').and.stub();

      const mockServices: Service[] = [];

      service.getMyServices().subscribe(services => {
        expect(services).toEqual(mockServices);
      });

      const req = httpMock.expectOne('http://test-api.example.com/api/services/my-services');
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.has('Authorization')).toBeFalse();
      req.flush(mockServices);
    });
  });

  describe('getUserServices', () => {
    it('should get user services with token', () => {
      spyOn(localStorage, 'getItem').and.callFake((key: string) => {
        return key === 'token' ? 'mock-token' : null;
      });
      spyOn(console, 'log').and.stub();

      const mockService = new Service();
      mockService.id = 1;
      mockService.title = 'User Service 1';
      mockService.description = 'Description 1';
      mockService.category = ServiceCategory.HOME;
      mockService.price = 50;
      mockService.providerId = 1;

      const mockServices: Service[] = [mockService];

      service.getUserServices(1).subscribe(services => {
        expect(services).toEqual(mockServices);
      });

      const req = httpMock.expectOne('http://test-api.example.com/api/users/1/services');
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.has('Authorization')).toBeTrue();
      req.flush(mockServices);
    });

    it('should get user services without token', () => {
      spyOn(localStorage, 'getItem').and.returnValue(null);
      spyOn(console, 'warn').and.stub();
      spyOn(console, 'log').and.stub();

      const mockServices: Service[] = [];

      service.getUserServices(1).subscribe(services => {
        expect(services).toEqual(mockServices);
      });

      const req = httpMock.expectOne('http://test-api.example.com/api/users/1/services');
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.has('Authorization')).toBeFalse();
      req.flush(mockServices);
    });
  });

  describe('createService', () => {
    it('should create service with token', () => {
      spyOn(localStorage, 'getItem').and.callFake((key: string) => {
        return key === 'token' ? 'mock-token' : null;
      });
      spyOn(console, 'log').and.stub();

      const newService = new Service();
      newService.title = 'New Service';
      newService.description = 'New Description';
      newService.category = ServiceCategory.HOME;
      newService.price = 100;
      newService.providerId = 1;

      const createdService = new Service();
      createdService.id = 1;
      createdService.title = 'New Service';
      createdService.description = 'New Description';
      createdService.category = ServiceCategory.HOME;
      createdService.price = 100;
      createdService.providerId = 1;

      service.createService(newService).subscribe(service => {
        expect(service).toEqual(createdService);
      });

      const req = httpMock.expectOne('http://test-api.example.com/api/services');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newService);
      expect(req.request.headers.has('Authorization')).toBeTrue();
      req.flush(createdService);
    });

    it('should create service without token', () => {
      spyOn(localStorage, 'getItem').and.returnValue(null);
      spyOn(console, 'warn').and.stub();
      spyOn(console, 'log').and.stub();

      const newService = new Service();
      newService.title = 'New Service';
      newService.description = 'New Description';
      newService.category = ServiceCategory.HOME;
      newService.price = 100;
      newService.providerId = 1;

      const createdService = new Service();
      createdService.id = 1;
      createdService.title = 'New Service';
      createdService.description = 'New Description';
      createdService.category = ServiceCategory.HOME;
      createdService.price = 100;
      createdService.providerId = 1;

      service.createService(newService).subscribe(service => {
        expect(service).toEqual(createdService);
      });

      const req = httpMock.expectOne('http://test-api.example.com/api/services');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newService);
      expect(req.request.headers.has('Authorization')).toBeFalse();
      req.flush(createdService);
    });
  });

  describe('updateService', () => {
    it('should update service with token', () => {
      spyOn(localStorage, 'getItem').and.callFake((key: string) => {
        return key === 'token' ? 'mock-token' : null;
      });
      spyOn(console, 'log').and.stub();

      const serviceToUpdate = new Service();
      serviceToUpdate.title = 'Updated Service';
      serviceToUpdate.description = 'Updated Description';
      serviceToUpdate.category = ServiceCategory.OUTDOOR;
      serviceToUpdate.price = 150;
      serviceToUpdate.providerId = 1;

      const updatedService = new Service();
      updatedService.id = 1;
      updatedService.title = 'Updated Service';
      updatedService.description = 'Updated Description';
      updatedService.category = ServiceCategory.OUTDOOR;
      updatedService.price = 150;
      updatedService.providerId = 1;

      service.updateService(1, serviceToUpdate).subscribe(service => {
        expect(service).toEqual(updatedService);
      });

      const req = httpMock.expectOne('http://test-api.example.com/api/services/1');
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(serviceToUpdate);
      expect(req.request.headers.has('Authorization')).toBeTrue();
      req.flush(updatedService);
    });

    it('should update service without token', () => {
      spyOn(localStorage, 'getItem').and.returnValue(null);
      spyOn(console, 'warn').and.stub();
      spyOn(console, 'log').and.stub();

      const serviceToUpdate = new Service();
      serviceToUpdate.title = 'Updated Service';
      serviceToUpdate.description = 'Updated Description';
      serviceToUpdate.category = ServiceCategory.OUTDOOR;
      serviceToUpdate.price = 150;
      serviceToUpdate.providerId = 1;

      const updatedService = new Service();
      updatedService.id = 1;
      updatedService.title = 'Updated Service';
      updatedService.description = 'Updated Description';
      updatedService.category = ServiceCategory.OUTDOOR;
      updatedService.price = 150;
      updatedService.providerId = 1;

      service.updateService(1, serviceToUpdate).subscribe(service => {
        expect(service).toEqual(updatedService);
      });

      const req = httpMock.expectOne('http://test-api.example.com/api/services/1');
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(serviceToUpdate);
      expect(req.request.headers.has('Authorization')).toBeFalse();
      req.flush(updatedService);
    });
  });

  describe('deleteService', () => {
    it('should delete service with token', () => {
      spyOn(localStorage, 'getItem').and.callFake((key: string) => {
        return key === 'token' ? 'mock-token' : null;
      });
      spyOn(console, 'log').and.stub();

      service.deleteService(1).subscribe(() => {
        // Service deleted successfully
      });

      const req = httpMock.expectOne('http://test-api.example.com/api/services/1');
      expect(req.request.method).toBe('DELETE');
      expect(req.request.headers.has('Authorization')).toBeTrue();
      req.flush(null);
    });

    it('should delete service without token', () => {
      spyOn(localStorage, 'getItem').and.returnValue(null);
      spyOn(console, 'warn').and.stub();
      spyOn(console, 'log').and.stub();

      service.deleteService(1).subscribe(() => {
        // Service deleted successfully
      });

      const req = httpMock.expectOne('http://test-api.example.com/api/services/1');
      expect(req.request.method).toBe('DELETE');
      expect(req.request.headers.has('Authorization')).toBeFalse();
      req.flush(null);
    });
  });
});
