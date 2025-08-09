import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ConfigService {

  private config: any = {};

  constructor(private readonly http: HttpClient) {
    this.loadConfig();
  }

  get apiUrl(): string {
    return this.config?.apiUrl || '';
  }

  get stripePublicKey(): string {
    return this.config?.NG_APP_STRIPE_PUBLIC_KEY || '';
  }

  async loadConfig(): Promise<void> {
    try {
      const config = await firstValueFrom(this.http.get('/assets/config.json'));
      this.config = config;
      console.log('Configuration chargée:', this.config);
    } catch (error) {
      console.warn('Impossible de charger config.json, utilisation des variables d\'environnement');
      // Utiliser les variables d'environnement si le fichier config.json n'existe pas
      this.config = {
        apiUrl: environment.apiUrl
      };
      console.log('Configuration d\'environnement utilisée:', this.config);
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

