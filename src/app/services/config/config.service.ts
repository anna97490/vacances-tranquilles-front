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
      this.loadConfigSync();
    }
    return this.config?.apiUrl || '';
  }

  private loadConfigSync(): void {
    // Chargement synchrone pour éviter les erreurs pendant l'initialisation
    if (!this.config?.apiUrl) {
      // Utiliser l'URL de développement par défaut
      this.config = { 
        apiUrl: 'http://localhost:8080/api',
        NG_APP_STRIPE_PUBLIC_KEY: 'pk_test_51ABC123DEF456GHI789JKL012MNO345PQR678STU901VWX234YZA567BCD890EFG'
      };
    }
  }

  get stripePublicKey(): string {
    if (!this.config?.NG_APP_STRIPE_PUBLIC_KEY) {
      // Charger la configuration de manière synchrone si elle n'est pas encore chargée
      this.loadConfigSync();
    }
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

