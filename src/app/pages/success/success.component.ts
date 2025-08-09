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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private configService: ConfigService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const sessionId = params['session_id'];
      if (sessionId) {
        this.confirmReservation(sessionId);
      } else {
        this.message = '❌ Paramètre de session manquant.';
        this.isLoading = false;
      }
    });
  }

  private confirmReservation(sessionId: string): void {
    this.http.post(`${this.configService.apiUrl}/reservations/confirm`, { sessionId })
      .subscribe({
        next: () => {
          this.message = '✅ Réservation confirmée !';
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erreur lors de la confirmation:', error);
          this.message = '❌ Une erreur est survenue lors de la confirmation.';
          this.isLoading = false;
        }
      });
  }

  goToHome(): void {
    this.router.navigate(['/home']);
  }
} 