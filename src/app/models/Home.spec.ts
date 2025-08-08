import { HomeContent, HomeFeature } from './Home';

describe('Home Models', () => {
  describe('HomeContent', () => {
    it('should create HomeContent with all required properties', () => {
      const content: HomeContent = {
        iconType: 'custom',
        mainIcon: 'assets/icons/beach_access_FFA101.svg',
        title: 'Vacances Tranquilles',
        subtitle: 'Votre partenaire de confiance',
        introText: 'Test intro text',
        btnPrestataire: 'Inscription Prestataires',
        btnParticulier: 'Inscription Particuliers',
        btnConnexion: 'Connexion',
        featuresTitle: 'Pourquoi nous choisir',
        features: []
      };

      expect(content.iconType).toBe('custom');
      expect(content.mainIcon).toBe('assets/icons/beach_access_FFA101.svg');
      expect(content.title).toBe('Vacances Tranquilles');
      expect(content.subtitle).toBe('Votre partenaire de confiance');
      expect(content.introText).toBe('Test intro text');
      expect(content.btnPrestataire).toBe('Inscription Prestataires');
      expect(content.btnParticulier).toBe('Inscription Particuliers');
      expect(content.btnConnexion).toBe('Connexion');
      expect(content.featuresTitle).toBe('Pourquoi nous choisir');
      expect(content.features).toEqual([]);
    });
  });

  describe('HomeFeature', () => {
    it('should create HomeFeature with all required properties', () => {
      const feature: HomeFeature = {
        iconType: 'custom',
        icon: 'assets/icons/field_FFA101.svg',
        title: 'Prestataires Vérifiés',
        desc: 'Tous nos prestataires sont soigneusement sélectionnés'
      };

      expect(feature.iconType).toBe('custom');
      expect(feature.icon).toBe('assets/icons/field_FFA101.svg');
      expect(feature.title).toBe('Prestataires Vérifiés');
      expect(feature.desc).toBe('Tous nos prestataires sont soigneusement sélectionnés');
    });
  });
}); 