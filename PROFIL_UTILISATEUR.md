# Gestion du Profil Utilisateur - Frontend

## Vue d'ensemble

Cette implémentation permet la synchronisation complète entre le frontend Angular et le backend Spring Boot pour la gestion du profil utilisateur.

## Architecture

### Composants principaux

1. **ProfilePageComponent** (`src/app/pages/ProfilePage/`)
   - Composant parent qui gère l'affichage et l'édition du profil
   - Bascule entre mode affichage et mode édition
   - Coordonne la sauvegarde des modifications

2. **DisplayProfileComponent** (`src/app/components/profile/display-profile/`)
   - Affiche les informations du profil en lecture seule
   - Se met à jour automatiquement après les modifications

3. **UpdateProfileComponent** (`src/app/components/profile/update-profile/`)
   - Permet la modification des informations du profil
   - Gère la sauvegarde vers le backend

### Services

1. **UserInformationService** (`src/app/services/user-information/user-information.service.ts`)
   - Service existant étendu pour gérer le profil utilisateur
   - Méthodes ajoutées :
     - `updateUserProfile(updateDTO)` : Met à jour le profil utilisateur
     - `getUserProfileWithServices()` : Récupère le profil avec les services
   - Endpoints : GET /users/profile, PATCH /users/profile

### Modèles

1. **UpdateUserDTO** (`src/app/models/UpdateUserDTO.ts`)
   - Interface pour les données de mise à jour du profil
   - Correspond au DTO backend

2. **UserProfileDTO** (`src/app/models/UserProfileDTO.ts`)
   - Interface pour la réponse du profil utilisateur
   - Contient l'utilisateur et ses services

## Flux de données

### Chargement initial
1. `ProfilePageComponent` charge les données via `UserInformationService`
2. Les données sont passées aux composants enfants via `@Input()`

### Mode édition
1. L'utilisateur clique sur "Modifier"
2. `ProfilePageComponent` bascule en mode édition
3. `UpdateProfileComponent` affiche les formulaires d'édition

### Sauvegarde
1. L'utilisateur clique sur "Valider les modifications"
2. `ProfilePageComponent` appelle `saveProfileChanges()`
3. `UpdateProfileComponent.saveProfile()` envoie les données au backend
4. Le backend répond avec les données mises à jour
5. Les composants se mettent à jour automatiquement
6. Retour en mode affichage

### Gestion des services
Les services sont gérés localement dans le composant `UpdateProfileServicesComponent` et synchronisés avec le parent via les événements. La sauvegarde vers le backend se fait via la méthode `saveProfile()` du composant parent.

## Endpoints Backend

### Profil utilisateur
- `GET /api/users/profile` - Récupérer le profil
- `PATCH /api/users/profile` - Mettre à jour le profil
- `DELETE /api/users/profile` - Supprimer le compte

### Services (optionnel)
Les services peuvent être gérés localement ou via des endpoints backend si nécessaire :
- `GET /api/services/provider/{providerId}` - Services d'un prestataire
- `POST /api/services` - Créer un service
- `PATCH /api/services/{serviceId}` - Modifier un service
- `DELETE /api/services/{serviceId}` - Supprimer un service

## Gestion des erreurs

- Affichage de messages d'erreur via `MatSnackBar`
- Logs d'erreur dans la console
- Gestion des états de chargement et de sauvegarde

## Sécurité

- Utilisation de l'intercepteur d'authentification (`authInterceptor`)
- Validation des données côté frontend et backend
- Gestion des tokens d'authentification

## Tests

Les composants incluent des tests unitaires avec Jasmine/Karma.
Les services peuvent être testés avec des mocks pour les appels HTTP.

## Utilisation

```typescript
// Dans un composant
constructor(private userInformationService: UserInformationService) {}

// Charger le profil
this.userInformationService.getUserProfileWithServices().subscribe(profile => {
  this.user = profile.user;
  this.services = profile.services;
});

// Mettre à jour le profil
const updateDTO: UpdateUserDTO = { firstName: 'Nouveau prénom' };
this.userInformationService.updateUserProfile(updateDTO).subscribe(updatedProfile => {
  // Traitement de la réponse
});
```
