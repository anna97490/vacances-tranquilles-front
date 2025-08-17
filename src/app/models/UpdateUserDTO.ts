/**
 * DTO pour la mise à jour du profil utilisateur.
 * Correspond au UpdateUserDTO du backend.
 */
export interface UpdateUserDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  postalCode?: number;
  siretSiren?: string;
  companyName?: string;
  rcNumber?: string;
  kbisUrl?: string;
  autoEntrepreneurAttestationUrl?: string;
  insuranceCertificateUrl?: string;
  description?: string;
}
