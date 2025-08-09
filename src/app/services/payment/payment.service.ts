import { Injectable } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { ConfigService } from '../config/config.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(
    private readonly configService: ConfigService,
    private readonly http: HttpClient
  ) { }

  /**
   * Crée une session de paiement Stripe
   * @param payload Les données de la session de paiement
   * @param token Le token d'authentification
   * @returns Promise<string> L'ID de la session Stripe
   */
  async createCheckoutSession(payload: any, token: string): Promise<string> {
    // S'assurer que la configuration est chargée
    await this.configService.waitForConfig();
    
    const headers = { 'Authorization': `Bearer ${token}` };
    const apiUrl = `${this.configService.apiUrl}/stripe/create-checkout-session`;

    const response = await firstValueFrom(
      this.http.post<{ [key: string]: string }>(
        apiUrl,
        payload,
        { headers }
      )
    );

    const sessionId = response['sessionId'];
    if (!sessionId) {
      throw new Error('Session ID non reçu');
    }

    return sessionId;
  }

  async redirectToStripe(sessionId: string) {
    try {
      const stripePublicKey = this.configService.stripePublicKey;
      if (!stripePublicKey || stripePublicKey.trim() === '') {
        console.warn('Stripe public key not configured. Payment functionality will be disabled.');
        return;
      }
      
      const stripe = await loadStripe(stripePublicKey);
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId });
      } else {
        console.error('Stripe could not be loaded');
      }
    } catch (error) {
      console.error('Erreur lors du chargement de Stripe:', error);
    }
  }
}
