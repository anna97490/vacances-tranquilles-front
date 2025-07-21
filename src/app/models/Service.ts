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
 * Classe représentant un service proposé ou demandé par un utilisateur.
 */
export class Service {
  /** Identifiant unique du service */
  id!: number;

  /** Titre du service */
  title!: string;

  /** Description détaillée du service */
  description!: string;

  /** Catégorie du service (ex: entretien, travaux, etc.) */
  category!: ServiceCategory;

  /** Prix du service en euros */
  price!: number;

  /** Identifiant de l'utilisateur associé à ce service */
  userId!: number;
}
