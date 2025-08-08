// Service principal d'inscription
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiConfig } from '../../models/Register';
import { RegisterErrorHandlerService } from './register-error-handler.service';
import { UserTypeDetectorService } from './user-type-detector.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly errorHandler: RegisterErrorHandlerService,
    private readonly userTypeDetector: UserTypeDetectorService
  ) {}

  /**
   * Effectue la requête d'inscription
   * @param apiConfig Configuration de l'API
   */
  performRegistration(apiConfig: ApiConfig): Observable<HttpResponse<any>> {
    const httpOptions = {
      headers: { 'Content-Type': 'application/json' },
      observe: 'response' as const,
      responseType: 'text' as const
    };

    return this.http.post(apiConfig.url, apiConfig.payload, httpOptions);
  }

  /**
   * Gère le succès de l'inscription
   * @param response La réponse HTTP
   * @param isPrestataire Si l'utilisateur est un prestataire
   */
  handleRegistrationSuccess(response: HttpResponse<any>, isPrestataire: boolean): void {
    this.showSuccessMessage(isPrestataire);
    this.redirectToLogin();
  }

  /**
   * Gère les erreurs d'inscription
   * @param error L'erreur HTTP
   * @param isPrestataire Si l'utilisateur est un prestataire
   * @returns Le message d'erreur à afficher
   */
  handleRegistrationError(error: HttpErrorResponse, isPrestataire: boolean): string | null {
    console.error('Erreur d\'inscription:', error);

    // Gérer les "fausses erreurs" (succès avec erreur de parsing)
    if (this.errorHandler.isSuccessfulButParseFailed(error)) {
      this.handleParseErrorButSuccess(isPrestataire);
      return null;
    }

    // Gérer les vraies erreurs
    const errorMessage = this.errorHandler.getRegistrationErrorMessage(error);
    return errorMessage;
  }

  /**
   * Gère le cas d'un succès avec erreur de parsing
   * @param isPrestataire Si l'utilisateur est un prestataire
   */
  private handleParseErrorButSuccess(isPrestataire: boolean): void {
    this.showSuccessMessage(isPrestataire);
    this.redirectToLogin();
  }

  /**
   * Affiche un message de succès
   * @param isPrestataire Si l'utilisateur est un prestataire
   */
  private showSuccessMessage(isPrestataire: boolean): void {
    const userType = isPrestataire ?
      this.userTypeDetector.getPrestataireUserTypeString() :
      this.userTypeDetector.getParticulierUserTypeString();
    // Utiliser une notification plus moderne au lieu d'alert
    console.log(`Inscription ${userType} réussie ! Vous pouvez maintenant vous connecter.`);
    // Ici vous pourriez intégrer un service de notification comme MatSnackBar
  }

  /**
   * Affiche un message d'erreur
   * @param message Le message d'erreur
   */
  private showErrorMessage(message: string): void {
    console.error('Erreur lors de l\'inscription : ' + message);
    // Ici vous pourriez intégrer un service de notification comme MatSnackBar
  }

  /**
   * Redirige vers la page de connexion
   */
  private redirectToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
