import { Injectable } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { EnvService } from '../env/env.service';
import { NotificationService } from '../notification/notification.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(
    private readonly envService: EnvService,
    private readonly notificationService: NotificationService
  ) { }

  async redirectToStripe(sessionId: string): Promise<boolean> {
    try {
      const stripePublicKey = this.envService.stripePublicKey;
      if (!stripePublicKey || stripePublicKey.trim() === '') {
        console.warn('Stripe public key not configured. Payment functionality will be disabled.');
        this.notificationService.warning('Le système de paiement n\'est pas configuré. Veuillez contacter le support.');
        return false;
      }
      
      const stripe = await loadStripe(stripePublicKey);
      if (stripe) {
        const result = await stripe.redirectToCheckout({ sessionId });
        if (result.error) {
          console.error('Erreur Stripe:', result.error);
          this.notificationService.error(`Erreur de paiement: ${result.error.message}`);
          return false;
        }
        return true;
      } else {
        console.error('Stripe could not be loaded');
        this.notificationService.error('Impossible de charger le système de paiement. Veuillez réessayer.');
        return false;
      }
    } catch (error) {
      console.error('Erreur lors du chargement de Stripe:', error);
      this.notificationService.error('Erreur lors du chargement du système de paiement. Veuillez réessayer.');
      return false;
    }
  }

  /**
   * Vérifie si Stripe est configuré et disponible
   */
  isStripeConfigured(): boolean {
    const stripePublicKey = this.envService.stripePublicKey;
    return !!(stripePublicKey && stripePublicKey.trim() !== '');
  }
}
