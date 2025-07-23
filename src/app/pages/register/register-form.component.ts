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
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

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

  constructor(private fb: FormBuilder, private renderer: Renderer2, private http: HttpClient, private router: Router) {
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
    // On inclut tous les champs nécessaires pour les deux types d'utilisateur
    return this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phoneNumber: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.pattern(/^[0-9]{5}$/)]],
      // Champs spécifiques prestataire
      companyName: [''],
      siretSiren: ['', [Validators.pattern(/^[0-9]{14}$/)]]
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
   * Soumission du formulaire avec validation et adaptation du payload selon le type d'utilisateur.
   * Envoie les données à l'API backend pour enregistrement en base.
   */
  onSubmit(): void {
    if (this.form.valid) {
      let apiUrl: string;
      let payload: any;
      if (this.isPrestataire) {
        apiUrl = 'http://localhost:8080/api/auth/register/provider';
        payload = {
          firstName: this.form.value.firstName,
          lastName: this.form.value.lastName,
          email: this.form.value.email,
          password: this.form.value.password,
          phoneNumber: this.form.value.phoneNumber,
          address: this.form.value.address,
          city: this.form.value.city,
          postalCode: this.form.value.postalCode,
          companyName: this.form.value.companyName,
          siretSiren: this.form.value.siretSiren
        };

        console.log("payload prestataire", payload);
      } else {
        apiUrl = 'http://localhost:8080/api/auth/register/client';
        payload = {
          firstName: this.form.value.firstName,
          lastName: this.form.value.lastName,
          email: this.form.value.email,
          password: this.form.value.password,
          phoneNumber: this.form.value.phoneNumber,
          address: this.form.value.address,
          city: this.form.value.city,
          postalCode: this.form.value.postalCode
        };
        console.log("payload particulier", payload);
      }
      console.log("apiUrl : ", apiUrl);
      console.log("payload : ", payload);
      this.http.post(apiUrl, payload).subscribe({
        next: () => {
          alert('Inscription réussie !');
          this.router.navigate(['/auth/login']);
        },
        error: (err) => {
          const message = err.error?.message || 'Erreur inconnue, veuillez réessayer.';
          alert('Erreur lors de l\'inscription : ' + message);
        }
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}