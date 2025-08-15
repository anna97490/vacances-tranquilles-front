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

export const MOCK_USER_ADMIN: User = {
  idUser: 2,
  firstName: 'Claire',
  lastName: 'Durand',
  email: 'claire.durand@email.com',
  password: '',
  role: UserRole.ADMIN,
  phoneNumber: '+33 6 12 34 56 78',
  address: '24 avenue de Lyon',
  city: 'Lyon, France',
  postalCode: 69000,
  siretSiren: '',
  companyName: '',
  rcNumber: '',
  kbisUrl: '',
  autoEntrepreneurAttestationUrl: '',
  insuranceCertificateUrl: '',
  description: 'Cliente fidèle, passionnée de déco et de rénovation.'
};

export const MOCK_USER_PROVIDER_2: User = {
  idUser: 3,
  firstName: 'Marie',
  lastName: 'Dubois',
  email: 'marie.dubois@email.com',
  password: '',
  role: UserRole.PROVIDER,
  phoneNumber: '+33 7 12 34 56 78',
  address: '8 rue des Lilas',
  city: 'Bordeaux, France',
  postalCode: 33000,
  siretSiren: '987 654 321 00021',
  companyName: 'JardiBricole',
  rcNumber: 'RC987654321',
  kbisUrl: 'https://example.com/kbis2.pdf',
  autoEntrepreneurAttestationUrl: 'https://example.com/attestation2.pdf',
  insuranceCertificateUrl: 'https://example.com/assurance2.pdf',
  description: 'Prestataire passionnée par le jardinage et le bricolage, toujours souriante.'
};

export const MOCK_USERS: User[] = [MOCK_USER_PROVIDER, MOCK_USER_ADMIN, MOCK_USER_PROVIDER_2];
export const MOCK_PROVIDERS: User[] = [MOCK_USER_PROVIDER, MOCK_USER_PROVIDER_2];

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
