import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * Constantes d'interface utilisateur pour les libellés des champs
 */
const UI_FIELD_LABELS = {
  firstName: 'Prénom',
  lastName: 'Nom',
  email: 'Email',
  userSecret: 'Mot de passe',
  phoneNumber: 'Téléphone',
  address: 'Adresse',
  city: 'Ville',
  postalCode: 'Code postal'
} as const;

/**
 * Constantes d'interface utilisateur pour les placeholders des champs
 */
const UI_PLACEHOLDERS = {
  firstName: 'Jean',
  lastName: 'Dupont',
  email: 'exemple@mail.com',
  userSecretPlaceholder: '********',
  phoneNumber: '0601020304',
  address: '123 rue Exemple',
  city: 'Paris',
  postalCode: '75000'
} as const;

/**
 * Applique une validation uniquement si la valeur du champ n'est pas vide.
 * @param control Contrôle de formulaire à valider
 * @param fn Fonction de validation appliquée si le champ est non vide
 * @returns Erreurs de validation ou null
 */
function validateIfNotEmpty(control: AbstractControl, fn: (value: string) => ValidationErrors | null): ValidationErrors | null {
  if (control == null || control.value == null || control.value === '') return null;
  return fn(String(control.value));
}

/**
 * Crée un validateur qui détecte des caractères dangereux pour éviter les injections.
 * @param pattern Expression régulière définissant les caractères interdits
 * @returns Fonction de validation Angular
 */
function makeDangerValidator(pattern: RegExp) {
  return (control: AbstractControl): ValidationErrors | null =>
    validateIfNotEmpty(control, (value) => (pattern.test(value) ? { injectionPrevention: true } : null));
}

