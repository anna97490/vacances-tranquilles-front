import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ConfigService } from '../../services/config/config.service';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './success.component.html',
  styleUrl: './success.component.scss'
})
export class SuccessComponent implements OnInit {
  message: string = '';
  isLoading: boolean = true;
  sessionId: string = '';
  hasError: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private configService: ConfigService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.sessionId = params['session_id'];
      if (this.sessionId) {
        this.confirmReservation(this.sessionId);
      } else {
        this.message = '❌ Paramètre de session manquant.';
        this.isLoading = false;
        this.hasError = true;
      }
    });
  }

  retryConfirmation(): void {
    if (this.sessionId) {
      this.isLoading = true;
      this.hasError = false;
      this.confirmReservation(this.sessionId);
    }
  }

  private async confirmReservation(sessionId: string): Promise<void> {
    try {
      // S'assurer que la configuration est chargée
      await this.configService.waitForConfig();
      
      const apiUrl = `${this.configService.apiUrl}/reservations/confirm`;
      console.log('URL de confirmation:', apiUrl);
      console.log('Session ID:', sessionId);
      
      // Essayer d'abord avec POST
      this.http.post(apiUrl, { sessionId })
        .subscribe({
          next: (response) => {
            console.log('Réponse de confirmation:', response);
            this.message = '✅ Réservation confirmée !';
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Erreur lors de la confirmation:', error);
            console.error('Status:', error.status);
            console.error('Status Text:', error.statusText);
            console.error('Error Message:', error.message);
            console.error('Error Body:', error.error);
            
            // Si POST n'est pas supporté, essayer avec GET
            if (error.status === 500 && error.error?.message?.includes('POST')) {
              console.log('POST non supporté, essai avec GET...');
              this.tryGetConfirmation(apiUrl, sessionId);
            } else {
              this.handleConfirmationError(error);
            }
          }
        });
    } catch (error) {
      console.error('Erreur lors du chargement de la configuration:', error);
      this.message = '❌ Erreur de configuration.';
      this.isLoading = false;
    }
  }

  private tryGetConfirmation(apiUrl: string, sessionId: string): void {
    // Essayer avec GET et sessionId en paramètre
    const urlWithParams = `${apiUrl}?sessionId=${encodeURIComponent(sessionId)}`;
    console.log('Essai avec GET:', urlWithParams);
    
    this.http.get(urlWithParams)
      .subscribe({
        next: (response) => {
          console.log('Réponse de confirmation (GET):', response);
          this.message = '✅ Réservation confirmée !';
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erreur avec GET aussi:', error);
          // Si GET ne fonctionne pas non plus, traiter comme une erreur normale
          this.handleConfirmationError(error);
        }
      });
  }

  private handleConfirmationError(error: any): void {
    let errorMessage = '❌ Une erreur est survenue lors de la confirmation.';
    
    if (error.status === 500) {
      if (error.error?.message?.includes('POST')) {
        errorMessage = '❌ L\'endpoint de confirmation n\'est pas configuré pour accepter les requêtes POST.';
      } else {
        errorMessage = '❌ Erreur serveur (500). Veuillez contacter le support.';
      }
    } else if (error.status === 404) {
      errorMessage = '❌ Endpoint de confirmation non trouvé. Vérifiez la configuration de l\'API.';
    } else if (error.status === 405) {
      errorMessage = '❌ Méthode HTTP non autorisée pour cet endpoint.';
    } else if (error.status === 401) {
      errorMessage = '❌ Non autorisé. Veuillez vous reconnecter.';
    } else if (error.status === 0) {
      errorMessage = '❌ Impossible de se connecter au serveur. Vérifiez que le serveur est démarré.';
    }
    
    this.message = errorMessage;
    this.isLoading = false;
    this.hasError = true;
  }

  goToHome(): void {
    this.router.navigate(['/home']);
  }
} 