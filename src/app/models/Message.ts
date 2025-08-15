/**
 * Classe représentant un message dans une conversation.
 */
export class Message {
  /** Identifiant unique du message */
  id?: number;

  /** Identifiant de la conversation à laquelle appartient le message */
  conversationId!: number;

  /** Identifiant de l'expéditeur du message */
  senderId?: number;

  /** Contenu textuel du message */
  content!: string;

  /** Date et heure d'envoi du message */
  sentAt!: Date;

  /** Indique si le message a été lu par le destinataire */
  isRead?: boolean;

  /** Nom de l'expéditeur (pour l'affichage) */
  senderName?: string;

  /** Nom de l'utilisateur connecté (pour l'affichage) */
  myName?: string;

  /**
   * Constructeur permettant d'initialiser un objet message partiellement.
   * @param data Données initiales du message.
   */
  constructor(data: Partial<Message> = {}) {
    Object.assign(this, data);

    // Convertir la date si elle est fournie sous forme de string
    if (typeof this.sentAt === 'string') {
      this.sentAt = new Date(this.sentAt);
    }
  }

  /**
   * Vérifie si le message a été envoyé par l'utilisateur connecté.
   * @param currentUserId Identifiant de l'utilisateur connecté
   * @returns true si le message a été envoyé par l'utilisateur connecté
   */
  isFromCurrentUser(currentUserId: number): boolean {
    return this.senderId === currentUserId;
  }

  /**
   * Formate la date d'envoi pour l'affichage.
   * @returns Date formatée en string
   */
  getFormattedDate(): string {
    if (!this.sentAt) return '';

    const now = new Date(Date.now());
    const messageDate = new Date(this.sentAt);
    const diffInHours = (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      // Aujourd'hui : afficher l'heure
      return messageDate.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else if (diffInHours < 48) {
      // Hier
      return 'Hier';
    } else {
      // Date complète
      return messageDate.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  }
}
