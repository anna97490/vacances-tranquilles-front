export class RegisterPayload {
  /** Prénom de l'utilisateur */
  firstName!: string;
  
  /** Nom de famille de l'utilisateur */
  lastName!: string;
  
  /** Adresse email de l'utilisateur */
  email!: string;
  
  /** Mot de passe de l'utilisateur */
  password!: string;
  
  /** Numéro de téléphone de l'utilisateur */
  phoneNumber!: string;
  
  /** Adresse postale de l'utilisateur */
  address!: string;
  
  /** Ville de résidence de l'utilisateur */
  city!: string;
  
  /** Code postal de l'utilisateur */
  postalCode!: string;
  
  /** Nom de l'entreprise (uniquement pour les prestataires) */
  companyName?: string;
  
  /** Numéro SIRET/SIREN (uniquement pour les prestataires) */
  siretSiren?: string;
}

export class ApiConfig {
  /** URL de l'endpoint API */
  url!: string;
  
  /** Données à envoyer dans la requête */
  payload!: RegisterPayload;
}