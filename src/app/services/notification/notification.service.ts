import { Injectable } from '@angular/core';

export interface NotificationOptions {
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  showCloseButton?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() {}

  /**
   * Affiche une notification de succès
   */
  success(message: string, title?: string, duration: number = 3000): void {
    this.showNotification({
      type: 'success',
      title: title || 'Succès',
      message,
      duration
    });
  }

  /**
   * Affiche une notification d'erreur
   */
  error(message: string, title?: string, duration: number = 5000): void {
    this.showNotification({
      type: 'error',
      title: title || 'Erreur',
      message,
      duration
    });
  }

  /**
   * Affiche une notification d'avertissement
   */
  warning(message: string, title?: string, duration: number = 4000): void {
    this.showNotification({
      type: 'warning',
      title: title || 'Avertissement',
      message,
      duration
    });
  }

  /**
   * Affiche une notification d'information
   */
  info(message: string, title?: string, duration: number = 3000): void {
    this.showNotification({
      type: 'info',
      title: title || 'Information',
      message,
      duration
    });
  }

  /**
   * Affiche une notification de session expirée
   */
  sessionExpired(): void {
    this.showNotification({
      type: 'warning',
      title: 'Session expirée',
      message: 'Votre session a expiré. Vous allez être redirigé vers la page de connexion.',
      duration: 3000,
      showCloseButton: false
    });
  }

  /**
   * Méthode principale pour afficher une notification
   */
  private showNotification(options: NotificationOptions): void {
    // Pour l'instant, on utilise alert() comme fallback
    // Dans une vraie application, on utiliserait un système de notification plus sophistiqué
    // comme ngx-toastr, Angular Material Snackbar, ou un composant personnalisé
    
    const message = options.title ? `${options.title}: ${options.message}` : options.message;
    
    switch (options.type) {
      case 'success':
        console.log(`✅ ${message}`);
        break;
      case 'error':
        console.error(`❌ ${message}`);
        alert(message);
        break;
      case 'warning':
        console.warn(`⚠️ ${message}`);
        alert(message);
        break;
      case 'info':
        console.info(`ℹ️ ${message}`);
        break;
    }
  }
}
