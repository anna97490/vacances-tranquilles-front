import { TestBed } from '@angular/core/testing';
import { HomeContentService } from './home-content.service';
import { HomeContent } from '../models/Home';

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
    // Act
    const content = service.getContent();

    // Assert
    expect(content).toBeDefined();
    expect(content.iconType).toBe('custom');
    expect(content.mainIcon).toBe('assets/icons/beach_access_FFA101.svg');
    expect(content.title).toBe('Vacances Tranquilles');
    expect(content.subtitle).toBe('Votre partenaire de confiance pour des vacances sereines');
    expect(content.introText).toContain('Simplifiez la gestion');
    expect(content.btnPrestataire).toBe('Inscription Prestataires');
    expect(content.btnParticulier).toBe('Inscription Particuliers');
    expect(content.btnConnexion).toBe('Connexion');
    expect(content.featuresTitle).toBe('Pourquoi Nous Choisir');
  });

  it('should return features array with correct length', () => {
    // Act
    const content = service.getContent();

    // Assert
    expect(content.features).toBeDefined();
    expect(Array.isArray(content.features)).toBe(true);
    expect(content.features.length).toBe(4);
  });

  it('should return features with correct structure', () => {
    // Act
    const content = service.getContent();

    // Assert
    content.features.forEach(feature => {
      expect(feature.iconType).toBe('custom');
      expect(feature.icon).toBeDefined();
      expect(feature.title).toBeDefined();
      expect(feature.desc).toBeDefined();
    });
  });

  it('should return specific features with correct content', () => {
    // Act
    const content = service.getContent();

    // Assert
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