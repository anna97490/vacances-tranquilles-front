import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStorageService } from '../login/auth-storage.service';
import { NotificationService } from '../notification/notification.service';

export function authInterceptor(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const authStorage = inject(AuthStorageService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      // Gestion des erreurs d'authentification
      if (error.status === 403 || error.status === 401) {
        console.warn('Erreur d\'authentification détectée:', error.status);
        
        // Nettoyer les données d'authentification
        authStorage.clearAuthenticationData();
        
        // Afficher une notification à l'utilisateur
        notificationService.sessionExpired();
        
        // Rediriger vers la page de connexion
        router.navigate(['/auth/login']);
        
        // Retourner une erreur avec un message explicite
        return throwError(() => new Error('Session expirée. Veuillez vous reconnecter.'));
      }
      
      // Pour les autres erreurs, les laisser passer
      return throwError(() => error);
    })
  );
}
