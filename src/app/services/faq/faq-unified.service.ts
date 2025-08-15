import { Injectable } from '@angular/core';
import { FAQGeneralService } from './faq-general.service';
import { FAQPrestataireService } from './faq-prestataire.service';
import { FAQParticulierService } from './faq-particulier.service';
import { UnifiedFAQItem, FAQItem } from '../../models/FAQ';

// Type alias pour le type union
type FAQType = 'general' | 'prestataire' | 'particulier';

// Interface pour la configuration des services FAQ
interface FAQServiceConfig {
  service: FAQGeneralService | FAQPrestataireService | FAQParticulierService;
  type: FAQType;
  source: string;
}

@Injectable({
  providedIn: 'root'
})
export class FAQUnifiedService {
  
  // Configuration centralisée des services FAQ
  private readonly faqServices: FAQServiceConfig[];

  constructor(
    private readonly faqGeneralService: FAQGeneralService,
    private readonly faqPrestataireService: FAQPrestataireService,
    private readonly faqParticulierService: FAQParticulierService
  ) { 
    // Initialisation de la configuration dans le constructeur
    this.faqServices = [
      {
        service: this.faqGeneralService,
        type: 'general',
        source: 'Général'
      },
      {
        service: this.faqPrestataireService,
        type: 'prestataire',
        source: 'Prestataire'
      },
      {
        service: this.faqParticulierService,
        type: 'particulier',
        source: 'Particulier'
      }
    ];
  }

  /**
   * Méthode utilitaire pour mapper les FAQ vers UnifiedFAQItem
   */
  private mapToUnifiedFAQ<T extends FAQItem>(items: T[], type: FAQType, source: string): UnifiedFAQItem[] {
    return items.map(item => ({
      ...item,
      type,
      source
    }));
  }

  /**
   * Méthode utilitaire pour récupérer les FAQ d'un service spécifique
   */
  private getFAQFromService(type: FAQType): UnifiedFAQItem[] {
    const config = this.faqServices.find(s => s.type === type);
    if (!config) return [];

    const items = config.service.getAllFAQ();
    return this.mapToUnifiedFAQ(items, config.type, config.source);
  }

  /**
   * Récupère toutes les FAQ de tous les services
   */
  getAllFAQ(): UnifiedFAQItem[] {
    return this.faqServices.flatMap(config => {
      const items = config.service.getAllFAQ();
      return this.mapToUnifiedFAQ(items, config.type, config.source);
    });
  }

  /**
   * Récupère les FAQ par type d'utilisateur
   */
  getFAQByType(type: FAQType): UnifiedFAQItem[] {
    return this.getFAQFromService(type);
  }

  /**
   * Recherche globale dans toutes les FAQ
   */
  searchAllFAQ(query: string): UnifiedFAQItem[] {
    const searchTerm = query.toLowerCase();
    const allFAQ = this.getAllFAQ();
    
    return allFAQ.filter(item => 
      item.question.toLowerCase().includes(searchTerm) || 
      item.reponse.toLowerCase().includes(searchTerm) ||
      item.categorie.toLowerCase().includes(searchTerm)
    );
  }

  /**
   * Récupère les FAQ par catégorie dans tous les services
   */
  getFAQByCategory(categorie: string): UnifiedFAQItem[] {
    const allFAQ = this.getAllFAQ();
    return allFAQ.filter(item => item.categorie === categorie);
  }

  /**
   * Récupère toutes les catégories disponibles
   */
  getAllCategories(): string[] {
    const allFAQ = this.getAllFAQ();
    return [...new Set(allFAQ.map(item => item.categorie))];
  }

  /**
   * Récupère les FAQ les plus populaires (basées sur des catégories fréquentes)
   */
  getPopularFAQ(): UnifiedFAQItem[] {
    const popularCategories = ['inscription', 'connexion', 'reservation', 'paiement', 'annulation', 'services'];
    const allFAQ = this.getAllFAQ();
    
    return allFAQ.filter(item => popularCategories.includes(item.categorie));
  }

  /**
   * Récupère les FAQ par ordre de priorité pour un type donné
   */
  getFAQByPriority(type: FAQType): UnifiedFAQItem[] {
    const config = this.faqServices.find(s => s.type === type);
    if (!config) return [];

    let items: FAQItem[];
    
    // Gestion spécifique pour les méthodes qui peuvent ne pas exister
    if (type === 'prestataire' && 'getFAQByPriority' in config.service) {
      items = (config.service as any).getFAQByPriority();
    } else {
      items = config.service.getAllFAQ();
    }

    return this.mapToUnifiedFAQ(items, config.type, config.source);
  }

  /**
   * Récupère les FAQ les plus fréquemment consultées
   */
  getMostFrequentFAQ(): UnifiedFAQItem[] {
    const frequentFAQ: UnifiedFAQItem[] = [];

    // FAQ fréquentes des particuliers
    if ('getMostFrequentFAQ' in this.faqParticulierService) {
      const particulierFrequent = (this.faqParticulierService as any).getMostFrequentFAQ();
      frequentFAQ.push(...this.mapToUnifiedFAQ(particulierFrequent, 'particulier', 'Particulier'));
    }

    // FAQ fréquentes générales (basées sur des catégories spécifiques)
    const generalFrequent = this.faqGeneralService.getAllFAQ()
      .filter(item => ['inscription', 'services', 'tarifs', 'assistance'].includes(item.categorie));
    frequentFAQ.push(...this.mapToUnifiedFAQ(generalFrequent, 'general', 'Général'));

    return frequentFAQ;
  }

  /**
   * Récupère les statistiques des FAQ
   */
  getFAQStats(): { total: number; general: number; prestataire: number; particulier: number; categories: number } {
    const allFAQ = this.getAllFAQ();
    const categories = this.getAllCategories();
    
    return {
      total: allFAQ.length,
      general: allFAQ.filter(item => item.type === 'general').length,
      prestataire: allFAQ.filter(item => item.type === 'prestataire').length,
      particulier: allFAQ.filter(item => item.type === 'particulier').length,
      categories: categories.length
    };
  }

  /**
   * Filtre les FAQ par plusieurs critères
   */
  filterFAQ(filters: {
    type?: 'general' | 'prestataire' | 'particulier';
    categorie?: string;
    search?: string;
  }): UnifiedFAQItem[] {
    let filteredFAQ = this.getAllFAQ();

    if (filters.type) {
      filteredFAQ = filteredFAQ.filter(item => item.type === filters.type);
    }

    if (filters.categorie) {
      filteredFAQ = filteredFAQ.filter(item => item.categorie === filters.categorie);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredFAQ = filteredFAQ.filter(item => 
        item.question.toLowerCase().includes(searchTerm) || 
        item.reponse.toLowerCase().includes(searchTerm) ||
        item.categorie.toLowerCase().includes(searchTerm)
      );
    }

    return filteredFAQ;
  }
}
