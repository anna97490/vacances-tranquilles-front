import { Injectable } from '@angular/core';
import { FAQGeneralService } from './faq-general.service';
import { FAQPrestataireService } from './faq-prestataire.service';
import { FAQParticulierService } from './faq-particulier.service';
import { UnifiedFAQItem } from '../../models/FAQ';

@Injectable({
  providedIn: 'root'
})
export class FAQUnifiedService {
  
  constructor(
    private faqGeneralService: FAQGeneralService,
    private faqPrestataireService: FAQPrestataireService,
    private faqParticulierService: FAQParticulierService
  ) { }

  /**
   * Récupère toutes les FAQ de tous les services
   */
  getAllFAQ(): UnifiedFAQItem[] {
    const generalFAQ = this.faqGeneralService.getAllFAQ().map(item => ({
      ...item,
      type: 'general' as const,
      source: 'Général'
    }));

    const prestataireFAQ = this.faqPrestataireService.getAllFAQ().map(item => ({
      ...item,
      type: 'prestataire' as const,
      source: 'Prestataire'
    }));

    const particulierFAQ = this.faqParticulierService.getAllFAQ().map(item => ({
      ...item,
      type: 'particulier' as const,
      source: 'Particulier'
    }));

    return [...generalFAQ, ...prestataireFAQ, ...particulierFAQ];
  }

  /**
   * Récupère les FAQ par type d'utilisateur
   */
  getFAQByType(type: 'general' | 'prestataire' | 'particulier'): UnifiedFAQItem[] {
    switch (type) {
      case 'general':
        return this.faqGeneralService.getAllFAQ().map(item => ({
          ...item,
          type: 'general' as const,
          source: 'Général'
        }));
      case 'prestataire':
        return this.faqPrestataireService.getAllFAQ().map(item => ({
          ...item,
          type: 'prestataire' as const,
          source: 'Prestataire'
        }));
      case 'particulier':
        return this.faqParticulierService.getAllFAQ().map(item => ({
          ...item,
          type: 'particulier' as const,
          source: 'Particulier'
        }));
      default:
        return [];
    }
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
  getFAQByPriority(type: 'general' | 'prestataire' | 'particulier'): UnifiedFAQItem[] {
    switch (type) {
      case 'prestataire':
        return this.faqPrestataireService.getFAQByPriority().map(item => ({
          ...item,
          type: 'prestataire' as const,
          source: 'Prestataire'
        }));
      case 'particulier':
        // Utiliser getAllFAQ() au lieu de getFAQByPriority() qui n'existe pas
        return this.faqParticulierService.getAllFAQ().map(item => ({
          ...item,
          type: 'particulier' as const,
          source: 'Particulier'
        }));
      default:
        return this.faqGeneralService.getAllFAQ().map(item => ({
          ...item,
          type: 'general' as const,
          source: 'Général'
        }));
    }
  }

  /**
   * Récupère les FAQ les plus fréquemment consultées
   */
  getMostFrequentFAQ(): UnifiedFAQItem[] {
    const particulierFrequent = this.faqParticulierService.getMostFrequentFAQ().map(item => ({
      ...item,
      type: 'particulier' as const,
      source: 'Particulier'
    }));

    const generalFrequent = this.faqGeneralService.getAllFAQ()
      .filter(item => ['inscription', 'services', 'tarifs', 'assistance'].includes(item.categorie))
      .map(item => ({
        ...item,
        type: 'general' as const,
        source: 'Général'
      }));

    return [...particulierFrequent, ...generalFrequent];
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
