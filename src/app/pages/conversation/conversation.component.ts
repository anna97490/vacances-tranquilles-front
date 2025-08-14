import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { ConversationsService, ConversationSummaryDTO } from '../../services/conversation/conversations.service';

@Component({
  selector: 'app-conversation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './conversation.component.html',
  styleUrl: './conversation.component.scss'
})
export class ConversationComponent implements OnInit {
  conversations: ConversationSummaryDTO[] = [];
  isLoading = false;
  error = '';
  liveMessage = '';

  constructor(
    private conversationsService: ConversationsService,
    private router: Router
  ) {}

  /**
   * Initialise le composant en chargeant les conversations
   */
  ngOnInit(): void {
    this.loadConversations();
  }

  /**
   * Charge la liste des conversations depuis le service
   */
  loadConversations(): void {
    this.isLoading = true;
    this.error = '';

    this.conversationsService.getConversations()
      .pipe(take(1))
      .subscribe({
        next: (data: ConversationSummaryDTO[]) => {
          console.log('📋 Conversations reçues:', data);
          this.conversations = data;
          this.isLoading = false;
        },
        error: (err: any) => {
          this.isLoading = false;
        }
      });
  }

  /**
   * Ouvre une conversation en naviguant vers la page des messages
   * @param conversationId - L'ID de la conversation à ouvrir
   */
  openConversation(conversationId: number): void {
    if (conversationId && conversationId > 0) {
      this.router.navigate(['/messages', conversationId]);
    } else {
      console.error('ID de conversation invalide pour navigation:');
    }
  }

  /**
   * Gère les événements clavier sur les cartes de conversation
   * @param event - L'événement clavier
   * @param conversationId - L'ID de la conversation
   */
  onCardKeydown(event: KeyboardEvent, conversationId: number): void {
    const key = event.key;
    if (key === 'Enter' || key === ' ') {
      event.preventDefault();
      this.openConversation(conversationId);
    }
  }



  /**
   * Fonction de tracking pour optimiser les performances de la liste des conversations
   * @param index - Index de la conversation
   * @param conversation - La conversation
   * @returns L'ID de la conversation pour le tracking
   */
  trackByConversationId(index: number, conversation: ConversationSummaryDTO): number {
    return conversation.conversationId;
  }
}
