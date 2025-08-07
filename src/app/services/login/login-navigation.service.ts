// Service de navigation après connexion
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

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
    // Vérifier le userRole dans le localStorage
    const storedUserRole = localStorage.getItem('userRole');
    
    // Si le userRole est CLIENT, redirection vers la page de recherche
    if (storedUserRole === 'CLIENT') {
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