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

    it('should create HomeContent with material icon type', () => {
      const content: HomeContent = {
        iconType: 'material',
        mainIcon: 'home',
        title: 'Test Title',
        subtitle: 'Test Subtitle',
        introText: 'Test intro',
        btnPrestataire: 'Test Prestataire',
        btnParticulier: 'Test Particulier',
        btnConnexion: 'Test Connexion',
        featuresTitle: 'Test Features',
        features: []
      };

      expect(content.iconType).toBe('material');
      expect(content.mainIcon).toBe('home');
    });

    it('should create HomeContent with features', () => {
      const features: HomeFeature[] = [
        {
          iconType: 'custom',
          icon: 'assets/icons/field_FFA101.svg',
          title: 'Feature 1',
          desc: 'Description 1'
        },
        {
          iconType: 'material',
          icon: 'star',
          title: 'Feature 2',
          desc: 'Description 2'
        }
      ];

      const content: HomeContent = {
        iconType: 'custom',
        mainIcon: 'assets/icons/beach_access_FFA101.svg',
        title: 'Test',
        subtitle: 'Test',
        introText: 'Test',
        btnPrestataire: 'Test',
        btnParticulier: 'Test',
        btnConnexion: 'Test',
        featuresTitle: 'Test',
        features: features
      };

      expect(content.features).toHaveSize(2);
      expect(content.features[0].title).toBe('Feature 1');
      expect(content.features[1].title).toBe('Feature 2');
    });

    it('should handle empty features array', () => {
      const content: HomeContent = {
        iconType: 'custom',
        mainIcon: 'test.svg',
        title: 'Test',
        subtitle: 'Test',
        introText: 'Test',
        btnPrestataire: 'Test',
        btnParticulier: 'Test',
        btnConnexion: 'Test',
        featuresTitle: 'Test',
        features: []
      };

      expect(content.features).toEqual([]);
      expect(content.features.length).toBe(0);
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

    it('should create HomeFeature with material icon', () => {
      const feature: HomeFeature = {
        iconType: 'material',
        icon: 'star',
        title: 'Test Feature',
        desc: 'Test Description'
      };

      expect(feature.iconType).toBe('material');
      expect(feature.icon).toBe('star');
      expect(feature.title).toBe('Test Feature');
      expect(feature.desc).toBe('Test Description');
    });

    it('should handle different icon types', () => {
      const customFeature: HomeFeature = {
        iconType: 'custom',
        icon: 'custom.svg',
        title: 'Custom',
        desc: 'Custom desc'
      };

      const materialFeature: HomeFeature = {
        iconType: 'material',
        icon: 'home',
        title: 'Material',
        desc: 'Material desc'
      };

      expect(customFeature.iconType).toBe('custom');
      expect(materialFeature.iconType).toBe('material');
    });

    it('should handle empty strings', () => {
      const feature: HomeFeature = {
        iconType: 'custom',
        icon: '',
        title: '',
        desc: ''
      };

      expect(feature.icon).toBe('');
      expect(feature.title).toBe('');
      expect(feature.desc).toBe('');
    });
  });
});
