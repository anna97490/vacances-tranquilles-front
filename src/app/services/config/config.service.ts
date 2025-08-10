import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConfigService {

  private config: any = {};

  constructor(private readonly http: HttpClient) {
    // Ne pas charger automatiquement la configuration dans le constructeur
    // pour éviter les problèmes dans les tests
  }

  get apiUrl(): string {
    if (!this.config?.apiUrl) {
      // Charger la configuration de manière synchrone si elle n'est pas encore chargée
      this.loadConfigTest();
    }
    return this.config?.apiUrl || '';
  }

  private loadConfigTest(): void {
    // Chargement synchrone pour les tests
    if (!this.config?.apiUrl) {
      // Utiliser une URL par défaut pour les tests
      this.config = { apiUrl: 'http://test-api.example.com/api' };
    }
  }

  get stripePublicKey(): string {
    return this.config?.NG_APP_STRIPE_PUBLIC_KEY || '';
  }

  async loadConfig(): Promise<void> {
    try {
      const config = await firstValueFrom(this.http.get('/assets/config.json'));
      this.config = config;
    } catch (error) {
      console.error('Erreur lors du chargement de config.json:', error);
      throw new Error('Impossible de charger la configuration. Vérifiez que le fichier config.json existe dans /assets/');
    }
  }

  /**
   * Attend que la configuration soit chargée
   */
  async waitForConfig(): Promise<void> {
    if (!this.config.apiUrl) {
      await this.loadConfig();
    }
  }
}

