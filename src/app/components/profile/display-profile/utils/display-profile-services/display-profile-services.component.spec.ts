import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Service, ServiceCategory } from '../../../../../models/Service';
import { IconService } from '../../../../../services/icon/icon.service';
import { DisplayProfileServicesComponent } from './display-profile-services.component';

describe('DisplayProfileServicesComponent', () => {
  let component: DisplayProfileServicesComponent;
  let fixture: ComponentFixture<DisplayProfileServicesComponent>;
  let iconService: jasmine.SpyObj<IconService>;

  beforeEach(async () => {
    const iconServiceSpy = jasmine.createSpyObj('IconService', ['getIcon']);

    await TestBed.configureTestingModule({
      imports: [DisplayProfileServicesComponent],
      providers: [
        { provide: IconService, useValue: iconServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayProfileServicesComponent);
    component = fixture.componentInstance;
    iconService = TestBed.inject(IconService) as jasmine.SpyObj<IconService>;

    component.services = [
      {
        id: 1,
        title: 'Service de test',
        description: 'Description du service',
        category: ServiceCategory.HOME,
        price: 50,
        providerId: 1
      } as Service
    ];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display services when provided', () => {
    expect(component.services).toBeDefined();
    expect(component.services.length).toBe(1);
    expect(component.services[0].title).toBe('Service de test');
  });

  it('should handle empty services array', () => {
    component.services = [];
    fixture.detectChanges();
    expect(component.services).toBeDefined();
    expect(component.services.length).toBe(0);
  });

  it('should display multiple services', () => {
    component.services = [
      {
        id: 1,
        title: 'Service 1',
        description: 'Description 1',
        category: ServiceCategory.HOME,
        price: 50,
        providerId: 1
      } as Service,
      {
        id: 2,
        title: 'Service 2',
        description: 'Description 2',
        category: ServiceCategory.OUTDOOR,
        price: 75,
        providerId: 1
      } as Service
    ];
    fixture.detectChanges();

    expect(component.services.length).toBe(2);
  });

  it('should call iconService.getIcon for each service', () => {
    iconService.getIcon.and.returnValue('home');

    component.services = [
      {
        id: 1,
        title: 'Service 1',
        description: 'Description 1',
        category: ServiceCategory.HOME,
        price: 50,
        providerId: 1
      } as Service
    ];
    fixture.detectChanges();

    expect(iconService.getIcon).toHaveBeenCalledWith(ServiceCategory.HOME);
  });
});
