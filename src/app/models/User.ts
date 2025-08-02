/**
 * Enumération des rôles utilisateur, alignée avec les valeurs du backend.
 */
export enum UserRole {
  CLIENT = 'CLIENT',           // Particulier
  PROVIDER = 'PROVIDER',       // Prestataire
  ADMIN = 'ADMIN'              // Administrateurs
}

/**
 * Classe représentant un utilisateur de l'application.
 */
export class User {
  /** Identifiant unique de l'utilisateur */
  idUser!: number;


  /** Prénom de l'utilisateur */
  firstName!: string;

  /** Nom de l'utilisateur */
  lastName!: string;

  /** Adresse email de l'utilisateur */
  email!: string;

  /**
   * Mot de passe chiffré (ne jamais exposer côté front, réservé à la création/modification)
   * @security Ne jamais afficher ni manipuler côté client.
   */
  password?: string;

  /** Rôle de l'utilisateur (Particulier, Prestataire, Admin) */
  role!: UserRole;

  /** Numéro de téléphone */
  phoneNumber!: string;

  /** Adresse complète */
  address!: string;

  /** Ville */
  city!: string;

  /** Code postal */
  postalCode!: number;

  /** Numéro SIRET/SIREN (prestataires uniquement) */
  siretSiren?: string;

  /** Nom de l'entreprise (prestataires uniquement) */
  companyName?: string;

  /** Numéro de responsabilité civile (prestataires uniquement) */
  rcNumber?: string;

  /** URL vers l'extrait Kbis (prestataires uniquement) */
  kbisUrl?: string;

  /** URL vers l'attestation d'auto-entrepreneur (prestataires uniquement) */
  autoEntrepreneurAttestationUrl?: string;

  /** URL vers le certificat d'assurance (prestataires uniquement) */
  insuranceCertificateUrl?: string;

  /** Description de l'utilisateur */
  description?: string;

  /**
   * Constructeur permettant d'initialiser un objet utilisateur partiellement.
   * @param data Données initiales de l'utilisateur.
   */
  constructor(data: Partial<User> = {}) {
    Object.assign(this, data);
  }

  /**
   * Vérifie si l'utilisateur est un prestataire.
   * @returns true si le rôle est PROVIDER.
   */
  isProvider(): boolean {
    return this.role === UserRole.PROVIDER;
  }

  /**
   * Vérifie si l'utilisateur est un administrateur.
   * @returns true si le rôle est ADMIN.
   */
  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  /**
   * Vérifie si l'utilisateur est un particulier (client).
   * @returns true si le rôle est CLIENT.
   */
  isClient(): boolean {
    return this.role === UserRole.CLIENT;
  }
}
