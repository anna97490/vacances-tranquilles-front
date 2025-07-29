import {
  Component,
  OnDestroy,
  ViewEncapsulation,
  Renderer2
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { RegisterPayload, ApiConfig } from '../../models/interfacesRegister';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class RegisterFormComponent implements OnDestroy {
  form!: FormGroup;
  isPrestataire = false;
  mainLogo = './assets/pictures/logo.png';
  
  private readonly routerSubscription?: Subscription;
  private readonly API_BASE_URL = 'http://localhost:8080/api/auth/register';

  constructor(
    private readonly fb: FormBuilder,
    private readonly renderer: Renderer2,
    private readonly http: HttpClient,
    private readonly router: Router
  ) {
    this.detectUserType();
    this.initializeForm();
  }

  /**
   * Checks if the error response is a potential parse error (status 200 or 201).
   */
  private isPotentialParseError(error: { status: number }): boolean {
    return error.status === 200 || error.status === 201;
  }

  /**
   * Handles actual HTTP errors during registration.
   * @param error The HttpErrorResponse object.
   */
  private processActualError(error: HttpErrorResponse): void {
    window.alert('Erreur lors de la connexion : ' + this.getRegistrationErrorMessage(error));
    this.resetPasswordField();
  }

  /**
   * Réinitialise le champ mot de passe du formulaire.
   */
  resetPasswordField(): void {
    const passwordControl = this.form.get('password');
    if (passwordControl) {
      passwordControl.setValue('');
      passwordControl.markAsUntouched();
    }
  }

  /**
   * Extracts token from an error response, returns null if parsing fails.
   */
  private extractTokenFromErrorResponse(error: any): string | null {
    try {
      if (typeof error?.error?.text === 'string') {
        const parsed = JSON.parse(error.error.text);
        return parsed.token || null;
      }
    } catch (e) {
      console.warn('Erreur lors du parsing du token depuis la réponse:', e);
      return null;
    }
    return null;
  }

  /**
   * Détermine le type d'utilisateur à partir de l'URL
   */
  private detectUserType(): void {
    const path = window.location.pathname;
    this.isPrestataire = path.includes('prestataire');
  }

  /**
   * Initialise le formulaire avec les validateurs appropriés
   */
  private initializeForm(): void {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phoneNumber: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', [
        Validators.required, 
        Validators.pattern(/^\d{5}$/)  // Utilisation de \d au lieu de [0-9]
      ]],
      companyName: [''],
      siretSiren: ['']
    });
  }

  /**
   * Met à jour les validateurs selon le type d'utilisateur
   */
  private updateValidatorsBasedOnUserType(): void {
const companyNameControl = this.form.get('companyName');
    const siretSirenControl = this.form.get('siretSiren');

    if (this.isPrestataire) {
      companyNameControl?.setValidators([Validators.required]);
      siretSirenControl?.setValidators([
        Validators.required,
        Validators.pattern(/^\d{14}$/)  // Utilisation de \d au lieu de [0-9]
      ]);
    } else {
      companyNameControl?.clearValidators();
      siretSirenControl?.clearValidators();
    }

    companyNameControl?.updateValueAndValidity();
    siretSirenControl?.updateValueAndValidity();
  }

  /**
   * Gestion de la soumission du formulaire
   */
  onSubmit(): void {
    if (!this.isFormValid()) {
      this.handleInvalidForm();
      return;
    }

    const apiConfig = this.buildApiConfig();
    this.performRegistration(apiConfig);
  }

  /**
   * Vérifie la validité du formulaire
   */
  private isFormValid(): boolean {
    return this.form.valid;
  }

  /**
   * Gère les cas où le formulaire est invalide
   */
  private handleInvalidForm(): void {
    console.warn('⚠️ Formulaire d\'inscription invalide');
    this.form.markAllAsTouched();
    
    const errorMessage = this.getValidationErrorMessage();
    alert(errorMessage);
  }

  /**
   * Génère un message d'erreur de validation approprié
   */
  private getValidationErrorMessage(): string {
    const controls = this.form.controls;
    
    // Vérifier les erreurs des champs communs
    const commonFieldError = this.checkCommonFieldErrors(controls);
    if (commonFieldError) return commonFieldError;
    
    // Vérifier les erreurs spécifiques aux prestataires
    const prestataireError = this.checkPrestataireErrors(controls);
    if (prestataireError) return prestataireError;
    
    return 'Formulaire invalide - vérifiez vos données';
  }

  private checkCommonFieldErrors(controls: { [key: string]: AbstractControl }): string | null {
    if (controls['firstName']?.hasError('required')) return 'Le prénom est requis';
    if (controls['lastName']?.hasError('required')) return 'Le nom est requis';
    if (controls['email']?.hasError('required')) return 'L\'email est requis';
    if (controls['email']?.hasError('email')) return 'Format d\'email invalide';
    if (controls['password']?.hasError('required')) return 'Le mot de passe est requis';
    if (controls['password']?.hasError('minlength')) return 'Le mot de passe doit contenir au moins 6 caractères';
    if (controls['phoneNumber']?.hasError('required')) return 'Le numéro de téléphone est requis';
    if (controls['address']?.hasError('required')) return 'L\'adresse est requise';
    if (controls['city']?.hasError('required')) return 'La ville est requise';
    if (controls['postalCode']?.hasError('required')) return 'Le code postal est requis';
    if (controls['postalCode']?.hasError('pattern')) return 'Le code postal doit contenir 5 chiffres';
    
    return null;
  }

  private checkPrestataireErrors(controls: { [key: string]: AbstractControl }): string | null {
    if (this.isPrestataire) {
      if (controls['companyName']?.hasError('required')) return 'Le nom de l\'entreprise est requis';
      if (controls['siretSiren']?.hasError('required')) return 'Le numéro SIRET/SIREN est requis';
      if (controls['siretSiren']?.hasError('pattern')) return 'Le SIRET/SIREN doit contenir 14 chiffres';
    }
    
    return null;
  }

  /**
   * Construit la configuration API selon le type d'utilisateur
   */
  private buildApiConfig(): ApiConfig {
    const basePayload: RegisterPayload = {
      firstName: this.form.value.firstName,
      lastName: this.form.value.lastName,
      email: this.form.value.email,
      password: this.form.value.password,
      phoneNumber: this.form.value.phoneNumber,
      address: this.form.value.address,
      city: this.form.value.city,
      postalCode: this.form.value.postalCode
    };

    if (this.isPrestataire) {
      return {
        url: `${this.API_BASE_URL}/provider`,
        payload: {
          ...basePayload,
          companyName: this.form.value.companyName,
          siretSiren: this.form.value.siretSiren
        }
      };
    } else {
      return {
        url: `${this.API_BASE_URL}/client`,
        payload: basePayload
      };
    }
  }

  /**
   * Effectue la requête d'inscription
   */
  private performRegistration(apiConfig: ApiConfig): void {
    const httpOptions = {
      headers: { 'Content-Type': 'application/json' },
      observe: 'response' as const,
      responseType: 'text' as const
    };

    this.http.post(apiConfig.url, apiConfig.payload, httpOptions).subscribe({
      next: (response) => this.handleRegistrationSuccess(response),
      error: (err) => this.handleRegistrationError(err)
    });
  }

  /**
   * Gère le succès de l'inscription
   */
  private handleRegistrationSuccess(response: HttpResponse<any>): void {
    this.showSuccessMessage();
    this.redirectToLogin();
  }

  /**
   * Gère les erreurs d'inscription
   */
  private handleRegistrationError(err: HttpErrorResponse): void {
    console.error('❌ Erreur d\'inscription:', err);

    // Gérer les "fausses erreurs" (succès avec erreur de parsing)
    if (this.isSuccessfulButParseFailed(err)) {
      this.handleParseErrorButSuccess();
      return;
    }

    // Gérer les vraies erreurs
    const errorMessage = this.getRegistrationErrorMessage(err);
    this.showErrorMessage(errorMessage);
  }

  /**
   * Vérifie s'il s'agit d'un succès avec erreur de parsing
   */
  private isSuccessfulButParseFailed(err: HttpErrorResponse): boolean {
    return err.status === 200 || err.status === 201;
  }

  /**
   * Gère le cas d'un succès avec erreur de parsing
   */
  private handleParseErrorButSuccess(): void {
    this.showSuccessMessage();
    this.redirectToLogin();
  }

  /**
   * Génère un message d'erreur approprié selon l'erreur d'inscription
   */
  private getRegistrationErrorMessage(error: HttpErrorResponse): string {
    switch (error.status) {
        case 400:
          return 'Données invalides - vérifiez vos informations';
        case 409:
          return 'Un compte avec cet email existe déjà';
        case 422:
          return 'Données de validation incorrectes';
        case 500:
          return 'Erreur interne du serveur';
        case 0:
          return 'Impossible de contacter le serveur';
        default:
          return error.error?.message || 'Erreur inconnue lors de l\'inscription';
      }
  }

  /**
   * Affiche un message de succès
   */
  private showSuccessMessage(): void {
    const userType = this.isPrestataire ? 'prestataire' : 'particulier';
    alert(`Inscription ${userType} réussie ! Vous pouvez maintenant vous connecter.`);
  }

  /**
   * Affiche un message d'erreur
   */
  private showErrorMessage(message: string): void {
    alert('Erreur lors de l\'inscription : ' + message);
  }

  /**
   * Redirige vers la page de connexion
   */
  private redirectToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  /**
   * Nettoyage lors de la destruction du composant
   */
  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  // ✅ MÉTHODES UTILITAIRES PUBLIQUES

  /**
   * Récupère le titre du formulaire selon le type d'utilisateur
   */
  getFormTitle(): string {
    return this.isPrestataire ? 'Inscription Prestataire' : 'Inscription Particulier';
  }

  /**
   * Vérifie si un champ doit être affiché selon le type d'utilisateur
   */
  shouldShowField(fieldName: string): boolean {
    const prestataireOnlyFields = ['companyName', 'siretSiren'];
    
    if (prestataireOnlyFields.includes(fieldName)) {
      return this.isPrestataire;
    }
    
    return true;
  }

  /**
   * Récupère les classes CSS pour un champ selon son état de validation
   */
  getFieldClasses(fieldName: string): string {
    const field = this.form.get(fieldName);
    
    if (!field) return '';
    
    return field.invalid && field.touched ? 'field-error' : '';
  }
}