import { Injectable } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { ConfigService } from '../config/config.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private readonly configService: ConfigService) { }

  async redirectToStripe(sessionId: string) {
    const stripePublicKey = this.configService.stripePublicKey;
    if (!stripePublicKey) {
      console.error('Stripe public key not found in configuration');
      return;
    }
    
    const stripe = await loadStripe(stripePublicKey);
    if (stripe) {
      await stripe.redirectToCheckout({ sessionId });
    } else {
      console.error('Stripe could not be loaded');
    }
  }
}
