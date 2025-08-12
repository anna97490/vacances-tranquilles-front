import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { EnvService } from '../../services/env/env.service';
import { finalize, take } from 'rxjs/operators';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);
  private envService = inject(EnvService);

  message = '';
  isLoading = true;

  async ngOnInit(): Promise<void> {
    const sessionId = this.route.snapshot.queryParamMap.get('session_id');
    if (!sessionId) {
      this.isLoading = false;
      this.message = '❌ Paramètre de session manquant.';
      return;
    }
    this.confirmReservation(sessionId);
  }

  private confirmReservation(sessionId: string): void {
    this.http.post(`${this.envService.apiUrl}/stripe/confirm-reservation`, { sessionId })
      .pipe(finalize(() => (this.isLoading = false)), take(1))
      .subscribe({
        next: () => {
          this.message = '✅ Réservation confirmée !';
        },
        error: (error) => {
          console.error('Erreur lors de la confirmation:', error);
          this.message = '❌ Une erreur est survenue lors de la confirmation.';
        }
      });
  }

  goToHome(): void {
    this.router.navigate(['/home']);
  }
}
