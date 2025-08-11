import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * Constantes d'interface utilisateur pour les libellés des champs
 */
const UI_FIELD_LABELS = {
  firstName: 'Prénom',
  lastName: 'Nom',
  email: 'Email',
  phoneNumber: 'Téléphone',
  city: 'Ville',
  description: 'Description'
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
 * Crée un validateur pour prévenir les injections de caractères dangereux
 * @param pattern Pattern regex des caractères dangereux
 * @returns Fonction de validation
 */
function makeDangerValidator(pattern: RegExp) {
  return (control: AbstractControl): ValidationErrors | null => {
    return validateIfNotEmpty(control, (value) => {
      return pattern.test(value) ? { injectionPrevention: true } : null;
    });
  };
}

// Définition des patterns d'injection
const DANGEROUS_GENERAL = /[<>'"&;{}()\[\]\\|`~#$%^*+=]/;
const DANGEROUS_EMAIL = /[<>'"&;{}()\[\]\\|`~#$%^*=]/;

const injectionPreventionValidator = makeDangerValidator(DANGEROUS_GENERAL);
const emailInjectionPreventionValidator = makeDangerValidator(DANGEROUS_EMAIL);

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
 * Valide le format d'un email
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
 * Valide le format d'un numéro de téléphone français
 * @param control Contrôle Angular
 * @returns Erreurs de validation ou null
 */
function phoneNumberValidator(control: AbstractControl): ValidationErrors | null {
  return validateIfNotEmpty(control, (value) => {
    // Supprime tous les espaces et caractères non numériques
    const cleanValue = value.replace(/\s/g, '');
    // Vérifie que c'est un numéro français valide (10 chiffres commençant par 0)
    const phonePattern = /^0[1-9](\d{8})$/;
    return phonePattern.test(cleanValue) ? null : { phoneNumberFormat: true };
  });
}

/**
 * Valide la longueur d'une description
 * @param control Contrôle Angular
 * @returns Erreurs de validation ou null
 */
function descriptionLengthValidator(control: AbstractControl): ValidationErrors | null {
  return validateIfNotEmpty(control, (value) => {
    if (value.length > 500) return { maxLength: { max: 500, actual: value.length } };
    return null;
  });
}

@Injectable({
  providedIn: 'root'
})
export class ProfileValidationService {

  constructor(private fb: FormBuilder) {}

  /**
   * Crée le formulaire de profil avec les validateurs appropriés.
   * @returns FormGroup configuré
   */
  createProfileForm(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required, lettersOnlyValidator, injectionPreventionValidator]],
      lastName: ['', [Validators.required, lettersOnlyValidator, injectionPreventionValidator]],
      email: ['', [Validators.required, emailFormatValidator, emailInjectionPreventionValidator]],
      phoneNumber: ['', [Validators.required, phoneNumberValidator, injectionPreventionValidator]],
      city: ['', [Validators.required, lettersOnlyValidator, injectionPreventionValidator]],
      description: ['', [descriptionLengthValidator, injectionPreventionValidator]]
    });
  }

  /**
   * Récupère les libellés des champs
   * @returns Objet contenant les libellés
   */
  getFieldLabels(): { [key: string]: string } {
    return UI_FIELD_LABELS;
  }

  /**
   * Génère un message d'erreur de validation approprié pour un champ
   * @param fieldName Nom du champ
   * @param control Contrôle du formulaire
   * @returns Message d'erreur ou chaîne vide
   */
  getFieldErrorText(fieldName: string, control: AbstractControl): string {
    if (!control || !control.errors || !control.touched) return '';

    const labels = this.getFieldLabels();
    const L = (k: string) => labels[k] || k;

    switch (fieldName) {
      case 'firstName':
        if (control.errors['required']) return 'Le prénom est requis';
        if (control.errors['lettersOnly']) return 'Le prénom ne doit contenir que des lettres';
        if (control.errors['injectionPrevention']) return `Le prénom ne doit pas contenir de caractères spéciaux dangereux`;
        break;
      case 'lastName':
        if (control.errors['required']) return 'Le nom est requis';
        if (control.errors['lettersOnly']) return 'Le nom ne doit contenir que des lettres';
        if (control.errors['injectionPrevention']) return `Le nom ne doit pas contenir de caractères spéciaux dangereux`;
        break;
      case 'email':
        if (control.errors['required']) return "L'email est requis";
        if (control.errors['emailFormat']) return "Format d'email invalide";
        if (control.errors['injectionPrevention']) return `L'email ne doit pas contenir de caractères spéciaux dangereux`;
        break;
      case 'phoneNumber':
        if (control.errors['required']) return 'Le numéro de téléphone est requis';
        if (control.errors['phoneNumberFormat']) return 'Format de numéro de téléphone invalide (ex: 0612345678)';
        if (control.errors['injectionPrevention']) return `Le numéro de téléphone ne doit pas contenir de caractères spéciaux dangereux`;
        break;
      case 'city':
        if (control.errors['required']) return 'La ville est requise';
        if (control.errors['lettersOnly']) return 'La ville ne doit contenir que des lettres';
        if (control.errors['injectionPrevention']) return `La ville ne doit pas contenir de caractères spéciaux dangereux`;
        break;
      case 'description':
        if (control.errors['maxLength']) return `La description ne doit pas dépasser ${control.errors['maxLength'].max} caractères`;
        if (control.errors['injectionPrevention']) return `La description ne doit pas contenir de caractères spéciaux dangereux`;
        break;
    }

    return '';
  }

  /**
   * Vérifie si le formulaire est valide
   * @param form Formulaire à vérifier
   * @returns true si le formulaire est valide
   */
  isFormValid(form: FormGroup): boolean {
    return form.valid;
  }

  /**
   * Marque tous les champs comme touchés pour afficher les erreurs
   * @param form Formulaire à marquer
   */
  markAllFieldsAsTouched(form: FormGroup): void {
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      control?.markAsTouched();
    });
  }
}
