import {
  Component,
  OnDestroy,
  ViewEncapsulation,
  Renderer2,
  ElementRef,
  ViewChild
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
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { FooterComponent } from '../../components/footer/footer.component';
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
    RouterModule,
    FooterComponent
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
  private readonly routerSubscription?: Subscription;
  urlApi: string;
  showErrorSummary = false;
  errorSummaryItems: { id: string; label: string; message: string }[] = [];
  @ViewChild('registerErrorSummary') errorSummaryRef?: ElementRef<HTMLDivElement>;

  constructor(
    private readonly renderer: Renderer2,
    private readonly configService: ConfigService,
    private readonly validationService: RegisterValidationService,
    private readonly formConfigService: RegisterFormConfigService,
    private readonly userTypeDetector: UserTypeDetectorService,
    private readonly apiBuilder: RegisterApiBuilderService,
    private readonly registerService: RegisterService,
    private readonly router: Router
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

    // Demander le consentement CGU via alerte/confirm
    const accepted = window.confirm("En continuant, vous confirmez avoir lu et accepté nos CGU.\nVoulez-vous poursuivre ?");
    if (accepted) {
      const apiConfig = this.apiBuilder.buildApiConfig(this.form, this.isPrestataire, this.urlApi);
      this.performRegistration(apiConfig);
    }
  }

  /**
   * Gère les cas où le formulaire est invalide
   */
  private handleInvalidForm(): void {
    console.warn('Formulaire d\'inscription invalide');
    this.form.markAllAsTouched();
    this.buildErrorSummary();
    this.showErrorSummary = this.errorSummaryItems.length > 0;
    setTimeout(() => {
      this.errorSummaryRef?.nativeElement.focus();
      this.focusFirstInvalidField();
    }, 0);
  }

  /**
   * Récupère la liste des champs manquants pour l'affichage
   */
  private getMissingFields(): string[] {
    const requiredFields = this.isPrestataire
      ? ['firstName', 'lastName', 'email', 'userSecret', 'phoneNumber', 'address', 'city', 'postalCode', 'companyName', 'siretSiren']
      : ['firstName', 'lastName', 'email', 'userSecret', 'phoneNumber', 'address', 'city', 'postalCode'];

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

    switch (fieldName) {
      case 'firstName':
        if (control.errors['required']) return 'Le prénom est requis';
        if (control.errors['lettersOnly']) return 'Le prénom ne doit contenir que des lettres';
        if (control.errors['injectionPrevention']) return 'Le prénom ne doit pas contenir de caractères spéciaux dangereux';
        break;
      case 'lastName':
        if (control.errors['required']) return 'Le nom est requis';
        if (control.errors['lettersOnly']) return 'Le nom ne doit contenir que des lettres';
        if (control.errors['injectionPrevention']) return 'Le nom ne doit pas contenir de caractères spéciaux dangereux';
        break;
      case 'companyName':
        if (control.errors['required']) return "Le nom de l'entreprise est requis";
        if (control.errors['injectionPrevention']) return "Le nom de l'entreprise ne doit pas contenir de caractères spéciaux dangereux";
        break;
      case 'siretSiren':
        if (control.errors['required']) return 'Le numéro SIRET est requis';
        if (control.errors['pattern']) return 'Le SIRET doit contenir 14 chiffres';
        if (control.errors['injectionPrevention']) return 'Le SIRET ne doit pas contenir de caractères spéciaux dangereux';
        break;
      case 'email':
        if (control.errors['required']) return "L'email est requis";
        if (control.errors['emailFormat']) return "Format d'email invalide";
        if (control.errors['injectionPrevention']) return "L'email ne doit pas contenir de caractères spéciaux dangereux";
        if (control.errors['emailTaken']) return 'Cet email est déjà utilisé';
        break;
      case 'phoneNumber':
        if (control.errors['required']) return 'Le numéro de téléphone est requis';
        if (control.errors['phoneNumberLength']) return 'Le numéro de téléphone doit contenir exactement 10 chiffres';
        if (control.errors['numbersOnly']) return 'Le numéro de téléphone ne doit contenir que des chiffres';
        if (control.errors['injectionPrevention']) return 'Le numéro de téléphone ne doit pas contenir de caractères spéciaux dangereux';
        break;
      case 'address':
        if (control.errors['required']) return "L'adresse est requise";
        if (control.errors['injectionPrevention']) return "L'adresse ne doit pas contenir de caractères spéciaux dangereux";
        break;
      case 'postalCode':
        if (control.errors['required']) return 'Le code postal est requis';
        if (control.errors['pattern']) return 'Le code postal doit contenir 5 chiffres';
        if (control.errors['injectionPrevention']) return 'Le code postal ne doit pas contenir de caractères spéciaux dangereux';
        break;
      case 'city':
        if (control.errors['required']) return 'La ville est requise';
        if (control.errors['lettersOnly']) return 'La ville ne doit contenir que des lettres';
        if (control.errors['injectionPrevention']) return 'La ville ne doit pas contenir de caractères spéciaux dangereux';
        break;
    }

    return '';
  }

  /**
   * Construit le résumé des erreurs du formulaire d'inscription
   * Parcourt tous les champs du formulaire et ajoute les erreurs à errorSummaryItems
   * Gère différemment les champs selon le type d'utilisateur (particulier/prestataire)
   */
  private buildErrorSummary(): void {
    const items: { id: string; label: string; message: string }[] = [];
    const add = (id: string, label: string, message: string | null) => {
      if (message) items.push({ id, label, message });
    };
    const getMsg = (name: string) => this.getFieldErrorText(name);

    const fields = this.isPrestataire
      ? ['firstName','lastName','companyName','siretSiren','email','phoneNumber','address','postalCode','city','userSecret']
      : ['firstName','lastName','email','phoneNumber','address','postalCode','city','userSecret'];

    const labels: Record<string,string> = {
      firstName: 'Prénom', lastName: 'Nom', companyName: "Nom de l'entreprise",
      siretSiren: 'SIRET', email: 'Email', phoneNumber: 'Téléphone', address: 'Adresse',
      postalCode: 'Code postal', city: 'Ville', userSecret: 'Mot de passe'
    };

    for (const f of fields) {
      const ctrl = this.form.get(f);
      if (ctrl && ctrl.invalid) {
        const msg = f === 'userSecret' ? this.getPasswordErrorText() : getMsg(f);
        add(f, labels[f], msg);
      }
    }

    this.errorSummaryItems = items;
  }

  /**
   * Met le focus sur un champ spécifique du formulaire
   * @param fieldId - L'ID du champ à focaliser
   */
  focusField(fieldId: string): void {
    const el = document.getElementById(fieldId) as HTMLElement | null;
    if (el) el.focus();
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

  /**
   * Retourne le type d'utilisateur sous forme de chaîne pour affichage.
   * @returns Le type d'utilisateur détecté (par ex. 'prestataire' ou 'particulier').
   */
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
