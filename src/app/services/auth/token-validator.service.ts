import { Injectable } from '@angular/core';
import { AuthStorageService } from '../login/auth-storage.service';

@Injectable({
  providedIn: 'root'
})
export class TokenValidatorService {

  constructor(private authStorage: AuthStorageService) {}

  /**
   * Vérifie si le token est présent et valide
   */
  isTokenValid(): boolean {
    const token = this.authStorage.getToken();
    
    if (!token) {
      return false;
    }

    try {
      // Décoder le token JWT (partie payload)
      const payload = this.decodeToken(token);
      
      if (!payload) {
        return false;
      }

      // Vérifier si le token a expiré
      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < currentTime) {
        console.warn('Token expiré');
        this.authStorage.clearAuthenticationData();
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erreur lors de la validation du token:', error);
      this.authStorage.clearAuthenticationData();
      return false;
    }
  }

  /**
   * Décode un token JWT
   */
  private decodeToken(token: string): any {
    try {
      // Vérifier que le token a le bon format (3 parties séparées par des points)
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }
      
      const base64Url = parts[1];
      if (!base64Url) {
        return null;
      }
      
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Erreur lors du décodage du token:', error);
      return null;
    }
  }

  /**
   * Vérifie si l'utilisateur doit être redirigé vers la page de connexion
   */
  shouldRedirectToLogin(): boolean {
    return !this.isTokenValid();
  }
}
