import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConversationsService, ReservationResponseDTO } from '../../services/conversation/conversations.service';
import { Message } from '../../models/Message';
import { Conversation } from '../../models/Conversation';

// Interface pour les données brutes de l'API
interface MessageDTO {
  id?: number;
  conversationId: number;
  senderId?: number;
  content: string;
  sentAt: Date;
}

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  conversationId?: number;
  messages: Message[] = [];
  loading = false;
  error: string | null = null;
  myName: string = "";
  otherUserName: string = "";
  showNoConversationsMessage = false;

  newMessageContent = '';
  sending = false;

  // Propriétés pour la modification des messages
  editingMessageId: number | null = null;
  editingContent = '';
  updating = false;

  // Propriétés pour le statut de la réservation
  reservationStatus: string | null = null;
  isReservationClosed = false;

  constructor(
    private conversationService: ConversationsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  /**
   * Initialise le composant en chargeant les messages et le statut de réservation
   */
  ngOnInit(): void {
    // Masquer le chatbot Botpress sur cette page
    this.hideBotpressWidget();

    this.route.params.subscribe(params => {
      const idParam = params['id'];

      if (idParam && !isNaN(+idParam) && +idParam > 0) {
        this.conversationId = +idParam;
        this.loadMessages(this.conversationId);
        this.loadReservationStatus(this.conversationId);
      } else {
        this.error = 'ID de conversation invalide';
        this.showNoConversationsMessage = true;
      }
    });
  }

  /**
   * Charge les messages d'une conversation
   * @param id - L'ID de la conversation
   */
  loadMessages(id: number): void {
    this.loading = true;
    this.error = null;
    this.showNoConversationsMessage = false;

    this.conversationService.getConversationWithMessages(id).subscribe({
      next: (data: Message[]) => {
        this.messages = data;

        if (data.length > 0) {
          this.myName = data[0].myName || '';
          // Déterminer le nom de l'autre utilisateur
          this.otherUserName = data.find(msg => msg.senderName !== this.myName)?.senderName || 'Utilisateur';
        }

        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement messages', err);

        // Si c'est une erreur 404 (conversation non trouvée), afficher le message "pas de conversation"
        if (err.status === 404) {
          this.showNoConversationsMessage = true;
          this.error = null;
        } else {
          this.error = 'Impossible de charger les messages';
        }

        this.loading = false;
      }
    });
  }

  /**
   * Charge le statut de la réservation associée à la conversation
   * @param conversationId - L'ID de la conversation
   */
  loadReservationStatus(conversationId: number): void {
    this.conversationService.getReservationByConversationId(conversationId).subscribe({
      next: (reservation: ReservationResponseDTO) => {
        this.reservationStatus = reservation.status;
        this.isReservationClosed = reservation.status === 'CLOSED';
      },
      error: (err) => {
        console.error('Erreur chargement statut réservation', err);
      }
    });
  }

  /**
   * Envoie un nouveau message dans la conversation
   */
  sendMessage(): void {

    if (!this.conversationId) {
      this.error = 'Erreur : ID de conversation manquant';
      return;
    }

    // Empêcher l'envoi si la réservation est fermée
    if (this.isReservationClosed) {
      this.error = 'Impossible d\'envoyer un message : la réservation est fermée';
      return;
    }

    this.sending = true;
    this.error = null;

    const messageToSend: MessageDTO = {
      conversationId: this.conversationId,
      content: this.newMessageContent.trim(),
      sentAt: new Date()
    };

    this.conversationService.sendMessage(messageToSend).subscribe({
      next: (savedMessage: Message) => {

        // Créer un nouveau message avec les données complètes
        const newMessage = new Message({
          ...savedMessage,
          senderName: this.myName,
          myName: this.myName,
          isRead: false
        });

        this.messages.push(newMessage);
        this.newMessageContent = '';
        this.sending = false;
        this.error = null;

        // Scroll vers le bas pour voir le nouveau message
        setTimeout(() => {
          this.scrollToBottom();
        }, 100);
      },
      error: (err) => {
        this.error = 'Impossible d\'envoyer le message';
        this.sending = false;
      }
    });
  }

  /**
   * Gère les événements clavier pour l'envoi de message
   * @param event - L'événement clavier
   */
  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  /**
   * Valide le contenu du message pour déterminer si le bouton d'envoi doit être désactivé
   * @param content - Le contenu à valider
   * @returns true si le contenu est valide
   */
  isMessageValid(content: string): boolean {
    if (!content || content.trim() === '') {
      return false;
    }

    // Vérifier qu'il n'y a pas de caractères dangereux (mais autoriser !, :, ;, ?, ')
    const dangerousPattern = /[<>{}*$#@%^&()_+\-=\[\]{}|\\"`~]/;
    if (dangerousPattern.test(content)) {
      return false;
    }

    // Supprimer les espaces et caractères de ponctuation pour la validation
    const cleanContent = content.replaceAll(/[\s.,"()\-_@#$%&*+=<>[\]{}|\\/`~€£¥§±°©®™✓✔✗✘•·–—…¿¡¡¿\n\r\t!?:;]/g, '');

    // Vérifier que le contenu n'est pas vide après nettoyage
    if (cleanContent.length === 0) {
      return false;
    }

    // Vérifier que le contenu n'est pas composé uniquement de chiffres
    if (/^[0-9]+$/.test(cleanContent)) {
      return false;
    }

    // Vérifier que le contenu a au moins 2 caractères
    if (cleanContent.length < 2) {
      return false;
    }

    return true;
  }

  /**
   * Retourne le message d'erreur de validation pour le contenu donné
   * @param content - Le contenu à valider
   * @returns Le message d'erreur ou null
   */
  getValidationErrorMessage(content: string): string | null {
    if (!content || content.trim() === '') {
      return null;
    }

    const dangerousPattern = /[<>{}*$#@%^&()_+\-=\[\]{}|\\"`~]/;
    if (dangerousPattern.test(content)) {
      return "Le message contient des caractères non autorisés. Veuillez utiliser uniquement des lettres, chiffres, ponctuation simple et espaces.";
    }

    const cleanContent = content.replaceAll(/[\s.,"()\-_@#$%&*+=<>[\]{}|\\/`~€£¥§±°©®™✓✔✗✘•·–—…¿¡¡¿\n\r\t!?:;]/g, '');

    if (cleanContent.length === 0) {
      return "Le message ne peut pas être composé uniquement de ponctuation et d'espaces.";
    }

    if (/^[0-9]+$/.test(cleanContent)) {
      return "Le message ne peut pas être composé uniquement de chiffres.";
    }

    if (cleanContent.length < 2) {
      return "Le message est trop court. Veuillez en saisir plus.";
    }

    return null;
  }

  /**
   * Fait défiler vers le bas de la liste des messages
   */
  scrollToBottom(): void {
    const messagesContainer = document.querySelector('.messages-container');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }

  /**
   * Navigue vers la page des conversations
   */
  goBack(): void {
    this.router.navigate(['/messaging']);
  }

  /**
   * Détermine si un en-tête de date doit être affiché
   * @param index - L'index du message
   * @returns true si l'en-tête doit être affiché
   */
  shouldShowDateHeader(index: number): boolean {
    if (index === 0) return true;

    const currentMessage = this.messages[index];
    const previousMessage = this.messages[index - 1];

    const currentDate = new Date(currentMessage.sentAt).toDateString();
    const previousDate = new Date(previousMessage.sentAt).toDateString();

    return currentDate !== previousDate;
  }

  /**
   * Ajuste automatiquement la hauteur du textarea
   * @param event - L'événement d'entrée
   */
  autoResize(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  // Méthodes pour la modification des messages
  /**
   * Commence l'édition d'un message
   * @param message - Le message à éditer
   */
  startEditing(message: Message): void {
    this.editingMessageId = message.id || null;
    this.editingContent = message.content;
  }

  /**
   * Annule l'édition en cours
   */
  cancelEditing(): void {
    this.editingMessageId = null;
    this.editingContent = '';
  }

  /**
   * Met à jour un message modifié
   */
  updateMessage(): void {
    if (!this.editingMessageId) {
      this.error = 'Erreur : ID de message manquant';
      return;
    }

    if (!this.editingContent.trim()) {
      this.error = 'Le message ne peut pas être vide';
      return;
    }

    this.updating = true;
    this.error = null;

    const messageToUpdate: MessageDTO = {
      conversationId: this.conversationId!,
      content: this.editingContent.trim(),
      sentAt: new Date()
    };

    this.conversationService.updateMessage(this.editingMessageId, messageToUpdate).subscribe({
      next: (updatedMessage: Message) => {
        const messageIndex = this.messages.findIndex(msg => msg.id === this.editingMessageId);
        if (messageIndex !== -1) {
          this.messages[messageIndex] = updatedMessage;
        }
        this.editingMessageId = null;
        this.editingContent = '';
        this.updating = false;
        this.error = null;
      },
      error: (err) => {
        console.error('Erreur modification message', err);
        this.error = 'Impossible de modifier le message';
        this.updating = false;
      }
    });
  }

  /**
   * Gère les événements clavier pour l'édition
   * @param event - L'événement clavier
   */
  onEditKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.updateMessage();
    } else if (event.key === 'Escape') {
      this.cancelEditing();
    }
  }

  /**
   * Fonction de tracking pour optimiser les performances de la liste des messages
   * @param index - Index du message
   * @param message - Le message
   * @returns L'ID du message pour le tracking
   */
  trackByMessageId(index: number, message: Message): number {
    return message.id || index;
  }

  /**
   * Masque le widget Botpress sur cette page
   */
  private hideBotpressWidget(): void {
    const hideBotpressElements = () => {
      const selectors = [
        '#bp-widget',
        '.bp-widget',
        '.bp-widget-web',
        '[class*="botpress"]',
        '[id*="botpress"]',
        '[class*="webchat"]',
        'iframe[src*="botpress"]'
      ];

      selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          (element as HTMLElement).style.display = 'none';
        });
      });
    };

    hideBotpressElements();
    setTimeout(hideBotpressElements, 100);
    setTimeout(hideBotpressElements, 500);
    setTimeout(hideBotpressElements, 1000);
  }
}
