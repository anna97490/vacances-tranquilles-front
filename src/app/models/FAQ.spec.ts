import { FAQItem, FAQItemWithState, FAQParticulierItem, FAQPrestataireItem, FAQParticulierParcours, FAQPrestataireParcours, UnifiedFAQItem, FAQType, FAQSource, FAQItemFactory } from './FAQ';

describe('FAQ Models', () => {

  describe('FAQItem Interface', () => {
    it('should create a FAQItem object', () => {
      const faq: FAQItem = {
        question: 'Question test',
        reponse: 'Réponse test',
        categorie: 'categorie-test'
      };

      expect(faq.question).toBe('Question test');
      expect(faq.reponse).toBe('Réponse test');
      expect(faq.categorie).toBe('categorie-test');
    });

    it('should create FAQItem using factory', () => {
      const obj = {
        question: 'Question test',
        reponse: 'Réponse test',
        categorie: 'categorie-test'
      };

      const faq = FAQItemFactory.createFAQItem(obj);

      expect(faq.question).toBe('Question test');
      expect(faq.reponse).toBe('Réponse test');
      expect(faq.categorie).toBe('categorie-test');
    });
  });

  describe('FAQItemWithState Interface', () => {
    it('should create a FAQItemWithState object', () => {
      const faq: FAQItemWithState = {
        question: 'Question test',
        reponse: 'Réponse test',
        categorie: 'categorie-test',
        isExpanded: false
      };

      expect(faq.question).toBe('Question test');
      expect(faq.reponse).toBe('Réponse test');
      expect(faq.categorie).toBe('categorie-test');
      expect(faq.isExpanded).toBe(false);
    });

    it('should create FAQItemWithState using factory', () => {
      const obj = {
        question: 'Question test',
        reponse: 'Réponse test',
        categorie: 'categorie-test'
      };

      const faq = FAQItemFactory.createFAQItemWithState(obj);

      expect(faq.question).toBe('Question test');
      expect(faq.reponse).toBe('Réponse test');
      expect(faq.categorie).toBe('categorie-test');
      expect(faq.isExpanded).toBe(false);
    });

    it('should create FAQItemWithState with custom isExpanded value', () => {
      const obj = {
        question: 'Question test',
        reponse: 'Réponse test',
        categorie: 'categorie-test',
        isExpanded: true
      };

      const faq = FAQItemFactory.createFAQItemWithState(obj);

      expect(faq.question).toBe('Question test');
      expect(faq.isExpanded).toBe(true);
    });
  });

  describe('FAQParticulierItem Interface', () => {
    it('should create a FAQParticulierItem object', () => {
      const faq: FAQParticulierItem = {
        question: 'Question particulier',
        reponse: 'Réponse particulier',
        categorie: 'inscription'
      };

      expect(faq.question).toBe('Question particulier');
      expect(faq.categorie).toBe('inscription');
    });

    it('should create FAQParticulierItem using factory', () => {
      const obj = {
        question: 'Question particulier',
        reponse: 'Réponse particulier',
        categorie: 'inscription'
      };

      const faq = FAQItemFactory.createFAQParticulierItem(obj);

      expect(faq.question).toBe('Question particulier');
      expect(faq.categorie).toBe('inscription');
    });
  });

  describe('FAQPrestataireItem Interface', () => {
    it('should create a FAQPrestataireItem object', () => {
      const faq: FAQPrestataireItem = {
        question: 'Question prestataire',
        reponse: 'Réponse prestataire',
        categorie: 'conditions'
      };

      expect(faq.question).toBe('Question prestataire');
      expect(faq.categorie).toBe('conditions');
    });

    it('should create FAQPrestataireItem using factory', () => {
      const obj = {
        question: 'Question prestataire',
        reponse: 'Réponse prestataire',
        categorie: 'conditions'
      };

      const faq = FAQItemFactory.createFAQPrestataireItem(obj);

      expect(faq.question).toBe('Question prestataire');
      expect(faq.categorie).toBe('conditions');
    });
  });

  describe('UnifiedFAQItem Interface', () => {
    it('should create a UnifiedFAQItem object', () => {
      const faq: UnifiedFAQItem = {
        question: 'Question unifiée',
        reponse: 'Réponse unifiée',
        categorie: 'general',
        type: FAQType.GENERAL,
        source: FAQSource.GENERAL
      };

      expect(faq.question).toBe('Question unifiée');
      expect(faq.type).toBe(FAQType.GENERAL);
      expect(faq.source).toBe(FAQSource.GENERAL);
    });

    it('should create UnifiedFAQItem using factory', () => {
      const obj = {
        question: 'Question unifiée',
        reponse: 'Réponse unifiée',
        categorie: 'general',
        type: 'general',
        source: 'Général'
      };

      const faq = FAQItemFactory.createUnifiedFAQItem(obj);

      expect(faq.question).toBe('Question unifiée');
      expect(faq.type).toBe('general');
      expect(faq.source).toBe('Général');
    });
  });

  describe('FAQParticulierParcours Interface', () => {
    it('should create a FAQParticulierParcours object', () => {
      const faq: FAQParticulierParcours = {
        id: 'test-id',
        question: 'Question particulier parcours',
        reponse: 'Réponse particulier parcours',
        categorie: 'inscription',
        ordre: 1
      };

      expect(faq.id).toBe('test-id');
      expect(faq.question).toBe('Question particulier parcours');
      expect(faq.ordre).toBe(1);
    });

    it('should create FAQParticulierParcours using factory', () => {
      const obj = {
        id: 'test-id',
        question: 'Question particulier parcours',
        reponse: 'Réponse particulier parcours',
        categorie: 'inscription',
        ordre: 5
      };

      const faq = FAQItemFactory.createFAQParticulierParcours(obj);

      expect(faq.id).toBe('test-id');
      expect(faq.question).toBe('Question particulier parcours');
      expect(faq.ordre).toBe(5);
    });
  });

  describe('FAQPrestataireParcours Interface', () => {
    it('should create a FAQPrestataireParcours object', () => {
      const faq: FAQPrestataireParcours = {
        id: 'presta-test-id',
        question: 'Question prestataire parcours',
        reponse: 'Réponse prestataire parcours',
        categorie: 'conditions',
        ordre: 2
      };

      expect(faq.id).toBe('presta-test-id');
      expect(faq.question).toBe('Question prestataire parcours');
      expect(faq.ordre).toBe(2);
    });

    it('should create FAQPrestataireParcours using factory', () => {
      const obj = {
        id: 'presta-test-id',
        question: 'Question prestataire parcours',
        reponse: 'Réponse prestataire parcours',
        categorie: 'conditions',
        ordre: 10
      };

      const faq = FAQItemFactory.createFAQPrestataireParcours(obj);

      expect(faq.id).toBe('presta-test-id');
      expect(faq.question).toBe('Question prestataire parcours');
      expect(faq.ordre).toBe(10);
    });
  });

  describe('FAQItemFactory', () => {
    it('should create instances with default values for missing properties', () => {
      const obj = {
        question: 'Question test'
        // reponse et categorie manquants
      };

      const faq = FAQItemFactory.createFAQItem(obj);

      expect(faq.question).toBe('Question test');
      expect(faq.reponse).toBe('');
      expect(faq.categorie).toBe('');
    });

    it('should handle null/undefined values gracefully', () => {
      const obj = {
        question: null,
        reponse: undefined,
        categorie: ''
      };

      const faq = FAQItemFactory.createFAQItem(obj);

      expect(faq.question).toBe('');
      expect(faq.reponse).toBe('');
      expect(faq.categorie).toBe('');
    });
  });

  describe('Enums', () => {
    it('should have correct FAQType values', () => {
      expect(FAQType.GENERAL).toBe('general');
      expect(FAQType.PRESTATAIRE).toBe('prestataire');
      expect(FAQType.PARTICULIER).toBe('particulier');
    });

    it('should have correct FAQSource values', () => {
      expect(FAQSource.GENERAL).toBe('Général');
      expect(FAQSource.PRESTATAIRE).toBe('Prestataire');
      expect(FAQSource.PARTICULIER).toBe('Particulier');
    });
  });
});
