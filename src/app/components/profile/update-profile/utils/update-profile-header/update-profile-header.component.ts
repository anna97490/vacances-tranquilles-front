import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { User } from '../../../../../models/User';
import { ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ProfileValidationService } from '../../../../../services/user-profile/profile-validation.service';

/**
 * Composant d'en-tête de mise à jour du profil utilisateur.
 * Permet la modification du nom, et des informations principales.
 */
@Component({
  selector: 'app-update-profile-header',
  standalone: true,
  imports: [ReactiveFormsModule, MatIconModule, CommonModule],
  templateUrl: './update-profile-header.component.html',
  styleUrl: './update-profile-header.component.scss'
})
export class UpdateProfileHeaderComponent implements OnInit {
  /** Utilisateur affiché et modifié */
  @Input() user!: User;
  /** Liste des services associés à l'utilisateur */
  @Input() services!: any[];
  /** Événement émis quand l'utilisateur est modifié */
  @Output() userChange = new EventEmitter<User>();
  /** Événement émis quand la validation échoue */
  @Output() validationError = new EventEmitter<string>();

  /** Nom du fichier sélectionné pour la photo de profil */
  fileName: string = '';
  /** Formulaire réactif pour la validation */
  profileForm!: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly profileValidationService: ProfileValidationService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  /**
   * Initialise le formulaire avec les données de l'utilisateur
   */
  private initializeForm(): void {
    this.profileForm = this.profileValidationService.createProfileForm();
    this.profileForm.patchValue({
      firstName: this.user.firstName || '',
      lastName: this.user.lastName || '',
      email: this.user.email || '',
      phoneNumber: this.user.phoneNumber || '',
      city: this.user.city || '',
      description: this.user.description || ''
    });

    // Écouter les changements du formulaire
    this.profileForm.valueChanges.subscribe(() => {
      this.onFormChange();
    });
  }

  /**
   * Gère les changements dans le formulaire
   */
  private onFormChange(): void {
    if (this.profileForm.valid) {
      this.updateUserFromForm();
      this.userChange.emit(this.user);
    }
  }

  /**
   * Met à jour l'objet utilisateur avec les valeurs du formulaire
   */
  private updateUserFromForm(): void {
    const formValue = this.profileForm.value;
    this.user.firstName = formValue.firstName;
    this.user.lastName = formValue.lastName;
    this.user.email = formValue.email;
    this.user.phoneNumber = formValue.phoneNumber;
    this.user.city = formValue.city;
    this.user.description = formValue.description;
  }

  /**
   * Valide le formulaire et émet les erreurs si nécessaire
   */
  validateForm(): boolean {
    this.profileValidationService.markAllFieldsAsTouched(this.profileForm);
    if (!this.profileForm.valid) {
      const errorMessage = this.getValidationErrorMessage();
      this.validationError.emit(errorMessage);
      return false;
    }
    return true;
  }

  /**
   * Génère un message d'erreur de validation
   */
  private getValidationErrorMessage(): string {
    const controls = this.profileForm.controls;

    // Vérifier les champs requis
    const requiredFields = ['firstName', 'lastName', 'email', 'phoneNumber', 'city'];
    const missingFields: string[] = [];

    requiredFields.forEach(fieldName => {
      const control = controls[fieldName];
      if (control?.hasError('required')) {
        missingFields.push(this.profileValidationService.getFieldLabels()[fieldName]);
      }
    });

    if (missingFields.length > 0) {
      return `Veuillez remplir tous les champs obligatoires : ${missingFields.join(', ')}`;
    }

    // Vérifier les autres erreurs
    for (const [fieldName, control] of Object.entries(controls)) {
      if (control.errors) {
        const errorText = this.profileValidationService.getFieldErrorText(fieldName, control);
        if (errorText) {
          return errorText;
        }
      }
    }

    return 'Formulaire invalide - vérifiez vos données';
  }

  /**
   * Récupère le message d'erreur pour un champ spécifique
   */
  getFieldErrorText(fieldName: string): string {
    const control = this.profileForm.get(fieldName);
    return this.profileValidationService.getFieldErrorText(fieldName, control!);
  }

  /**
   * Vérifie si un champ est invalide et a été touché
   */
  isFieldInvalid(fieldName: string): boolean {
    const control = this.profileForm.get(fieldName);
    return !!(control?.invalid && control?.touched);
  }

  /**
   * Émet l'événement de changement d'utilisateur (méthode legacy)
   */
  onUserChange(): void {
    this.userChange.emit(this.user);
  }
}
