import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ReservationListComponent } from './reservation-list.component';
import { ReservationService } from '../../services/reservation.service';

describe('ReservationListComponent', () => {
  let component: ReservationListComponent;
  let fixture: ComponentFixture<ReservationListComponent>;
  let reservationService: jasmine.SpyObj<ReservationService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ReservationService', ['getReservations']);

    await TestBed.configureTestingModule({
      imports: [
        ReservationListComponent,
        HttpClientTestingModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatCardModule,
        MatButtonModule,
        MatInputModule,
        MatIconModule,
        MatChipsModule,
        MatPaginatorModule,
        MatProgressSpinnerModule
      ],
      providers: [
        { provide: ReservationService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReservationListComponent);
    component = fixture.componentInstance;
    reservationService = TestBed.inject(ReservationService) as jasmine.SpyObj<ReservationService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load reservations on init', () => {
    const mockReservations = {
      reservations: [],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10
      }
    };

    reservationService.getReservations.and.returnValue(jasmine.createSpyObj('Observable', ['subscribe']));

    component.ngOnInit();

    expect(reservationService.getReservations).toHaveBeenCalled();
  });

  it('should format date correctly', () => {
    const testDate = '2024-01-15T10:00:00';
    const formattedDate = component.formatDate(testDate);
    
    expect(formattedDate).toContain('15');
    expect(formattedDate).toContain('jan');
    expect(formattedDate).toContain('2024');
  });

  it('should format price correctly', () => {
    const testPrice = 850.50;
    const formattedPrice = component.formatPrice(testPrice);
    
    expect(formattedPrice).toContain('850,50');
    expect(formattedPrice).toContain('€');
  });

  it('should get full name correctly', () => {
    const user = { firstName: 'Antoine', lastName: 'Bayern' };
    const fullName = component.getFullName(user);
    
    expect(fullName).toBe('Antoine Bayern');
  });

  it('should handle null user in getFullName', () => {
    const fullName = component.getFullName(undefined);
    
    expect(fullName).toBe('Utilisateur inconnu');
  });

  it('should get status display correctly', () => {
    expect(component.getStatusDisplay('CONFIRMEE')).toBe('Confirmée');
    expect(component.getStatusDisplay('EN_ATTENTE')).toBe('En attente');
    expect(component.getStatusDisplay('ANNULEE')).toBe('Annulée');
    expect(component.getStatusDisplay('UNKNOWN')).toBe('UNKNOWN');
  });

  it('should get status class correctly', () => {
    expect(component.getStatusClass('CONFIRMEE')).toBe('status-confirmed');
    expect(component.getStatusClass('EN_ATTENTE')).toBe('status-pending');
    expect(component.getStatusClass('ANNULEE')).toBe('status-cancelled');
    expect(component.getStatusClass('UNKNOWN')).toBe('status-default');
  });

  it('should get sort icon correctly', () => {
    component.currentSort = 'date';
    component.currentSortOrder = 'desc';
    
    expect(component.getSortIcon('date')).toBe('keyboard_arrow_down');
    expect(component.getSortIcon('price')).toBe('');
  });

  it('should handle search control changes', (done) => {
    const mockReservations = {
      reservations: [],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10
      }
    };

    reservationService.getReservations.and.returnValue(jasmine.createSpyObj('Observable', ['subscribe']));

    component.ngOnInit();
    
    // Simuler un changement dans le champ de recherche
    component.searchControl.setValue('test');
    
    setTimeout(() => {
      expect(reservationService.getReservations).toHaveBeenCalled();
      done();
    }, 350); // Attendre le debounce
  });
}); 