import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactComponent } from './contact.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactComponent, ReactiveFormsModule, FooterComponent],
      providers: [
        { provide: ActivatedRoute, useValue: {
          params: of({}),
          queryParams: of({}),
          snapshot: {},
        } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    
    // Attendre que le composant soit complètement initialisé
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component.contactForm.get('nom')?.value).toBe('');
    expect(component.contactForm.get('prenom')?.value).toBe('');
    expect(component.contactForm.get('objet')?.value).toBe('');
    expect(component.contactForm.get('demande')?.value).toBe('');
  });

  it('should initialize with correct form validators', () => {
    const form = component.contactForm;
    
    // Test required validators by checking that empty values trigger required errors
    expect(form.get('nom')?.errors?.['required']).toBeTruthy();
    expect(form.get('prenom')?.errors?.['required']).toBeTruthy();
    expect(form.get('objet')?.errors?.['required']).toBeTruthy();
    expect(form.get('demande')?.errors?.['required']).toBeTruthy();
    
    // Test minLength validators by setting values below minimum
    form.get('nom')?.setValue('A');
    form.get('prenom')?.setValue('B');
    form.get('objet')?.setValue('Test');
    
    expect(form.get('nom')?.errors?.['minlength']).toBeTruthy();
    expect(form.get('prenom')?.errors?.['minlength']).toBeTruthy();
    expect(form.get('objet')?.errors?.['minlength']).toBeTruthy();
    
    // Test maxLength validator for demande
    const longText = 'A'.repeat(1001);
    form.get('demande')?.setValue(longText);
    expect(form.get('demande')?.errors?.['maxlength']).toBeTruthy();
    
    // Reset form to initial state
    form.reset({
      nom: '',
      prenom: '',
      objet: '',
      demande: ''
    });
  });

  it('should validate required fields', () => {
    const form = component.contactForm;
    
    expect(form.get('nom')?.errors?.['required']).toBeTruthy();
    expect(form.get('prenom')?.errors?.['required']).toBeTruthy();
    expect(form.get('objet')?.errors?.['required']).toBeTruthy();
    expect(form.get('demande')?.errors?.['required']).toBeTruthy();
  });

  it('should validate minimum length for nom and prenom', () => {
    const form = component.contactForm;
    
    form.get('nom')?.setValue('A');
    form.get('prenom')?.setValue('B');
    
    expect(form.get('nom')?.errors?.['minlength']).toBeTruthy();
    expect(form.get('prenom')?.errors?.['minlength']).toBeTruthy();
  });

  it('should validate minimum length for objet', () => {
    const form = component.contactForm;
    
    form.get('objet')?.setValue('Test');
    
    expect(form.get('objet')?.errors?.['minlength']).toBeTruthy();
  });

  it('should validate maximum length for demande', () => {
    const form = component.contactForm;
    const longText = 'A'.repeat(1001);
    
    form.get('demande')?.setValue(longText);
    
    expect(form.get('demande')?.errors?.['maxlength']).toBeTruthy();
  });

  it('should calculate remaining characters correctly', () => {
    const form = component.contactForm;
    const testText = 'Test message';
    
    form.get('demande')?.setValue(testText);
    
    expect(component.remainingCharacters).toBe(1000 - testText.length);
  });

  it('should show warning when remaining characters is 100 or less', () => {
    const form = component.contactForm;
    
    // Test with exactly 100 characters remaining
    form.get('demande')?.setValue('A'.repeat(900));
    expect(component.remainingCharacters).toBe(100);
    
    // Test with less than 100 characters remaining
    form.get('demande')?.setValue('A'.repeat(950));
    expect(component.remainingCharacters).toBe(50);
  });

  it('should not submit form when invalid', async () => {
    // Spy on console.log to track calls
    spyOn(console, 'log');
    
    const form = component.contactForm;
    
    // Form is invalid by default (empty required fields)
    expect(form.valid).toBeFalse();
    
    // Try to submit
    await component.onSubmit();
    
    // Should not call console.log
    expect(console.log).not.toHaveBeenCalled();
    
    // Should not show success
    expect(component.submitSuccess).toBeFalse();
  });

  it('should submit form successfully when valid', async () => {
    // Spy on console.log to track calls
    spyOn(console, 'log');
    
    const form = component.contactForm;
    form.patchValue({
      nom: 'Doe',
      prenom: 'John',
      objet: 'Test object',
      demande: 'Test request'
    });

    await component.onSubmit();

    // Should call console.log with form data
    expect(console.log).toHaveBeenCalledWith('=== DONNÉES DU FORMULAIRE DE CONTACT ===');
    expect(console.log).toHaveBeenCalledWith('Nom:', 'Doe');
    expect(console.log).toHaveBeenCalledWith('Prénom:', 'John');
    expect(console.log).toHaveBeenCalledWith('Objet:', 'Test object');
    expect(console.log).toHaveBeenCalledWith('Demande:', 'Test request');

    // Should show success
    expect(component.submitSuccess).toBeTrue();
    
    // Should reset form
    expect(form.get('nom')?.value).toBe('');
    expect(form.get('prenom')?.value).toBe('');
    expect(form.get('objet')?.value).toBe('');
    expect(form.get('demande')?.value).toBe('');
  });

  it('should handle submission error', async () => {
    // Mock console.log to throw an error
    spyOn(console, 'log').and.throwError('Console error');
    
    const form = component.contactForm;
    form.patchValue({
      nom: 'Doe',
      prenom: 'John',
      objet: 'Test object',
      demande: 'Test request'
    });

    await component.onSubmit();

    // Should show error message
    expect(component.submitError).toBe('Une erreur est survenue lors de l\'envoi. Veuillez réessayer.');
    
    // Should not show success
    expect(component.submitSuccess).toBeFalse();
  });

  it('should set isSubmitting during form submission', async () => {
    // Spy on console.log
    spyOn(console, 'log');
    
    const form = component.contactForm;
    form.patchValue({
      nom: 'Doe',
      prenom: 'John',
      objet: 'Test object',
      demande: 'Test request'
    });

    // Start submission
    const submitPromise = component.onSubmit();
    
    // Check that isSubmitting is true during submission
    expect(component.isSubmitting).toBeTrue();
    
    // Wait for completion
    await submitPromise;
    
    // Check that isSubmitting is false after completion
    expect(component.isSubmitting).toBeFalse();
  });

  it('should clear submitError when starting new submission', async () => {
    // Set an error first
    component.submitError = 'Previous error';
    
    // Spy on console.log
    spyOn(console, 'log');
    
    const form = component.contactForm;
    form.patchValue({
      nom: 'Doe',
      prenom: 'John',
      objet: 'Test object',
      demande: 'Test request'
    });

    await component.onSubmit();

    expect(component.submitError).toBe('');
  });

  it('should mark form as touched when submitting invalid form', async () => {
    const form = component.contactForm;
    
    // Form is invalid (empty required fields)
    expect(form.valid).toBeFalse();
    
    // Submit invalid form
    await component.onSubmit();
    
    // All fields should be marked as touched
    expect(form.get('nom')?.touched).toBeTrue();
    expect(form.get('prenom')?.touched).toBeTrue();
    expect(form.get('objet')?.touched).toBeTrue();
    expect(form.get('demande')?.touched).toBeTrue();
  });

  it('should get field error messages for required field', () => {
    const form = component.contactForm;
    form.get('nom')?.setValue('');
    form.get('nom')?.markAsTouched();
    
    expect(component.getFieldError('nom')).toBe('Ce champ est requis');
  });

  it('should get field error messages for minlength field', () => {
    const form = component.contactForm;
    form.get('nom')?.setValue('A');
    form.get('nom')?.markAsTouched();
    
    expect(component.getFieldError('nom')).toBe('Minimum 2 caractères');
  });

  it('should get field error messages for maxlength field', () => {
    const form = component.contactForm;
    const longText = 'A'.repeat(1001);
    form.get('demande')?.setValue(longText);
    form.get('demande')?.markAsTouched();
    
    expect(component.getFieldError('demande')).toBe('Maximum 1000 caractères');
  });

  it('should return empty string for field without errors', () => {
    const form = component.contactForm;
    form.get('nom')?.setValue('Valid Name');
    form.get('nom')?.markAsTouched();
    
    expect(component.getFieldError('nom')).toBe('');
  });

  it('should return empty string for field not touched', () => {
    const form = component.contactForm;
    form.get('nom')?.setValue('');
    // Not marking as touched
    
    expect(component.getFieldError('nom')).toBe('');
  });

  it('should return empty string for non-existent field', () => {
    expect(component.getFieldError('nonExistentField')).toBe('');
  });

  describe('Form getters', () => {
    it('should return correct form controls', () => {
      expect(component.nom).toBe(component.contactForm.get('nom'));
      expect(component.prenom).toBe(component.contactForm.get('prenom'));
      expect(component.objet).toBe(component.contactForm.get('objet'));
      expect(component.demande).toBe(component.contactForm.get('demande'));
    });
  });

  describe('Form validation edge cases', () => {
    it('should handle form with exactly minimum required lengths', () => {
      const form = component.contactForm;
      
      form.patchValue({
        nom: 'Ab',
        prenom: 'Cd',
        objet: 'Teste',
        demande: 'Test'
      });
      
      expect(form.valid).toBeTrue();
    });

    it('should handle form with exactly maximum allowed length', () => {
      const form = component.contactForm;
      const maxLengthText = 'A'.repeat(1000);
      
      form.patchValue({
        nom: 'Ab',
        prenom: 'Cd',
        objet: 'Teste',
        demande: maxLengthText
      });
      
      expect(form.valid).toBeTrue();
    });
  });
});
