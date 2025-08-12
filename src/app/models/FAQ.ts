/**
 * Modèles pour les FAQ de l'application Vacances Tranquilles
 * Basés sur les interfaces des services FAQ
 */

/**
 * Interface de base pour un élément FAQ
 */
export interface FAQItem {
  question: string;
  reponse: string;
  categorie: string;
}

/**
 * Interface pour un élément FAQ avec état d'expansion (utilisé dans les composants)
 */
export interface FAQItemWithState extends FAQItem {
  isExpanded: boolean;
}

/**
 * Interface pour un élément FAQ Particulier
 */
export interface FAQParticulierItem extends FAQItem {
  // Hérite de FAQItem
}

/**
 * Interface pour un élément FAQ Prestataire
 */
export interface FAQPrestataireItem extends FAQItem {
  // Hérite de FAQItem
}

/**
 * Interface pour un élément FAQ Particulier Parcours (avec ordre et id)
 */
export interface FAQParticulierParcours extends FAQItem {
  id: string;
  ordre: number;
}

/**
 * Interface pour un élément FAQ Prestataire Parcours (avec ordre et id)
 */
export interface FAQPrestataireParcours extends FAQItem {
  id: string;
  ordre: number;
}

/**
 * Interface pour un élément FAQ unifié (tous types confondus)
 */
export interface UnifiedFAQItem extends FAQItem {
  type: 'general' | 'prestataire' | 'particulier';
  source: string;
}

/**
 * Énumération des types de FAQ
 */
export enum FAQType {
  GENERAL = 'general',
  PRESTATAIRE = 'prestataire',
  PARTICULIER = 'particulier'
}

/**
 * Énumération des sources de FAQ
 */
export enum FAQSource {
  GENERAL = 'Général',
  PRESTATAIRE = 'Prestataire',
  PARTICULIER = 'Particulier'
}

/**
 * Interface pour les filtres de recherche FAQ
 */
export interface FAQFilters {
  type?: FAQType;
  categorie?: string;
  search?: string;
}

/**
 * Interface pour les statistiques FAQ
 */
export interface FAQStats {
  total: number;
  general: number;
  prestataire: number;
  particulier: number;
  categories: number;
}

/**
 * Classes utilitaires pour la création d'instances FAQ
 * Ces classes peuvent être utilisées pour créer des instances avec des méthodes utilitaires
 */
export class FAQItemFactory {
  /**
   * Méthode générique pour créer un objet FAQ de base
   */
  private static createBaseFAQ(obj: any): { question: string; reponse: string; categorie: string } {
    return {
      question: obj.question || '',
      reponse: obj.reponse || '',
      categorie: obj.categorie || ''
    };
  }

  /**
   * Crée une instance FAQItem à partir d'un objet
   */
  static createFAQItem(obj: any): FAQItem {
    return this.createBaseFAQ(obj);
  }

  /**
   * Crée une instance FAQItemWithState à partir d'un objet
   */
  static createFAQItemWithState(obj: any): FAQItemWithState {
    return {
      ...this.createBaseFAQ(obj),
      isExpanded: obj.isExpanded !== undefined ? obj.isExpanded : false
    };
  }

  /**
   * Crée une instance FAQParticulierItem à partir d'un objet
   */
  static createFAQParticulierItem(obj: any): FAQParticulierItem {
    return this.createBaseFAQ(obj);
  }

  /**
   * Crée une instance FAQPrestataireItem à partir d'un objet
   */
  static createFAQPrestataireItem(obj: any): FAQPrestataireItem {
    return this.createBaseFAQ(obj);
  }

  /**
   * Crée une instance UnifiedFAQItem à partir d'un objet
   */
  static createUnifiedFAQItem(obj: any): UnifiedFAQItem {
    return {
      ...this.createBaseFAQ(obj),
      type: obj.type || 'general',
      source: obj.source || ''
    };
  }

  /**
   * Crée une instance FAQParticulierParcours à partir d'un objet
   */
  static createFAQParticulierParcours(obj: any): FAQParticulierParcours {
    return {
      ...this.createBaseFAQ(obj),
      id: obj.id || '',
      ordre: obj.ordre || 0
    };
  }

  /**
   * Crée une instance FAQPrestataireParcours à partir d'un objet
   */
  static createFAQPrestataireParcours(obj: any): FAQPrestataireParcours {
    return {
      ...this.createBaseFAQ(obj),
      id: obj.id || '',
      ordre: obj.ordre || 0
    };
  }
}
