import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserInformationService } from './user-information.service';
import { User, UserRole } from '../models/User';

describe('UserInformationService', () => {
  let service: UserInformationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserInformationService]
    });
    service = TestBed.inject(UserInformationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get user by id', () => {
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

    const req = httpMock.expectOne('http://localhost:8080/api/users/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should get user profile', () => {
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
      profilePicture: 'client.jpg'
    });

    service.getUserProfile().subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/users/profile');
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should get users by ids', () => {
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
        profilePicture: 'profile.jpg',
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
        profilePicture: 'jane.jpg',
        companyName: 'Jane Services',
        siretSiren: '98765432109876'
      })
    ];

    const userIds = [1, 2];

    service.getUsersByIds(userIds).subscribe(users => {
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/users/batch');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ userIds });
    req.flush(mockUsers);
  });
}); 