// Service pour la gestion des erreurs d'inscription
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RegisterErrorHandlerService {

  /**
   * Vérifie s'il s'agit d'un succès avec erreur de parsing
   * @param error L'erreur HTTP
   */
  isSuccessfulButParseFailed(error: HttpErrorResponse): boolean {
    return error.status === 200 || error.status === 201;
  }

  /**
   * Vérifie si l'erreur est une erreur de parsing potentielle
   * @param error L'objet erreur
   */
  isPotentialParseError(error: { status: number }): boolean {
    return error.status === 200 || error.status === 201;
  }

  /**
   * Génère un message d'erreur approprié selon l'erreur d'inscription
   * @param error L'erreur HTTP
   */
  getRegistrationErrorMessage(error: HttpErrorResponse): string {
    switch (error.status) {
      case 422:
        return 'Données de validation incorrectes';
      case 0:
        return 'Impossible de contacter le serveur';
      case 401:
        return 'Non autorisé';
      case 403:
        return 'Accès refusé';
      case 404:
        return 'Ressource non trouvée';
      case null:
      case undefined:
        return 'Données invalides - vérifiez vos informations';
      default:
        return 'Erreur inconnue lors de l\'inscription';
    }
  }

  /**
   * Extrait le token d'une réponse d'erreur
   * @param error L'erreur
   */
  extractTokenFromErrorResponse(error: any): string | null {
    try {
      if (typeof error?.error?.text === 'string') {
        const parsed = JSON.parse(error.error.text);
        return parsed.token || null;
      }
    } catch (e) {
      console.warn('Erreur lors du parsing du token depuis la réponse:', e);
      return null;
    }
    return null;
  }
}