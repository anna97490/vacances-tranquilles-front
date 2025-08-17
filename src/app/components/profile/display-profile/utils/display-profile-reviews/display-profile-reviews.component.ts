import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Review, ReviewWithReviewer, ReviewService } from '../../../../../services/review/review.service';

@Component({
  selector: 'app-display-profile-reviews',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './display-profile-reviews.component.html',
  styleUrls: ['./display-profile-reviews.component.scss']
})
export class DisplayProfileReviewsComponent implements OnInit, OnChanges {
  /** Identifiant du prestataire pour lequel afficher les avis */
  @Input() providerId: number = 0;

  /** Liste des avis avec les informations des évaluateurs */
  reviews: ReviewWithReviewer[] = [];

  /** Indique si les avis sont en cours de chargement */
  isLoading = false;

  /** Indique s'il y a eu une erreur lors du chargement des avis */
  hasError = false;

  constructor(private reviewService: ReviewService) {}

  /**
   * Initialise le composant et charge les avis si un providerId est fourni
   */
  ngOnInit(): void {
    if (this.providerId > 0) {
      this.loadReviews();
    }
  }

  /**
   * Réagit aux changements des propriétés d'entrée et recharge les avis si nécessaire
   * @param changes Les changements détectés sur les propriétés d'entrée
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['providerId'] && changes['providerId'].currentValue > 0) {
      this.loadReviews();
    }
  }

  /**
   * Charge les avis du prestataire depuis le service
   */
  loadReviews(): void {
    this.isLoading = true;
    this.hasError = false;

    this.reviewService.getReviewsWithReviewerByProviderId(this.providerId).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        this.isLoading = false;
      },
      error: (error) => {
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }

  /**
   * Génère un tableau d'icônes d'étoiles basé sur la note fournie
   * @param rating La note sur 5 à convertir en étoiles
   * @returns Un tableau de chaînes représentant les icônes d'étoiles
   */
  getStars(rating: number): string[] {
    const stars = [];

    for (let i = 0; i < 5; i++) {
      if (i < Math.floor(rating)) {
        stars.push('star');
      } else if (i === Math.floor(rating) && rating % 1 !== 0) {
        stars.push('star_half');
      } else {
        stars.push('star_border');
      }
    }

    return stars;
  }

  /**
   * Formate une date en format français lisible
   * @param dateString La date à formater (chaîne ISO)
   * @returns La date formatée en français (ex: "15 janvier 2024")
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);

    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
}

