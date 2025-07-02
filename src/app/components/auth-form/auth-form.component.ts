import { Component, Renderer2, ViewEncapsulation } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import { RegistrationField } from '../../services/interfaces/interfaceRegister';
import { CommonModule } from '@angular/common';
import { CustomValidators } from '../../services/validators/type-field';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-auth-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatFormFieldModule, MatInputModule, NgOptimizedImage
  ],
  encapsulation: ViewEncapsulation.None, 
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.scss'
})

/**
 * Composant pour le formulaire de connexion
 * Il gère l'affichage des champs en fonction du type d'utilisateur (particulier ou prestataire)
 * Il valide les entrées du formulaire et affiche les erreurs si nécessaire
 */
export class AuthFormComponent {
  logoPath = 'assets/pictures/logo.png';

  // On récupére l'url du chemin pour savoir s'il s'agit d'un particulier ou d'un prestataire
  userType: 'particulier' | 'prestataire';
  registrationFields: RegistrationField[];
   // Stocke les valeurs du formulaire
  formData: { [key: string]: string } = {};
  // Indique si les valeurs du formulaire sont valides
  validValuesToConnect: boolean = false;
  constructor(private renderer: Renderer2) {
    // Récupération du type d'utilisateur depuis l'URL
    const url = window.location.pathname;
    this.userType = url.includes('particulier') ? 'particulier' : 'prestataire';
    // Initialisation des champs en fonction du type d'utilisateur
    if (this.userType === 'particulier') {
      this.registrationFields = [
        { label: 'E-mail', placeholder: 'Entrez votre e-mail', type: 'email' },
        { label: 'Mot de passe', placeholder: 'Entrez votre mot de passe', type: 'password' },
      ];
    } else {
      this.registrationFields = [
        { label: 'E-mail', placeholder: 'Entrez votre e-mail', type: 'email' },
        { label: 'Mot de passe', placeholder: 'Entrez votre mot de passe', type: 'password' },
      ];
    }
  }

  /**
   * * Fonction appelée lors de l'initialisation du composant
   * * Elle supprime les classes indésirables et ajuste la hauteur des champs de texte
   */
  ngOnInit() {
    this.removeClasses();
    this.adjustTextFieldHeight();
  }

  /**
   * * Fonction pour ajuster dynamiquement la hauteur des champs de texte
   * * Elle applique des styles CSS pour uniformiser l'apparence des champs de texte
   */
  adjustTextFieldHeight() {
    const textFields = document.querySelectorAll('.mdc-text-field--filled, .mat-mdc-form-field-infix, .mdc-text-field__inputt');
    textFields.forEach((textField) => {
      this.renderer.setStyle(textField, 'height', '40');
      this.renderer.setStyle(textField, 'font-size', '14px');
      this.renderer.setStyle(textField, 'padding', '0 8px');
      if (textField.classList.contains('mdc-text-field--filled')) {
        this.renderer.setStyle(textField, 'height', '36px');
      }
  
      if (textField.classList.contains('mat-mdc-form-field-infix')) {
        this.renderer.setStyle(textField, 'position', 'static');
      }
  
      if (textField.classList.contains('mdc-text-field__input')) {
        this.renderer.setStyle(textField, 'min-height', '38px');
      }
    });
  }

  /**
   * * Fonction pour supprimer les classes indésirables des champs de texte
   * * Elle parcourt tous les champs de texte et supprime les classes spécifiques
   * * pour éviter les conflits de style avec Angular Material
   */
  removeClasses() {
    const textFields = document.querySelectorAll('.mat-mdc-text-field-wrapper');
    textFields.forEach((textField) => {
      textField.classList.remove('mat-mdc-text-field-wrapper');
    });
  }

  /**
   * * Fonction pour enregistrer les données du formulaire
   * * Elle valide les valeurs du formulaire et affiche les erreurs si nécessaire
   */
  register() {
    this.validValuesToConnect = CustomValidators.emailValidator(this.formData['email']);

    if (!this.validValuesToConnect) {
        console.error('Form validation failed. Please check your inputs.');
        return;
    }

    console.log('Form Data:', this.formData);
  }
}
