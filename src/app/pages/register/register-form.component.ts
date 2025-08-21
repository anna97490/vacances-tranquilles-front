import {
  Component,
  OnDestroy,
  ViewEncapsulation,
  Renderer2,
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
import { Subscription } from 'rxjs';

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
export class RegisterFormComponent implements OnDestroy {
  form!: FormGroup;
  isPrestataire = false;
  mainLogo = './assets/pictures/logo.png';
  apiError: string | null = null; // Pour stocker l'erreur d'API
  private readonly routerSubscription?: Subscription; // conservé pour compat
  urlApi: string;
  showErrorSummary = false;
  errorSummaryItems: { id: string; label: string; message: string }[] = [];

  @ViewChild('registerErrorSummary') errorSummaryRef?: ElementRef<HTMLDivElement>;

  constructor(
    private readonly renderer: Renderer2,
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
   * Détermine le type d'utilisateur (unifié via la méthode publique)
   */
  private detectUserType(): void {
    this.isPrestataire = this.detectUserTypeFromUrl();
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
   * Message standardisé pour l'erreur d'injection
   */
  private dangerMsg(label: string): string {
    return `${label} ne doit pas contenir de caractères spéciaux dangereux`;
  }

  /**
   * Construit un message unique pour les erreurs du mot de passe (comme login)
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
   * Construit un message unique pour un champ donné (même style que login)
   */
  getFieldErrorText(fieldName: string): string {
    const control = this.form?.get(fieldName);
    if (!control || !control.errors || !control.touched) return '';

    const labels = this.formConfigService.getFieldLabels();
    const L = (k: string) => labels[k] || k;

    switch (fieldName) {
      case 'firstName':
        if (control.errors['required']) return 'Le prénom est requis';
        if (control.errors['lettersOnly']) return 'Le prénom ne doit contenir que des lettres';
        if (control.errors['injectionPrevention']) return this.dangerMsg(L('firstName'));
        break;
      case 'lastName':
        if (control.errors['required']) return 'Le nom est requis';
        if (control.errors['lettersOnly']) return 'Le nom ne doit contenir que des lettres';
        if (control.errors['injectionPrevention']) return this.dangerMsg(L('lastName'));
        break;
      case 'companyName':
        if (control.errors['required']) return "Le nom de l'entreprise est requis";
        if (control.errors['injectionPrevention']) return this.dangerMsg(L('companyName'));
        break;
      case 'siretSiren':
        if (control.errors['required']) return 'Le numéro SIRET est requis';
        if (control.errors['pattern']) return 'Le SIRET doit contenir 14 chiffres';
        if (control.errors['injectionPrevention']) return this.dangerMsg(L('siretSiren'));
        break;
      case 'email':
        if (control.errors['required']) return "L'email est requis";
        if (control.errors['emailFormat']) return "Format d'email invalide";
        if (control.errors['injectionPrevention']) return this.dangerMsg(L('email'));
        if (control.errors['emailTaken']) return 'Cet email est déjà utilisé';
        break;
      case 'phoneNumber':
        if (control.errors['required']) return 'Le numéro de téléphone est requis';
        if (control.errors['phoneNumberLength']) return 'Le numéro de téléphone doit contenir exactement 10 chiffres';
        if (control.errors['numbersOnly']) return 'Le numéro de téléphone ne doit contenir que des chiffres';
        if (control.errors['injectionPrevention']) return this.dangerMsg(L('phoneNumber'));
        break;
      case 'address':
        if (control.errors['required']) return "L'adresse est requise";
        if (control.errors['injectionPrevention']) return this.dangerMsg(L('address'));
        break;
      case 'postalCode':
        if (control.errors['required']) return 'Le code postal est requis';
        if (control.errors['pattern']) return 'Le code postal doit contenir 5 chiffres';
        if (control.errors['injectionPrevention']) return this.dangerMsg(L('postalCode'));
        break;
      case 'city':
        if (control.errors['required']) return 'La ville est requise';
        if (control.errors['lettersOnly']) return 'La ville ne doit contenir que des lettres';
        if (control.errors['injectionPrevention']) return this.dangerMsg(L('city'));
        break;
    }
    return '';
  }

  /**
   * Construit le résumé des erreurs du formulaire d'inscription
   * (utilise la source unique fields + labels depuis le service)
   */
  private buildErrorSummary(): void {
    const labels = this.formConfigService.getFieldLabels();
    const fields = this.formConfigService.getRegistrationFields(this.isPrestataire);

    const items: { id: string; label: string; message: string }[] = [];
    const add = (id: string, label: string, message: string | null) => {
      if (message) items.push({ id, label, message });
    };

    for (const f of fields) {
      const ctrl = this.form.get(f);
      if (ctrl && ctrl.invalid) {
        const msg = f === 'userSecret' ? this.getPasswordErrorText() : this.getFieldErrorText(f);
        add(f, labels[f] || f, msg);
      }
    }
    this.errorSummaryItems = items;
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
   * Nettoyage lors de la destruction du composant
   */
  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  /**
   * Détecte le type d'utilisateur à partir de l'URL courante (exposé publiquement)
   */
  detectUserTypeFromUrl(): boolean {
    return this.userTypeDetector.detectUserTypeFromUrl();
  }
}
