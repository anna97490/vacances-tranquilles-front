# Service de Validation du Profil Utilisateur

## Vue d'ensemble

Ce service implémente la validation des champs du profil utilisateur lors de la modification, en utilisant les mêmes règles de validation que le formulaire d'inscription.

## Architecture

### ProfileValidationService

Le service principal `ProfileValidationService` (`profile-validation.service.ts`) fournit :

1. **Création de formulaires réactifs** avec validation
2. **Validateurs personnalisés** pour chaque type de champ
3. **Messages d'erreur** en français
4. **Méthodes utilitaires** pour la validation

### Validateurs implémentés

#### Champs requis
- `firstName` (Prénom)
- `lastName` (Nom)
- `email` (Email)
- `phoneNumber` (Téléphone)
- `city` (Ville)

#### Validations spécifiques

1. **Validation des noms** (`lettersOnlyValidator`)
   - Uniquement des lettres, espaces, tirets et apostrophes
   - Support des caractères accentués français
   - Exemple valide : "Jean-Pierre", "O'Connor"

2. **Validation email** (`emailFormatValidator`)
   - Format email standard
   - Exemple valide : "user@domain.com"

3. **Validation téléphone** (`phoneNumberValidator`)
   - Format français : 10 chiffres commençant par 0
   - Exemple valide : "0612345678"

4. **Validation description** (`descriptionLengthValidator`)
   - Maximum 500 caractères
   - Optionnel

5. **Prévention d'injection** (`injectionPreventionValidator`)
   - Bloque les caractères dangereux : `<>'"&;{}()[]\\|`~#$%^*+=`
   - Différents patterns selon le type de champ

## Utilisation

### Dans un composant

```typescript
import { ProfileValidationService } from './services/user-profile/profile-validation.service';

export class MyComponent {
  constructor(private profileValidationService: ProfileValidationService) {}

  ngOnInit() {
    // Créer un formulaire avec validation
    this.form = this.profileValidationService.createProfileForm();
    
    // Remplir avec les données existantes
    this.form.patchValue({
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      // ...
    });
  }

  // Valider le formulaire
  validateForm(): boolean {
    this.profileValidationService.markAllFieldsAsTouched(this.form);
    return this.profileValidationService.isFormValid(this.form);
  }

  // Obtenir le message d'erreur d'un champ
  getFieldError(fieldName: string): string {
    const control = this.form.get(fieldName);
    return this.profileValidationService.getFieldErrorText(fieldName, control!);
  }
}
```

### Dans un template

```html
<form [formGroup]="form">
  <div class="input-container">
    <input 
      formControlName="firstName" 
      [class.invalid]="form.get('firstName')?.invalid && form.get('firstName')?.touched"
      placeholder="Prénom"
    />
    <div class="error-message" *ngIf="form.get('firstName')?.invalid && form.get('firstName')?.touched">
      {{ getFieldError('firstName') }}
    </div>
  </div>
</form>
```

## Messages d'erreur

### Champs requis
- "Le prénom est requis"
- "Le nom est requis"
- "L'email est requis"
- "Le numéro de téléphone est requis"
- "La ville est requise"

### Format invalide
- "Le prénom ne doit contenir que des lettres"
- "Format d'email invalide"
- "Format de numéro de téléphone invalide (ex: 0612345678)"
- "La description ne doit pas dépasser 500 caractères"

### Sécurité
- "Le prénom ne doit pas contenir de caractères spéciaux dangereux"
- (Messages similaires pour tous les champs)

## Tests

Le service inclut une suite de tests complète (`profile-validation.service.spec.ts`) qui couvre :

- Création du formulaire
- Validation des champs requis
- Validation des formats (email, téléphone, noms)
- Validation de la longueur de description
- Messages d'erreur
- Méthodes utilitaires

## Intégration avec les composants existants

### UpdateProfileHeaderComponent

Le composant `update-profile-header` a été modifié pour :

1. Utiliser `ReactiveFormsModule` au lieu de `FormsModule`
2. Implémenter la validation en temps réel
3. Afficher les messages d'erreur sous chaque champ
4. Émettre des événements de validation vers le composant parent

### UpdateProfileComponent

Le composant parent gère :

1. La réception des erreurs de validation
2. La validation avant sauvegarde
3. L'émission des erreurs vers le composant racine

### ProfilePageComponent

Le composant racine affiche :

1. Les erreurs de validation dans un snackbar
2. Empêche la sauvegarde si le formulaire est invalide

## Styles CSS

Les styles pour les messages d'erreur incluent :

- Bordure rouge pour les champs invalides
- Fond légèrement rouge pour les champs invalides
- Messages d'erreur avec animation d'apparition
- Astérisques rouges pour les champs requis

## Sécurité

La validation inclut une protection contre les injections de caractères dangereux, similaire à celle implémentée dans le formulaire d'inscription.
