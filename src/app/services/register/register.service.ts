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
    private http: HttpClient,
    private router: Router,
    private errorHandler: RegisterErrorHandlerService,
    private userTypeDetector: UserTypeDetectorService
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
   */
  handleRegistrationError(error: HttpErrorResponse, isPrestataire: boolean): void {
    console.error('Erreur d\'inscription:', error);

    // Gérer les "fausses erreurs" (succès avec erreur de parsing)
    if (this.errorHandler.isSuccessfulButParseFailed(error)) {
      this.handleParseErrorButSuccess(isPrestataire);
      return;
    }

    // Gérer les vraies erreurs
    const errorMessage = this.errorHandler.getRegistrationErrorMessage(error);
    this.showErrorMessage(errorMessage);
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
    const userType = this.userTypeDetector.getUserTypeString(isPrestataire);
    alert(`Inscription ${userType} réussie ! Vous pouvez maintenant vous connecter.`);
  }

  /**
   * Affiche un message d'erreur
   * @param message Le message d'erreur
   */
  private showErrorMessage(message: string): void {
    alert('Erreur lors de l\'inscription : ' + message);
  }

  /**
   * Redirige vers la page de connexion
   */
  private redirectToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}