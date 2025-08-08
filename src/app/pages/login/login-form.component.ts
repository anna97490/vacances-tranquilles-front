import { Component, ViewEncapsulation } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, RouterLink } from '@angular/router';
import { LoginPayload } from './../../models/Login';
import { ConfigService } from '../../services/config/config.service';
import { LoginValidationService } from '../../services/login/login-validation.service';
import { LoginFormConfigService } from '../../services/login/login-form-config.service';
import { LoginService } from '../../services/login/login.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    RouterLink
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LoginFormComponent {
  form!: FormGroup;
  mainLogo = './assets/pictures/logo.png';
  urlApi: string;
  apiError: string | null = null; // Pour stocker l'erreur d'API
  emailError: string | null = null; // Erreur spécifique à l'email
  passwordError: string | null = null; // Erreur spécifique au mot de passe

  constructor(
    private readonly configService: ConfigService,
    private readonly validationService: LoginValidationService,
    private readonly formConfigService: LoginFormConfigService,
    private readonly loginService: LoginService
  ) {
    this.urlApi = this.configService.apiUrl;
    this.initializeForm();
  }

  /**
   * Initialise le formulaire de connexion
   */
  private initializeForm(): void {
    this.form = this.formConfigService.createLoginForm();
  }

  /**
   * Gestion de la soumission du formulaire de connexion
   */
  onSubmit(): void {
    // Réinitialiser les erreurs précédentes
    this.clearErrors();

    if (!this.validationService.isFormValid(this.form)) {
      this.handleInvalidForm();
      return;
    }

    const payload = this.createLoginPayload();
    this.performLogin(payload);
  }

  /**
   * Efface toutes les erreurs
   */
  private clearErrors(): void {
    this.apiError = null;
    this.emailError = null;
    this.passwordError = null;
  }

  /**
   * Gère les cas où le formulaire est invalide
   */
  private handleInvalidForm(): void {
    this.validationService.markAllFieldsAsTouched(this.form);

    const errorMessage = this.validationService.getValidationErrorMessage(this.form);
    this.apiError = errorMessage;
  }

  /**
   * Crée le payload pour la requête de connexion
   */
  private createLoginPayload(): LoginPayload {
    return this.formConfigService.createLoginPayload(this.form);
  }

  /**
   * Effectue la requête de connexion
   */
  private performLogin(payload: LoginPayload): void {
    this.loginService.performLogin(payload, this.urlApi).subscribe({
      next: (response) => this.loginService.handleLoginSuccess(response),
      error: (error) => {
        this.handleLoginError(error);
        this.validationService.resetPasswordField(this.form);
      }
    });
  }

  /**
   * Gère les erreurs de connexion
   */
  private handleLoginError(error: any): void {
    // Réinitialiser les erreurs spécifiques
    this.emailError = null;
    this.passwordError = null;

    // Gérer les erreurs selon le type
    if (error.status === 401) {
      // Erreur d'authentification - email ou mot de passe incorrect
      this.emailError = 'Email ou mot de passe incorrect';
      this.passwordError = 'Email ou mot de passe incorrect';
    } else if (error.status === 403) {
      this.apiError = 'Accès non autorisé';
    } else if (error.status === 404) {
      this.apiError = 'Service de connexion non disponible';
    } else if (error.status === 500) {
      this.apiError = 'Erreur interne du serveur';
    } else if (error.status === 0) {
      this.apiError = 'Impossible de contacter le serveur';
    } else {
      this.apiError = error.error?.message || 'Erreur de connexion inconnue';
    }
  }
}
