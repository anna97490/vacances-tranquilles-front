import { TestBed } from '@angular/core/testing';
import { HomeContentService } from './home-content.service';
import { HomeContent } from '../../models/Home';

describe('HomeContentService', () => {
  let service: HomeContentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomeContentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return home content with correct structure', () => {
    const content = service.getContent();

    expect(content).toBeDefined();
    expect(content.iconType).toBe('custom');
    expect(content.mainIcon).toBe('assets/icons/beach_access_FFA101.svg');
    expect(content.title).toBe('Vacances Tranquilles');
    expect(content.subtitle).toContain('Confiez votre maison, partez l');
    expect(content.introText).toContain('Trouvez des professionnels de confiance');
    expect(content.btnPrestataire).toBe('Je suis prestataire');
    expect(content.btnParticulier).toBe('Je suis particulier');
    expect(content.btnConnexion).toBe('Connexion');
    expect(content.featuresTitle).toBe('Pourquoi nous choisir');
  });

  it('should return features array with correct length', () => {
    const content = service.getContent();

    expect(content.features).toBeDefined();
    expect(Array.isArray(content.features)).toBe(true);
    expect(content.features.length).toBe(4);
  });

  it('should return features with correct structure', () => {
    const content = service.getContent();

    content.features.forEach(feature => {
      expect(feature.iconType).toBe('custom');
      expect(feature.icon).toBeDefined();
      expect(feature.title).toBeDefined();
      expect(feature.desc).toBeDefined();
    });
  });

  it('should return specific features with correct content', () => {
    const content = service.getContent();

    const prestatairesFeature = content.features.find(f => f.title === 'Prestataires Vérifiés');
    expect(prestatairesFeature).toBeDefined();
    expect(prestatairesFeature?.icon).toBe('assets/icons/field_FFA101.svg');

    const disponibiliteFeature = content.features.find(f => f.title === 'Disponibilité 7j/7');
    expect(disponibiliteFeature).toBeDefined();
    expect(disponibiliteFeature?.icon).toBe('assets/icons/calendar_FFA101.svg');

    const satisfactionFeature = content.features.find(f => f.title === 'Satisfaction Garantie');
    expect(satisfactionFeature).toBeDefined();
    expect(satisfactionFeature?.icon).toBe('assets/icons/thumb_up_FFA101.svg');

    const serviceFeature = content.features.find(f => f.title === 'Service Personnalisé');
    expect(serviceFeature).toBeDefined();
    expect(serviceFeature?.icon).toBe('assets/icons/check_FFA101.svg');
  });
});
