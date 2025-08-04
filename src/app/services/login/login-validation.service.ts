// Service de validation pour la connexion
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class LoginValidationService {

  /**
   * Vérifie la validité du formulaire de connexion
   * @param form Le formulaire à valider
   */
  isFormValid(form: FormGroup): boolean {
    return form.valid;
  }

  /**
   * Génère un message d'erreur de validation approprié
   * @param form Le formulaire avec les erreurs
   */
  getValidationErrorMessage(form: FormGroup): string {
    const emailControl = form.get('email');
    const userSecretControl = form.get('userSecret');

    if (emailControl?.hasError('required')) return 'L\'email est requis';
    if (emailControl?.hasError('email')) return 'Format d\'email invalide';
    if (userSecretControl?.hasError('required')) return 'Le mot de passe est requis';
    if (userSecretControl?.hasError('minlength')) return 'Le mot de passe doit contenir au moins 6 caractères';
    
    return 'Formulaire invalide - vérifiez vos données';
  }

  /**
   * Remet à zéro le champ mot de passe après une erreur
   * @param form Le formulaire
   */
  resetPasswordField(form: FormGroup): void {
    const userSecretControl = form.get('userSecret');
    if (userSecretControl) {
      userSecretControl.setValue('');
      userSecretControl.markAsUntouched();
    }
  }

  /**
   * Marque tous les champs comme touchés pour afficher les erreurs
   * @param form Le formulaire
   */
  markAllFieldsAsTouched(form: FormGroup): void {
    form.markAllAsTouched();
  }
}