# Implémentation de la récupération des informations utilisateur connecté

## Vue d'ensemble

Cette implémentation permet de récupérer et d'afficher les informations de l'utilisateur connecté (`loggedUser`) sur la page profil lorsqu'on clique sur "Profil" dans le header.

## Fonctionnalités implémentées

### 1. Récupération des données utilisateur
- **Service utilisé** : `UserInformationService.getUserProfile()`
- **Méthode** : Appel API GET vers `/users/profile` avec authentification Bearer token
- **Gestion d'erreur** : Fallback vers les données mock en cas d'échec
- **Propriétés** : 
  - `loggedUser` : Utilisateur connecté (récupéré via API)
  - `displayedUser` : Utilisateur affiché (peut être le même que loggedUser ou un autre utilisateur)

### 2. États de l'interface utilisateur
- **Chargement** : Spinner avec message "Chargement des informations du profil..."
- **Erreur** : Message d'erreur avec bouton "Réessayer"
- **Succès** : Affichage des informations utilisateur

### 3. Navigation
- **Route** : `/profile` (corrigée depuis `/profil`)
- **Accès** : Via le menu "Profil" dans le header

## Fichiers modifiés

### 1. `src/app/pages/ProfilePage/profilePage.component.ts`
- Ajout de l'injection du `UserInformationService`
- Implémentation de `ngOnInit()` pour charger les données
- Ajout des propriétés `isLoading` et `hasError`
- Renommage de `user` en `displayedUser` pour plus de clarté
- Méthode `loadLoggedUserData()` pour récupérer les données
- Méthode `retryLoadData()` pour recharger en cas d'erreur
- Méthode `isCurrentUserProfile()` pour vérifier si l'utilisateur affiché est le même que l'utilisateur connecté

### 2. `src/app/pages/ProfilePage/profilePage.component.html`
- Ajout des états de chargement et d'erreur
- Structure conditionnelle pour afficher le contenu approprié
- Bouton de retry en cas d'erreur
- Condition `*ngIf="isCurrentUserProfile()"` pour afficher le bouton "Modifier" uniquement si l'utilisateur affiché est le même que l'utilisateur connecté

### 3. `src/app/pages/ProfilePage/profilePage.component.scss`
- Styles pour le spinner de chargement
- Styles pour les messages d'erreur
- Animation de rotation pour l'icône de chargement

### 4. `src/app/components/header/header.component.ts`
- Correction du chemin de navigation : `/profil` → `/profile`

## Flux de données

1. **Clic sur "Profil"** dans le header
2. **Navigation** vers `/profile`
3. **Chargement** du `ProfilePageComponent`
4. **Appel API** `getUserProfile()` via `UserInformationService`
5. **Mise à jour** des propriétés `loggedUser` et `displayedUser`
6. **Affichage** des informations dans `DisplayProfileComponent`

## Gestion de l'authentification

- **Token** : Récupéré automatiquement depuis `localStorage`
- **Intercepteur** : `authInterceptor` ajoute le header `Authorization: Bearer {token}`
- **Expiration** : Redirection automatique vers `/auth/login` si token expiré

## Gestion des erreurs

- **Erreur réseau** : Affichage du message d'erreur avec bouton retry
- **Erreur 401/403** : Redirection automatique vers la page de connexion
- **Fallback** : Utilisation des données mock en cas d'échec

## Tests

L'application compile sans erreur et est prête pour les tests fonctionnels.

## Fonctionnalités supplémentaires

### Redirection automatique après connexion
- **CLIENT** : Redirection vers `/service-search`
- **PROVIDER** : Redirection vers `/profile` (nouveau)
- **ADMIN** : Redirection vers `/home`

## Prochaines étapes

1. Tester la connexion avec un vrai utilisateur
2. Vérifier l'affichage des données dans les composants enfants
3. Implémenter la mise à jour des informations utilisateur
4. Ajouter des tests unitaires pour le `ProfilePageComponent`
