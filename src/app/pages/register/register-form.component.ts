import {
  Component,
  OnDestroy,
  ViewEncapsulation,
  Renderer2
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

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
    RouterModule
  ],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class RegisterFormComponent implements OnDestroy {
  form: FormGroup;
  isPrestataire = false;
  mainLogo = './assets/pictures/logo.png';
  private routerSubscription: any;

  constructor(private fb: FormBuilder, private renderer: Renderer2) {
    this.detectUserType();
    this.form = this.buildForm();
  }

  /**
   * Détermine le type d'utilisateur à partir de l'URL
   */
  private detectUserType(): void {
    const path = window.location.pathname;
    this.isPrestataire = path.includes('prestataire');
  }

  /**
   * Initialise le formulaire avec les validateurs requis
   */
  private buildForm(): FormGroup {
    return this.fb.group({
      companyName: ['', Validators.required],
      siret: ['', [Validators.required, Validators.pattern(/^\d{14}$/)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
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
   * Soumission du formulaire avec validation
   */
  onSubmit(): void {
    if (this.form.valid) {
      alert('Inscription soumise !');
      // Ajouter la logique d'envoi ici
    } else {
      this.form.markAllAsTouched();
    }
  }
}