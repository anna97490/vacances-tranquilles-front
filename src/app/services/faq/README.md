# Services FAQ - Vacances Tranquilles

Ce dossier contient tous les services liés à la gestion des FAQ (Foire Aux Questions) de l'application Vacances Tranquilles.

## Structure des Services

### 1. Services de Base

#### `FAQGeneralService`
Service principal pour les questions générales sur l'application.
- **Interface**: `FAQItem`
- **Méthodes principales**:
  - `getAllQuestions()`: Récupère toutes les questions générales
  - `getQuestionsByCategory(categorie)`: Questions par catégorie
  - `searchQuestions(term)`: Recherche dans les questions/réponses
  - `getCategories()`: Liste des catégories disponibles

#### `FAQPrestataireService`
Service pour les questions spécifiques aux prestataires de services.
- **Interface**: `FAQPrestataireItem`
- **Méthodes principales**:
  - `getAllQuestions()`: Toutes les questions prestataires
  - `getQuestionsByCategory(categorie)`: Questions par catégorie
  - `searchQuestions(term)`: Recherche dans les questions/réponses
  - `getCategories()`: Catégories prestataires

#### `FAQParticulierService`
Service pour les questions spécifiques aux particuliers utilisateurs.
- **Interface**: `FAQParticulierItem`
- **Méthodes principales**:
  - `getAllQuestions()`: Toutes les questions particuliers
  - `getQuestionsByCategory(categorie)`: Questions par catégorie
  - `searchQuestions(term)`: Recherche dans les questions/réponses
  - `getCategories()`: Catégories particuliers

### 2. Services de Parcours Utilisateur

#### `FAQPrestataireParcoursService`
Service dédié au parcours complet des prestataires, étape par étape.
- **Interface**: `FAQPrestataireParcours`
- **Catégories couvertes**:
  - Inscription / Connexion (3 questions)
  - Gestion des services (6 questions)
  - Création / Gestion des Services (2 questions)
  - Messagerie (4 questions)
  - Profil Prestataire (2 questions)
- **Total**: 17 questions organisées par ordre logique
- **Méthodes principales**:
  - `getAllQuestions()`: Questions triées par ordre
  - `getQuestionsByCategory(categorie)`: Questions par étape du parcours
  - `searchQuestions(term)`: Recherche dans le parcours
  - `getQuestionById(id)`: Question spécifique par ID

#### `FAQParticulierParcoursService`
Service dédié au parcours complet des particuliers, étape par étape.
- **Interface**: `FAQParticulierParcours`
- **Catégories couvertes**:
  - Inscription / Connexion (3 questions)
  - Consulter des prestations (2 questions)
  - Réserver une prestation (4 questions)
  - Suivi de la prestation (3 questions)
  - Messagerie (4 questions)
  - Profil personnel (2 questions)
- **Total**: 18 questions organisées par ordre logique
- **Méthodes principales**:
  - `getAllQuestions()`: Questions triées par ordre
  - `getQuestionsByCategory(categorie)`: Questions par étape du parcours
  - `searchQuestions(term)`: Recherche dans le parcours
  - `getQuestionById(id)`: Question spécifique par ID

### 3. Service Unifié

#### `FAQUnifiedService`
Service qui unifie l'accès à tous les services FAQ.
- **Interface**: `UnifiedFAQItem`
- **Méthodes principales**:
  - `getAllFAQ()`: Toutes les FAQ de tous les services
  - `getFAQByType(type)`: FAQ par type (general, prestataire, particulier)
  - `searchAllFAQ(term)`: Recherche globale dans toutes les FAQ
  - `getCategoriesByType(type)`: Catégories par type de service

## Utilisation

### Import des Services

```typescript
import { 
  FAQGeneralService,
  FAQPrestataireService,
  FAQParticulierService,
  FAQUnifiedService,
  FAQPrestataireParcoursService,
  FAQParticulierParcoursService
} from '@app/services/faq';
```

### Exemple d'Utilisation

```typescript
constructor(
  private faqPrestataireParcours: FAQPrestataireParcoursService,
  private faqParticulierParcours: FAQParticulierParcoursService
) {}

// Récupérer le parcours complet d'un prestataire
getParcoursPrestataire() {
  const questions = this.faqPrestataireParcours.getAllQuestions();
  const categories = this.faqPrestataireParcours.getCategories();
  
  // Organiser par catégorie pour l'affichage
  const parcoursOrganise = categories.map(cat => ({
    categorie: cat,
    questions: this.faqPrestataireParcours.getQuestionsByCategory(cat)
  }));
  
  return parcoursOrganise;
}

// Rechercher dans le parcours particulier
searchParcoursParticulier(term: string) {
  return this.faqParticulierParcours.searchQuestions(term);
}
```

## Architecture et Conception

### Principes de Conception

1. **Séparation des Responsabilités**: Chaque service gère un aspect spécifique des FAQ
2. **Interface Commune**: Tous les services suivent une structure similaire pour la cohérence
3. **Organisation Logique**: Les questions sont organisées par ordre et catégorie
4. **Extensibilité**: Facile d'ajouter de nouvelles questions ou catégories
5. **Performance**: Recherche et filtrage optimisés

### Structure des Données

Chaque question suit cette structure :
```typescript
interface FAQItem {
  id: string;           // Identifiant unique
  question: string;     // Question posée
  reponse: string;      // Réponse détaillée
  categorie: string;    // Catégorie/étape du parcours
  ordre: number;        // Ordre d'affichage
}
```

### Gestion des Catégories

Les catégories sont organisées de manière hiérarchique :
- **Services de Base**: Questions générales et spécifiques
- **Services de Parcours**: Questions organisées par étapes du parcours utilisateur
- **Catégories Métier**: Regroupement logique des questions par domaine
