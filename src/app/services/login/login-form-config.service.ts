// Service de configuration du formulaire de connexion
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * Exécute une validation uniquement si la valeur est non vide
 */
function validateIfNotEmpty(control: AbstractControl, fn: (value: string) => ValidationErrors | null): ValidationErrors | null {
  if (!control.value) return null;
  return fn(control.value.toString());
}

/**
 * Crée un validateur qui détecte les caractères dangereux
 */
function createInjectionPreventionValidator(pattern: RegExp) {
  return (control: AbstractControl): ValidationErrors | null =>
    validateIfNotEmpty(control, value =>
      pattern.test(value) ? { injectionPrevention: true } : null
    );
}

// Validateur spécifique pour les emails (autorise @ et .)
const emailInjectionPreventionValidator = createInjectionPreventionValidator(/[<>'"&;{}()\[\]\\|`~#$%^*=]/);

// Validateur de format d'email plus strict (exige un TLD, ex: domaine.com)
function strictEmailFormatValidator(control: AbstractControl): ValidationErrors | null {
  return validateIfNotEmpty(control, value => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(value) ? null : { email: true };
  });
}

// Validateur personnalisé pour le mot de passe (règles de complexité)
function passwordComplexityValidator(control: AbstractControl): ValidationErrors | null {
  return validateIfNotEmpty(control, value => {
    const errors: ValidationErrors = {};
    if (value.length < 8) errors['minLength'] = true;
    if (!/[a-z]/.test(value)) errors['lowercase'] = true;
    if (!/[A-Z]/.test(value)) errors['uppercase'] = true;
    if (!/\d/.test(value)) errors['number'] = true;
    if (!/[@$!%*?&]/.test(value)) errors['special'] = true;
    return Object.keys(errors).length > 0 ? errors : null;
  });
}

@Injectable({
  providedIn: 'root'
})
export class LoginFormConfigService {
  constructor(private readonly fb: FormBuilder) {}

  /**
   * Crée un formulaire de connexion avec les validateurs appropriés
   */
  createLoginForm(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, strictEmailFormatValidator, emailInjectionPreventionValidator]],
      userSecret: ['', [Validators.required, Validators.minLength(8), passwordComplexityValidator]]
    });
  }

  /**
   * Crée le payload pour la requête de connexion
   * @param form Le formulaire avec les données
   */
  createLoginPayload(form: FormGroup): { email: string; password: string } {
    return {
      email: form.value.email,
      password: form.value.userSecret // Mappé depuis userSecret vers password pour l'API
    };
  }
}
