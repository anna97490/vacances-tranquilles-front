# Gestion de l'Authentification

Ce dossier contient les services et intercepteurs pour gérer l'authentification dans l'application.

## Services

### AuthInterceptor (`auth.interceptor.ts`)
Intercepteur HTTP qui gère automatiquement les erreurs d'authentification (401, 403) :
- Détecte les erreurs 401 (Unauthorized) et 403 (Forbidden)
- Nettoie automatiquement les données d'authentification stockées
- Affiche une notification claire à l'utilisateur
- Redirige l'utilisateur vers la page de connexion (`/auth/login`)
- Retourne un message d'erreur explicite

### TokenValidatorService (`token-validator.service.ts`)
Service pour valider les tokens JWT :
- Vérifie la présence et la validité du token
- Décode le token JWT pour vérifier l'expiration
- Nettoie automatiquement les tokens expirés
- Fournit des méthodes utilitaires pour la validation

### NotificationService (`../notification/notification.service.ts`)
Service pour afficher des notifications utilisateur :
- Messages de succès, erreur, avertissement et information
- Notification spécialisée pour les sessions expirées
- Interface cohérente pour tous les messages utilisateur

## Utilisation

### Configuration
L'intercepteur est automatiquement configuré dans `app.config.ts` :
```typescript
provideHttpClient(withInterceptors([authInterceptor]))
```

### Validation de token
```typescript
// Dans un service
constructor(
  private tokenValidator: TokenValidatorService,
  private router: Router
) {}

// Avant une requête API
if (!this.tokenValidator.isTokenValid()) {
  this.router.navigate(['/auth/login']);
  return throwError(() => new Error('Session expirée'));
}
```

### Gestion d'erreurs
L'intercepteur gère automatiquement les erreurs d'authentification. Dans les composants, vous pouvez également gérer ces erreurs spécifiquement :

```typescript
this.service.searchServices(...).subscribe({
  next: (result) => { /* ... */ },
  error: (error) => {
    if (error.status === 403 || error.status === 401 || error.message?.includes('Session expirée')) {
      this.notificationService.sessionExpired();
    } else {
      this.notificationService.error('Erreur lors de la recherche. Veuillez réessayer.');
    }
  }
});
```

### Notifications utilisateur
```typescript
// Utilisation du service de notification
constructor(private notificationService: NotificationService) {}

// Différents types de notifications
this.notificationService.success('Opération réussie');
this.notificationService.error('Une erreur est survenue');
this.notificationService.warning('Attention');
this.notificationService.info('Information');
this.notificationService.sessionExpired(); // Spécialisé pour les sessions expirées
```

## Tests
- `auth.interceptor.spec.ts` : Tests pour l'intercepteur d'authentification
- `token-validator.service.spec.ts` : Tests pour le service de validation de token
- `../notification/notification.service.spec.ts` : Tests pour le service de notification

## Résolution du problème 403

L'erreur 403 (Forbidden) que vous rencontriez était probablement due à :
1. **Token expiré** : Le token JWT avait dépassé sa date d'expiration
2. **Token invalide** : Le token était corrompu ou mal formaté
3. **Token manquant** : Aucun token n'était présent dans le localStorage

### Solution implémentée :
1. **Validation proactive** : Vérification de la validité du token avant chaque requête
2. **Gestion automatique** : L'intercepteur détecte et gère automatiquement les erreurs 403/401
3. **Notifications claires** : Messages d'erreur explicites et informatifs pour l'utilisateur
4. **Redirection automatique** : L'utilisateur est automatiquement redirigé vers la page de connexion (`/auth/login`)
5. **Nettoyage automatique** : Les tokens invalides sont automatiquement supprimés

### Flux de gestion d'erreur :
1. **Détection** : Le `TokenValidatorService` détecte un token expiré
2. **Notification** : Le `NotificationService` affiche un message clair à l'utilisateur
3. **Nettoyage** : L'`AuthStorageService` supprime les données d'authentification
4. **Redirection** : L'utilisateur est redirigé vers `/auth/login`
5. **Gestion d'erreur** : L'intercepteur retourne une erreur explicite

Cette solution garantit une meilleure expérience utilisateur en évitant les erreurs 403 et en guidant automatiquement l'utilisateur vers la reconnexion avec des messages clairs et informatifs.
