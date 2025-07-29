import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DebugElement } from '@angular/core';

import { ReservationDetailComponent, ReservationDetail, ReservationAction } from './reservation-detail.component';

describe('ReservationDetailComponent', () => {
  let component: ReservationDetailComponent;
  let fixture: ComponentFixture<ReservationDetailComponent>;

  const mockReservation: ReservationDetail = {
    id: 'res-123',
    date: '2024-12-25',
    time: '14:30',
    clientName: 'Ashfak Sayem',
    location: 'Paris, France',
    serviceDescription: 'Service professionnel avec une attention particulière aux détails.',
    status: 'CONFIRMED'
  };

  const mockPendingReservation: ReservationDetail = {
    ...mockReservation,
    id: 'res-pending',
    status: 'PENDING'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReservationDetailComponent,
        NoopAnimationsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReservationDetailComponent);
    component = fixture.componentInstance;
  });

  beforeEach(() => {
    // Supprimer tous les logs console pour les tests
    spyOn(console, 'warn').and.stub();
    spyOn(console, 'error').and.stub();
    spyOn(console, 'log').and.stub();
  });

  afterEach(() => {
    fixture.destroy();
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.reservation).toBeNull();
      expect(component.showActions).toBeTrue();
      expect(component.readonly).toBeFalse();
    });

    it('should have status configuration defined', () => {
      expect(component.statusConfig).toBeDefined();
      expect(component.statusConfig['PENDING']).toEqual({
        label: 'En attente',
        color: 'warn',
        icon: 'schedule'
      });
      expect(component.statusConfig['CONFIRMED']).toEqual({
        label: 'Confirmé',
        color: 'primary',
        icon: 'check_circle'
      });
    });

    it('should emit reservationLoaded when reservation is provided on init', () => {
      spyOn(component.reservationLoaded, 'emit');
      component.reservation = mockReservation;
      
      component.ngOnInit();
      
      expect(component.reservationLoaded.emit).toHaveBeenCalledWith(mockReservation);
    });

    it('should not emit reservationLoaded when no reservation on init', () => {
      spyOn(component.reservationLoaded, 'emit');
      component.reservation = null;
      
      component.ngOnInit();
      
      expect(component.reservationLoaded.emit).not.toHaveBeenCalled();
    });
  });

  describe('Template Rendering', () => {
    it('should display no reservation template when reservation is null', () => {
      component.reservation = null;
      fixture.detectChanges();

      const noReservationCard = fixture.debugElement.query(By.css('.no-reservation-card'));
      const reservationCard = fixture.debugElement.query(By.css('.reservation-detail-card'));

      expect(noReservationCard).toBeTruthy();
      expect(reservationCard).toBeFalsy();
      expect(noReservationCard.nativeElement.textContent).toContain('Aucune réservation sélectionnée');
    });

    it('should display reservation details when reservation is provided', () => {
      component.reservation = mockReservation;
      fixture.detectChanges();

      const reservationCard = fixture.debugElement.query(By.css('.reservation-detail-card'));
      const noReservationCard = fixture.debugElement.query(By.css('.no-reservation-card'));

      expect(reservationCard).toBeTruthy();
      expect(noReservationCard).toBeFalsy();
    });

    it('should display correct reservation information', () => {
      component.reservation = mockReservation;
      fixture.detectChanges();

      const clientName = fixture.debugElement.query(By.css('[data-testid="client-name"]'));
      const location = fixture.debugElement.query(By.css('[data-testid="location"]'));
      const serviceDescription = fixture.debugElement.query(By.css('[data-testid="service-description"]'));

      expect(clientName.nativeElement.textContent.trim()).toBe('Ashfak Sayem');
      expect(location.nativeElement.textContent.trim()).toBe('Paris, France');
      expect(serviceDescription.nativeElement.textContent.trim()).toBe('Service professionnel avec une attention particulière aux détails.');
    });

    it('should display status chip with correct configuration', () => {
      component.reservation = mockReservation;
      fixture.detectChanges();

      const statusChip = fixture.debugElement.query(By.css('[data-testid="status-chip"]'));
      expect(statusChip).toBeTruthy();
      expect(statusChip.nativeElement.textContent).toContain('Confirmé');
    });

    it('should hide actions when showActions is false', () => {
      component.reservation = mockReservation;
      component.showActions = false;
      fixture.detectChanges();

      const actionsSection = fixture.debugElement.query(By.css('.reservation-actions'));
      expect(actionsSection).toBeFalsy();
    });

    it('should show actions when showActions is true', () => {
      component.reservation = mockPendingReservation;
      component.showActions = true;
      fixture.detectChanges();

      const actionsSection = fixture.debugElement.query(By.css('.reservation-actions'));
      expect(actionsSection).toBeTruthy();
    });
  });

  describe('Date and Time Formatting', () => {
    it('should format valid date correctly', () => {
      const formattedDate = component.getFormattedDate('2024-12-25');
      expect(formattedDate).toBe('25/12/2024');
    });

    it('should handle invalid date', () => {
      const invalidDate = component.getFormattedDate('invalid-date');
      expect(invalidDate).toBe('invalid-date');
    });

    it('should handle empty date', () => {
      const emptyDate = component.getFormattedDate('00/00/00');
      expect(emptyDate).toBe('Date non définie');
    });

    it('should format time correctly from HH:MM format', () => {
      const formattedTime = component.getFormattedTime('14:30');
      expect(formattedTime).toBe('14h30');
    });

    it('should keep time in XXhXX format unchanged', () => {
      const formattedTime = component.getFormattedTime('14h30');
      expect(formattedTime).toBe('14h30');
    });

    it('should handle empty time', () => {
      const emptyTime = component.getFormattedTime('00h00');
      expect(emptyTime).toBe('Heure non définie');
    });

    it('should handle unknown time format', () => {
      const unknownTime = component.getFormattedTime('unknown');
      expect(unknownTime).toBe('unknown');
    });
  });

  describe('Status Configuration', () => {
    it('should return correct config for known status', () => {
      const config = component.getStatusConfig('PENDING');
      expect(config).toEqual({
        label: 'En attente',
        color: 'warn',
        icon: 'schedule'
      });
    });

    it('should return default config for unknown status', () => {
      const config = component.getStatusConfig('UNKNOWN');
      expect(config).toEqual({
        label: 'UNKNOWN',
        color: 'primary',
        icon: 'info'
      });
    });

    it('should have config for all expected statuses', () => {
      const statuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];
      statuses.forEach(status => {
        const config = component.getStatusConfig(status);
        expect(config.label).toBeDefined();
        expect(config.color).toBeDefined();
        expect(config.icon).toBeDefined();
      });
    });
  });

  describe('Action Permissions', () => {
    it('should allow cancel action for PENDING status', () => {
      component.reservation = mockPendingReservation;
      expect(component.isActionAllowed('cancel')).toBeTrue();
    });

    it('should allow cancel action for CONFIRMED status', () => {
      component.reservation = mockReservation; // CONFIRMED status
      expect(component.isActionAllowed('cancel')).toBeTrue();
    });

    it('should not allow cancel action for COMPLETED status', () => {
      component.reservation = { ...mockReservation, status: 'COMPLETED' };
      expect(component.isActionAllowed('cancel')).toBeFalse();
    });

    it('should allow validate action for PENDING status', () => {
      component.reservation = mockPendingReservation;
      expect(component.isActionAllowed('validate')).toBeTrue();
    });

    it('should not allow validate action for CONFIRMED status', () => {
      component.reservation = mockReservation; // CONFIRMED status
      expect(component.isActionAllowed('validate')).toBeFalse();
    });

    it('should not allow any action in readonly mode', () => {
      component.reservation = mockPendingReservation;
      component.readonly = true;
      
      expect(component.isActionAllowed('cancel')).toBeFalse();
      expect(component.isActionAllowed('validate')).toBeFalse();
    });

    it('should not allow any action when no reservation', () => {
      component.reservation = null;
      
      expect(component.isActionAllowed('cancel')).toBeFalse();
      expect(component.isActionAllowed('validate')).toBeFalse();
    });
  });

  describe('Action Handling', () => {
    it('should emit actionClicked when valid action is clicked', () => {
      spyOn(component.actionClicked, 'emit');
      component.reservation = mockPendingReservation;
      
      component.onActionClick('validate');
      
      expect(component.actionClicked.emit).toHaveBeenCalledWith({
        action: 'validate',
        reservation: mockPendingReservation
      });
    });

    it('should not emit when action is not allowed', () => {
      spyOn(component.actionClicked, 'emit');
      component.reservation = mockReservation; // CONFIRMED, can't validate
      
      component.onActionClick('validate');
      
      expect(component.actionClicked.emit).not.toHaveBeenCalled();
    });

    it('should not emit when no reservation', () => {
      spyOn(component.actionClicked, 'emit');
      component.reservation = null;
      
      component.onActionClick('validate');
      
      expect(component.actionClicked.emit).not.toHaveBeenCalled();
    });

    it('should handle button clicks in template', () => {
      spyOn(component, 'onActionClick');
      component.reservation = mockPendingReservation;
      fixture.detectChanges();

      const validateButton = fixture.debugElement.query(By.css('[data-testid="validate-button"]'));
      validateButton.nativeElement.click();

      expect(component.onActionClick).toHaveBeenCalledWith('validate');
    });
  });

  describe('Action UI Configuration', () => {
    it('should return correct action icon', () => {
      expect(component.getActionIcon('cancel')).toBe('cancel');
      expect(component.getActionIcon('validate')).toBe('check');
      expect(component.getActionIcon('unknown' as ReservationAction)).toBe('action');
    });

    it('should return correct action label', () => {
      expect(component.getActionLabel('cancel')).toBe('Annuler');
      expect(component.getActionLabel('validate')).toBe('Valider');
      expect(component.getActionLabel('unknown' as ReservationAction)).toBe('Action');
    });

    it('should return correct action color', () => {
      expect(component.getActionColor('cancel')).toBe('warn');
      expect(component.getActionColor('validate')).toBe('primary');
      expect(component.getActionColor('unknown' as ReservationAction)).toBe('primary');
    });
  });

  describe('Tooltip Messages', () => {
    it('should return tooltip for no reservation', () => {
      component.reservation = null;
      const tooltip = component.getActionTooltip('validate');
      expect(tooltip).toBe('Aucune réservation sélectionnée');
    });

    it('should return tooltip for readonly mode', () => {
      component.reservation = mockReservation;
      component.readonly = true;
      const tooltip = component.getActionTooltip('validate');
      expect(tooltip).toBe('Mode lecture seule');
    });

    it('should return tooltip for disallowed cancel action', () => {
      component.reservation = { ...mockReservation, status: 'COMPLETED' };
      const tooltip = component.getActionTooltip('cancel');
      expect(tooltip).toBe('Impossible d\'annuler une réservation avec ce statut');
    });

    it('should return tooltip for disallowed validate action', () => {
      component.reservation = mockReservation; // CONFIRMED status
      const tooltip = component.getActionTooltip('validate');
      expect(tooltip).toBe('Impossible de valider une réservation avec ce statut');
    });

    it('should return empty tooltip for allowed action', () => {
      component.reservation = mockPendingReservation;
      const tooltip = component.getActionTooltip('validate');
      expect(tooltip).toBe('');
    });
  });

  describe('Validation Methods', () => {
    it('should return true for valid reservation', () => {
      component.reservation = mockReservation;
      expect(component.hasValidReservation()).toBeTrue();
    });

    it('should return false for null reservation', () => {
      component.reservation = null;
      expect(component.hasValidReservation()).toBeFalse();
    });

    it('should return false for reservation without id', () => {
      component.reservation = { ...mockReservation, id: '' };
      expect(component.hasValidReservation()).toBeFalse();
    });

    it('should return false for reservation without client name', () => {
      component.reservation = { ...mockReservation, clientName: '' };
      expect(component.hasValidReservation()).toBeFalse();
    });
  });

  describe('Component Lifecycle', () => {
    it('should call initializeComponent on ngOnInit', () => {
      spyOn(component as any, 'initializeComponent');
      component.ngOnInit();
      expect(component['initializeComponent']).toHaveBeenCalled();
    });

    it('should complete destroy subject on ngOnDestroy', () => {
      spyOn(component['destroy$'], 'next');
      spyOn(component['destroy$'], 'complete');
      
      component.ngOnDestroy();
      
      expect(component['destroy$'].next).toHaveBeenCalled();
      expect(component['destroy$'].complete).toHaveBeenCalled();
    });
  });

  describe('Button States', () => {
    it('should disable buttons when actions are not allowed', () => {
      component.reservation = mockReservation; // CONFIRMED - can't validate
      fixture.detectChanges();

      const validateButton = fixture.debugElement.query(By.css('[data-testid="validate-button"]'));
      expect(validateButton.nativeElement.disabled).toBeTrue();
    });

    it('should enable buttons when actions are allowed', () => {
      component.reservation = mockPendingReservation; // PENDING - can validate and cancel
      fixture.detectChanges();

      const validateButton = fixture.debugElement.query(By.css('[data-testid="validate-button"]'));
      const cancelButton = fixture.debugElement.query(By.css('[data-testid="cancel-button"]'));
      
      expect(validateButton.nativeElement.disabled).toBeFalse();
      expect(cancelButton.nativeElement.disabled).toBeFalse();
    });
  });

  describe('Edge Cases', () => {
    it('should handle reservation with minimal data', () => {
      const minimalReservation: ReservationDetail = {
        id: 'min-1',
        date: '',
        time: '',
        clientName: 'Test Client',
        location: '',
        serviceDescription: '',
        status: 'PENDING'
      };
      
      component.reservation = minimalReservation;
      fixture.detectChanges();

      expect(component.hasValidReservation()).toBeTrue();
      
      const dateElement = fixture.debugElement.query(By.css('[data-testid="reservation-date"]'));
      const timeElement = fixture.debugElement.query(By.css('[data-testid="reservation-time"]'));
      
      expect(dateElement.nativeElement.textContent.trim()).toBe('Date non définie');
      expect(timeElement.nativeElement.textContent.trim()).toBe('Heure non définie');
    });

    it('should handle all status types', () => {
      const statuses: Array<ReservationDetail['status']> = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];
      
      statuses.forEach(status => {
        component.reservation = { ...mockReservation, status };
        fixture.detectChanges();
        
        const statusChip = fixture.debugElement.query(By.css('[data-testid="status-chip"]'));
        expect(statusChip).toBeTruthy();
        expect(component.getStatusConfig(status).label).toBeDefined();
      });
    });

    it('should handle unknown action types gracefully', () => {
      const unknownAction = 'unknown' as ReservationAction;
      
      expect(component.getActionIcon(unknownAction)).toBe('action');
      expect(component.getActionLabel(unknownAction)).toBe('Action');
      expect(component.getActionColor(unknownAction)).toBe('primary');
      expect(component.isActionAllowed(unknownAction)).toBeFalse();
    });
  });
});