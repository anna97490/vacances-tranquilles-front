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
    this.detectUserType();
    this.initializeForm();
  }

  /**
   * Détermine le type d'utilisateur à partir de l'URL
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

    const apiConfig = this.apiBuilder.buildApiConfig(this.form, this.isPrestataire, this.urlApi);
    this.performRegistration(apiConfig);
  }

  /**
   * Gère les cas où le formulaire est invalide
   */
  private handleInvalidForm(): void {
    console.warn('Formulaire d\'inscription invalide');
    this.form.markAllAsTouched();
    
    const errorMessage = this.validationService.getValidationErrorMessage(this.form, this.isPrestataire);
    alert(errorMessage);
  }

  /**
   * Effectue la requête d'inscription
   */
  private performRegistration(apiConfig: any): void {
    this.registerService.performRegistration(apiConfig).subscribe({
      next: (response) => this.registerService.handleRegistrationSuccess(response, this.isPrestataire),
      error: (err) => this.registerService.handleRegistrationError(err, this.isPrestataire)
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
    return this.isPrestataire ? 
      this.userTypeDetector.getPrestataireFormTitle() : 
      this.userTypeDetector.getParticulierFormTitle();
  }

  getUserTypeString(): string {
    return this.isPrestataire ? 
      this.userTypeDetector.getPrestataireUserTypeString() : 
      this.userTypeDetector.getParticulierUserTypeString();
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

  getFieldLabel(fieldName: string): string {
    return this.formConfigService.getFieldLabel(fieldName, this.isPrestataire);
  }

  getFieldPlaceholder(fieldName: string): string {
    return this.formConfigService.getFieldPlaceholder(fieldName, this.isPrestataire);
  }

  getFieldType(fieldName: string): string {
    return this.formConfigService.getFieldType(fieldName, this.isPrestataire);
  }

  getFieldRequired(fieldName: string): boolean {
    return this.formConfigService.getFieldRequired(fieldName, this.isPrestataire);
  }

  detectUserTypeFromUrl(): boolean {
    return this.userTypeDetector.detectUserTypeFromUrl();
  }

  detectUserTypeFromString(str: string): boolean {
    return this.userTypeDetector.detectUserTypeFromString(str);
  }

  getApiUrl(): string {
    return this.configService.apiUrl;
  }
}