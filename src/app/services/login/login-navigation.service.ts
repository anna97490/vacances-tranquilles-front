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
    // Redirection vers home pour tous les utilisateurs
    this.router.navigate(['/home']);
  }

  /**
   * Redirige vers la page d'inscription
   */
  redirectToRegister(): void {
    this.router.navigate(['/auth/register']);
  }

  /**
   * Redirige vers la page de récupération de mot de passe
   */
  redirectToForgotPassword(): void {
    this.router.navigate(['/auth/forgot-password']);
  }
}
