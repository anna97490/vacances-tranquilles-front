import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FooterComponent],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  contactForm: FormGroup;
  isSubmitting = false;
  submitSuccess = false;
  submitError = '';

  constructor(
    private readonly fb: FormBuilder
  ) {
    this.contactForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      objet: ['', [Validators.required, Validators.minLength(5)]],
      demande: ['', [Validators.required, Validators.maxLength(1000)]]
    });
  }

  get nom() { return this.contactForm.get('nom'); }
  get prenom() { return this.contactForm.get('prenom'); }
  get objet() { return this.contactForm.get('objet'); }
  get demande() { return this.contactForm.get('demande'); }

  get remainingCharacters(): number {
    const demandeValue = this.demande?.value || '';
    return 1000 - demandeValue.length;
  }

  async onSubmit(): Promise<void> {
    if (this.contactForm.valid) {
      this.isSubmitting = true;
      this.submitError = '';
      
      try {
        const emailData = this.contactForm.value;
        
        // Simulation d'envoi - simple console.log pour le moment
        console.log('=== DONNÉES DU FORMULAIRE DE CONTACT ===');
        console.log('Nom:', emailData.nom);
        console.log('Prénom:', emailData.prenom);
        console.log('Objet:', emailData.objet);
        console.log('Demande:', emailData.demande);
        console.log('Date d\'envoi:', new Date().toISOString());
        console.log('========================================');

        // Simuler un délai d'envoi
        await new Promise(resolve => setTimeout(resolve, 1000));

        this.submitSuccess = true;
        this.contactForm.reset({
          nom: '',
          prenom: '',
          objet: '',
          demande: ''
        });
      } catch (error) {
        this.submitError = 'Une erreur est survenue lors de l\'envoi. Veuillez réessayer.';
        console.error('Erreur lors de l\'envoi du formulaire:', error);
      } finally {
        this.isSubmitting = false;
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.contactForm.controls).forEach(key => {
      const control = this.contactForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.contactForm.get(fieldName);
    if (field?.errors && field?.touched) {
      if (field.errors['required']) {
        return 'Ce champ est requis';
      }
      if (field.errors['minlength']) {
        return `Minimum ${field.errors['minlength'].requiredLength} caractères`;
      }
      if (field.errors['maxlength']) {
        return `Maximum ${field.errors['maxlength'].requiredLength} caractères`;
      }
    }
    return '';
  }
}
