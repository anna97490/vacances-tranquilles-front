// Service de validation pour l'inscription
import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class RegisterValidationService {

  /**
   * Vérifie la validité du formulaire d'inscription
   * @param form Le formulaire à valider
   */
  isFormValid(form: FormGroup): boolean {
    return form.valid;
  }

  /**
   * Vérifie si tous les champs requis sont remplis
   * @param form Le formulaire à vérifier
   * @param isPrestataire Si l'utilisateur est un prestataire
   */
  areAllRequiredFieldsFilled(form: FormGroup, isPrestataire: boolean): boolean {
    const requiredFields = this.getRequiredFields(isPrestataire);

    for (const fieldName of requiredFields) {
      const control = form.get(fieldName);
      if (!control || !control.value || control.value.trim() === '') {
        return false;
      }
    }

    return true;
  }

  /**
   * Récupère la liste des champs requis selon le type d'utilisateur
   * @param isPrestataire Si l'utilisateur est un prestataire
   */
  private getRequiredFields(isPrestataire: boolean): string[] {
    const commonFields = ['firstName', 'lastName', 'email', 'userSecret', 'phoneNumber', 'address', 'city', 'postalCode'];

    if (isPrestataire) {
      return [...commonFields, 'companyName', 'siretSiren'];
    }

    return commonFields;
  }

  /**
   * Génère un message d'erreur de validation approprié
   * @param form Le formulaire avec les erreurs
   * @param isPrestataire Si l'utilisateur est un prestataire
   */
  getValidationErrorMessage(form: FormGroup, isPrestataire: boolean): string {
    const controls = form.controls;

    // Vérifier d'abord si tous les champs requis sont remplis
    if (!this.areAllRequiredFieldsFilled(form, isPrestataire)) {
      const missingFields = this.getMissingFields(form, isPrestataire);
      return `Veuillez remplir tous les champs obligatoires : ${missingFields.join(', ')}`;
    }

    // Vérifier les erreurs des champs communs
    const commonFieldError = this.checkCommonFieldErrors(controls);
    if (commonFieldError) return commonFieldError;

    // Vérifier les erreurs spécifiques aux prestataires
    const prestataireError = this.checkPrestataireErrors(controls, isPrestataire);
    if (prestataireError) return prestataireError;

    return 'Formulaire invalide - vérifiez vos données';
  }

  /**
   * Récupère la liste des champs manquants
   * @param form Le formulaire à vérifier
   * @param isPrestataire Si l'utilisateur est un prestataire
   */
  private getMissingFields(form: FormGroup, isPrestataire: boolean): string[] {
    const requiredFields = this.getRequiredFields(isPrestataire);
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
      const control = form.get(fieldName);
      if (!control || !control.value || control.value.trim() === '') {
        missingFields.push(fieldLabels[fieldName] || fieldName);
      }
    }

    return missingFields;
  }

  /**
   * Vérifie les erreurs des champs communs
   * @param controls Les contrôles du formulaire
   */
  private checkCommonFieldErrors(controls: { [key: string]: AbstractControl }): string | null {
    if (controls['firstName']?.hasError('required')) return 'Le prénom est requis';
    if (controls['firstName']?.hasError('lettersOnly')) return 'Le prénom ne doit contenir que des lettres';
    if (controls['firstName']?.hasError('injectionPrevention')) return 'Le prénom ne doit pas contenir de caractères spéciaux dangereux';
    if (controls['lastName']?.hasError('required')) return 'Le nom est requis';
    if (controls['lastName']?.hasError('lettersOnly')) return 'Le nom ne doit contenir que des lettres';
    if (controls['lastName']?.hasError('injectionPrevention')) return 'Le nom ne doit pas contenir de caractères spéciaux dangereux';
    if (controls['email']?.hasError('required')) return 'L\'email est requis';
    if (controls['email']?.hasError('emailFormat')) return 'Format d\'email invalide';
    if (controls['email']?.hasError('injectionPrevention')) return 'L\'email ne doit pas contenir de caractères spéciaux dangereux';
    if (controls['userSecret']?.hasError('required')) return 'Le mot de passe est requis';
    if (controls['userSecret']?.hasError('minLength')) return 'Le mot de passe doit contenir au moins 8 caractères';
    if (controls['userSecret']?.hasError('lowercase')) return 'Le mot de passe doit contenir au moins une minuscule';
    if (controls['userSecret']?.hasError('uppercase')) return 'Le mot de passe doit contenir au moins une majuscule';
    if (controls['userSecret']?.hasError('number')) return 'Le mot de passe doit contenir au moins un chiffre';
    if (controls['userSecret']?.hasError('special')) return 'Le mot de passe doit contenir au moins un caractère spécial';
    if (controls['phoneNumber']?.hasError('required')) return 'Le numéro de téléphone est requis';
    if (controls['phoneNumber']?.hasError('numbersOnly')) return 'Le numéro de téléphone ne doit contenir que des chiffres';
    if (controls['phoneNumber']?.hasError('injectionPrevention')) return 'Le numéro de téléphone ne doit pas contenir de caractères spéciaux dangereux';
    if (controls['address']?.hasError('required')) return 'L\'adresse est requise';
    if (controls['address']?.hasError('injectionPrevention')) return 'L\'adresse ne doit pas contenir de caractères spéciaux dangereux';
    if (controls['city']?.hasError('required')) return 'La ville est requise';
    if (controls['city']?.hasError('lettersOnly')) return 'La ville ne doit contenir que des lettres';
    if (controls['city']?.hasError('injectionPrevention')) return 'La ville ne doit pas contenir de caractères spéciaux dangereux';
    if (controls['postalCode']?.hasError('required')) return 'Le code postal est requis';
    if (controls['postalCode']?.hasError('pattern')) return 'Le code postal doit contenir 5 chiffres';
    if (controls['postalCode']?.hasError('injectionPrevention')) return 'Le code postal ne doit pas contenir de caractères spéciaux dangereux';

    return null;
  }

  /**
   * Vérifie les erreurs spécifiques aux prestataires
   * @param controls Les contrôles du formulaire
   * @param isPrestataire Si l'utilisateur est un prestataire
   */
  private checkPrestataireErrors(controls: { [key: string]: AbstractControl }, isPrestataire: boolean): string | null {
    if (isPrestataire) {
      if (controls['companyName']?.hasError('required')) return 'Le nom de l\'entreprise est requis';
      if (controls['companyName']?.hasError('injectionPrevention')) return 'Le nom de l\'entreprise ne doit pas contenir de caractères spéciaux dangereux';
      if (controls['siretSiren']?.hasError('required')) return 'Le numéro SIRET/SIREN est requis';
      if (controls['siretSiren']?.hasError('pattern')) return 'Le SIRET/SIREN doit contenir 14 chiffres';
      if (controls['siretSiren']?.hasError('injectionPrevention')) return 'Le SIRET/SIREN ne doit pas contenir de caractères spéciaux dangereux';
    }

    return null;
  }

  /**
   * Récupère les classes CSS pour un champ selon son état de validation
   * @param form Le formulaire
   * @param fieldName Le nom du champ
   */
  getFieldClasses(form: FormGroup, fieldName: string): string {
    const field = form.get(fieldName);

    if (!field) return '';

    return field.invalid && field.touched ? 'field-error' : '';
  }

  /**
   * Réinitialise le champ mot de passe du formulaire
   * @param form Le formulaire
   */
  resetPasswordField(form: FormGroup): void {
    const userSecretControl = form.get('userSecret');
    if (userSecretControl) {
      userSecretControl.setValue('');
      userSecretControl.markAsUntouched();
    }
  }
}
