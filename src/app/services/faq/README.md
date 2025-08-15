# Services FAQ - Architecture Refactorisée

## Vue d'ensemble

Cette architecture a été refactorisée pour éliminer la duplication de code massive (50-66% de lignes dupliquées) détectée par SonarQube. L'approche utilise l'héritage et la généricité pour respecter le principe DRY (Don't Repeat Yourself).

## Architecture

### Services de Base

#### `BaseFAQService<T extends FAQItem>`
Service de base générique qui contient toutes les méthodes communes :
- `getAllFAQ()`: Récupère toutes les questions
- `getFAQByCategory(categorie: string)`: Filtre par catégorie
- `searchFAQ(query: string)`: Recherche textuelle
- `getCategories()`: Liste des catégories disponibles
- `getTotalQuestions()`: Nombre total de questions

#### `BaseFAQParcoursService<T extends FAQParcoursItem>`
Service de base spécialisé pour les parcours qui étend `BaseFAQService` et ajoute :
- `getAllQuestions()`: Questions triées par ordre
- `getQuestionsByCategory(categorie: string)`: Questions par catégorie triées
- `searchQuestions(searchTerm: string)`: Recherche dans les parcours
- `getQuestionById(id: string)`: Récupération par ID

### Services Concrets

#### Services Standard
- `FAQGeneralService`: FAQ générales
- `FAQParticulierService`: FAQ pour particuliers (avec méthodes spécifiques)
- `FAQPrestataireService`: FAQ pour prestataires (avec méthodes spécifiques)

#### Services de Parcours
- `FAQParticulierParcoursService`: Parcours utilisateur particulier
- `FAQPrestataireParcoursService`: Parcours prestataire

#### Service Unifié
- `FAQUnifiedService`: Service qui agrège tous les autres services

## Avantages de la Refactorisation

### 1. Élimination de la Duplication
- **Avant**: 50-66% de lignes dupliquées entre les services
- **Après**: 0% de duplication grâce à l'héritage

### 2. Maintenabilité
- Modifications centralisées dans les services de base
- Ajout de nouvelles fonctionnalités simplifié
- Tests unitaires réduits

### 3. Cohérence
- Interface uniforme pour tous les services
- Comportement prévisible et standardisé

### 4. Extensibilité
- Ajout de nouveaux types de FAQ facilité
- Réutilisation du code existant

## Utilisation

### Service Standard
```typescript
constructor(private faqService: FAQGeneralService) {}

// Utilisation des méthodes héritées
const allFAQ = this.faqService.getAllFAQ();
const searchResults = this.faqService.searchFAQ('recherche');
const categories = this.faqService.getCategories();
```

### Service de Parcours
```typescript
constructor(private parcoursService: FAQParticulierParcoursService) {}

// Méthodes spécifiques aux parcours
const orderedQuestions = this.parcoursService.getAllQuestions();
const questionById = this.parcoursService.getQuestionById('part-inscription-1');
```

### Service Unifié
```typescript
constructor(private unifiedService: FAQUnifiedService) {}

// Accès à toutes les FAQ
const allFAQ = this.unifiedService.getAllFAQ();
const filteredFAQ = this.unifiedService.filterFAQ({
  type: 'particulier',
  categorie: 'inscription'
});
```

## Conformité aux Standards

### Principes SOLID
- **S** (Single Responsibility): Chaque service a une responsabilité claire
- **O** (Open/Closed): Ouvert à l'extension, fermé à la modification
- **L** (Liskov Substitution): Les services dérivés peuvent remplacer les services de base
- **I** (Interface Segregation): Interfaces spécifiques pour chaque type
- **D** (Dependency Inversion): Dépendance vers les abstractions

### Bonnes Pratiques
- **DRY**: Aucune duplication de code
- **KISS**: Architecture simple et compréhensible
- **YAGNI**: Pas de fonctionnalités inutiles

## Tests

Les tests existants continuent de fonctionner car l'interface publique des services n'a pas changé. Seule l'implémentation interne a été refactorisée.

## Migration

Aucune migration nécessaire pour les composants utilisant ces services. L'API publique reste identique.
