import { User, UserRole } from '../models/User';
import { Service, ServiceCategory } from '../models/Service';

/**
 * Fichier centralisé des mocks pour les tests
 * Contient les objets mockés utilisés dans les tests unitaires
 */

// ============================================================================
// MOCKS UTILISATEURS
// ============================================================================

export const MOCK_USER_PROVIDER: User = {
  idUser: 1,
  firstName: 'Ashfak',
  lastName: 'Sayem',
  email: 'contact@servicepro.fr',
  password: '',
  role: UserRole.PROVIDER,
  phoneNumber: '+1 234 567 890',
  address: '12 rue de Paris',
  city: 'Paris, France',
  postalCode: 75001,
  siretSiren: '123 456 789 00012',
  companyName: 'ServicePro',
  rcNumber: 'RC123456789',
  kbisUrl: 'https://example.com/kbis.pdf',
  autoEntrepreneurAttestationUrl: 'https://example.com/attestation.pdf',
  insuranceCertificateUrl: 'https://example.com/assurance.pdf',
  description: 'description succinte du prestataire vraiment très très très enrichissante. Il adore sa vie et les gens autour de lui'
};



// ============================================================================
// MOCKS SERVICES
// ============================================================================

export const MOCK_SERVICES: Service[] = [
  {
    id: 1,
    title: 'Entretien de la maison',
    description: 'Nettoyage et entretien des espaces intérieurs de la maison.',
    category: ServiceCategory.HOME,
    price: 45,
    providerId: 1,
  },
  {
    id: 2,
    title: 'Jardinage et aménagement extérieur',
    description: "Tonte de pelouse, taille de haies et entretien général des jardins.",
    category: ServiceCategory.OUTDOOR,
    price: 60,
    providerId: 1,
  },
  {
    id: 3,
    title: 'Réparation d\'électroménager',
    description: 'Réparation de vos appareils électroménagers défectueux (réfrigérateur, lave-vaisselle, etc.).',
    category: ServiceCategory.REPAIRS,
    price: 50,
    providerId: 1,
  },
  {
    id: 4,
    title: 'Courses alimentaires',
    description: 'Livraison à domicile de vos courses alimentaires hebdomadaires.',
    category: ServiceCategory.SHOPPING,
    price: 25,
    providerId: 1,
  },
  {
    id: 5,
    title: 'Promenade de chien',
    description: 'Promenade et soins pour vos animaux de compagnie.',
    category: ServiceCategory.ANIMALS,
    price: 15,
    providerId: 1,
  },
  {
    id: 6,
    title: 'Peinture intérieure',
    description: 'Application de peinture dans les pièces de votre maison.',
    category: ServiceCategory.HOME,
    price: 100,
    providerId: 1,
  },
  {
    id: 7,
    title: 'Installation de système de sécurité',
    description: 'Installation et configuration de systèmes de sécurité à domicile (caméras, alarmes).',
    category: ServiceCategory.REPAIRS,
    price: 120,
    providerId: 1,
  },
  {
    id: 8,
    title: 'Réparation de toiture',
    description: 'Réparation des fuites et autres dommages au toit de votre maison.',
    category: ServiceCategory.REPAIRS,
    price: 200,
    providerId: 1,
  },
  {
    id: 9,
    title: 'Nettoyage de piscine',
    description: 'Services de nettoyage et entretien des piscines (filtration, nettoyage du bassin).',
    category: ServiceCategory.OUTDOOR,
    price: 70,
    providerId: 1,
  },
  {
    id: 10,
    title: 'Soins vétérinaires',
    description: 'Consultations et soins de santé pour vos animaux de compagnie.',
    category: ServiceCategory.ANIMALS,
    price: 50,
    providerId: 1,
  }
];
