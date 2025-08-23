import {
  Component,
  ViewEncapsulation,
  ElementRef,
  ViewChild
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';

import { EnvService } from '../../services/env/env.service';
import { RegisterValidationService } from '../../services/register/register-validation.service';
import { RegisterFormConfigService } from '../../services/register/register-form-config.service';
import { UserTypeDetectorService } from '../../services/register/user-type-detector.service';
import { RegisterApiBuilderService } from '../../services/register/register-api-builder.service';
import { RegisterService } from '../../services/register/register.service';
import { BackButtonComponent } from '../../components/shared/back-button/back-button.component';

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
    RouterModule,
    BackButtonComponent
  ],
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RegisterFormComponent {
  form!: FormGroup;
  isPrestataire = false;
  mainLogo = './assets/pictures/logo.png';
  apiError: string | null = null; // Pour stocker l'erreur d'API
  urlApi: string;
  showErrorSummary = false;
  errorSummaryItems: { id: string; label: string; message: string }[] = [];

  @ViewChild('registerErrorSummary') errorSummaryRef?: ElementRef<HTMLDivElement>;

  constructor(
    private readonly envService: EnvService,
    private readonly validationService: RegisterValidationService,
    private readonly formConfigService: RegisterFormConfigService,
    private readonly userTypeDetector: UserTypeDetectorService,
    private readonly apiBuilder: RegisterApiBuilderService,
    private readonly registerService: RegisterService,
    private readonly router: Router
  ) {
    this.urlApi = this.envService.apiUrl;
    this.detectUserType();
    this.initializeForm();
  }

  /**
   * Détermine le type d'utilisateur
   */
  private detectUserType(): void {
    this.isPrestataire = this.userTypeDetector.detectUserTypeFromUrl();
  }

  /**
   * Initialise le formulaire avec les validateurs appropriés
   */
  private initializeForm(): void {
    this.form = this.formConfigService.createRegistrationForm();
    this.formConfigService.updateValidatorsBasedOnUserType(this.form, this.isPrestataire);
  }

  /**
   * Gestion de la soumission du formulaire
   */
  onSubmit(): void {
    if (!this.validationService.isFormValid(this.form)) {
      this.handleInvalidForm();
      return;
    }
    const accepted = window.confirm(
      "En continuant, vous confirmez avoir lu et accepté nos CGU.\nVoulez-vous poursuivre ?"
    );
    if (accepted) {
      const apiConfig = this.apiBuilder.buildApiConfig(this.form, this.isPrestataire, this.urlApi);
      this.performRegistration(apiConfig);
    }
  }

  /**
   * Gère les cas où le formulaire est invalide
   */
  private handleInvalidForm(): void {
    console.warn("Formulaire d'inscription invalide");
    this.form.markAllAsTouched();
    this.buildErrorSummary();
    this.showErrorSummary = this.errorSummaryItems.length > 0;
    setTimeout(() => {
      this.errorSummaryRef?.nativeElement.focus();
      this.focusFirstInvalidField();
    }, 0);
  }

  /**
   * Récupère la liste des champs manquants (source unique via service)
   */
  private getMissingFields(): string[] {
    const fields = this.formConfigService.getRegistrationFields(this.isPrestataire);
    const labels = this.formConfigService.getFieldLabels();

    const missing: string[] = [];
    for (const name of fields) {
      const ctrl = this.form.get(name);
      const val = ctrl?.value;
      const empty = val == null || (typeof val === 'string' && val.trim() === '');
      if (!ctrl || empty) {
        missing.push(labels[name] || name);
      }
    }
    return missing;
  }

  /**
   * Vérifie s'il y a des champs manquants
   */
  hasMissingFields(): boolean {
    return this.getMissingFields().length > 0;
  }

  /**
   * Récupère le texte des champs manquants pour l'affichage
   */
  getMissingFieldsText(): string {
    return this.getMissingFields().join(', ');
  }

  /**
   * Effectue la requête d'inscription
   */
  private performRegistration(apiConfig: any): void {
    this.apiError = null;
    this.registerService.performRegistration(apiConfig).subscribe({
      next: (response) => {
        this.registerService.handleRegistrationSuccess(response, this.isPrestataire);
      },
      error: (err) => {
        if (err?.status === 409) {
          const emailControl = this.form.get('email');
          emailControl?.setErrors({ ...(emailControl.errors || {}), emailTaken: true });
          emailControl?.markAsTouched();
        }
        const errorMessage = this.registerService.handleRegistrationError(err, this.isPrestataire);
        if (errorMessage) {
          this.apiError = errorMessage;
        }
      }
    });
  }

  /**
   * Construit un message unique pour les erreurs du mot de passe
   */
  getPasswordErrorText(): string {
    const control = this.form?.get('userSecret');
    if (!control || !control.errors || !control.touched) return '';
    
    if (control.errors['required']) {
      return 'Le mot de passe est requis';
    }

    const constraints = [
      { key: 'minLength', label: 'au moins 8 caractères' },
      { key: 'lowercase', label: 'une minuscule' },
      { key: 'uppercase', label: 'une majuscule' },
      { key: 'number', label: 'un chiffre' },
      { key: 'special', label: 'un caractère spécial' }
    ];

    const missing = constraints
      .filter(constraint => control.errors && control.errors[constraint.key])
      .map(constraint => constraint.label);

    if (missing.length === 0) return '';

    const last = missing.pop();
    const prefix = missing.length > 0 ? missing.join(', ') + ' et ' : '';
    return `Le mot de passe doit contenir ${prefix}${last}`;
  }

  /**
   * Construit un message unique pour un champ donné
   */
  getFieldErrorText(fieldName: string): string {
    const control = this.form?.get(fieldName);
    if (!control || !control.errors || !control.touched) return '';

    const labels = this.formConfigService.getFieldLabels();
    const dangerLabel = labels[fieldName] || fieldName;

    // Table de correspondance des messages d'erreur
    const fieldMessages: Record<string, Record<string, string>> = {
      firstName: { 
        required: 'Le prénom est requis', 
        lettersOnly: 'Le prénom ne doit contenir que des lettres', 
        injectionPrevention: `${dangerLabel} ne doit pas contenir de caractères spéciaux dangereux` 
      },
      lastName: { 
        required: 'Le nom est requis', 
        lettersOnly: 'Le nom ne doit contenir que des lettres', 
        injectionPrevention: `${dangerLabel} ne doit pas contenir de caractères spéciaux dangereux` 
      },
      companyName: { 
        required: "Le nom de l'entreprise est requis", 
        injectionPrevention: `${dangerLabel} ne doit pas contenir de caractères spéciaux dangereux` 
      },
      siretSiren: { 
        required: 'Le numéro SIRET est requis', 
        pattern: 'Le SIRET doit contenir 14 chiffres', 
        injectionPrevention: `${dangerLabel} ne doit pas contenir de caractères spéciaux dangereux` 
      },
      email: { 
        required: "L'email est requis", 
        emailFormat: "Format d'email invalide", 
        injectionPrevention: `${dangerLabel} ne doit pas contenir de caractères spéciaux dangereux`, 
        emailTaken: 'Cet email est déjà utilisé' 
      },
      phoneNumber: { 
        required: 'Le numéro de téléphone est requis', 
        phoneNumberLength: 'Le numéro de téléphone doit contenir exactement 10 chiffres', 
        numbersOnly: 'Le numéro de téléphone ne doit contenir que des chiffres', 
        injectionPrevention: `${dangerLabel} ne doit pas contenir de caractères spéciaux dangereux` 
      },
      address: { 
        required: "L'adresse est requise", 
        injectionPrevention: `${dangerLabel} ne doit pas contenir de caractères spéciaux dangereux` 
      },
      postalCode: { 
        required: 'Le code postal est requis', 
        pattern: 'Le code postal doit contenir 5 chiffres', 
        injectionPrevention: `${dangerLabel} ne doit pas contenir de caractères spéciaux dangereux` 
      },
      city: { 
        required: 'La ville est requise', 
        lettersOnly: 'La ville ne doit contenir que des lettres', 
        injectionPrevention: `${dangerLabel} ne doit pas contenir de caractères spéciaux dangereux` 
      }
    };

    // Récupérer le premier message d'erreur applicable
    const messages = fieldMessages[fieldName];
    if (messages) {
      for (const [key, message] of Object.entries(messages)) {
        if (control.errors[key]) {
          return message;
        }
      }
    }
    return '';
  }

  /**
   * Construit le résumé des erreurs du formulaire d'inscription
   */
  private buildErrorSummary(): void {
    const labels = this.formConfigService.getFieldLabels();
    const fields = this.formConfigService.getRegistrationFields(this.isPrestataire);

    this.errorSummaryItems = fields
      .map(field => ({ field, ctrl: this.form.get(field) }))
      .filter(({ ctrl }) => ctrl && ctrl.invalid)
      .map(({ field, ctrl }) => ({
        id: field,
        label: labels[field] || field,
        message: field === 'userSecret' ? this.getPasswordErrorText() : this.getFieldErrorText(field)
      }))
      .filter(item => !!item.message);
  }

  /**
   * Met le focus sur un champ spécifique du formulaire
   */
  focusField(fieldId: string): void {
    const el = document.getElementById(fieldId) as HTMLElement | null;
    if (el) el.focus();
  }

  /**
   * Met le focus sur le premier champ invalide du formulaire
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

  /**
   * Détecte le type d'utilisateur à partir de l'URL courante
   */
  detectUserTypeFromUrl(): boolean {
    return this.userTypeDetector.detectUserTypeFromUrl();
  }
}
