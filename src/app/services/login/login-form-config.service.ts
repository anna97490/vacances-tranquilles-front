// Service de configuration du formulaire de connexion
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class LoginFormConfigService {

  constructor(private fb: FormBuilder) {}

  /**
   * Crée un formulaire de connexion avec les validateurs appropriés
   */
  createLoginForm(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      userSecret: ['', [Validators.required, Validators.minLength(6)]]
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