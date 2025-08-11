import { User } from './User';
import { Service } from './Service';

/**
 * DTO pour la réponse du profil utilisateur.
 * Correspond au UserProfileDTO du backend.
 */
export interface UserProfileDTO {
  user: User;
  services: Service[];
}
