/**
 * Interface représentant un service proposé ou demandé par un utilisateur.
 */
export interface Service {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  imageUrl: string;
} 