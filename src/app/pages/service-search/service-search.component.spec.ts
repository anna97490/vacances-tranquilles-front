import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServiceSearchComponent } from './service-search.component';
import { ServicesService } from '../../services/services/services.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceCategory } from '../../models/Service';

class MockServicesService {
  searchServices = jasmine.createSpy().and.returnValue(of([]));
}

class MockRouter {
  navigate = jasmine.createSpy();
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
        { provide: Router, useClass: MockRouter }
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

    it('should return false for postal code with letters', () => {
      component.postalCode = '75A01';
      expect(component.isPostalCodeValid).toBeFalse();
    });

    it('should return false for empty postal code', () => {
      component.postalCode = '';
      expect(component.isPostalCodeValid).toBeFalse();
    });
  });

  describe('isHourRangeValid', () => {
    it('should return true when end hour is after start hour', () => {
      component.selectedStartHour = '10:00';
      component.selectedEndHour = '12:00';
      expect(component.isHourRangeValid).toBeTrue();
    });

    it('should return false when end hour is before start hour', () => {
      component.selectedStartHour = '14:00';
      component.selectedEndHour = '11:00';
      expect(component.isHourRangeValid).toBeFalse();
    });

    it('should return false when start hour is equal to end hour', () => {
      component.selectedStartHour = '09:00';
      component.selectedEndHour = '09:00';
      expect(component.isHourRangeValid).toBeFalse();
    });

    it('should return true when start hour is undefined', () => {
      component.selectedStartHour = undefined;
      component.selectedEndHour = '10:00';
      expect(component.isHourRangeValid).toBeTrue();
    });

    it('should return true when end hour is undefined', () => {
      component.selectedStartHour = '08:00';
      component.selectedEndHour = undefined;
      expect(component.isHourRangeValid).toBeTrue();
    });
  });

  describe('isFormValid', () => {
    beforeEach(() => {
      // Remplir tous les champs avec des valeurs valides par défaut
      component.selectedDay = 1;
      component.selectedMonth = 'Janvier';
      component.selectedYear = 2025;
      component.selectedStartHour = '10:00';
      component.selectedEndHour = '11:00';
      component.selectedService = 'Plomberie';
      component.postalCode = '75001';
    });

    it('should return true when all fields are valid', () => {
      expect(component.isFormValid()).toBeTrue();
    });

    it('should return false when postal code is invalid', () => {
      component.postalCode = '123'; // invalide
      expect(component.isFormValid()).toBeFalse();
    });

    it('should return false when hour range is invalid', () => {
      component.selectedStartHour = '12:00';
      component.selectedEndHour = '10:00'; // fin avant début
      expect(component.isFormValid()).toBeFalse();
    });

    it('should return false when a required field is missing (e.g. selectedDay)', () => {
      component.selectedDay = undefined!;
      expect(component.isFormValid()).toBeFalse();
    });

    it('should return false when selectedService is missing', () => {
      component.selectedService = undefined!;
      expect(component.isFormValid()).toBeFalse();
    });
  });

  describe('format Date', () => {
    it('should return correct date string in format YYYY-MM-DD', () => {
      component.selectedDay = 5;
      component.selectedMonth = 'Mars';
      component.selectedYear = 2025;

      const result = (component as any).formatDate();
      expect(result).toBe('2025-03-05');
    });

    it('should throw error if selectedDay is missing', () => {
      component.selectedDay = undefined!;
      component.selectedMonth = 'Mars';
      component.selectedYear = 2025;

      expect(() => (component as any).formatDate()).toThrowError('Date incomplète');
    });

    it('should throw error if selectedMonth is missing', () => {
      component.selectedDay = 5;
      component.selectedMonth = undefined!;
      component.selectedYear = 2025;

      expect(() => (component as any).formatDate()).toThrowError('Date incomplète');
    });

    it('should throw error if selectedYear is missing', () => {
      component.selectedDay = 5;
      component.selectedMonth = 'Mars';
      component.selectedYear = undefined!;

      expect(() => (component as any).formatDate()).toThrowError('Date incomplète');
    });

    it('should generate hours from 08:00 to 20:00', () => {
      expect(component.hours).toEqual([
        '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
        '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
      ]);
    });

  });

  describe('find providers', () => {
    let searchSpy: jasmine.Spy;
    let navigateSpy: jasmine.Spy;

    beforeEach(() => {
      // Remplir tous les champs valides
      component.selectedDay = 10;
      component.selectedMonth = 'Janvier';
      component.selectedYear = 2025;
      component.selectedStartHour = '10:00';
      component.selectedEndHour = '12:00';
      component.selectedService = 'Plomberie';
      component.postalCode = '75001';

      // Spies
      searchSpy = (TestBed.inject(ServicesService) as any).searchServices;
      navigateSpy = (TestBed.inject(Router) as any).navigate;

      // Spy localStorage
      spyOn(localStorage, 'setItem');
    });

    it('should call searchServices and navigate if form is valid', () => {
      component.findProviders();

      expect(searchSpy).toHaveBeenCalledWith(
        'Plomberie',
        '75001',
        '2025-01-10',
        '10:00',
        '12:00'
      );

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'searchResults',
        jasmine.any(String)
      );

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'searchCriteria',
        jasmine.any(String)
      );

      expect(navigateSpy).toHaveBeenCalledWith(['/avalaible-providers']);
    });

    it('should not call service or navigate if postal code is invalid', () => {
      component.postalCode = '123'; // invalide

      spyOn(window, 'alert');
      component.findProviders();

      expect(searchSpy).not.toHaveBeenCalled();
      expect(navigateSpy).not.toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('Veuillez saisir un code postal valide.');
    });

    it('should not call service or navigate if form is invalid', () => {
      component.selectedStartHour = '12:00';
      component.selectedEndHour = '10:00'; // invalide (heure de fin avant début)

      spyOn(window, 'alert');
      component.findProviders();

      expect(searchSpy).not.toHaveBeenCalled();
      expect(navigateSpy).not.toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('Veuillez remplir tous les champs obligatoires.');
    });
  });

  describe('days getter', () => {
    it('should return 31 days for Janvier 2025', () => {
      component.selectedMonth = 'Janvier';
      component.selectedYear = 2025;
      expect(component.days.length).toBe(31);
    });

    it('should return 29 days for Février 2024 (année bissextile)', () => {
      component.selectedMonth = 'Février';
      component.selectedYear = 2024;
      expect(component.days.length).toBe(29);
    });

    it('should return 28 days for Février 2025', () => {
      component.selectedMonth = 'Février';
      component.selectedYear = 2025;
      expect(component.days.length).toBe(28);
    });

    it('should return 31 days if month is undefined', () => {
      component.selectedMonth = undefined;
      expect(component.days.length).toBe(31);
    });
  });

  describe('hour getter', () => {
    it('should generate hours from 08:00 to 20:00', () => {
      expect(component.hours).toEqual([
        '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
        '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
      ]);
    });
  });

  describe('services getter', () => {
    it('should have services from ServiceCategory enum', () => {
      const values = Object.values(ServiceCategory);
      expect(component.services).toEqual(values);
    });
  });

});
