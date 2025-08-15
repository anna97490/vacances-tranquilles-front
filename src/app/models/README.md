# Modèles FAQ

Ce dossier contient les modèles TypeScript pour la gestion des données FAQ dans l'application Vacances Tranquilles.

## Structure des fichiers

- `FAQ.ts` - Définition des interfaces et classes utilitaires pour les FAQ
- `index.ts` - Export centralisé de tous les modèles
- `FAQ.spec.ts` - Tests unitaires pour les modèles
- `README.md` - Documentation des modèles

## Interfaces disponibles

### FAQItem
Interface de base pour tous les éléments FAQ avec les propriétés essentielles :
- `question: string` - La question
- `reponse: string` - La réponse
- `categorie: string` - La catégorie

### FAQItemWithState
Étend `FAQItem` avec un état d'expansion pour les composants :
- `isExpanded: boolean` - État d'ouverture/fermeture

### FAQParticulierItem
Interface pour les FAQ destinées aux particuliers (hérite de `FAQItem`).

### FAQPrestataireItem
Interface pour les FAQ destinées aux prestataires (hérite de `FAQItem`).

### FAQParticulierParcours
Interface pour les FAQ de parcours utilisateur des particuliers :
- `id: string` - Identifiant unique
- `ordre: number` - Ordre d'affichage
- Hérite de `FAQItem`

### FAQPrestataireParcours
Interface pour les FAQ de parcours utilisateur des prestataires :
- `id: string` - Identifiant unique
- `ordre: number` - Ordre d'affichage
- Hérite de `FAQItem`

### UnifiedFAQItem
Interface pour unifier tous les types de FAQ :
- `type: 'general' | 'prestataire' | 'particulier'` - Type de FAQ
- `source: string` - Source d'origine
- Hérite de `FAQItem`

## Énumérations

### FAQType
- `GENERAL = 'general'`
- `PRESTATAIRE = 'prestataire'`
- `PARTICULIER = 'particulier'`

### FAQSource
- `GENERAL = 'Général'`
- `PRESTATAIRE = 'Prestataire'`
- `PARTICULIER = 'Particulier'`

## Interfaces utilitaires

### FAQFilters
Interface pour les filtres de recherche FAQ :
- `type?: FAQType` - Filtre par type
- `categorie?: string` - Filtre par catégorie
- `search?: string` - Terme de recherche

### FAQStats
Interface pour les statistiques FAQ :
- `total: number` - Nombre total de questions
- `general: number` - Nombre de questions générales
- `prestataire: number` - Nombre de questions prestataires
- `particulier: number` - Nombre de questions particuliers
- `categories: number` - Nombre de catégories

## Classes utilitaires

### FAQItemFactory
Classe avec des méthodes statiques pour créer des instances d'objets conformes aux interfaces :

- `createFAQItem(obj: any): FAQItem` - Crée un FAQItem
- `createFAQItemWithState(obj: any): FAQItemWithState` - Crée un FAQItemWithState
- `createFAQParticulierItem(obj: any): FAQParticulierItem` - Crée un FAQParticulierItem
- `createFAQPrestataireItem(obj: any): FAQPrestataireItem` - Crée un FAQPrestataireItem
- `createUnifiedFAQItem(obj: any): UnifiedFAQItem` - Crée un UnifiedFAQItem
- `createFAQParticulierParcours(obj: any): FAQParticulierParcours` - Crée un FAQParticulierParcours
- `createFAQPrestataireParcours(obj: any): FAQPrestataireParcours` - Crée un FAQPrestataireParcours

## Utilisation

### Création d'un élément FAQ simple
```typescript
import { FAQItem, FAQItemFactory } from './models/FAQ';

const faq: FAQItem = FAQItemFactory.createFAQItem({
  question: 'Comment ça marche ?',
  reponse: 'C\'est simple !',
  categorie: 'general'
});
```

### Création d'un élément FAQ avec état
```typescript
import { FAQItemWithState, FAQItemFactory } from './models/FAQ';

const faqWithState: FAQItemWithState = FAQItemFactory.createFAQItemWithState({
  question: 'Comment ça marche ?',
  reponse: 'C\'est simple !',
  categorie: 'general'
});
// isExpanded sera automatiquement défini à false
```

### Création d'un élément FAQ de parcours
```typescript
import { FAQParticulierParcours, FAQItemFactory } from './models/FAQ';

const faqParcours: FAQParticulierParcours = FAQItemFactory.createFAQParticulierParcours({
  id: 'inscription-1',
  question: 'Comment créer mon compte ?',
  reponse: 'Cliquez sur S\'inscrire...',
  categorie: 'Inscription / Connexion',
  ordre: 1
});
```

### Création d'un élément FAQ unifié
```typescript
import { UnifiedFAQItem, FAQItemFactory, FAQType, FAQSource } from './models/FAQ';

const unifiedFaq: UnifiedFAQItem = FAQItemFactory.createUnifiedFAQItem({
  question: 'Comment ça marche ?',
  reponse: 'C\'est simple !',
  categorie: 'general',
  type: FAQType.GENERAL,
  source: FAQSource.GENERAL
});
```

## Avantages de cette approche

1. **Type Safety** : Interfaces TypeScript pour une meilleure vérification des types
2. **Flexibilité** : Possibilité d'étendre les interfaces selon les besoins
3. **Réutilisabilité** : Factory methods pour créer des objets conformes aux interfaces
4. **Maintenabilité** : Structure claire et documentation complète
5. **Compatibilité** : Les interfaces sont compatibles avec les services existants
6. **État local** : FAQItemWithState permet de gérer l'état d'expansion dans les composants
7. **Parcours utilisateur** : Interfaces spécialisées pour les guides étape par étape