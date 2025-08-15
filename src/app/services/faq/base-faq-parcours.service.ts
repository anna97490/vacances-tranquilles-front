import { Injectable } from '@angular/core';
import { FAQItem } from '../../models/FAQ';
import { BaseFAQService } from './base-faq.service';

/**
 * Interface pour les éléments FAQ avec ordre et ID
 */
export interface FAQParcoursItem extends FAQItem {
  id: string;
  ordre: number;
}

/**
 * Service de base pour les services FAQ de parcours
 * Étend BaseFAQService et ajoute les méthodes spécifiques aux parcours
 */
@Injectable()
export abstract class BaseFAQParcoursService<T extends FAQParcoursItem> extends BaseFAQService<T> {
  
  /**
   * Récupère toutes les questions du parcours triées par ordre
   */
  getAllQuestions(): T[] {
    return this.faqItems.sort((a, b) => a.ordre - b.ordre);
  }

  /**
   * Récupère les questions par catégorie triées par ordre
   */
  getQuestionsByCategory(categorie: string): T[] {
    return this.faqItems
      .filter(faq => faq.categorie === categorie)
      .sort((a, b) => a.ordre - b.ordre);
  }

  /**
   * Recherche dans les questions et réponses
   */
  searchQuestions(searchTerm: string): T[] {
    const term = searchTerm.toLowerCase();
    return this.faqItems.filter(faq => 
      faq.question.toLowerCase().includes(term) || 
      faq.reponse.toLowerCase().includes(term)
    );
  }

  /**
   * Récupère une question spécifique par ID
   */
  getQuestionById(id: string): T | undefined {
    return this.faqItems.find(faq => faq.id === id);
  }
}
