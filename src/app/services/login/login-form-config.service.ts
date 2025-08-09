// Service de configuration du formulaire de connexion
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

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

// Validateur de format d'email plus strict (exige un TLD, ex: domaine.com)
function strictEmailFormatValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isValid = emailPattern.test(control.value);
  return isValid ? null : { email: true };
}

// Validateur pour empêcher les caractères spéciaux d'injection (strict)
function injectionPreventionValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;

  const value = control.value.toString();

  // Pattern pour détecter les caractères vraiment dangereux pour les injections
  const dangerousPattern = /[<>'"&;{}()\[\]\\|`~#$%^*+=]/;

  if (dangerousPattern.test(value)) {
    return { injectionPrevention: true };
  }

  return null;
}

// Validateur personnalisé pour le mot de passe (règles de complexité) — aligné sur l'inscription prestataire
function passwordComplexityValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;

  const password = control.value;
  const errors: ValidationErrors = {};

  if (password.length < 8) {
    errors['minLength'] = true;
  }
  if (!/[a-z]/.test(password)) {
    errors['lowercase'] = true;
  }
  if (!/[A-Z]/.test(password)) {
    errors['uppercase'] = true;
  }
  if (!/\d/.test(password)) {
    errors['number'] = true;
  }
  if (!/[@$!%*?&]/.test(password)) {
    errors['special'] = true;
  }

  return Object.keys(errors).length > 0 ? errors : null;
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
