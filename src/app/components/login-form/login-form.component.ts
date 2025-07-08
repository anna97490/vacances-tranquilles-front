import { Component, ViewEncapsulation, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login-form',
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
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LoginFormComponent {
  form: FormGroup;
  beach_access = './assets/icones/beach_access.svg';
  
  constructor(private fb: FormBuilder, private renderer: Renderer2) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      // Traitement à ajouter plus tard
      alert('Connexion soumise !');
    } else {
      this.form.markAllAsTouched();
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
} 