// Définition des patterns d'injection
const DANGEROUS_GENERAL = /[<>'"&;{}()\[\]\\|`~#$%^*+=]/;
const DANGEROUS_EMAIL = /[<>'"&;{}()\[\]\\|`~#$%^*=]/;
const DANGEROUS_ADDRESS = /[<>'"&;{}()\[\]\\|`~#$%^*+=]/;

const injectionPreventionValidator = makeDangerValidator(DANGEROUS_GENERAL);
const emailInjectionPreventionValidator = makeDangerValidator(DANGEROUS_EMAIL);
const addressInjectionPreventionValidator = makeDangerValidator(DANGEROUS_ADDRESS);

/**
 * Valide que le champ contient uniquement des lettres, espaces, tirets ou apostrophes.
 * @param control Contrôle Angular
 * @returns Erreurs de validation ou null
 */
function lettersOnlyValidator(control: AbstractControl): ValidationErrors | null {
  return validateIfNotEmpty(control, (value) => {
    if (/\d/.test(value)) return { lettersOnly: true };
    const ok = /^[a-zA-ZÀ-ÿ\s'-]+$/.test(value);
    return ok ? null : { lettersOnly: true };
  });
}

/**
 * Valide qu'un numéro de téléphone contient exactement 10 chiffres.
 * @param control Contrôle Angular
 * @returns Erreurs de validation ou null
 */
function phoneNumberValidator(control: AbstractControl): ValidationErrors | null {
  return validateIfNotEmpty(control, (value) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length !== 10) return { phoneNumberLength: true };
    if (!/^\d{10}$/.test(digits)) return { numbersOnly: true };
    return null;
  });
}

/**
 * Valide le format strict d'une adresse email.
 * @param control Contrôle Angular
 * @returns Erreurs de validation ou null
 */
function emailFormatValidator(control: AbstractControl): ValidationErrors | null {
  return validateIfNotEmpty(control, (value) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(value) ? null : { emailFormat: true };
  });
}

/**
 * Valide la complexité d'un mot de passe selon les règles définies :
 * longueur minimale, minuscule, majuscule, chiffre, caractère spécial.
 * @param control Contrôle Angular
 * @returns Erreurs de validation ou null
 */
function passwordComplexityValidator(control: AbstractControl): ValidationErrors | null {
  return validateIfNotEmpty(control, (value) => {
    const errors: ValidationErrors = {};
    if (value.length < 8) errors['minLength'] = true;
    if (!/[a-z]/.test(value)) errors['lowercase'] = true;
    if (!/[A-Z]/.test(value)) errors['uppercase'] = true;
    if (!/\d/.test(value)) errors['number'] = true;
    if (!/[@$!%*?&]/.test(value)) errors['special'] = true;
    return Object.keys(errors).length ? errors : null;
  });
}

// Validateurs regroupés pour le mot de passe
const PASSWORD_VALIDATORS = [Validators.required, Validators.minLength(8), passwordComplexityValidator];

@Injectable({ providedIn: 'root' })
export class RegisterFormConfigService {
  constructor(private readonly fb: FormBuilder) {}

  /**
   * Crée le formulaire d'inscription avec les validateurs par défaut.
   * @returns FormGroup configuré
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
      postalCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/), injectionPreventionValidator]],
      companyName: ['', [addressInjectionPreventionValidator]],
      siretSiren: ['', [injectionPreventionValidator]]
    });
  }

  /**
   * Met à jour les validateurs spécifiques en fonction du type d'utilisateur.
   * @param form Formulaire à mettre à jour
   * @param isPrestataire Indique si l'utilisateur est un prestataire
   */
  updateValidatorsBasedOnUserType(form: FormGroup, isPrestataire: boolean): void {
    const companyNameControl = form.get('companyName');
    const siretSirenControl = form.get('siretSiren');

    if (isPrestataire) {
      companyNameControl?.setValidators([Validators.required, addressInjectionPreventionValidator]);
      siretSirenControl?.setValidators([Validators.required, Validators.pattern(/^\d{14}$/), injectionPreventionValidator]);
    } else {
      companyNameControl?.clearValidators();
      siretSirenControl?.clearValidators();
    }
    companyNameControl?.updateValueAndValidity();
    siretSirenControl?.updateValueAndValidity();
  }

  /**
   * Indique si un champ doit être affiché selon le type d'utilisateur.
   * @param fieldName Nom du champ
   * @param isPrestataire Indique si l'utilisateur est un prestataire
   * @returns true si le champ doit être affiché
   */
  shouldShowField(fieldName: string, isPrestataire: boolean): boolean {
    const prestataireOnly = ['companyName', 'siretSiren'];
    return prestataireOnly.includes(fieldName) ? isPrestataire : true;
  }

  /**
   * Retourne le libellé d'un champ pour l'affichage.
   * @param fieldName Nom du champ
   * @param isPrestataire Indique si l'utilisateur est un prestataire
   * @returns Libellé à afficher
   */
  getFieldLabel(fieldName: string, isPrestataire: boolean): string {
    const specials: Record<string, string> = {
      companyName: isPrestataire ? "Nom de l'entreprise" : '',
      siretSiren: isPrestataire ? 'SIRET' : '',
      userSecret: UI_FIELD_LABELS.userSecret
    };
    if (fieldName in specials) return specials[fieldName];
    return UI_FIELD_LABELS[fieldName as keyof typeof UI_FIELD_LABELS] || fieldName;
  }

  /**
   * Retourne le placeholder d'un champ pour l'affichage.
   * @param fieldName Nom du champ
   * @param isPrestataire Indique si l'utilisateur est un prestataire
   * @returns Placeholder à afficher
   */
  getFieldPlaceholder(fieldName: string, isPrestataire: boolean): string {
    const specials: Record<string, string> = {
      companyName: isPrestataire ? 'Votre entreprise' : '',
      siretSiren: isPrestataire ? 'Numéro SIRET (14 chiffres)' : '',
      userSecret: UI_PLACEHOLDERS.userSecretPlaceholder
    };
    if (fieldName in specials) return specials[fieldName];
    return UI_PLACEHOLDERS[fieldName as keyof typeof UI_PLACEHOLDERS] || '';
  }

  /**
   * Retourne le type d'input HTML adapté au champ.
   * @param fieldName Nom du champ
   * @returns Type d'input HTML
   */
  getFieldType(fieldName: string): string {
    const map: Record<string, string> = {
      email: 'email',
      userSecret: 'password',
      siretSiren: 'text'
    };
    return map[fieldName] || 'text';
  }

  /**
   * Indique si un champ est requis en fonction du type d'utilisateur.
   * @param fieldName Nom du champ
   * @param isPrestataire Indique si l'utilisateur est un prestataire
   * @returns true si requis
   */
  getFieldRequired(fieldName: string, isPrestataire: boolean): boolean {
    if (fieldName === 'companyName' || fieldName === 'siretSiren') return isPrestataire;
    return true;
  }

  /**
   * Fournit la liste ordonnée des champs du formulaire selon le type d'utilisateur.
   * @param isPrestataire Indique si l'utilisateur est un prestataire
   * @returns Tableau des noms de champs
   */
  getRegistrationFields(isPrestataire: boolean): string[] {
    return isPrestataire
      ? ['firstName', 'lastName', 'companyName', 'siretSiren', 'email', 'phoneNumber', 'address', 'postalCode', 'city', 'userSecret']
      : ['firstName', 'lastName', 'email', 'phoneNumber', 'address', 'postalCode', 'city', 'userSecret'];
  }

  /**
   * Retourne la map des libellés pour tous les champs.
   * @returns Objet clé-valeur (nom du champ → libellé)
   */
  getFieldLabels(): Record<string, string> {
    return {
      firstName: 'Prénom',
      lastName: 'Nom',
      companyName: "Nom de l'entreprise",
      siretSiren: 'SIRET',
      email: 'Email',
      phoneNumber: 'Téléphone',
      address: 'Adresse',
      postalCode: 'Code postal',
      city: 'Ville',
      userSecret: 'Mot de passe'
    };
  }
}
