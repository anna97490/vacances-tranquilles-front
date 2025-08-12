import { Injectable } from '@angular/core';
import { FAQItem } from '../../models/FAQ';

/**
 * Service de base générique pour tous les services FAQ
 * Contient les méthodes communes pour éviter la duplication de code
 */
@Injectable()
export abstract class BaseFAQService<T extends FAQItem> {
  
  protected abstract faqItems: T[];

  /**
   * Récupère toutes les questions FAQ
   */
  getAllFAQ(): T[] {
    return this.faqItems;
  }

  /**
   * Récupère les questions FAQ par catégorie
   */
  getFAQByCategory(categorie: string): T[] {
    return this.faqItems.filter(item => item.categorie === categorie);
  }

  /**
   * Recherche dans les questions FAQ
   */
  searchFAQ(query: string): T[] {
    const searchTerm = query.toLowerCase();
    return this.faqItems.filter(item => 
      item.question.toLowerCase().includes(searchTerm) || 
      item.reponse.toLowerCase().includes(searchTerm)
    );
  }

  /**
   * Récupère les catégories disponibles
   */
  getCategories(): string[] {
    return [...new Set(this.faqItems.map(item => item.categorie))];
  }

  /**
   * Récupère le nombre total de questions
   */
  getTotalQuestions(): number {
    return this.faqItems.length;
  }

  /**
   * Récupère les questions FAQ par ordre de priorité
   * Méthode générique pour éviter la duplication dans les services dérivés
   */
  getFAQByPriority(priorityOrder?: string[]): T[] {
    // Si aucun ordre de priorité n'est fourni, retourner toutes les questions
    if (!priorityOrder || priorityOrder.length === 0) {
      return this.faqItems;
    }

    return this.faqItems.sort((a, b) => {
      const aIndex = priorityOrder.indexOf(a.categorie);
      const bIndex = priorityOrder.indexOf(b.categorie);
      
      // Si les deux catégories sont dans l'ordre de priorité, les trier selon cet ordre
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }
      
      // Si seule la première catégorie est dans l'ordre, la mettre en premier
      if (aIndex !== -1) {
        return -1;
      }
      
      // Si seule la deuxième catégorie est dans l'ordre, la mettre en premier
      if (bIndex !== -1) {
        return 1;
      }
      
      // Si aucune n'est dans l'ordre, garder l'ordre original
      return 0;
    });
  }

  /**
   * Récupère les questions FAQ les plus fréquemment consultées
   * Méthode générique pour éviter la duplication dans les services dérivés
   */
  getMostFrequentFAQ(frequentCategories?: string[]): T[] {
    // Si aucune catégorie fréquente n'est fournie, retourner toutes les questions
    if (!frequentCategories || frequentCategories.length === 0) {
      return this.faqItems;
    }

    return this.faqItems.filter(item => frequentCategories.includes(item.categorie));
  }
}
