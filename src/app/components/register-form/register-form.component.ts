import { Component, Renderer2, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import { RegistrationField } from '../../services/interfaces/interfaceRegister';
import { CustomValidators } from '../../services/validators/type-field';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatFormFieldModule, MatInputModule, NgOptimizedImage
  ],
  encapsulation: ViewEncapsulation.None, 
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss'
})

/**
 * Composant pour le formulaire d'inscription
 * Il gère l'affichage des champs en fonction du type d'utilisateur (particulier ou prestataire)
 * Il valide les entrées du formulaire et affiche les erreurs si nécessaire
 */
export class RegisterFormComponent {
  logoPath = 'assets/pictures/logo.png';
  
  // On récupére l'url du chemin pour savoir s'il s'agit d'un particulier ou d'un prestataire
  userType: 'particulier' | 'prestataire';
  registrationFields: RegistrationField[];
  // Stocke les valeurs du formulaire
  formData: { [key: string]: string } = {};

  // Indique si les valeurs du formulaire sont valides
  validValuesToRegisterPrestataire: boolean = false;
  validValuesToRegisterParticulier: boolean = false;

  /**
   * 
   * @param renderer Renderer2 - Injecté pour manipuler le DOM de manière sécurisée
   * Cette fonction initialise le composant en récupérant le type d'utilisateur depuis l'URL
   * et en définissant les champs d'inscription appropriés.
   */
  constructor(private renderer: Renderer2) {
    // Récupération du type d'utilisateur depuis l'URL
    const url = window.location.pathname;
    this.userType = url.includes('particulier') ? 'particulier' : 'prestataire';
    // Initialisation des champs en fonction du type d'utilisateur
    if (this.userType === 'particulier') {
      this.registrationFields = [
        { label: 'Prénom', placeholder: 'Entrez votre prénom', type: 'text' },
        { label: 'Nom', placeholder: 'Entrez votre nom', type: 'text' },
        { label: 'E-mail', placeholder: 'Entrez votre e-mail', type: 'email' },
        { label: 'Mot de passe', placeholder: 'Entrez votre mot de passe', type: 'password' },
        { label: 'Téléphone', placeholder: 'Entrez votre téléphone', type: 'tel' },
        { label: 'Adresse', placeholder: 'Entrez votre adresse', type: 'text' },
        { label: 'Ville', placeholder: 'Entrez votre ville', type: 'text' },
        { label: 'Code postal', placeholder: 'Entrez votre code postal', type: 'text' }
      ];
    } else {
      this.registrationFields = [
        { label: 'Prénom', placeholder: 'Entrez votre prénom', type: 'text' },
        { label: 'Nom', placeholder: 'Entrez votre nom', type: 'text' },
        { label: 'E-mail', placeholder: 'Entrez votre e-mail', type: 'email' },
        { label: 'Mot de passe', placeholder: 'Entrez votre mot de passe', type: 'password' },
        { label: 'Téléphone', placeholder: 'Entrez votre téléphone', type: 'tel' },
        { label: 'Adresse', placeholder: 'Entrez votre adresse', type: 'text' },
        { label: 'Ville', placeholder: 'Entrez votre ville', type: 'text' },
        { label: 'Code postal', placeholder: 'Entrez votre code postal', type: 'text' },
        { label: 'Entreprise', placeholder: 'Entrez le nom de votre entreprise', type: 'text' },
        { label: 'SIRET/SIREN', placeholder: 'Entrez votre numéro SIRET/SIREN', type: 'text' }
      ];
    }
  }

  /** 
   * Appel de la fonction pour supprimer les classes lors de l'initialisation du composant
  */
  ngOnInit() {
    this.removeClasses();
    this.adjustTextFieldHeight();
  }


  /**
   * Fonction pour ajuster dynamiquement la hauteur des champs de texte
   * Cette fonction parcourt tous les champs de texte et applique des styles pour uniformiser leur apparence.
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
   * Fonction pour supprimer les classes spécifiques des champs de texte
   * Cette fonction parcourt tous les champs de texte et supprime les classes inutiles pour éviter les conflits de style.
   */
  removeClasses() {
    const textFields = document.querySelectorAll('.mat-mdc-text-field-wrapper');
    textFields.forEach((textField) => {
      textField.classList.remove('mat-mdc-text-field-wrapper');
    });
  }

  /**
   * Fonction pour enregistrer les données du formulaire
   * Cette fonction valide les entrées du formulaire et affiche les données dans la console si elles sont valides.
   */
  register() {
    this.validValuesToRegisterPrestataire =
        CustomValidators.nameValidator(this.formData['firstName']) &&
        CustomValidators.nameValidator(this.formData['lastName']) &&
        CustomValidators.emailValidator(this.formData['email']) &&
        CustomValidators.phoneNumberValidator(this.formData['phoneNumber']) &&
        CustomValidators.postalCodeValidator(this.formData['postalCode']) &&
        CustomValidators.siretSirenValidator(this.formData['siretSiren']);

    this.validValuesToRegisterParticulier =
        CustomValidators.nameValidator(this.formData['firstName']) &&
        CustomValidators.nameValidator(this.formData['lastName']) &&
        CustomValidators.emailValidator(this.formData['email']) &&
        CustomValidators.phoneNumberValidator(this.formData['phoneNumber']) &&
        CustomValidators.postalCodeValidator(this.formData['postalCode']);

    if (!this.validValuesToRegisterPrestataire && !this.validValuesToRegisterParticulier) {
        console.error('Form validation failed. Please check your inputs.');
        return;
    }

    console.log('Form Data:', this.formData);
  }
}
