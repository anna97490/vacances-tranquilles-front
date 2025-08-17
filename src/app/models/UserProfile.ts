import { User } from './User';
import { Service } from './Service';

/**
 * DTO pour la réponse du profil utilisateur.
 * Correspond au UserProfile du backend.
 */
export interface UserProfile {
  user: User;
  services: Service[];
}
