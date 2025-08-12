import { Component, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FooterComponent } from '../../components/footer/footer.component';
import { RouterModule, RouterLink, Router } from '@angular/router';
import { LoginPayload } from './../../models/Login';
import { EnvService } from '../../services/env/env.service';
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
    RouterLink,
    FooterComponent
  ],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LoginFormComponent {
  form!: FormGroup;
  mainLogo = './assets/pictures/logo.png';
  urlApi: string;
  apiError: string | null = null; // Pour stocker l'erreur d'API
  emailError: string | null = null; // Erreur spécifique à l'email
  passwordError: string | null = null; // Erreur spécifique au mot de passe
  showErrorSummary = false;
  errorSummaryItems: { id: string; label: string; message: string }[] = [];
  @ViewChild('loginErrorSummary') errorSummaryRef?: ElementRef<HTMLDivElement>;

  constructor(
    private readonly envService: EnvService,
    private readonly validationService: LoginValidationService,
    private readonly formConfigService: LoginFormConfigService,
    private readonly loginService: LoginService,
    private readonly router: Router
  ) {
    this.urlApi = this.envService.apiUrl;
    this.initializeForm();
  }

  /**
   * Construit un message unique pour les erreurs de mot de passe
   */
  getPasswordErrorText(): string {
    const control = this.form?.get('userSecret');
    if (!control || !control.errors || !control.touched) return '';

    if (control.errors['required']) {
      return 'Le mot de passe est requis';
    }

    const constraints: string[] = [];
    if (control.errors['minLength']) constraints.push('au moins 8 caractères');
    if (control.errors['lowercase']) constraints.push('une minuscule');
    if (control.errors['uppercase']) constraints.push('une majuscule');
    if (control.errors['number']) constraints.push('un chiffre');
    if (control.errors['special']) constraints.push('un caractère spécial');

    if (constraints.length === 0) return '';

    const last = constraints.pop();
    const prefix = constraints.length > 0 ? constraints.join(', ') + ' et ' : '';
    return `Le mot de passe doit contenir ${prefix}${last}`;
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
    this.showErrorSummary = false;

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
    this.buildErrorSummary();
    this.showErrorSummary = this.errorSummaryItems.length > 0;
    setTimeout(() => {
      this.errorSummaryRef?.nativeElement.focus();
      this.focusFirstInvalidField();
    }, 0);
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

  /**
   * Construit le résumé des erreurs du formulaire
   * Récupère les erreurs des champs email et mot de passe et les ajoute à errorSummaryItems
   */
  private buildErrorSummary(): void {
    this.errorSummaryItems = [];
    const controls: Array<{ id: string; label: string; message: string }> = [];

    const emailCtrl = this.form.get('email');
    if (emailCtrl && emailCtrl.invalid) {
      const message = emailCtrl.hasError('required')
        ? "L'email est requis"
        : 'Format d\'email invalide';
      controls.push({ id: 'email', label: 'Email', message });
    }

    const passCtrl = this.form.get('userSecret');
    if (passCtrl && passCtrl.invalid) {
      const message = this.getPasswordErrorText() || 'Mot de passe invalide';
      controls.push({ id: 'userSecret', label: 'Mot de passe', message });
    }

    this.errorSummaryItems = controls;
  }

  /**
   * Met le focus sur un champ spécifique du formulaire
   * @param fieldId - L'ID du champ à focaliser
   */
  focusField(fieldId: string): void {
    const el = document.getElementById(fieldId) as HTMLElement | null;
    if (el) {
      el.focus();
    }
  }

  /**
   * Met le focus sur le premier champ invalide du formulaire
   * Utilise le premier élément de errorSummaryItems pour déterminer quel champ focaliser
   */
  private focusFirstInvalidField(): void {
    const first = this.errorSummaryItems[0];
    if (first) this.focusField(first.id);
  }

  /**
   * Bouton retour: ramène vers la page d'accueil
   */
  goBack(): void {
    this.router.navigate(['/home']);
  }
}
