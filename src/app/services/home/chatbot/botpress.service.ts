// Service pour l'intégration Botpress
import { Injectable } from '@angular/core';
import { SecureIdGeneratorService } from './../crypto/secure-id-generator.service';

@Injectable({
  providedIn: 'root'
})
export class BotpressService {
  private readonly botpressApiUrl = 'https://webchat.botpress.cloud/30677914-9ece-488e-b7ad-f2415dad46c3/messages';
  private readonly maxRetries = 10;
  private readonly retryInterval = 500;

  constructor(private readonly secureIdGenerator: SecureIdGeneratorService) {}

  /**
   * Envoie un message d'accueil au chatbot Botpress
   * @param message Message à envoyer (par défaut "Bonjour")
   */
  async sendWelcomeMessage(message: string = 'Bonjour'): Promise<void> {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      
      const interval = setInterval(async () => {
        attempts++;
        
        try {
          const bpWebChat = (window as any).botpressWebChat;
          
          if (bpWebChat?.conversationId) {
            const success = await this.sendMessage(bpWebChat.conversationId, message);
            if (success) {
              clearInterval(interval);
              resolve();
            }
          }
          
          if (attempts >= this.maxRetries) {
            clearInterval(interval);
            reject(new Error('Timeout: Unable to initialize Botpress conversation'));
          }
        } catch (error) {
          if (attempts >= this.maxRetries) {
            clearInterval(interval);
            reject(new Error(error instanceof Error ? error.message : String(error)));
          }
        }
      }, this.retryInterval);
    });
  }

  /**
   * Envoie un message au chatbot
   * @param conversationId ID de la conversation
   * @param text Texte du message
   */
  private async sendMessage(conversationId: string, text: string): Promise<boolean> {
    try {
      const clientMessageId = await this.secureIdGenerator.generateSecureRandomId('msg');
      
      const response = await fetch(this.botpressApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          conversationId,
          payload: { type: 'text', text },
          metadata: { clientMessageId }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Message envoyé avec succès', data);
      return true;
      
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      return false;
    }
  }

  /**
   * Vérifie si Botpress est disponible
   */
  isBotpressAvailable(): boolean {
    const bpWebChat = (window as any).botpressWebChat;
    return !!bpWebChat?.conversationId;
  }

  /**
   * Attend que Botpress soit disponible
   * @param timeout Timeout en millisecondes
   */
  async waitForBotpress(timeout: number = 5000): Promise<boolean> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      if (this.isBotpressAvailable()) {
        return true;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return false;
  }
}