import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

export function authInterceptor(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  // Récupérer le token depuis le localStorage
  const token = localStorage.getItem('token');

  if (token) {
    // Cloner la requête et ajouter le header Authorization
    const authReq = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('Token ajouté à la requête:', authReq.url);
    return next(authReq);
  }

  console.log('Aucun token trouvé pour la requête:', request.url);
  return next(request);
}
