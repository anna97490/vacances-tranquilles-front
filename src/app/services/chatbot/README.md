# Service de Diagnostic du Chatbot Botpress

## 📋 Vue d'ensemble

Le `ChatbotOpenerService` a été étendu avec des fonctionnalités de diagnostic pour vérifier l'état du chatbot Botpress et identifier les problèmes potentiels.

## 🔧 Fonctionnalités de diagnostic

### 1. Vérification automatique
- **Script chargé** : Vérifie si le script Botpress est présent dans le DOM
- **Objet global** : Vérifie si `botpressWebChat` est disponible
- **Méthodes** : Vérifie si la méthode `open()` est accessible
- **État global** : Détermine si le chatbot est fonctionnel

### 2. Interface de diagnostic
```typescript
interface ChatbotDiagnostic {
  isAvailable: boolean;           // Chatbot globalement disponible
  isScriptLoaded: boolean;        // Script Botpress chargé
  hasWebChatObject: boolean;      // Objet botpressWebChat existe
  hasOpenMethod: boolean;         // Méthode open() disponible
  errorDetails?: string;          // Détails d'erreur éventuels
  timestamp: Date;                // Horodatage du diagnostic
}
```

## 🚀 Utilisation

### Dans un composant Angular

```typescript
import { ChatbotOpenerService, ChatbotDiagnostic } from './chatbot-opener.service';

export class MonComposant {
  constructor(private chatbotOpener: ChatbotOpenerService) {}

  // Vérifier l'état du chatbot
  checkStatus() {
    const status = this.chatbotOpener.getChatbotStatus();
    console.log('État:', status.message);
  }

  // Effectuer un diagnostic complet
  runDiagnostic() {
    const diagnostic = this.chatbotOpener.runDiagnostic();
    console.log('Diagnostic:', diagnostic);
  }

  // Logger les informations dans la console
  logDiagnostic() {
    this.chatbotOpener.logDiagnostic();
  }
}
```

## 📊 États possibles

### ✅ Disponible
- Script Botpress chargé
- Objet `botpressWebChat` initialisé
- Méthode `open()` accessible
- Chatbot prêt à être utilisé

### ⚠️ Non disponible
- Script chargé mais objet non initialisé
- Objet présent mais méthode manquante
- Problèmes de configuration

### ❌ Erreur
- Erreurs JavaScript lors de l'initialisation
- Conflits avec d'autres scripts
- Problèmes de réseau ou de chargement

## 🔍 Méthodes de diagnostic

### `runDiagnostic()`
Effectue une vérification complète et retourne un objet `ChatbotDiagnostic`.

### `getChatbotStatus()`
Retourne un résumé de l'état avec un message explicatif.

### `isChatbotAvailable()`
Vérification rapide de la disponibilité (boolean).

### `logDiagnostic()`
Affiche les informations de diagnostic dans la console du navigateur.

## 🛠️ Dépannage

### Script non chargé
- Vérifier que le script Botpress est inclus dans `index.html`
- Vérifier l'ordre de chargement des scripts
- Contrôler la console pour les erreurs de chargement

### Objet non initialisé
- Attendre que le script soit complètement chargé
- Vérifier la configuration Botpress
- Contrôler les erreurs JavaScript

### Méthode manquante
- Vérifier la version de Botpress
- Contrôler la configuration du webchat
- Vérifier les conflits avec d'autres scripts

## 📱 Intégration dans l'interface

Le composant FAQ inclut maintenant :
- **Indicateur de statut** visuel avec icônes
- **Bouton de diagnostic** pour afficher les détails
- **Bouton d'actualisation** pour vérifier l'état
- **Grille de diagnostic** avec tous les paramètres
- **Gestion des erreurs** avec messages explicatifs

## 🔄 Actualisation automatique

Le diagnostic est effectué :
- Au chargement de la page
- Avant l'ouverture du chatbot
- Sur demande manuelle (bouton actualiser)

## 📝 Logs de console

Le service génère des logs détaillés dans la console :
- État général du chatbot
- Détails techniques du diagnostic
- Horodatage des vérifications
- Messages d'erreur éventuels

## 🎯 Bonnes pratiques

1. **Vérifier l'état** avant d'essayer d'ouvrir le chatbot
2. **Logger les diagnostics** en cas de problème
3. **Actualiser régulièrement** l'état si nécessaire
4. **Gérer les erreurs** avec des messages utilisateur appropriés
5. **Tester sur différentes pages** pour identifier les problèmes de chargement
