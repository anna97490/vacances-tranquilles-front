import { User } from './User';
import { Message } from './Message';

/**
 * Classe représentant une conversation entre deux utilisateurs.
 */
export class Conversation {
  /** Identifiant unique de la conversation */
  id!: number;

  /** Premier utilisateur participant à la conversation */
  user1!: User;

  /** Deuxième utilisateur participant à la conversation */
  user2!: User;

  /** Date de création de la conversation */
  createdAt!: Date;

  /** Date de dernière modification de la conversation */
  updatedAt?: Date;

  /** Liste des messages de la conversation */
  messages?: Message[];

  /** Identifiant de la réservation associée à cette conversation */
  reservationId?: number;

  /**
   * Constructeur permettant d'initialiser un objet conversation partiellement.
   * @param data Données initiales de la conversation.
   */
  constructor(data: Partial<Conversation> = {}) {
    Object.assign(this, data);

    // Convertir les dates si elles sont fournies sous forme de string
    if (typeof this.createdAt === 'string') {
      this.createdAt = new Date(this.createdAt);
    }
    if (typeof this.updatedAt === 'string') {
      this.updatedAt = new Date(this.updatedAt);
    }
  }

  /**
   * Récupère l'autre participant de la conversation.
   * @param currentUserId Identifiant de l'utilisateur connecté
   * @returns L'autre utilisateur participant à la conversation
   */
  getOtherParticipant(currentUserId: number): User {
    return this.user1.idUser === currentUserId ? this.user2 : this.user1;
  }

  /**
   * Vérifie si l'utilisateur est participant de cette conversation.
   * @param userId Identifiant de l'utilisateur à vérifier
   * @returns true si l'utilisateur participe à la conversation
   */
  isParticipant(userId: number): boolean {
    return this.user1.idUser === userId || this.user2.idUser === userId;
  }

  /**
   * Récupère le dernier message de la conversation.
   * @returns Le dernier message ou undefined si aucun message
   */
  getLastMessage(): Message | undefined {
    if (!this.messages || this.messages.length === 0) {
      return undefined;
    }
    return this.messages[this.messages.length - 1];
  }

  /**
   * Récupère le nombre de messages non lus pour l'utilisateur connecté.
   * @param currentUserId Identifiant de l'utilisateur connecté
   * @returns Nombre de messages non lus
   */
  getUnreadMessageCount(currentUserId: number): number {
    if (!this.messages) return 0;

    return this.messages.filter(message =>
      !message.isRead && message.senderId !== currentUserId
    ).length;
  }

  /**
   * Formate la date de dernière activité pour l'affichage.
   * @returns Date formatée en string
   */
  getLastActivityFormatted(): string {
    const lastMessage = this.getLastMessage();
    if (lastMessage) {
      return lastMessage.getFormattedDate();
    }

    if (this.updatedAt) {
      const now = new Date(Date.now());
      const updatedDate = new Date(this.updatedAt);
      const diffInHours = (now.getTime() - updatedDate.getTime()) / (1000 * 60 * 60);

      if (diffInHours < 24) {
        return updatedDate.toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit'
        });
      } else if (diffInHours < 48) {
        return 'Hier';
      } else {
        return updatedDate.toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      }
    }

    return '';
  }

  /**
   * Récupère un aperçu du dernier message pour l'affichage dans la liste.
   * @returns Aperçu du dernier message (tronqué si nécessaire)
   */
  getLastMessagePreview(): string {
    const lastMessage = this.getLastMessage();
    if (!lastMessage) return 'Aucun message';

    const preview = lastMessage.content.trim();
    if (!preview) return 'Aucun message';

    return preview.length > 50 ? preview.substring(0, 50) + '...' : preview;
  }
}
