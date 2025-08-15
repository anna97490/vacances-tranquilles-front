import { Injectable } from '@angular/core';
import { FAQParticulierParcours } from '../../models/FAQ';
import { BaseFAQParcoursService } from './base-faq-parcours.service';
import { FAQDataFactory } from './faq-data.factory';

@Injectable({
  providedIn: 'root'
})
export class FAQParticulierParcoursService extends BaseFAQParcoursService<FAQParticulierParcours> {

  protected faqItems: FAQParticulierParcours[] = FAQDataFactory.generateParticulierFAQ();

  constructor() {
    super();
  }
}
