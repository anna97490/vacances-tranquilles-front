// Service de navigation après connexion
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserRole } from '../../models/User';

@Injectable({
  providedIn: 'root'
})
export class LoginNavigationService {

  constructor(private readonly router: Router) {}

  /**
   * Redirige l'utilisateur après une connexion réussie
   * @param userRole Le rôle de l'utilisateur (optionnel pour redirection spécifique)
   */
  redirectAfterLogin(userRole?: string): void {
    // Si l'utilisateur est un prestataire, rediriger vers /profile
    if (userRole === UserRole.PROVIDER) {
      this.router.navigate(['/profile']);
    } else if (userRole === UserRole.CLIENT) {
      // Si l'utilisateur est un client, rediriger vers /service-search
      this.router.navigate(['/service-search']);
    } else {
      // Redirection vers home pour les autres cas (fallback)
      this.router.navigate(['/home']);
    }
  }

  /**
   * Redirige vers la page d'inscription
   */
  redirectToRegister(): void {
    this.router.navigate(['/auth/register/particulier']);
  }

  /**
   * Redirige vers la page de récupération de mot de passe
   */
  redirectToForgotPassword(): void {
    this.router.navigate(['/auth/forgot-password']);
  }
}
