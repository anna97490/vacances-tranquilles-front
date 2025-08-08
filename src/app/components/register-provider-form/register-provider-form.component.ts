import {
  Component,
  OnDestroy,
  ViewEncapsulation,
  Renderer2
} from '@angular/core';
import {
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { ConfigService } from '../../services/config/config.service';
import { RegisterValidationService } from '../../services/register/register-validation.service';
import { RegisterFormConfigService } from '../../services/register/register-form-config.service';
import { UserTypeDetectorService } from '../../services/register/user-type-detector.service';
import { RegisterApiBuilderService } from '../../services/register/register-api-builder.service';
import { RegisterService } from '../../services/register/register.service';

@Component({
  selector: 'app-register-provider-form',
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
  templateUrl: './register-provider-form.component.html',
  styleUrl: './register-provider-form.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class RegisterProviderFormComponent implements OnDestroy {
  form!: FormGroup;
  isPrestataire = true; // Ce composant est spécifiquement pour les prestataires
  beach_access = './assets/icons/beach_access_FFA101.svg';
  apiError: string | null = null; // Pour stocker l'erreur d'API
  private readonly routerSubscription?: Subscription;
  urlApi: string;

  constructor(
    private readonly renderer: Renderer2,
    private readonly configService: ConfigService,
    private readonly validationService: RegisterValidationService,
    private readonly formConfigService: RegisterFormConfigService,
    private readonly userTypeDetector: UserTypeDetectorService,
    private readonly apiBuilder: RegisterApiBuilderService,
    private readonly registerService: RegisterService
  ) {
    this.urlApi = this.configService.apiUrl;
    this.initializeForm();
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

    const apiConfig = this.apiBuilder.buildApiConfig(this.form, this.isPrestataire, this.urlApi);
    this.performRegistration(apiConfig);
  }

  /**
   * Gère les cas où le formulaire est invalide
   */
  private handleInvalidForm(): void {
    console.warn('Formulaire d\'inscription prestataire invalide');
    this.form.markAllAsTouched();

    // Vérifier si tous les champs requis sont remplis
    if (!this.validationService.areAllRequiredFieldsFilled(this.form, this.isPrestataire)) {
      const missingFields = this.getMissingFields();
      console.error(`Champs manquants : ${missingFields.join(', ')}`);
    }

    // Les erreurs s'affichent maintenant directement dans le template
  }

  /**
   * Récupère la liste des champs manquants pour l'affichage
   */
  private getMissingFields(): string[] {
    const requiredFields = ['firstName', 'lastName', 'email', 'userSecret', 'phoneNumber', 'address', 'city', 'postalCode', 'companyName', 'siretSiren'];

    const missingFields: string[] = [];
    const fieldLabels: { [key: string]: string } = {
      firstName: 'Prénom',
      lastName: 'Nom',
      email: 'Email',
      userSecret: 'Mot de passe',
      phoneNumber: 'Téléphone',
      address: 'Adresse',
      city: 'Ville',
      postalCode: 'Code postal',
      companyName: 'Nom de l\'entreprise',
      siretSiren: 'SIRET'
    };

    for (const fieldName of requiredFields) {
      const control = this.form.get(fieldName);
      if (!control || !control.value || control.value.trim() === '') {
        missingFields.push(fieldLabels[fieldName] || fieldName);
      }
    }

    return missingFields;
  }

  /**
   * Vérifie s'il y a des champs manquants
   */
  hasMissingFields(): boolean {
    return !this.validationService.areAllRequiredFieldsFilled(this.form, this.isPrestataire);
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
    // Réinitialiser l'erreur précédente
    this.apiError = null;

    this.registerService.performRegistration(apiConfig).subscribe({
      next: (response) => {
        this.registerService.handleRegistrationSuccess(response, this.isPrestataire);
      },
      error: (err) => {
        // Spécifique: email déjà utilisé (409)
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
   * Réinitialise le champ mot de passe du formulaire
   */
  resetPasswordField(): void {
    this.validationService.resetPasswordField(this.form);
  }

  /**
   * Nettoyage lors de la destruction du composant
   */
  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  /**
   * Récupère le titre du formulaire selon le type d'utilisateur
   */
  getFormTitle(): string {
    return this.userTypeDetector.getPrestataireFormTitle();
  }

  /**
   * Retourne le type d'utilisateur sous forme de chaîne pour affichage.
   * @returns Le type d'utilisateur détecté (par ex. 'prestataire').
   */
  getUserTypeString(): string {
    return this.userTypeDetector.getPrestataireUserTypeString();
  }

  /**
   * Vérifie si un champ doit être affiché selon le type d'utilisateur
   */
  shouldShowField(fieldName: string): boolean {
    return this.formConfigService.shouldShowField(fieldName, this.isPrestataire);
  }

  /**
   * Récupère les classes CSS pour un champ selon son état de validation
   */
  getFieldClasses(fieldName: string): string {
    return this.validationService.getFieldClasses(this.form, fieldName);
  }

  /**
   * Récupère le libellé d'un champ selon le type d'utilisateur.
   * @param fieldName Le nom du champ de formulaire.
   * @returns Le libellé à afficher pour le champ.
   */
  getFieldLabel(fieldName: string): string {
    return this.formConfigService.getFieldLabel(fieldName, this.isPrestataire);
  }

  /**
   * Récupère le placeholder d'un champ selon le type d'utilisateur.
   * @param fieldName Le nom du champ de formulaire.
   * @returns Le placeholder à afficher pour le champ.
   */
  getFieldPlaceholder(fieldName: string): string {
    return this.formConfigService.getFieldPlaceholder(fieldName, this.isPrestataire);
  }

  /**
   * Récupère le type d'input d'un champ selon le type d'utilisateur.
   * @param fieldName Le nom du champ de formulaire.
   * @returns Le type d'input (ex: 'text', 'email', 'password').
   */
  getFieldType(fieldName: string): string {
    return this.formConfigService.getFieldType(fieldName, this.isPrestataire);
  }

  /**
   * Indique si un champ est requis selon le type d'utilisateur.
   * @param fieldName Le nom du champ de formulaire.
   * @returns true si le champ est requis, sinon false.
   */
  getFieldRequired(fieldName: string): boolean {
    return this.formConfigService.getFieldRequired(fieldName, this.isPrestataire);
  }

  /**
   * Détecte le type d'utilisateur à partir de l'URL courante.
   * @returns true si l'utilisateur est un prestataire, sinon false.
   */
  detectUserTypeFromUrl(): boolean {
    return this.userTypeDetector.detectUserTypeFromUrl();
  }

  /**
   * Détecte le type d'utilisateur à partir d'une chaîne fournie.
   * @param str Chaîne de détection (ex: segment d'URL ou paramètre).
   * @returns true si la chaîne indique un prestataire, sinon false.
   */
  detectUserTypeFromString(str: string): boolean {
    return this.userTypeDetector.detectUserTypeFromString(str);
  }

  /**
   * Retourne l'URL de base de l'API provenant de la configuration d'application.
   * @returns L'URL de l'API.
   */
  getApiUrl(): string {
    return this.configService.apiUrl;
  }
}
