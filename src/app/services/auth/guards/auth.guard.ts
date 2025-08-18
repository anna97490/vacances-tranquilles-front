import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { TokenValidatorService } from '../validators/token-validator.service';
import { AuthStorageService } from '../../login/auth-storage.service';
import { UserRole } from '../../../models/User';

/**
 * Guard de protection des routes pour l'authentification et l'autorisation
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private tokenValidator: TokenValidatorService,
    private authStorage: AuthStorageService,
    private router: Router
  ) {}

  /**
   * Détermine si l'utilisateur peut accéder à la route demandée.
   *
   * @param route - Snapshot de la route à activer
   * @param state - État actuel du routeur avec l'URL demandée
   * @returns `true` si l'accès est autorisé, `false` sinon (avec redirection automatique)
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Logique spécifique pour la route /home (page publique avec redirection des utilisateurs connectés)
    if (state.url === '/home') {
      // Si l'utilisateur n'est pas authentifié, permettre l'accès à la page home publique
      if (!this.tokenValidator.isTokenValid()) {
        return true;
      }

      // Si l'utilisateur est authentifié, le rediriger selon son rôle
      const userRole = this.authStorage.getUserRole();
      if (userRole === UserRole.PROVIDER) {
        this.router.navigate(['/profile']);

        return false;
      } else if (userRole === UserRole.CLIENT) {
        this.router.navigate(['/service-search']);

        return false;
      }
    }

    // Vérifier l'authentification pour toutes les autres routes protégées
    if (!this.tokenValidator.isTokenValid()) {
      this.router.navigate(['/home']);

      return false;
    }

    // Récupérer le rôle utilisateur une seule fois
    const userRole = this.authStorage.getUserRole();

    // Logique spécifique pour la route /review
    if (state.url === '/review') {
      if (userRole === UserRole.PROVIDER) {
        this.router.navigate(['/profile']);

        return false;
      }
    }

    // Autoriser l'accès pour toutes les autres routes
    return true;
  }
}
