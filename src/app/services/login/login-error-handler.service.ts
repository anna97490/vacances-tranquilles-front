// Service de gestion des erreurs de connexion
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginErrorHandlerService {

  /**
   * Vérifie s'il s'agit d'une erreur de parsing avec succès HTTP
   * @param error L'erreur HTTP
   */
  isPotentialParseError(error: HttpErrorResponse): boolean {
    return error.status === 200 || error.status === 201;
  }

  /**
   * Génère un message d'erreur approprié selon l'erreur de connexion
   * @param error L'erreur HTTP
   */
  getLoginErrorMessage(error: HttpErrorResponse): string {
    const errorMessages: { [key: number]: string } = {
      401: 'Email ou mot de passe incorrect',
      403: 'Accès non autorisé',
      404: 'Service de connexion non disponible',
      500: 'Erreur interne du serveur',
      0: 'Impossible de contacter le serveur'
    };

    return errorMessages[error.status] || error.error?.message || 'Erreur de connexion inconnue';
  }

  /**
   * Essaie d'extraire le token d'une réponse d'erreur
   * @param error L'erreur HTTP
   */
  extractTokenFromErrorResponse(error: HttpErrorResponse): string | null {
    try {
      // Essayer d'extraire depuis error.text (cas de parsing JSON)
      if (error.error?.text) {
        const parsed = JSON.parse(error.error.text);
        return parsed.token || null;
      }
      
      // Essayer d'extraire depuis error.token (cas direct)
      if (error.error?.token) {
        return error.error.token;
      }
      
      return null;
    } catch (parseError) {
      console.warn('Erreur lors du parsing du token depuis la réponse:', parseError);
      return null;
    }
  }
}