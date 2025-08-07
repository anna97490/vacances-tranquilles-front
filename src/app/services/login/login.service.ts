// Service principal de connexion
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginResponse, LoginPayload } from '../../models/Login';
import { AuthStorageService } from './auth-storage.service';
import { LoginErrorHandlerService } from './login-error-handler.service';
import { LoginNavigationService } from './login-navigation.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private readonly http: HttpClient,
    private readonly authStorage: AuthStorageService,
    private readonly errorHandler: LoginErrorHandlerService,
    private readonly navigation: LoginNavigationService
  ) {}

  /**
   * Effectue la requête de connexion vers l'API
   * @param payload Les données de connexion
   * @param apiUrl L'URL de l'API
   */
  performLogin(payload: LoginPayload, apiUrl: string): Observable<HttpResponse<LoginResponse>> {
    const httpOptions = {
      headers: { 'Content-Type': 'application/json' },
      observe: 'response' as const,
      responseType: 'json' as const
    };

    return this.http.post<LoginResponse>(`${apiUrl}/auth/login`, payload, httpOptions);
  }

  /**
   * Gère le succès de la connexion
   * @param response La réponse HTTP
   */
  handleLoginSuccess(response: HttpResponse<LoginResponse>): void {
    const responseBody = response.body;
    
    if (!responseBody?.token) {
      this.showErrorMessage('Token manquant dans la réponse du serveur');
      return;
    }

    // Stockage des données d'authentification
    this.authStorage.storeAuthenticationData(responseBody.token, responseBody.userRole);
    
    this.showSuccessMessage();
    this.navigation.redirectAfterLogin(responseBody.userRole);
  }

  /**
   * Gère les erreurs de connexion
   * @param error L'erreur HTTP
   */
  handleLoginError(error: HttpErrorResponse): void {
    console.error('Erreur de connexion:', error);

    // Vérifier d'abord si c'est une erreur de parsing avec status 200/201
    if (this.errorHandler.isPotentialParseError(error)) {
      this.handleSuccessWithParseError(error);
      return;
    }

    // Gérer les vraies erreurs
    this.processActualError(error);
  }

  /**
   * Gère le cas d'un succès avec erreur de parsing de la réponse
   * @param error L'erreur HTTP
   */
  private handleSuccessWithParseError(error: HttpErrorResponse): void {
    console.log('Gestion spéciale pour erreur de parsing avec status 200:', error);
    
    const token = this.errorHandler.extractTokenFromErrorResponse(error);
    if (token) {
      this.authStorage.storeAuthenticationData(token, '');
      this.showSuccessMessage();
      this.navigation.redirectAfterLogin();
    } else {
      this.showErrorMessage('Token manquant dans la réponse du serveur');
    }
  }

  /**
   * Traite les vraies erreurs HTTP
   * @param error L'erreur HTTP
   */
  private processActualError(error: HttpErrorResponse): void {
    const errorMessage = this.errorHandler.getLoginErrorMessage(error);
    this.showErrorMessage(errorMessage);
  }

  /**
   * Affiche un message de succès
   */
  private showSuccessMessage(): void {
    alert('Connexion réussie !');
  }

  /**
   * Affiche un message d'erreur
   * @param message Le message d'erreur
   */
  private showErrorMessage(message: string): void {
    alert(`Erreur lors de la connexion : ${message}`);
  }
}