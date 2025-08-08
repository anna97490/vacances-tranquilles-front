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
      email: ['', [Validators.required, Validators.email, emailInjectionPreventionValidator]],
      userSecret: ['', [Validators.required, Validators.minLength(6), injectionPreventionValidator]]
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
