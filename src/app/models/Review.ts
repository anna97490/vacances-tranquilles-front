/**
 * Classe représentant un avis/évaluation entre utilisateurs.
 */
export class Review {
  /** Identifiant unique de l'avis */
  id!: number;

  /** Note attribuée (1 à 5) */
  note!: number;

  /** Commentaire associé à l'avis */
  commentaire?: string;

  /** Identifiant de la réservation associée */
  reservationId!: number;

  /** Identifiant de l'utilisateur qui a écrit l'avis */
  reviewerId!: number;

  /** Identifiant de l'utilisateur évalué */
  reviewedId!: number;

  /** Date de création de l'avis */
  createdAt!: Date;

  /**
   * Constructeur permettant d'initialiser un objet avis partiellement.
   * @param data Données initiales de l'avis.
   */
  constructor(data: Partial<Review> = {}) {
    Object.assign(this, data);
  }

  /**
   * Vérifie si la note est valide (entre 1 et 5).
   * @returns true si la note est valide, false sinon.
   */
  isValidNote(): boolean {
    return this.note >= 1 && this.note <= 5;
  }

  /**
   * Retourne la note sous forme d'étoiles pour l'affichage.
   * @returns Un tableau de 5 éléments représentant les étoiles (true = étoile pleine, false = étoile vide).
   */
  getStars(): boolean[] {
    const stars = new Array(5).fill(false);
    const validNote = Math.min(Math.max(this.note, 0), 5); // Limite entre 0 et 5
    for (let i = 0; i < validNote; i++) {
      stars[i] = true;
    }
    return stars;
  }

  /**
   * Retourne la note sous forme de texte.
   * @returns Une description textuelle de la note.
   */
  getNoteText(): string {
    switch (this.note) {
      case 1: return 'Très mauvais';
      case 2: return 'Mauvais';
      case 3: return 'Moyen';
      case 4: return 'Bon';
      case 5: return 'Excellent';
      default: return 'Non évalué';
    }
  }
}
