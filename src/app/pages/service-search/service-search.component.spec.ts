import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServiceSearchComponent } from './service-search.component';
import { ServicesService } from '../../services/services/services.service';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceCategory } from '../../models/Service';

class MockServicesService {
  searchServices = jasmine.createSpy().and.returnValue(of([]));
}

class MockRouter {
  navigate = jasmine.createSpy();
  events = of({});
  url = '/test';
  createUrlTree = jasmine.createSpy('createUrlTree').and.returnValue({});
  parseUrl = jasmine.createSpy('parseUrl').and.returnValue({});
  serializeUrl = jasmine.createSpy('serializeUrl').and.returnValue('');
  createUrlTreeFromSegment = jasmine.createSpy('createUrlTreeFromSegment').and.returnValue({});
  routerState = {
    snapshot: {
      root: {
        children: []
      }
    }
  };
}

class MockActivatedRoute {
  url = of([]);
  params = of({});
  queryParams = of({});
  fragment = of('');
  data = of({});
  outlet = 'primary';
  component = null;
  snapshot = {
    url: [],
    params: {},
    queryParams: {},
    fragment: '',
    data: {},
    outlet: 'primary',
    component: null
  };
}

describe('ServiceSearchComponent', () => {
  let component: ServiceSearchComponent;
  let fixture: ComponentFixture<ServiceSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ServiceSearchComponent,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: ServicesService, useClass: MockServicesService },
        { provide: Router, useClass: MockRouter },
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('isPostalCodeValid', () => {
    it('should return true for valid postal code', () => {
      component.postalCode = '75001';
      expect(component.isPostalCodeValid).toBeTrue();
    });

    it('should return false for postal code with less than 5 digits', () => {
      component.postalCode = '1234';
      expect(component.isPostalCodeValid).toBeFalse();
    });
  });

  describe('isFormValid', () => {
    beforeEach(() => {
      const now = new Date();
      component.selectedDay = now.getDate();
      component.selectedMonth = component.months[now.getMonth()];
      component.selectedYear = now.getFullYear();
      component.selectedStartHour = '10:00';
      component.selectedEndHour = '12:00';
      component.selectedService = 'HOME';
      component.postalCode = '75001';
    });

    it('should return true when all fields are valid', () => {
      expect(component.isFormValid()).toBeTrue();
    });

    it('should return false when hour range is invalid', () => {
      component.selectedStartHour = '12:00';
      component.selectedEndHour = '10:00';
      expect(component.isFormValid()).toBeFalse();
    });

    it('should return false when postal code is invalid', () => {
      component.postalCode = '000';
      expect(component.isFormValid()).toBeFalse();
    });
  });

  describe('findProviders', () => {
    let searchSpy: jasmine.Spy;
    let navigateSpy: jasmine.Spy;

    beforeEach(() => {
      const today = new Date();
      component.selectedDay = today.getDate();
      component.selectedMonth = component.months[today.getMonth()];
      component.selectedYear = today.getFullYear();
      component.selectedStartHour = '10:00';
      component.selectedEndHour = '12:00';
      component.selectedService = 'HOME';
      component.postalCode = '75001';

      searchSpy = TestBed.inject(ServicesService).searchServices as jasmine.Spy;
      navigateSpy = TestBed.inject(Router).navigate as jasmine.Spy;

      spyOn(localStorage, 'setItem');
      spyOn(window, 'alert');
    });

    it('should call service and navigate if form is valid', () => {
      // Simuler un token d'authentification
      spyOn(localStorage, 'getItem').and.returnValue('mock-token');
      
      component.findProviders();

      expect(searchSpy).toHaveBeenCalled();
      expect(localStorage.setItem).toHaveBeenCalledWith('searchResults', jasmine.any(String));
      expect(localStorage.setItem).toHaveBeenCalledWith('searchCriteria', jasmine.any(String));
      expect(navigateSpy).toHaveBeenCalledWith(['/available-providers']);
    });

    it('should alert if postal code is invalid', () => {
      component.postalCode = '12';
      component.findProviders();
      expect(window.alert).toHaveBeenCalledWith('Veuillez saisir un code postal valide.');
    });

    it('should alert if date is in the past', () => {
      const past = new Date();
      past.setDate(past.getDate() - 2);
      component.selectedDay = past.getDate();
      component.selectedMonth = component.months[past.getMonth()];
      component.selectedYear = past.getFullYear();

      component.findProviders();
      expect(window.alert).toHaveBeenCalledWith('La date sélectionnée ne peut pas être dans le passé.');
    });

    it('should alert if form is invalid', () => {
      component.selectedStartHour = '12:00';
      component.selectedEndHour = '10:00';
      component.findProviders();
      expect(window.alert).toHaveBeenCalledWith('Veuillez remplir tous les champs obligatoires.');
    });
  });

  describe('days getter', () => {
    it('should return correct number of days for Janvier 2025', () => {
      component.selectedMonth = 'Janvier';
      component.selectedYear = 2025;
      expect(component.days.length).toBe(31);
    });

    it('should return 28 days for Février 2025', () => {
      component.selectedMonth = 'Février';
      component.selectedYear = 2025;
      expect(component.days.length).toBe(28);
    });

    it('should return 29 days for Février 2024 (leap year)', () => {
      component.selectedMonth = 'Février';
      component.selectedYear = 2024;
      expect(component.days.length).toBe(29);
    });
  });

  describe('onStartHourChange', () => {
    it('should reset end hour if not in available end hours', () => {
      component.selectedStartHour = '10:00';
      component.selectedEndHour = '09:00'; // non valide
      component.onStartHourChange();
      expect(component.selectedEndHour).toBeUndefined();
    });

    it('should not reset end hour if still valid', () => {
      component.selectedStartHour = '10:00';
      component.selectedEndHour = '11:00'; // valide
      component.onStartHourChange();
      expect(component.selectedEndHour).toBe('11:00');
    });
  });

  describe('onMonthChange', () => {
    it('should reset day if not in available days after month change', () => {
      component.selectedDay = 31;
      component.selectedMonth = 'Février';
      component.selectedYear = 2025;
      component.onMonthChange();
      expect(component.selectedDay).toBeUndefined();
    });

    it('should keep day if still valid after month change', () => {
      component.selectedDay = 28;
      component.selectedMonth = 'Février';
      component.selectedYear = 2025;
      component.onMonthChange();
      expect(component.selectedDay).toBe(28);
    });
  });

  describe('onYearChange', () => {
    it('should reset day if not in available days after year change', () => {
      component.selectedDay = 29;
      component.selectedMonth = 'Février';
      component.selectedYear = 2023; // pas bissextile
      component.onYearChange();
      expect(component.selectedDay).toBeUndefined();
    });

    it('should keep day if still valid after year change', () => {
      component.selectedDay = 29;
      component.selectedMonth = 'Février';
      component.selectedYear = 2024; // bissextile
      component.onYearChange();
      expect(component.selectedDay).toBe(29);
    });
  });

  describe('isHourRangeValid', () => {
    it('should return true if end hour is after start hour', () => {
      component.selectedStartHour = '10:00';
      component.selectedEndHour = '11:00';
      expect(component.isHourRangeValid).toBeTrue();
    });

    it('should return false if end hour is before start hour', () => {
      component.selectedStartHour = '11:00';
      component.selectedEndHour = '10:00';
      expect(component.isHourRangeValid).toBeFalse();
    });

    it('should return true if start or end hour is missing', () => {
      component.selectedStartHour = undefined;
      component.selectedEndHour = undefined;
      expect(component.isHourRangeValid).toBeTrue();
    });
  });

  describe('isDateValid', () => {
    it('should return false if selected date is in the past', () => {
      const past = new Date();
      past.setDate(past.getDate() - 1);
      component.selectedDay = past.getDate();
      component.selectedMonth = component.months[past.getMonth()];
      component.selectedYear = past.getFullYear();
      expect(component.isDateValid).toBeFalse();
    });

    it('should return true if selected date is today or future', () => {
      const future = new Date();
      future.setDate(future.getDate() + 1);
      component.selectedDay = future.getDate();
      component.selectedMonth = component.months[future.getMonth()];
      component.selectedYear = future.getFullYear();
      expect(component.isDateValid).toBeTrue();
    });

    it('should return true if date is incomplete', () => {
      component.selectedDay = undefined;
      component.selectedMonth = undefined;
      component.selectedYear = undefined;
      expect(component.isDateValid).toBeTrue();
    });
  });

  describe('findProviders errors', () => {
    it('should handle form validation errors', () => {
      // Simuler un token d'authentification
      spyOn(localStorage, 'getItem').and.returnValue('mock-token');
      
      // Rendre le formulaire invalide
      component.selectedDay = undefined;
      component.selectedMonth = undefined;
      component.selectedYear = undefined;
      component.selectedStartHour = undefined;
      component.selectedEndHour = undefined;
      component.selectedService = undefined;
      component.postalCode = '';
      
      spyOnProperty(component, 'isDateValid', 'get').and.returnValue(false);
      spyOnProperty(component, 'isPostalCodeValid', 'get').and.returnValue(false);
      spyOn(window, 'alert');

      component.findProviders();

      expect(window.alert).toHaveBeenCalledWith('Veuillez saisir un code postal valide.');
    });
  });

});
