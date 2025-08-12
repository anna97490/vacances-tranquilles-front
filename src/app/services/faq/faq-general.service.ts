import { Injectable } from '@angular/core';
import { FAQItem } from '../../models/FAQ';
import { BaseFAQService } from './base-faq.service';
import { FAQDataFactory } from './faq-data.factory';

@Injectable({
  providedIn: 'root'
})
export class FAQGeneralService extends BaseFAQService<FAQItem> {
  
  protected faqItems: FAQItem[] = FAQDataFactory.generateGeneralStandardFAQ();

  constructor() {
    super();
  }
}
