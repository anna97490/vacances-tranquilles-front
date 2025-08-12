import { Injectable } from '@angular/core';
import { FAQPrestataireItem } from '../../models/FAQ';
import { BaseFAQService } from './base-faq.service';
import { FAQDataFactory } from './faq-data.factory';

@Injectable({
  providedIn: 'root'
})
export class FAQPrestataireService extends BaseFAQService<FAQPrestataireItem> {
  
  protected faqItems: FAQPrestataireItem[] = FAQDataFactory.generatePrestataireStandardFAQ();

  constructor() {
    super();
  }

  /**
   * Récupère les questions FAQ par ordre de priorité
   */
  override getFAQByPriority(): FAQPrestataireItem[] {
    const priorityOrder = ['inscription', 'conditions', 'documents', 'connexion', 'agenda', 'clients', 'services', 'communication', 'messagerie', 'profil'];
    return super.getFAQByPriority(priorityOrder);
  }
}
