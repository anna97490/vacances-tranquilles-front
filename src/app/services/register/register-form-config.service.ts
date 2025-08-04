// Service de configuration des formulaires
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Constantes pour les labels UI (pas de mots de passe)
const UI_FIELD_LABELS = {
  firstName: 'Prénom',
  lastName: 'Nom',
  email: 'Email',
  password: 'Mot de passe',
  phoneNumber: 'Téléphone',
  address: 'Adresse',
  city: 'Ville',
  postalCode: 'Code postal'
} as const;

const UI_PLACEHOLDERS = {
  firstName: 'Jean',
  lastName: 'Dupont',
  email: 'exemple@mail.com',
  password: '********',
  phoneNumber: '0601020304',
  address: '123 rue Exemple',
  city: 'Paris',
  postalCode: '75000'
} as const;

@Injectable({
  providedIn: 'root'
})
export class RegisterFormConfigService {

  constructor(private fb: FormBuilder) {}

  /**
   * Crée un formulaire d'inscription avec les validateurs de base
   */
  createRegistrationForm(): FormGroup {
    return this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phoneNumber: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', [
        Validators.required, 
        Validators.pattern(/^\d{5}$/)
      ]],
      companyName: [''],
      siretSiren: ['']
    });
  }

  /**
   * Met à jour les validateurs selon le type d'utilisateur
   * @param form Le formulaire à configurer
   * @param isPrestataire Si l'utilisateur est un prestataire
   */
  updateValidatorsBasedOnUserType(form: FormGroup, isPrestataire: boolean): void {
    const companyNameControl = form.get('companyName');
    const siretSirenControl = form.get('siretSiren');

    if (isPrestataire) {
      companyNameControl?.setValidators([Validators.required]);
      siretSirenControl?.setValidators([
        Validators.required,
        Validators.pattern(/^\d{14}$/)
      ]);
    } else {
      companyNameControl?.clearValidators();
      siretSirenControl?.clearValidators();
    }

    companyNameControl?.updateValueAndValidity();
    siretSirenControl?.updateValueAndValidity();
  }

  /**
   * Vérifie si un champ doit être affiché selon le type d'utilisateur
   * @param fieldName Le nom du champ
   * @param isPrestataire Si l'utilisateur est un prestataire
   */
  shouldShowField(fieldName: string, isPrestataire: boolean): boolean {
    const prestataireOnlyFields = ['companyName', 'siretSiren'];
    
    if (prestataireOnlyFields.includes(fieldName)) {
      return isPrestataire;
    }
    
    return true;
  }

  /**
   * Récupère le label d'un champ selon le type d'utilisateur
   * @param fieldName Le nom du champ
   * @param isPrestataire Si l'utilisateur est un prestataire
   */
  getFieldLabel(fieldName: string, isPrestataire: boolean): string {
    // Exemple simple, à adapter selon vos besoins réels
    if (fieldName === 'companyName') return isPrestataire ? 'Nom de l\'entreprise' : '';
    if (fieldName === 'siretSiren') return isPrestataire ? 'SIRET/SIREN' : '';
    
    return UI_FIELD_LABELS[fieldName as keyof typeof UI_FIELD_LABELS] || fieldName;
  }

  /**
   * Récupère le placeholder d'un champ selon le type d'utilisateur
   * @param fieldName Le nom du champ
   * @param isPrestataire Si l'utilisateur est un prestataire
   */
  getFieldPlaceholder(fieldName: string, isPrestataire: boolean): string {
    // Exemple simple, à adapter selon vos besoins réels
    if (fieldName === 'companyName') return isPrestataire ? 'Votre entreprise' : '';
    if (fieldName === 'siretSiren') return isPrestataire ? 'Numéro SIRET/SIREN' : '';
    
    return UI_PLACEHOLDERS[fieldName as keyof typeof UI_PLACEHOLDERS] || '';
  }

  /**
   * Récupère le type d'un champ selon le type d'utilisateur
   * @param fieldName Le nom du champ
   * @param isPrestataire Si l'utilisateur est un prestataire
   */
  getFieldType(fieldName: string, isPrestataire: boolean): string {
    if (fieldName === 'email') return 'email';
    if (fieldName === 'password') return 'password';
    if (fieldName === 'siretSiren') return 'text';
    return 'text';
  }

  /**
   * Vérifie si un champ est requis selon le type d'utilisateur
   * @param fieldName Le nom du champ
   * @param isPrestataire Si l'utilisateur est un prestataire
   */
  getFieldRequired(fieldName: string, isPrestataire: boolean): boolean {
    // Reprend la logique des validateurs
    if (fieldName === 'companyName' || fieldName === 'siretSiren') return isPrestataire;
    return true;
  }
}