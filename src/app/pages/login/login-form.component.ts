import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, RouterLink, Router } from '@angular/router';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { LoginResponse, LoginPayload } from '../../models/interfacesLogin';

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
  private readonly API_URL = 'http://localhost:8080/api/auth/login';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.initializeForm();
  }

  /**
   * Initialise le formulaire de connexion
   */
  private initializeForm(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  /**
   * Gestion de la soumission du formulaire de connexion
   */
  onSubmit(): void {
    if (!this.form.valid) {
      this.handleInvalidForm();
      return;
    }

    const payload = this.createLoginPayload();
    
    this.performLogin(payload);
  }

  /**
   * Gère les cas où le formulaire est invalide
   */
  private handleInvalidForm(): void {
    this.form.markAllAsTouched();
    
    const errorMessage = this.getValidationErrorMessage();
    alert(errorMessage);
  }

  /**
   * Génère un message d'erreur de validation approprié
   */
  private getValidationErrorMessage(): string {
    const emailControl = this.form.get('email');
    const passwordControl = this.form.get('password');

    if (emailControl?.hasError('required')) return 'L\'email est requis';
    if (emailControl?.hasError('email')) return 'Format d\'email invalide';
    if (passwordControl?.hasError('required')) return 'Le mot de passe est requis';
    if (passwordControl?.hasError('minlength')) return 'Le mot de passe doit contenir au moins 6 caractères';
    
    return 'Formulaire invalide - vérifiez vos données';
  }

  /**
   * Crée le payload pour la requête de connexion
   */
  private createLoginPayload(): LoginPayload {
    return {
      email: this.form.value.email,
      password: this.form.value.password
    };
  }

  /**
   * Effectue la requête de connexion vers l'API
   */
  private performLogin(payload: LoginPayload): void {
    const httpOptions = {
      headers: { 'Content-Type': 'application/json' },
      observe: 'response' as const,
      responseType: 'json' as const
    };

    this.http.post<LoginResponse>(this.API_URL, payload, httpOptions).subscribe({
      next: (response) => this.handleLoginSuccess(response),
      error: (err) => this.handleLoginError(err)
    });
  }

  /**
   * Gère le succès de la connexion
   */
  private handleLoginSuccess(response: HttpResponse<LoginResponse>): void {
    
    const responseBody = response.body;
    if (!responseBody?.token) {
      alert('Erreur: Token manquant dans la réponse du serveur');
      return;
    }

    // Stockage des données d'authentification
    this.storeAuthenticationData(responseBody.token, responseBody.userRole);
    
    alert('Connexion réussie !');
    this.redirectAfterLogin();
  }

  /**
   * Stocke les données d'authentification en localStorage
   */
  private storeAuthenticationData(token: string, userRole: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('userRole', userRole || '');
  }

  /**
   * Redirige l'utilisateur après une connexion réussie
   */
  private redirectAfterLogin(): void {
    this.router.navigate(['/home']);
  }

  /**
   * Gère les erreurs de connexion
   */
  private handleLoginError(err: HttpErrorResponse): void {

    // Gérer les "fausses erreurs" (succès avec erreur de parsing)
    if (err.status === 200 || err.status === 201) {
      this.handleSuccessWithParseError(err);
      return;
    }

    // Gérer les vraies erreurs de connexion
    const errorMessage = this.getLoginErrorMessage(err);
    alert('Erreur lors de la connexion : ' + errorMessage);
    
    this.resetPasswordField();
  }

  /**
   * Gère le cas d'un succès avec erreur de parsing de la réponse
   */
  private handleSuccessWithParseError(err: HttpErrorResponse): void {
    
    // Essayer de récupérer le token même en cas d'erreur de parsing
    const token = this.extractTokenFromErrorResponse(err);
    if (token) {
      this.storeAuthenticationData(token, '');
    }
    this.redirectAfterLogin();
  }

  /**
   * Essaie d'extraire le token d'une réponse d'erreur
   */
  private extractTokenFromErrorResponse(err: HttpErrorResponse): string | null {
    try {
      if (err.error?.text) {
        const parsed = JSON.parse(err.error.text);
        return parsed.token || null;
      }
      return err.error?.token || null;
    } catch (parseError) {
      return null;
    }
  }

  /**
   * Génère un message d'erreur approprié selon l'erreur de connexion
   */
  private getLoginErrorMessage(err: HttpErrorResponse): string {
    const errorMessages: { [key: number]: string } = {
      401: 'Email ou mot de passe incorrect',
      403: 'Accès non autorisé',
      404: 'Service de connexion non disponible',
      500: 'Erreur interne du serveur',
      0: 'Impossible de contacter le serveur'
    };

    return errorMessages[err.status] || err.error?.message || 'Erreur de connexion inconnue';
  }

  /**
   * Remet à zéro le champ mot de passe après une erreur
   */
  private resetPasswordField(): void {
    this.form.get('password')?.setValue('');
  }
}