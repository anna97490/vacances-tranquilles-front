// Service d'initialisation pour le composant Home
import { Injectable } from '@angular/core';
import { ScriptLoaderService } from './script-loader.service';
import { BotpressService } from './chatbot/botpress.service';

@Injectable({
  providedIn: 'root'
})
export class HomeInitializationService {
  private readonly botpressScripts = [
    'https://cdn.botpress.cloud/webchat/v3.0/inject.js',
    'https://files.bpcontent.cloud/2025/06/23/13/20250623131622-WAJI2P5Q.js'
  ];

  constructor(
    private readonly scriptLoader: ScriptLoaderService,
    private readonly botpressService: BotpressService
  ) {}

  /**
   * Initialise tous les services nécessaires pour la page d'accueil
   */
  async initializeHomeServices(): Promise<void> {
    try {
      // Charger les scripts Botpress
      await this.loadBotpressScripts();

      // Envoyer le message d'accueil
      await this.initializeBotpress();

    } catch (error) {
      console.error('Erreur lors de l\'initialisation des services:', error);
    }
  }

  /**
   * Charge les scripts Botpress
   */
  private async loadBotpressScripts(): Promise<void> {
    try {
      await this.scriptLoader.loadScripts(this.botpressScripts);
      console.log('Scripts Botpress chargés avec succès');
    } catch (error) {
      console.error('Erreur lors du chargement des scripts Botpress:', error);
      throw error;
    }
  }

  /**
   * Initialise Botpress et envoie le message d'accueil
   */
  private async initializeBotpress(): Promise<void> {
    try {
      // Attendre que Botpress soit disponible
      const isAvailable = await this.botpressService.waitForBotpress();

      if (isAvailable) {
        await this.botpressService.sendWelcomeMessage();
        console.log('Botpress initialisé avec succès');
      } else {
        console.warn('Timeout: Botpress non disponible');
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de Botpress:', error);
    }
  }

  /**
   * Nettoie les ressources utilisées
   */
  cleanup(): void {
    this.scriptLoader.cleanupScripts();
  }
}
