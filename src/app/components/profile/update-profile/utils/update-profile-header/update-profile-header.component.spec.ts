import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { UpdateProfileHeaderComponent } from './update-profile-header.component';
import { ProfileValidationService } from '../../../../../services/user-profile/profile-validation.service';
import { User, UserRole } from '../../../../../models/User';

describe('UpdateProfileHeaderComponent', () => {
  let component: UpdateProfileHeaderComponent;
  let fixture: ComponentFixture<UpdateProfileHeaderComponent>;
  let mockUser: User;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateProfileHeaderComponent, ReactiveFormsModule, MatIconModule],
      providers: [ProfileValidationService]
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateProfileHeaderComponent);
    component = fixture.componentInstance;

    // Mock user data
    mockUser = new User({
      idUser: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: '0612345678',
      city: 'Paris',
      description: 'Test description',
      role: UserRole.CLIENT,
      address: '123 Test Street',
      postalCode: 75000,
      companyName: '',
      siretSiren: ''
    });

    component.user = mockUser;
    component.services = [];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with user data', () => {
    fixture.detectChanges();
    
    expect(component.profileForm.get('firstName')?.value).toBe('John');
    expect(component.profileForm.get('lastName')?.value).toBe('Doe');
    expect(component.profileForm.get('email')?.value).toBe('john.doe@example.com');
    expect(component.profileForm.get('phoneNumber')?.value).toBe('0612345678');
    expect(component.profileForm.get('city')?.value).toBe('Paris');
    expect(component.profileForm.get('description')?.value).toBe('Test description');
  });

  it('should emit userChange when form is valid', () => {
    spyOn(component.userChange, 'emit');
    fixture.detectChanges();

    // Simuler un changement valide
    component.profileForm.patchValue({
      firstName: 'Jane',
      lastName: 'Smith'
    });

    expect(component.userChange.emit).toHaveBeenCalledWith(component.user);
  });

  it('should validate required fields', () => {
    fixture.detectChanges();
    
    const firstNameControl = component.profileForm.get('firstName');
    firstNameControl?.setValue('');
    firstNameControl?.markAsTouched();
    
    expect(component.isFieldInvalid('firstName')).toBeTrue();
    expect(component.getFieldErrorText('firstName')).toBe('Le prénom est requis');
  });

  it('should validate email format', () => {
    fixture.detectChanges();
    
    const emailControl = component.profileForm.get('email');
    emailControl?.setValue('invalid-email');
    emailControl?.markAsTouched();
    
    expect(component.isFieldInvalid('email')).toBeTrue();
    expect(component.getFieldErrorText('email')).toBe('Format d\'email invalide');
  });

  it('should validate phone number format', () => {
    fixture.detectChanges();
    
    const phoneControl = component.profileForm.get('phoneNumber');
    phoneControl?.setValue('123');
    phoneControl?.markAsTouched();
    
    expect(component.isFieldInvalid('phoneNumber')).toBeTrue();
    expect(component.getFieldErrorText('phoneNumber')).toBe('Format de numéro de téléphone invalide (ex: 0612345678)');
  });

  it('should validate letters only for name fields', () => {
    fixture.detectChanges();
    
    const firstNameControl = component.profileForm.get('firstName');
    firstNameControl?.setValue('John123');
    firstNameControl?.markAsTouched();
    
    expect(component.isFieldInvalid('firstName')).toBeTrue();
    expect(component.getFieldErrorText('firstName')).toBe('Le prénom ne doit contenir que des lettres');
  });

  it('should validate description length', () => {
    fixture.detectChanges();
    
    const descriptionControl = component.profileForm.get('description');
    const longDescription = 'a'.repeat(501);
    descriptionControl?.setValue(longDescription);
    descriptionControl?.markAsTouched();
    
    expect(component.isFieldInvalid('description')).toBeTrue();
    expect(component.getFieldErrorText('description')).toContain('ne doit pas dépasser 500 caractères');
  });

  it('should emit validation error when form is invalid', () => {
    spyOn(component.validationError, 'emit');
    fixture.detectChanges();

    // Rendre le formulaire invalide
    component.profileForm.patchValue({
      firstName: '',
      email: 'invalid-email'
    });

    const isValid = component.validateForm();
    
    expect(isValid).toBeFalse();
    expect(component.validationError.emit).toHaveBeenCalled();
  });

  it('should return true when form is valid', () => {
    fixture.detectChanges();

    // S'assurer que le formulaire est valide
    component.profileForm.patchValue({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phoneNumber: '0612345678',
      city: 'Lyon',
      description: 'Valid description'
    });

    const isValid = component.validateForm();
    
    expect(isValid).toBeTrue();
  });
});
