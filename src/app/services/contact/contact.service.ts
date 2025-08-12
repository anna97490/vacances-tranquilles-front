import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface ContactFormData {
  nom: string;
  prenom: string;
  objet: string;
  demande: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private readonly apiUrl = '/api/contact'; // URL de votre API backend
  
  constructor(private readonly http: HttpClient) {}

  /**
   * Envoie le formulaire de contact
   * @param formData Les données du formulaire
   * @returns Observable de la réponse
   */
  sendContactForm(formData: ContactFormData): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(this.apiUrl, formData, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Gère les erreurs HTTP
   * @param error L'erreur à gérer
   * @returns Observable d'erreur
   */
  private handleError(error: any): Observable<never> {
    let errorMessage = 'Une erreur est survenue lors de l\'envoi du formulaire.';
    
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else if (error.status) {
      // Erreur côté serveur
      switch (error.status) {
        case 400:
          errorMessage = 'Données invalides. Veuillez vérifier vos informations.';
          break;
        case 401:
          errorMessage = 'Non autorisé. Veuillez vous connecter.';
          break;
        case 403:
          errorMessage = 'Accès interdit.';
          break;
        case 404:
          errorMessage = 'Service non trouvé.';
          break;
        case 500:
          errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
          break;
        default:
          errorMessage = `Erreur ${error.status}: ${error.message}`;
      }
    }
    
    console.error('Erreur dans ContactService:', error);
    return throwError(() => new Error(errorMessage));
  }
}
