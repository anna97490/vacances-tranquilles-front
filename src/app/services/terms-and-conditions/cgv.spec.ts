import { CGV_DATA } from './cgv';
import { TermsContent } from '../../models/Terms';

describe('CGV_DATA', () => {
  it('should be defined', () => {
    expect(CGV_DATA).toBeDefined();
  });

  it('should have correct structure', () => {
    expect(CGV_DATA.title).toBeDefined();
    expect(CGV_DATA.date).toBeDefined();
    expect(CGV_DATA.sections).toBeDefined();
    expect(Array.isArray(CGV_DATA.sections)).toBeTrue();
  });

  it('should have correct title and date', () => {
    expect(CGV_DATA.title).toBe('CONDITIONS GÉNÉRALES DE VENTE');
    expect(CGV_DATA.date).toBe('Juin 2025');
  });

  it('should have sections with correct structure', () => {
    CGV_DATA.sections.forEach(section => {
      expect(section.title).toBeDefined();
      expect(section.content).toBeDefined();
      expect(Array.isArray(section.content)).toBeTrue();
      expect(typeof section.title).toBe('string');
      expect(section.title.length).toBeGreaterThan(0);
    });
  });

  it('should have content items with text property', () => {
    CGV_DATA.sections.forEach(section => {
      section.content.forEach(item => {
        expect(item.text).toBeDefined();
        expect(typeof item.text).toBe('string');
        expect(item.text.length).toBeGreaterThan(0);
      });
    });
  });

  it('should have bullet points formatted correctly', () => {
    // Vérifier que les puces sont formatées avec "• "
    CGV_DATA.sections.forEach(section => {
      section.content.forEach(item => {
        if (item.text.startsWith('• ')) {
          expect(item.text.length).toBeGreaterThan(2); // Plus que juste "• "
        }
      });
    });
  });

  it('should have specific required sections', () => {
    const sectionTitles = CGV_DATA.sections.map(section => section.title);

    expect(sectionTitles).toContain('Article 1 – Objet');
    expect(sectionTitles).toContain('Article 2 – Réservation et engagement contractuel');
    expect(sectionTitles).toContain('Article 3 – Prix et modalités de paiement');
    expect(sectionTitles).toContain('Article 4 – Facturation');
    expect(sectionTitles).toContain('Article 5 – Annulation et remboursement');
    expect(sectionTitles).toContain('Article 6 – Retrait des fonds par le prestataire');
    expect(sectionTitles).toContain('Article 7 – Modification ou remplacement');
    expect(sectionTitles).toContain('Article 8 – Litiges et responsabilités');
    expect(sectionTitles).toContain('Article 9 – Suspension ou exclusion d\'un utilisateur');
  });

  it('should have content about payment methods', () => {
    const allContent = CGV_DATA.sections
      .flatMap(section => section.content)
      .map(item => item.text)
      .join(' ');

    expect(allContent).toContain('Stripe');
    expect(allContent).toContain('paiement');
    expect(allContent).toContain('CESU');
    expect(allContent).toContain('virement');
  });

  it('should have content about booking and cancellation', () => {
    const allContent = CGV_DATA.sections
      .flatMap(section => section.content)
      .map(item => item.text)
      .join(' ');

    expect(allContent).toContain('réservation');
    expect(allContent).toContain('annulation');
    expect(allContent).toContain('remboursement');
    expect(allContent).toContain('96h');
    expect(allContent).toContain('48h');
  });

  it('should have content about platform commission', () => {
    const allContent = CGV_DATA.sections
      .flatMap(section => section.content)
      .map(item => item.text)
      .join(' ');

    expect(allContent).toContain('commission');
    expect(allContent).toContain('plateforme');
  });

  it('should have content about user types', () => {
    const allContent = CGV_DATA.sections
      .flatMap(section => section.content)
      .map(item => item.text)
      .join(' ');

    expect(allContent).toContain('particulier');
    expect(allContent).toContain('prestataire');
    expect(allContent).toContain('utilisateur');
  });

  it('should have content about billing and invoices', () => {
    const allContent = CGV_DATA.sections
      .flatMap(section => section.content)
      .map(item => item.text)
      .join(' ');

    expect(allContent).toContain('facturation');
    expect(allContent).toContain('factures');
    expect(allContent).toContain('justificatifs');
  });

  it('should have content about disputes and responsibilities', () => {
    const allContent = CGV_DATA.sections
      .flatMap(section => section.content)
      .map(item => item.text)
      .join(' ');

    expect(allContent).toContain('litige');
    expect(allContent).toContain('responsabilité');
    expect(allContent).toContain('médiateur');
  });

  it('should conform to TermsContent interface', () => {
    const cgvData: TermsContent = CGV_DATA;
    expect(cgvData).toBeDefined();
    expect(typeof cgvData.title).toBe('string');
    expect(typeof cgvData.date).toBe('string');
    expect(Array.isArray(cgvData.sections)).toBeTrue();
  });

  it('should have non-empty content in all sections', () => {
    CGV_DATA.sections.forEach(section => {
      expect(section.content.length).toBeGreaterThan(0);
      section.content.forEach(item => {
        expect(item.text.trim().length).toBeGreaterThan(0);
      });
    });
  });

  it('should have proper article numbering', () => {
    CGV_DATA.sections.forEach((section, index) => {
      if (section.title.match(/^Article \d+/)) {
        const articleNumber = parseInt(section.title.split(' ')[1]);
        expect(articleNumber).toBe(index + 1);
      }
    });
  });

  it('should have content about service execution', () => {
    const allContent = CGV_DATA.sections
      .flatMap(section => section.content)
      .map(item => item.text)
      .join(' ');

    expect(allContent).toContain('prestation');
    expect(allContent).toContain('exécution');
    expect(allContent).toContain('réalisation');
  });

  it('should have content about platform URL', () => {
    const allContent = CGV_DATA.sections
      .flatMap(section => section.content)
      .map(item => item.text)
      .join(' ');

    expect(allContent).toContain('vacancestranquilles.fr');
  });
});
