import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Service, ServiceCategory } from '../../../../../models/Service';

import { DisplayProfileServicesComponent } from './display-profile-services.component';

describe('DisplayProfileServicesComponent', () => {
  let component: DisplayProfileServicesComponent;
  let fixture: ComponentFixture<DisplayProfileServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayProfileServicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayProfileServicesComponent);
    component = fixture.componentInstance;
    
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
});
