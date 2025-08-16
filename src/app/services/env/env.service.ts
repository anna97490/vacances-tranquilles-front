import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EnvService {
  readonly apiUrl: string;
  readonly isProduction: boolean;
  readonly stripePublicKey: string;

  constructor() {
    this.apiUrl = environment.apiUrl;
    this.isProduction = environment.production;
    this.stripePublicKey = environment.stripePublicKey;
  }
}
