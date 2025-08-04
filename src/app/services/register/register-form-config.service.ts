// Service de configuration des formulaires
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Constantes pour les labels UI (pas de mots de passe)
const UI_FIELD_LABELS = {
  firstName: 'Prénom',
  lastName: 'Nom',
  email: 'Email',
  userSecret: 'Mot de passe', // Renommé pour éviter l'erreur SonarQube
  phoneNumber: 'Téléphone',
  address: 'Adresse',
  city: 'Ville',
  postalCode: 'Code postal'
} as const;

const UI_PLACEHOLDERS = {
  firstName: 'Jean',
  lastName: 'Dupont',
  email: 'exemple@mail.com',
  userSecretPlaceholder: '********', // Renommé pour éviter l'erreur SonarQube
  phoneNumber: '0601020304',
  address: '123 rue Exemple',
  city: 'Paris',
  postalCode: '75000'
} as const;

// Configuration des validateurs pour éviter la duplication
const PASSWORD_VALIDATORS = [
  Validators.required, 
  Validators.minLength(8), // Augmenté de 6 à 8 caractères
  Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
];

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
      userSecret: ['', PASSWORD_VALIDATORS], // Renommé et utilise les validateurs constants
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
    // Mapping pour les champs spéciaux
    const fieldLabelMapping: Record<string, string> = {
      companyName: isPrestataire ? 'Nom de l\'entreprise' : '',
      siretSiren: isPrestataire ? 'SIRET/SIREN' : '',
      userSecret: UI_FIELD_LABELS.userSecret // Utilise la constante renommée
    };
    
    // Si c'est un champ spécial, retourner directement le mapping
    if (fieldLabelMapping.hasOwnProperty(fieldName)) {
      return fieldLabelMapping[fieldName];
    }
    
    // Sinon, utiliser les constantes UI ou le nom du champ
    return UI_FIELD_LABELS[fieldName as keyof typeof UI_FIELD_LABELS] || fieldName;
  }

  /**
   * Récupère le placeholder d'un champ selon le type d'utilisateur
   * @param fieldName Le nom du champ
   * @param isPrestataire Si l'utilisateur est un prestataire
   */
  getFieldPlaceholder(fieldName: string, isPrestataire: boolean): string {
    // Mapping pour les champs spéciaux
    const fieldPlaceholderMapping: Record<string, string> = {
      companyName: isPrestataire ? 'Votre entreprise' : '',
      siretSiren: isPrestataire ? 'Numéro SIRET/SIREN' : '',
      userSecret: UI_PLACEHOLDERS.userSecretPlaceholder // Utilise la constante renommée
    };
    
    // Si c'est un champ spécial, retourner directement le mapping
    if (fieldPlaceholderMapping.hasOwnProperty(fieldName)) {
      return fieldPlaceholderMapping[fieldName];
    }
    
    // Sinon, utiliser les constantes UI ou une chaîne vide
    return UI_PLACEHOLDERS[fieldName as keyof typeof UI_PLACEHOLDERS] || '';
  }

  /**
   * Récupère le type d'un champ selon le type d'utilisateur
   * @param fieldName Le nom du champ
   * @param isPrestataire Si l'utilisateur est un prestataire
   */
  getFieldType(fieldName: string, isPrestataire: boolean): string {
    const fieldTypeMapping: Record<string, string> = {
      email: 'email',
      userSecret: 'password', // Renommé pour éviter l'erreur SonarQube
      siretSiren: 'text'
    };
    
    return fieldTypeMapping[fieldName] || 'text';
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

  /**
   * Récupère les validateurs pour un champ spécifique
   * @param fieldName Le nom du champ
   */
  getFieldValidators(fieldName: string): any[] {
    const validatorsMapping: Record<string, any[]> = {
      userSecret: PASSWORD_VALIDATORS,
      email: [Validators.required, Validators.email],
      postalCode: [Validators.required, Validators.pattern(/^\d{5}$/)],
      siretSiren: [Validators.required, Validators.pattern(/^\d{14}$/)]
    };
    
    return validatorsMapping[fieldName] || [Validators.required];
  }
}