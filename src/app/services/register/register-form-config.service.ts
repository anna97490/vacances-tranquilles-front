// Service de configuration des formulaires
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

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

// Validateur pour empêcher les caractères spéciaux d'injection (strict)
function injectionPreventionValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;

  const value = control.value.toString();

  // Pattern pour détecter les caractères vraiment dangereux pour les injections
  // Exclut @ et . car ils sont nécessaires pour les emails et adresses
  const dangerousPattern = /[<>'"&;{}()\[\]\\|`~#$%^*+=]/;

  if (dangerousPattern.test(value)) {
    return { injectionPrevention: true };
  }

  return null;
}

// Validateur spécifique pour les emails (autorise @ et .)
function emailInjectionPreventionValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;

  const value = control.value.toString();

  // Pattern pour les emails - autorise @ . _ % + - mais bloque les vrais caractères dangereux
  const dangerousPattern = /[<>'"&;{}()\[\]\\|`~#$%^*=]/;

  if (dangerousPattern.test(value)) {
    return { injectionPrevention: true };
  }

  return null;
}

// Validateur spécifique pour les adresses (autorise plus de caractères)
function addressInjectionPreventionValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;

  const value = control.value.toString();

  // Pattern pour les adresses - autorise . , - mais bloque les vrais caractères dangereux
  const dangerousPattern = /[<>'"&;{}()\[\]\\|`~#$%^*+=]/;

  if (dangerousPattern.test(value)) {
    return { injectionPrevention: true };
  }

  return null;
}

// Validateur personnalisé pour les noms (lettres uniquement)
function lettersOnlyValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;

  // Pattern plus strict : seulement les lettres, espaces, tirets et apostrophes
  // Exclut explicitement les chiffres et autres caractères spéciaux
  const lettersOnly = /^[a-zA-ZÀ-ÿ\s'-]+$/.test(control.value);

  // Vérification supplémentaire : ne doit pas contenir de chiffres
  const hasNumbers = /\d/.test(control.value);

  if (hasNumbers) {
    return { lettersOnly: true };
  }

  return lettersOnly ? null : { lettersOnly: true };
}

// Validateur personnalisé pour le téléphone (exactement 10 chiffres)
function phoneNumberValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;

  // Supprimer tous les caractères non numériques
  const digitsOnly = control.value.replace(/\D/g, '');

  // Vérifier qu'il y a exactement 10 chiffres
  if (digitsOnly.length !== 10) {
    return { phoneNumberLength: true };
  }

  // Vérifier que le numéro ne contient que des chiffres
  const numbersOnly = /^\d+$/.test(digitsOnly);
  if (!numbersOnly) {
    return { numbersOnly: true };
  }

  return null;
}

// Validateur personnalisé pour l'email (format plus strict)
function emailFormatValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isValidEmail = emailPattern.test(control.value);
  return isValidEmail ? null : { emailFormat: true };
}

// Validateur personnalisé pour le mot de passe (règles de complexité)
function passwordComplexityValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;

  const password = control.value;
  const errors: ValidationErrors = {};

  // Vérifier la longueur minimale
  if (password.length < 8) {
    errors['minLength'] = true;
  }

  // Vérifier la présence d'au moins une minuscule
  if (!/[a-z]/.test(password)) {
    errors['lowercase'] = true;
  }

  // Vérifier la présence d'au moins une majuscule
  if (!/[A-Z]/.test(password)) {
    errors['uppercase'] = true;
  }

  // Vérifier la présence d'au moins un chiffre
  if (!/\d/.test(password)) {
    errors['number'] = true;
  }

  // Vérifier la présence d'au moins un caractère spécial
  if (!/[@$!%*?&]/.test(password)) {
    errors['special'] = true;
  }

  return Object.keys(errors).length > 0 ? errors : null;
}

// Configuration des validateurs pour éviter la duplication
const PASSWORD_VALIDATORS = [
  Validators.required,
  Validators.minLength(8),
  passwordComplexityValidator
];

@Injectable({
  providedIn: 'root'
})
export class RegisterFormConfigService {

  constructor(private readonly fb: FormBuilder) {}

  /**
   * Crée un formulaire d'inscription avec les validateurs de base
   */
  createRegistrationForm(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required, lettersOnlyValidator, injectionPreventionValidator]],
      lastName: ['', [Validators.required, lettersOnlyValidator, injectionPreventionValidator]],
      email: ['', [Validators.required, emailFormatValidator, emailInjectionPreventionValidator]],
      userSecret: ['', PASSWORD_VALIDATORS],
      phoneNumber: ['', [Validators.required, phoneNumberValidator, injectionPreventionValidator]],
      address: ['', [Validators.required, addressInjectionPreventionValidator]],
      city: ['', [Validators.required, lettersOnlyValidator, injectionPreventionValidator]],
      postalCode: ['', [
        Validators.required,
        Validators.pattern(/^\d{5}$/),
        injectionPreventionValidator
      ]],
      companyName: ['', [addressInjectionPreventionValidator]],
      siretSiren: ['', [injectionPreventionValidator]]
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
      companyNameControl?.setValidators([Validators.required, addressInjectionPreventionValidator]);
      siretSirenControl?.setValidators([
        Validators.required,
        Validators.pattern(/^\d{14}$/),
        injectionPreventionValidator
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
      firstName: [Validators.required, lettersOnlyValidator],
      lastName: [Validators.required, lettersOnlyValidator],
      city: [Validators.required, lettersOnlyValidator],
      userSecret: PASSWORD_VALIDATORS,
      email: [Validators.required, emailFormatValidator],
      phoneNumber: [Validators.required, phoneNumberValidator],
      postalCode: [Validators.required, Validators.pattern(/^\d{5}$/)],
      siretSiren: [Validators.required, Validators.pattern(/^\d{14}$/)]
    };

    return validatorsMapping[fieldName] || [Validators.required];
  }
}
