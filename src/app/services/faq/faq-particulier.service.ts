import { Injectable } from '@angular/core';
import { FAQParticulierItem } from '../../models/FAQ';
import { BaseFAQService } from './base-faq.service';
import { FAQDataFactory } from './faq-data.factory';

@Injectable({
  providedIn: 'root'
})
export class FAQParticulierService extends BaseFAQService<FAQParticulierItem> {
  
  protected faqItems: FAQParticulierItem[] = FAQDataFactory.generateParticulierStandardFAQ();

  constructor() {
    super();
  }

  /**
   * Récupère les questions FAQ par ordre de priorité
   */
  override getFAQByPriority(): FAQParticulierItem[] {
    const priorityOrder = ['inscription', 'connexion', 'recherche', 'prestataires', 'prestations', 'reservation', 'paiement', 'suivi', 'evaluation', 'messagerie', 'profil', 'securite', 'tarifs', 'annulation'];
    return super.getFAQByPriority(priorityOrder);
  }

  /**
   * Récupère les questions FAQ les plus fréquemment consultées
   */
  override getMostFrequentFAQ(): FAQParticulierItem[] {
    const frequentCategories = ['inscription', 'recherche', 'reservation', 'paiement', 'annulation'];
    return super.getMostFrequentFAQ(frequentCategories);
  }
}
