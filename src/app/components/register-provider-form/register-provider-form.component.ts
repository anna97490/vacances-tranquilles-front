import { Component, AfterViewInit, ViewEncapsulation, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register-provider-form',
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
  templateUrl: './register-provider-form.component.html',
  styleUrl: './register-provider-form.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class RegisterProviderFormComponent implements AfterViewInit {
  form: FormGroup;
  isPrestataire = false;
  userType: string;
  private routerSubscription: any;
  beach_access = './assets/icones/beach_access.svg';
  constructor(private fb: FormBuilder, private renderer: Renderer2) {
    const url = window.location.pathname;
    this.userType = url.includes('particulier') ? 'particulier' : 'prestataire';
    if (this.userType === 'prestataire') {
      this.isPrestataire = true;
    } else {
      this.isPrestataire = false;
    }

    this.form = this.fb.group({
      companyName: ['', Validators.required],
      siret: ['', [Validators.required, Validators.pattern(/^[0-9]{14}$/)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      address: ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.pattern(/^[0-9]{5}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }

  onSubmit() {
    if (this.form.valid) {
      // Traitement à ajouter plus tard
      alert('Inscription soumise !');
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

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  /**
   * * Fonction pour ajuster dynamiquement la hauteur des champs de texte
   * * Elle applique des styles CSS pour uniformiser l'apparence des champs de texte
   */
  adjustTextFieldHeight() {
    const adjustBorder = document.querySelectorAll('.mdc-notched-outline__trailing, .mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid .mat-mdc-notch-piece');

    adjustBorder.forEach((border) => {
      this.renderer.setStyle(border, 'border-radius', '20px !important');
      this.renderer.setStyle(border, 'border-color', 'lightgrey !important');
      this.renderer.setStyle(border, 'border-width', 'thin !important');
    });

    // Effet focus doux
    const outlinesThick = document.querySelectorAll('.mat-form-field-outline-thick');
    outlinesThick.forEach((outline) => {
      this.renderer.setStyle(outline, 'border-color', '#7a8a99');
      this.renderer.setStyle(outline, 'border-width', '1.5px');
      this.renderer.setStyle(outline, 'box-shadow', 'none');
    });

    // Fond gris clair et coins arrondis sur le flex
    const flexes = document.querySelectorAll('.mat-form-field-flex');
    flexes.forEach((flex) => {
      this.renderer.setStyle(flex, 'background', '#f8f9fa');
      this.renderer.setStyle(flex, 'border-radius', '8px');
    });

    // Centrage vertical du placeholder et du texte dans les inputs
    const inputs = document.querySelectorAll('input');
    inputs.forEach((input) => {
      this.renderer.removeStyle(input, 'text-align');
      this.renderer.setStyle(input, 'height', '44px');
      this.renderer.setStyle(input, 'padding-top', '5px');
      this.renderer.setStyle(input, 'padding-bottom', '0');
      this.renderer.setStyle(input, 'padding-left', '10px');
      this.renderer.setStyle(input, 'display', 'flex');
      this.renderer.setStyle(input, 'align-items', 'center');
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