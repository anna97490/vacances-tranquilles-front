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
    // Si le rôle est CLIENT, rediriger vers service-search
    if (userRole === UserRole.CLIENT) {
      this.router.navigate(['/service-search']);
    } else {
      // Redirection par défaut vers la page d'accueil pour les autres rôles
      this.router.navigate(['/home']);
    }
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