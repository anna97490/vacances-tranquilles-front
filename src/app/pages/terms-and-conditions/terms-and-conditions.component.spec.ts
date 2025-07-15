import { render, screen } from '@testing-library/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { TermsAndConditionsComponent } from './terms-and-conditions.component';

describe('TermsAndConditionsComponent', () => {
  const mockCguContent = {
    sections: [
      {
        title: 'Article 1 - Objet',
        content: [
          { text: 'Les présentes conditions générales d\'utilisation ont pour objet de définir les modalités d\'utilisation de la plateforme.' },
          { text: 'L\'utilisateur reconnaît avoir pris connaissance de ces conditions.' }
        ]
      },
      {
        title: 'Article 2 - Acceptation',
        content: [
          { text: 'L\'utilisation de la plateforme implique l\'acceptation pleine et entière des présentes CGU.' }
        ]
      }
    ]
  };

  const mockCgvContent = {
    sections: [
      {
        title: 'Article 1 - Prix',
        content: [
          { text: 'Les prix sont indiqués en euros toutes taxes comprises.' },
          { text: 'Les prix peuvent être modifiés à tout moment.' }
        ]
      },
      {
        title: 'Article 2 - Paiement',
        content: [
          { text: 'Le paiement s\'effectue par carte bancaire ou virement.' }
        ]
      }
    ]
  };

  describe('Affichage des CGU', () => {
    beforeEach(async () => {
      await render(TermsAndConditionsComponent, {
        componentInputs: {
          cguContent: mockCguContent,
          cgvContent: mockCgvContent,
        },
        providers: [
          {
            provide: ActivatedRoute,
            useValue: {
              snapshot: { params: { type: 'cgu' } }
            }
          }
        ],
        imports: [RouterTestingModule],
      });
    });

    it('devrait afficher le titre des CGU', () => {
      expect(screen.getByText('Conditions Générales d\'Utilisation (CGU)')).toBeTruthy();
    });

    it('devrait afficher tous les titres de sections CGU', () => {
      mockCguContent.sections.forEach(section => {
        expect(screen.getByText(section.title)).toBeTruthy();
      });
    });

    it('devrait afficher tout le contenu des sections CGU', () => {
      mockCguContent.sections.forEach(section => {
        section.content.forEach(content => {
          expect(screen.getByText(content.text)).toBeTruthy();
        });
      });
    });

    it('ne devrait pas afficher le titre des CGV', () => {
      expect(screen.queryByText('Conditions Générales de Vente (CGV)')).toBeFalsy();
    });

    it('ne devrait pas afficher le message d\'absence de conditions', () => {
      expect(screen.queryByText('Aucune condition à afficher.')).toBeFalsy();
    });

    it('devrait avoir la structure HTML correcte pour les CGU', () => {
      const container = document.querySelector('.terms-and-conditions-container');
      expect(container).toBeTruthy();

      const h2Element = container?.querySelector('h2');
      expect(h2Element?.textContent).toBe('Conditions Générales d\'Utilisation (CGU)');

      const h3Elements = container?.querySelectorAll('h3');
      expect(h3Elements?.length).toBe(mockCguContent.sections.length);

      const pElements = container?.querySelectorAll('p');
      const totalContentItems = mockCguContent.sections.reduce((total, section) => total + section.content.length, 0);
      expect(pElements?.length).toBe(totalContentItems);
    });
  });

  describe('Affichage des CGV', () => {
    beforeEach(async () => {
      await render(TermsAndConditionsComponent, {
        componentInputs: {
          cguContent: mockCguContent,
          cgvContent: mockCgvContent,
        },
        providers: [
          {
            provide: ActivatedRoute,
            useValue: {
              snapshot: { params: { type: 'cgv' } }
            }
          }
        ],
        imports: [RouterTestingModule],
      });
    });

    it('devrait afficher le titre des CGV', () => {
      expect(screen.getByText('Conditions Générales de Vente (CGV)')).toBeTruthy();
    });

    it('devrait afficher tous les titres de sections CGV', () => {
      mockCgvContent.sections.forEach(section => {
        expect(screen.getByText(section.title)).toBeTruthy();
      });
    });

    it('devrait afficher tout le contenu des sections CGV', () => {
      mockCgvContent.sections.forEach(section => {
        section.content.forEach(content => {
          expect(screen.getByText(content.text)).toBeTruthy();
        });
      });
    });

    it('ne devrait pas afficher le titre des CGU', () => {
      expect(screen.queryByText('Conditions Générales d\'Utilisation (CGU)')).toBeFalsy();
    });

    it('ne devrait pas afficher le message d\'absence de conditions', () => {
      expect(screen.queryByText('Aucune condition à afficher.')).toBeFalsy();
    });

    it('devrait avoir la structure HTML correcte pour les CGV', () => {
      const container = document.querySelector('.terms-and-conditions-container');
      expect(container).toBeTruthy();

      const h2Element = container?.querySelector('h2');
      expect(h2Element?.textContent).toBe('Conditions Générales de Vente (CGV)');

      const h3Elements = container?.querySelectorAll('h3');
      expect(h3Elements?.length).toBe(mockCgvContent.sections.length);

      const pElements = container?.querySelectorAll('p');
      const totalContentItems = mockCgvContent.sections.reduce((total, section) => total + section.content.length, 0);
      expect(pElements?.length).toBe(totalContentItems);
    });
  });

  describe('Affichage par défaut (aucune condition)', () => {
    beforeEach(async () => {
      await render(TermsAndConditionsComponent, {
        componentInputs: {
          cguContent: mockCguContent,
          cgvContent: mockCgvContent,
        },
        providers: [
          {
            provide: ActivatedRoute,
            useValue: {
              snapshot: { params: { type: 'autre' } }
            }
          }
        ],
        imports: [RouterTestingModule],
      });
    });

    it('devrait afficher le message d\'absence de conditions', () => {
      expect(screen.getByText('Aucune condition à afficher.')).toBeTruthy();
    });

    it('ne devrait pas afficher les titres CGU ou CGV', () => {
      expect(screen.queryByText('Conditions Générales d\'Utilisation (CGU)')).toBeFalsy();
      expect(screen.queryByText('Conditions Générales de Vente (CGV)')).toBeFalsy();
    });

    it('ne devrait pas afficher de contenu de sections', () => {
      mockCguContent.sections.forEach(section => {
        expect(screen.queryByText(section.title)).toBeFalsy();
        section.content.forEach(content => {
          expect(screen.queryByText(content.text)).toBeFalsy();
        });
      });

      mockCgvContent.sections.forEach(section => {
        expect(screen.queryByText(section.title)).toBeFalsy();
        section.content.forEach(content => {
          expect(screen.queryByText(content.text)).toBeFalsy();
        });
      });
    });
  });

  describe('Structure et classes CSS', () => {
    beforeEach(async () => {
      await render(TermsAndConditionsComponent, {
        componentInputs: {
          cguContent: mockCguContent,
          cgvContent: mockCgvContent,
        },
        providers: [
          {
            provide: ActivatedRoute,
            useValue: {
              snapshot: { params: { type: 'cgu' } }
            }
          }
        ],
        imports: [RouterTestingModule],
      });
    });

    it('devrait avoir la classe CSS principale', () => {
      const container = document.querySelector('.terms-and-conditions-container');
      expect(container).toBeTruthy();
    });

    it('devrait utiliser les bonnes balises HTML', () => {
      const h2Elements = document.querySelectorAll('h2');
      const h3Elements = document.querySelectorAll('h3');
      const pElements = document.querySelectorAll('p');

      expect(h2Elements.length).toBeGreaterThan(0);
      expect(h3Elements.length).toBeGreaterThan(0);
      expect(pElements.length).toBeGreaterThan(0);
    });
  });

  describe('Contenu vide', () => {
    beforeEach(async () => {
      await render(TermsAndConditionsComponent, {
        componentInputs: {
          cguContent: { sections: [] },
          cgvContent: { sections: [] },
        },
        providers: [
          {
            provide: ActivatedRoute,
            useValue: {
              snapshot: { params: { type: 'cgu' } }
            }
          }
        ],
        imports: [RouterTestingModule],
      });
    });

    it('devrait afficher le titre même avec un contenu vide', () => {
      expect(screen.getByText('Conditions Générales d\'Utilisation (CGU)')).toBeTruthy();
    });

    it('ne devrait pas afficher de sections avec un contenu vide', () => {
      const h3Elements = document.querySelectorAll('h3');
      const pElements = document.querySelectorAll('p');

      expect(h3Elements.length).toBe(0);
      expect(pElements.length).toBe(0);
    });
  });
});