import { Injectable } from '@angular/core';
import { FAQPrestataireParcours } from '../../models/FAQ';
import { BaseFAQParcoursService } from './base-faq-parcours.service';
import { FAQDataFactory } from './faq-data.factory';

@Injectable({
  providedIn: 'root'
})
export class FAQPrestataireParcoursService extends BaseFAQParcoursService<FAQPrestataireParcours> {

  protected faqItems: FAQPrestataireParcours[] = FAQDataFactory.generatePrestataireFAQ();

  constructor() {
    super();
  }
}
