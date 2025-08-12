import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  // Récupérer le token depuis le localStorage
  const token = localStorage.getItem('token');
  
  // Si un token existe, l'ajouter aux headers
  if (token) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Token expiré ou invalide, supprimer le token
        localStorage.removeItem('token');
        localStorage.removeItem('userRole'); 
      }
      return throwError(() => error);
    })
  );
};
