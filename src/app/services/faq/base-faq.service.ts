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
}
