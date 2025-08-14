import { HomeContentService } from './../../services/home-content/home-content.service';
import { HomeContent } from './../../models/Home';

describe('HomeContentService', () => {
  let service: HomeContentService;

  beforeEach(() => {
    service = new HomeContentService();
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('should return valid home content structure', () => {
    const content: HomeContent = service.getContent();

    expect(content).toBeDefined();
    expect(content.iconType).toBe('custom');
    expect(content.mainIcon).toContain('.svg');
    expect(content.title).toBeTruthy();
    expect(content.subtitle).toBeTruthy();
    expect(content.introText).toContain('Simplifiez');
    expect(content.btnPrestataire).toContain('Prestataires');
    expect(content.btnParticulier).toContain('Particuliers');
    expect(content.btnConnexion).toBe('Connexion');
    expect(content.featuresTitle).toContain('choisir');

    expect(Array.isArray(content.features)).toBeTrue();
    expect(content.features.length).toBeGreaterThan(0);

    content.features.forEach(feature => {
      expect(feature.iconType).toBe('custom');
      expect(feature.icon).toMatch(/\.svg$/);
      expect(feature.title).toBeTruthy();
      expect(feature.desc).toBeTruthy();
    });
  });

});
