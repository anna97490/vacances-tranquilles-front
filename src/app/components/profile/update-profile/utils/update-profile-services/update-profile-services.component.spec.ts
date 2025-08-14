import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { UpdateProfileServicesComponent } from './update-profile-services.component';
import { UserInformationService } from '../../../../../services/user-information/user-information.service';
import { EnvService } from '../../../../../services/env/env.service';
import { Service, ServiceCategory } from '../../../../../models/Service';

describe('UpdateProfileServicesComponent', () => {
  let component: UpdateProfileServicesComponent;
  let fixture: ComponentFixture<UpdateProfileServicesComponent>;
  let mockUserInformationService: jasmine.SpyObj<UserInformationService>;
  let mockEnvService: jasmine.SpyObj<EnvService>;

  beforeEach(async () => {
    const userInfoSpy = jasmine.createSpyObj('UserInformationService', [
      'createService', 'updateService', 'deleteService'
    ]);
    const envSpy = jasmine.createSpyObj('EnvService', [], { apiUrl: 'http://test-api.com' });

    await TestBed.configureTestingModule({
      imports: [
        UpdateProfileServicesComponent,
        HttpClientTestingModule,
        MatSnackBarModule,
        MatDialogModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: UserInformationService, useValue: userInfoSpy },
        { provide: EnvService, useValue: envSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateProfileServicesComponent);
    component = fixture.componentInstance;
    mockUserInformationService = TestBed.inject(UserInformationService) as jasmine.SpyObj<UserInformationService>;
    mockEnvService = TestBed.inject(EnvService) as jasmine.SpyObj<EnvService>;
    
    // Setup default spy returns
    const mockService: Service = {
      id: 1,
      title: 'Test Service',
      description: 'Test Description',
      category: ServiceCategory.HOME,
      price: 50,
      providerId: 1
    };
    
    mockUserInformationService.createService.and.returnValue(of(mockService));
    mockUserInformationService.updateService.and.returnValue(of(mockService));
    mockUserInformationService.deleteService.and.returnValue(of(void 0));
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
