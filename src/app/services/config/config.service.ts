import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConfigService {

  private config: any = {};

  constructor(private readonly http: HttpClient) {}

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
    } catch (error) {
      console.warn('Impossible de charger config.json, utilisation des valeurs par défaut');
      // Utiliser les valeurs par défaut si le fichier config.json n'existe pas
      this.config = {
        apiUrl: 'http://localhost:8080/api'
      };
    }
  }
}

