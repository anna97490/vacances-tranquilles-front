import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { EnvService } from '../env/env.service';
import { Message } from '../../models/Message';
import { Conversation } from '../../models/Conversation';

// Interfaces pour les données brutes de l'API
interface MessageResponseDTO {
  id: number;
  senderName: string;
  myName: string;
  content: string;
  sentAt: Date;
  isRead: boolean;
}

interface MessageDTO {
  id?: number;
  conversationId: number;
  senderId?: number;
  content: string;
  sentAt: Date;
}

interface ConversationCreateRequest {
  reservationId: number;
}

interface ConversationDTO {
  id: number;
  user1Id: number;
  user2Id: number;
  createdAt: string;
}

export interface ConversationSummaryDTO {
  conversationId: number;
  otherUserName: string;
  serviceTitle: string;
}

export interface ReservationResponseDTO {
  id: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'CLOSED' | 'CANCELLED';
  // autres propriétés de la réservation...
}

@Injectable({
  providedIn: 'root'
})
export class ConversationsService {

  constructor(
    private http: HttpClient,
    private envService: EnvService
  ) { }

  /**
   * Récupère les messages d'une conversation et les convertit en modèles Message
   */
  getConversationWithMessages(id: number): Observable<Message[]> {
    const apiUrl = this.envService.apiUrl;
    return this.http.get<MessageResponseDTO[]>(`${apiUrl}/messages/conversation/${id}`)
      .pipe(
        map(messages => messages.map(msg => new Message({
          id: msg.id,
          conversationId: id,
          content: msg.content,
          sentAt: msg.sentAt,
          isRead: msg.isRead,
          senderName: msg.senderName,
          myName: msg.myName
        })))
      );
  }

  /**
   * Envoie un message et retourne le modèle Message créé
   */
  sendMessage(message: MessageDTO): Observable<Message> {
    const apiUrl = this.envService.apiUrl;
    return this.http.post<MessageDTO>(`${apiUrl}/messages`, message)
      .pipe(
        map(savedMessage => new Message({
          id: savedMessage.id,
          conversationId: savedMessage.conversationId,
          senderId: savedMessage.senderId,
          content: savedMessage.content,
          sentAt: savedMessage.sentAt
        }))
      );
  }

  /**
   * Met à jour un message et retourne le modèle Message mis à jour
   */
  updateMessage(id: number, message: MessageDTO): Observable<Message> {
    const apiUrl = this.envService.apiUrl;
    return this.http.put<MessageDTO>(`${apiUrl}/messages/${id}`, message)
      .pipe(
        map(updatedMessage => new Message({
          id: updatedMessage.id,
          conversationId: updatedMessage.conversationId,
          senderId: updatedMessage.senderId,
          content: updatedMessage.content,
          sentAt: updatedMessage.sentAt
        }))
      );
  }

  /**
   * Crée une nouvelle conversation
   */
  createConversation(reservationId: number): Observable<ConversationDTO> {
    const apiUrl = this.envService.apiUrl;
    const request: ConversationCreateRequest = {
      reservationId
    };

    return this.http.post<ConversationDTO>(`${apiUrl}/conversations`, request);
  }

  /**
   * Récupère la liste des conversations
   */
  getConversations(): Observable<ConversationSummaryDTO[]> {
    const apiUrl = this.envService.apiUrl;
    return this.http.get<ConversationSummaryDTO[]>(`${apiUrl}/conversations`);
  }

  /**
   * Récupère les informations de la réservation associée à une conversation
   */
  getReservationByConversationId(conversationId: number): Observable<ReservationResponseDTO> {
    const apiUrl = this.envService.apiUrl;
    return this.http.get<ReservationResponseDTO>(`${apiUrl}/conversations/${conversationId}/reservation`);
  }
}
