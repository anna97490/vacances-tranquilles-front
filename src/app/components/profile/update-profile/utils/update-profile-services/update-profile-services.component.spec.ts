import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { UpdateProfileServicesComponent } from './update-profile-services.component';
import { UserInformationService } from '../../../../../services/user-information/user-information.service';
import { IconService } from '../../../../../services/icon.service';
import { Service, ServiceCategory } from '../../../../../models/Service';

describe('UpdateProfileServicesComponent', () => {
  let component: UpdateProfileServicesComponent;
  let fixture: ComponentFixture<UpdateProfileServicesComponent>;
  let mockUserInformationService: jasmine.SpyObj<UserInformationService>;
  let mockIconService: jasmine.SpyObj<IconService>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;
  let mockDialog: jasmine.SpyObj<MatDialog>;

  const mockService: Service = {
    id: 1,
    title: 'Test Service',
    description: 'Test Description',
    category: ServiceCategory.HOME,
    price: 50,
    providerId: 1
  };

  const mockCategories: ServiceCategory[] = [
    ServiceCategory.HOME,
    ServiceCategory.OUTDOOR,
    ServiceCategory.REPAIRS
  ];

  beforeEach(async () => {
    const userInfoSpy = jasmine.createSpyObj('UserInformationService', [
      'createService', 'updateService', 'deleteService'
    ]);
    const iconSpy = jasmine.createSpyObj('IconService', ['getAvailableCategories']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    iconSpy.getAvailableCategories.and.returnValue(mockCategories);

    await TestBed.configureTestingModule({
      imports: [
        UpdateProfileServicesComponent,
        HttpClientTestingModule,
        MatSnackBarModule,
        MatDialogModule,
        BrowserAnimationsModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: UserInformationService, useValue: userInfoSpy },
        { provide: IconService, useValue: iconSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateProfileServicesComponent);
    component = fixture.componentInstance;
    mockUserInformationService = TestBed.inject(UserInformationService) as jasmine.SpyObj<UserInformationService>;
    mockIconService = TestBed.inject(IconService) as jasmine.SpyObj<IconService>;
    mockSnackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    mockDialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    
    // Setup default spy returns
    mockUserInformationService.createService.and.returnValue(of(mockService));
    mockUserInformationService.updateService.and.returnValue(of(mockService));
    mockUserInformationService.deleteService.and.returnValue(of(void 0));
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.services).toEqual([]);
    expect(component.editingService).toBeNull();
    expect(component.isAddingNew).toBeFalse();
    expect(component.categories).toEqual(mockCategories);
  });

  it('should initialize service form with correct validators', () => {
    expect(component.serviceForm.get('title')).toBeTruthy();
    expect(component.serviceForm.get('description')).toBeTruthy();
    expect(component.serviceForm.get('category')).toBeTruthy();
    expect(component.serviceForm.get('price')).toBeTruthy();
  });

  describe('editService', () => {
    it('should set editingService and patch form values', () => {
      component.editService(mockService);

      expect(component.editingService).toEqual(mockService);
      expect(component.serviceForm.get('title')?.value).toBe(mockService.title);
      expect(component.serviceForm.get('description')?.value).toBe(mockService.description);
      expect(component.serviceForm.get('category')?.value).toBe(mockService.category);
      expect(component.serviceForm.get('price')?.value).toBe(mockService.price);
    });

    it('should create a copy of the service', () => {
      component.editService(mockService);
      
      expect(component.editingService).not.toBe(mockService);
      expect(component.editingService).toEqual(mockService);
    });
  });

  describe('addNewService', () => {
    it('should set isAddingNew to true and reset form', () => {
      component.addNewService();

      expect(component.isAddingNew).toBeTrue();
      expect(component.editingService).toBeNull();
      expect(component.serviceForm.get('price')?.value).toBe(0);
    });

    it('should reset form with default values', () => {
      // First set some values
      component.serviceForm.patchValue({
        title: 'Test',
        description: 'Test Description',
        category: ServiceCategory.HOME,
        price: 100
      });

      component.addNewService();

      expect(component.serviceForm.get('title')?.value).toBeNull();
      expect(component.serviceForm.get('description')?.value).toBeNull();
      expect(component.serviceForm.get('category')?.value).toBeNull();
      expect(component.serviceForm.get('price')?.value).toBe(0);
    });
  });

  describe('cancelEdit', () => {
    it('should reset editing state and form', () => {
      component.editingService = mockService;
      component.isAddingNew = true;

      component.cancelEdit();

      expect(component.editingService).toBeNull();
      expect(component.isAddingNew).toBeFalse();
      expect(component.serviceForm.get('price')?.value).toBe(0);
    });
  });

  describe('saveService', () => {
    beforeEach(() => {
      spyOn(component.servicesChange, 'emit');
    });

    it('should not save if form is invalid', () => {
      component.saveService();

      expect(mockUserInformationService.createService).not.toHaveBeenCalled();
      expect(mockUserInformationService.updateService).not.toHaveBeenCalled();
      expect(mockSnackBar.open).toHaveBeenCalledWith(
        'Veuillez corriger les erreurs dans le formulaire',
        'Fermer',
        { duration: 3000 }
      );
    });

    it('should create new service when isAddingNew is true', () => {
      component.isAddingNew = true;
      component.serviceForm.patchValue({
        title: 'New Service',
        description: 'New Description',
        category: ServiceCategory.HOME,
        price: 75
      });

      component.saveService();

      expect(mockUserInformationService.createService).toHaveBeenCalledWith({
        id: 0,
        providerId: 0,
        title: 'New Service',
        description: 'New Description',
        category: ServiceCategory.HOME,
        price: 75
      });
    });

    it('should update existing service when editing', () => {
      component.editingService = mockService;
      component.serviceForm.patchValue({
        title: 'Updated Service',
        description: 'Updated Description',
        category: ServiceCategory.OUTDOOR,
        price: 100
      });

      component.saveService();

      expect(mockUserInformationService.updateService).toHaveBeenCalledWith(
        mockService.id,
        {
          ...mockService,
          title: 'Updated Service',
          description: 'Updated Description',
          category: ServiceCategory.OUTDOOR,
          price: 100
        }
      );
    });

    it('should handle successful service creation', () => {
      component.isAddingNew = true;
      component.services = [mockService];
      component.serviceForm.patchValue({
        title: 'New Service',
        description: 'New Description',
        category: ServiceCategory.HOME,
        price: 75
      });

      component.saveService();

      expect(component.services).toContain(mockService);
      expect(component.servicesChange.emit).toHaveBeenCalledWith(component.services);
      expect(mockSnackBar.open).toHaveBeenCalledWith(
        'Service ajouté avec succès',
        'Fermer',
        { duration: 3000 }
      );
      expect(component.editingService).toBeNull();
      expect(component.isAddingNew).toBeFalse();
    });

    it('should handle successful service update', () => {
      component.editingService = mockService;
      component.services = [mockService];
      component.serviceForm.patchValue({
        title: 'Updated Service',
        description: 'Updated Description',
        category: ServiceCategory.OUTDOOR,
        price: 100
      });

      component.saveService();

      expect(component.servicesChange.emit).toHaveBeenCalledWith(component.services);
      expect(mockSnackBar.open).toHaveBeenCalledWith(
        'Service modifié avec succès',
        'Fermer',
        { duration: 3000 }
      );
      expect(component.editingService).toBeNull();
      expect(component.isAddingNew).toBeFalse();
    });

    it('should handle error during service creation', () => {
      const error = new Error('Creation failed');
      mockUserInformationService.createService.and.returnValue(throwError(() => error));
      
      component.isAddingNew = true;
      component.serviceForm.patchValue({
        title: 'New Service',
        description: 'New Description',
        category: ServiceCategory.HOME,
        price: 75
      });

      spyOn(console, 'error');
      component.saveService();

      expect(console.error).toHaveBeenCalledWith('Erreur lors de la création du service:', error);
      expect(mockSnackBar.open).toHaveBeenCalledWith(
        'Erreur lors de l\'ajout du service',
        'Fermer',
        { duration: 3000 }
      );
    });

    it('should handle error during service update', () => {
      const error = new Error('Update failed');
      mockUserInformationService.updateService.and.returnValue(throwError(() => error));
      
      component.editingService = mockService;
      component.serviceForm.patchValue({
        title: 'Updated Service',
        description: 'Updated Description',
        category: ServiceCategory.OUTDOOR,
        price: 100
      });

      spyOn(console, 'error');
      component.saveService();

      expect(console.error).toHaveBeenCalledWith('Erreur lors de la modification du service:', error);
      expect(mockSnackBar.open).toHaveBeenCalledWith(
        'Erreur lors de la modification du service',
        'Fermer',
        { duration: 3000 }
      );
    });
  });

  describe('deleteService', () => {
    beforeEach(() => {
      spyOn(component.servicesChange, 'emit');
    });

    it('should delete service and update services list', () => {
      component.services = [mockService];

      component.deleteService(mockService.id);

      expect(mockUserInformationService.deleteService).toHaveBeenCalledWith(mockService.id);
      expect(component.services).toEqual([]);
      expect(component.servicesChange.emit).toHaveBeenCalledWith([]);
      expect(mockSnackBar.open).toHaveBeenCalledWith(
        'Service supprimé avec succès',
        'Fermer',
        { duration: 3000 }
      );
    });

    it('should handle error during service deletion', () => {
      const error = new Error('Deletion failed');
      mockUserInformationService.deleteService.and.returnValue(throwError(() => error));

      spyOn(console, 'error');
      component.deleteService(mockService.id);

      expect(console.error).toHaveBeenCalledWith('Erreur lors de la suppression du service:', error);
      expect(mockSnackBar.open).toHaveBeenCalledWith(
        'Erreur lors de la suppression du service',
        'Fermer',
        { duration: 3000 }
      );
    });
  });

  describe('isFieldInvalid', () => {
    it('should return true for invalid and touched field', () => {
      const field = component.serviceForm.get('title');
      field?.markAsTouched();
      field?.setValue('');

      expect(component.isFieldInvalid('title')).toBeTrue();
    });

    it('should return true for invalid and dirty field', () => {
      const field = component.serviceForm.get('title');
      field?.markAsDirty();
      field?.setValue('');

      expect(component.isFieldInvalid('title')).toBeTrue();
    });

    it('should return false for valid field', () => {
      const field = component.serviceForm.get('title');
      field?.setValue('Valid Title');

      expect(component.isFieldInvalid('title')).toBeFalse();
    });

    it('should return false for non-existent field', () => {
      expect(component.isFieldInvalid('nonExistentField')).toBeFalse();
    });
  });

  describe('getErrorMessage', () => {
    it('should return required error message', () => {
      const field = component.serviceForm.get('title');
      field?.setValue('');
      field?.markAsTouched();

      expect(component.getErrorMessage('title')).toBe('Ce champ est requis');
    });

    it('should return minlength error message', () => {
      const field = component.serviceForm.get('title');
      field?.setValue('A');
      field?.markAsTouched();

      expect(component.getErrorMessage('title')).toBe('Minimum 2 caractères');
    });

    it('should return maxlength error message', () => {
      const field = component.serviceForm.get('title');
      field?.setValue('A'.repeat(51));
      field?.markAsTouched();

      expect(component.getErrorMessage('title')).toBe('Maximum 50 caractères');
    });

    it('should return min error message for price', () => {
      const field = component.serviceForm.get('price');
      field?.setValue(-1);
      field?.markAsTouched();

      expect(component.getErrorMessage('price')).toBe('La valeur minimum est 0');
    });

    it('should return max error message for price', () => {
      const field = component.serviceForm.get('price');
      field?.setValue(10001);
      field?.markAsTouched();

      expect(component.getErrorMessage('price')).toBe('La valeur maximum est 10000');
    });

    it('should return pattern error message', () => {
      const field = component.serviceForm.get('title');
      field?.setErrors({ pattern: true });

      expect(component.getErrorMessage('title')).toBe('Format d\'URL invalide');
    });

    it('should return default error message for unknown error', () => {
      const field = component.serviceForm.get('title');
      field?.setErrors({ unknown: true });

      expect(component.getErrorMessage('title')).toBe('Champ invalide');
    });

    it('should return empty string for field without errors', () => {
      const field = component.serviceForm.get('title');
      field?.setValue('Valid Title');

      expect(component.getErrorMessage('title')).toBe('');
    });

    it('should return empty string for non-existent field', () => {
      expect(component.getErrorMessage('nonExistentField')).toBe('');
    });
  });

  describe('Input/Output properties', () => {
    it('should handle services input', () => {
      const testServices = [mockService];
      component.services = testServices;

      expect(component.services).toEqual(testServices);
    });

    it('should emit servicesChange when services are updated', () => {
      spyOn(component.servicesChange, 'emit');
      const newServices = [mockService];

      component.services = newServices;
      component.servicesChange.emit(newServices);

      expect(component.servicesChange.emit).toHaveBeenCalledWith(newServices);
    });
  });
});
