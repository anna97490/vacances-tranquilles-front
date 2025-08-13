export class LoginResponse {
  /** Token d'authentification JWT */
  token!: string;
  
  /** Rôle de l'utilisateur (CLIENT, PRESTATAIRE, ADMIN) */
  userRole!: string;
  
  /** ID de l'utilisateur */
  userId?: number;
  
  /** Propriétés additionnelles dynamiques */
  [key: string]: any;
}

export class LoginPayload {
  /** Adresse email de l'utilisateur */
  email!: string;
  
  /** Mot de passe de l'utilisateur */
  password!: string;
}