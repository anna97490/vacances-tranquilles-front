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
   * Génère un message d'erreur de validation approprié
   * @param form Le formulaire avec les erreurs
   * @param isPrestataire Si l'utilisateur est un prestataire
   */
  getValidationErrorMessage(form: FormGroup, isPrestataire: boolean): string {
    const controls = form.controls;
    
    // Vérifier les erreurs des champs communs
    const commonFieldError = this.checkCommonFieldErrors(controls);
    if (commonFieldError) return commonFieldError;
    
    // Vérifier les erreurs spécifiques aux prestataires
    const prestataireError = this.checkPrestataireErrors(controls, isPrestataire);
    if (prestataireError) return prestataireError;
    
    return 'Formulaire invalide - vérifiez vos données';
  }

  /**
   * Vérifie les erreurs des champs communs
   * @param controls Les contrôles du formulaire
   */
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

  /**
   * Vérifie les erreurs spécifiques aux prestataires
   * @param controls Les contrôles du formulaire
   * @param isPrestataire Si l'utilisateur est un prestataire
   */
  private checkPrestataireErrors(controls: { [key: string]: AbstractControl }, isPrestataire: boolean): string | null {
    if (isPrestataire) {
      if (controls['companyName']?.hasError('required')) return 'Le nom de l\'entreprise est requis';
      if (controls['siretSiren']?.hasError('required')) return 'Le numéro SIRET/SIREN est requis';
      if (controls['siretSiren']?.hasError('pattern')) return 'Le SIRET/SIREN doit contenir 14 chiffres';
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
    const passwordControl = form.get('password');
    if (passwordControl) {
      passwordControl.setValue('');
      passwordControl.markAsUntouched();
    }
  }
}