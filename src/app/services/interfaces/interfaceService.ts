/**
 * Enum représentant les catégories de services disponibles.
 * @export
 */
export enum ServiceCategory {
  HOME = 'Entretien de la maison',
  OUTDOOR = 'Entretien extérieur',
  REPAIRS = 'Petits travaux',
  SHOPPING = 'Courses et logistique',
  ANIMALS = 'Soins aux animaux'
} 

/**
 * Interface représentant un service proposé ou demandé par un utilisateur.
 */
export interface Service {
  id: number;
  title: string;
  description: string;
  category: ServiceCategory;
  price: number;
  userId: number;
} 