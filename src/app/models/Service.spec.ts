import { Service, ServiceCategory } from '../models/Service';

describe('ServiceCategory Enum', () => {
  it('devrait contenir toutes les catégories attendues', () => {
    expect(ServiceCategory.HOME).toBe('Entretien de la maison');
    expect(ServiceCategory.OUTDOOR).toBe('Entretien extérieur');
    expect(ServiceCategory.REPAIRS).toBe('Petits travaux');
    expect(ServiceCategory.SHOPPING).toBe('Courses et logistique');
    expect(ServiceCategory.ANIMALS).toBe('Soins aux animaux');
  });
});

describe('Service Class', () => {
  it('devrait créer une instance de Service avec les propriétés obligatoires', () => {
    const service = new Service();
    service.id = 1;
    service.title = 'Nettoyage de printemps';
    service.category = ServiceCategory.HOME;
    service.price = 50;
    service.providerId = 123;

    expect(service.id).toBe(1);
    expect(service.title).toBe('Nettoyage de printemps');
    expect(service.category).toBe(ServiceCategory.HOME);
    expect(service.price).toBe(50);
    expect(service.providerId).toBe(123);
  });

  it('devrait permettre d’ajouter une description optionnelle', () => {
    const service = new Service();
    service.id = 2;
    service.title = 'Tonte de pelouse';
    service.category = ServiceCategory.OUTDOOR;
    service.price = 30;
    service.providerId = 456;
    service.description = 'Petit jardin de 100 m²';

    expect(service.description).toBe('Petit jardin de 100 m²');
  });
});
