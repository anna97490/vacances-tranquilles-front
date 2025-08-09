import { Injectable } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { ConfigService } from '../config/config.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private readonly configService: ConfigService) { }

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
