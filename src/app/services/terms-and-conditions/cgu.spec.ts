import { CGU_DATA } from './cgu';
import { TermsContent } from '../../models/Terms';

describe('CGU_DATA', () => {
  it('should be defined', () => {
    expect(CGU_DATA).toBeDefined();
  });

  it('should have correct structure', () => {
    expect(CGU_DATA.title).toBeDefined();
    expect(CGU_DATA.date).toBeDefined();
    expect(CGU_DATA.sections).toBeDefined();
    expect(Array.isArray(CGU_DATA.sections)).toBeTrue();
  });

  it('should have correct title and date', () => {
    expect(CGU_DATA.title).toBe("CONDITIONS GÉNÉRALES D'UTILISATION");
    expect(CGU_DATA.date).toBe("Juin 2025");
  });

  it('should have sections with correct structure', () => {
    CGU_DATA.sections.forEach(section => {
      expect(section.title).toBeDefined();
      expect(section.content).toBeDefined();
      expect(Array.isArray(section.content)).toBeTrue();
      expect(typeof section.title).toBe('string');
      expect(section.title.length).toBeGreaterThan(0);
    });
  });

  it('should have content items with text property', () => {
    CGU_DATA.sections.forEach(section => {
      section.content.forEach(item => {
        expect(item.text).toBeDefined();
        expect(typeof item.text).toBe('string');
        expect(item.text.length).toBeGreaterThan(0);
      });
    });
  });

  it('should have bullet points formatted correctly', () => {
    // Vérifier que les puces sont formatées avec "• "
    CGU_DATA.sections.forEach(section => {
      section.content.forEach(item => {
        if (item.text.startsWith('• ')) {
          expect(item.text.length).toBeGreaterThan(2); // Plus que juste "• "
        }
      });
    });
  });

  it('should have specific required sections', () => {
    const sectionTitles = CGU_DATA.sections.map(section => section.title);

    expect(sectionTitles).toContain('1. Objet');
    expect(sectionTitles).toContain('2. Accès à la plateforme');
    expect(sectionTitles).toContain('3. Fonctionnalités proposées');
    expect(sectionTitles).toContain('4. Engagements de l\'utilisateur');
    expect(sectionTitles).toContain('5. Acceptation des CGU');
    expect(sectionTitles).toContain('6. Suspension ou suppression du compte');
    expect(sectionTitles).toContain('7. Données personnelles et RGPD');
  });

  it('should have content about user types', () => {
    const allContent = CGU_DATA.sections
      .flatMap(section => section.content)
      .map(item => item.text)
      .join(' ');

    expect(allContent).toContain('Particulier');
    expect(allContent).toContain('Prestataire');
    expect(allContent).toContain('Administrateur');
  });

  it('should have content about platform features', () => {
    const allContent = CGU_DATA.sections
      .flatMap(section => section.content)
      .map(item => item.text)
      .join(' ');

    expect(allContent).toContain('réservation');
    expect(allContent).toContain('paiement');
    expect(allContent).toContain('messagerie');
    expect(allContent).toContain('notation');
  });

  it('should have GDPR related content', () => {
    const allContent = CGU_DATA.sections
      .flatMap(section => section.content)
      .map(item => item.text)
      .join(' ');

    expect(allContent).toContain('RGPD');
    expect(allContent).toContain('données personnelles');
    expect(allContent).toContain('Droit d\'accès');
  });

  it('should have content about account management', () => {
    const allContent = CGU_DATA.sections
      .flatMap(section => section.content)
      .map(item => item.text)
      .join(' ');

    expect(allContent).toContain('inscription');
    expect(allContent).toContain('compte');
    expect(allContent).toContain('suspendre');
  });

  it('should conform to TermsContent interface', () => {
    const cguData: TermsContent = CGU_DATA;
    expect(cguData).toBeDefined();
    expect(typeof cguData.title).toBe('string');
    expect(typeof cguData.date).toBe('string');
    expect(Array.isArray(cguData.sections)).toBeTrue();
  });

  it('should have non-empty content in all sections', () => {
    CGU_DATA.sections.forEach(section => {
      expect(section.content.length).toBeGreaterThan(0);
      section.content.forEach(item => {
        expect(item.text.trim().length).toBeGreaterThan(0);
      });
    });
  });

  it('should have proper section numbering', () => {
    CGU_DATA.sections.forEach((section, index) => {
      if (section.title.match(/^\d+\./)) {
        const sectionNumber = parseInt(section.title.split('.')[0]);
        expect(sectionNumber).toBe(index + 1);
      }
    });
  });
});
