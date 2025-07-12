/**
 * Interface représentant un service proposé ou demandé par un utilisateur.
 */
export interface Service {
  /** Identifiant unique du service (clé primaire, auto-incrémentée) */
  idService: number;

  /** Référence à l’utilisateur ayant créé le service (clé étrangère vers User) */
  idUser: number;

  /** Catégorie du service (ex : Ménage, Jardinage, etc.) */
  category: ServiceCategory;

  /** Titre du service (obligatoire) */
  title: string;

  /** Description détaillée du service (optionnel) */
  description?: string;

  /** Tarif horaire ou budget proposé (obligatoire pour les propositions) */
  hourlyRate?: number;

  /** Zone géographique d’intervention (ville, région, obligatoire) */
  interventionArea: string;

  /** Statut du service (ex : Ouvert, Attribué, Terminé) */
  status: ServiceStatus;
}

/**
 * Enumération des catégories de service.
 */
export enum ServiceCategory {
  Menage = 'Ménage',
  Jardinage = 'Jardinage',
  // Ajoute d'autres catégories selon tes besoins
}

/**
 * Enumération des statuts de service.
 */
export enum ServiceStatus {
  Ouvert = 'Ouvert',
  Attribue = 'Attribué',
  Termine = 'Terminé'
} 