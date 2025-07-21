import { Service, ServiceCategory } from '../../models/Service';

/**
 * Mock de services pour l'application.
 * Utilisé pour simuler des données de service dans l'application.
 */
export const MOCK_SERVICES: Service[] = [
  {
    id: 1,
    title: 'Entretien de la maison',
    description: 'Nettoyage et entretien des espaces intérieurs de la maison.',
    category: ServiceCategory.HOME,
    price: 45,
    userId: 1,
  },
  {
    id: 2,
    title: 'Jardinage et aménagement extérieur',
    description: "Tonte de pelouse, taille de haies et entretien général des jardins.",
    category: ServiceCategory.OUTDOOR,
    price: 60,
    userId: 1,
  },
  {
    id: 3,
    title: 'Réparation d\'électroménager',
    description: 'Réparation de vos appareils électroménagers défectueux (réfrigérateur, lave-vaisselle, etc.).',
    category: ServiceCategory.REPAIRS,
    price: 50,
    userId: 1,
  },
  {
    id: 4,
    title: 'Courses alimentaires',
    description: 'Livraison à domicile de vos courses alimentaires hebdomadaires.',
    category: ServiceCategory.SHOPPING,
    price: 25,
    userId: 1,
  },
  {
    id: 5,
    title: 'Promenade de chien',
    description: 'Promenade et soins pour vos animaux de compagnie.',
    category: ServiceCategory.ANIMALS,
    price: 15,
    userId: 1,
  },
  {
    id: 6,
    title: 'Peinture intérieure',
    description: 'Application de peinture dans les pièces de votre maison.',
    category: ServiceCategory.HOME,
    price: 100,
    userId: 1,
  },
  {
    id: 7,
    title: 'Installation de système de sécurité',
    description: 'Installation et configuration de systèmes de sécurité à domicile (caméras, alarmes).',
    category: ServiceCategory.REPAIRS,
    price: 120,
    userId: 1,
  },
  {
    id: 8,
    title: 'Réparation de toiture',
    description: 'Réparation des fuites et autres dommages au toit de votre maison.',
    category: ServiceCategory.REPAIRS,
    price: 200,
    userId: 1,
  },
  {
    id: 9,
    title: 'Nettoyage de piscine',
    description: 'Services de nettoyage et entretien des piscines (filtration, nettoyage du bassin).',
    category: ServiceCategory.OUTDOOR,
    price: 70,
    userId: 1,
  },
  {
    id: 10,
    title: 'Soins vétérinaires',
    description: 'Consultations et soins de santé pour vos animaux de compagnie.',
    category: ServiceCategory.ANIMALS,
    price: 50,
    userId: 1,
  }
];