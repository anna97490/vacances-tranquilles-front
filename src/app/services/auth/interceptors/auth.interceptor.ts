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
import { AuthStorageService } from '../../login/auth-storage.service';
import { TokenValidatorService } from '../validators/token-validator.service';

/**
 * Intercepteur HTTP pour gérer l'authentification automatique des requêtes.
 */
export function authInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  let authStorage: AuthStorageService;
  let tokenValidator: TokenValidatorService;
  let router: Router;

  try {
    authStorage = inject(AuthStorageService);
    tokenValidator = inject(TokenValidatorService);
    router = inject(Router);
  } catch (error) {
    return next(request);
  }

  // Vérifier la validité du token (inclut la vérification d'identité)
  const token = authStorage.getToken();
  let authRequest = request;

  if (token) {
    // Vérifier que le token est valide et correspond à l'utilisateur
    if (!tokenValidator.isTokenValid()) {
      authStorage.clearAuthenticationData();
      router.navigate(['/home']);

      return throwError(() => new Error('Token invalide ou usurpé'));
    }

    authRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      // Gestion des erreurs d'authentification
      if (error.status === 403 || error.status === 401) {

        // Nettoyer les données d'authentification
        authStorage.clearAuthenticationData();

        // Afficher une notification à l'utilisateur
        alert('Votre session a expiré. Vous allez être redirigé vers la page d\'accueil.');
        // Rediriger vers la page d'accueil
        router.navigate(['/home']);

        // Retourner une erreur avec un message explicite
        return throwError(() => new Error('Session expirée. Veuillez vous reconnecter.'));
      }

      // Pour les autres erreurs, les laisser passer
      return throwError(() => error);
    })
  );
}
