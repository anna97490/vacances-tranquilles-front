import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NgForOf } from '@angular/common';
import { ReviewService, Review } from '../../../services/review/review.service';

/**
 * Composant pour afficher les étoiles de notation basées sur les avis des prestataires.
 * Ce composant calcule et affiche la note moyenne en utilisant des icônes d'étoiles.
 */
@Component({
  selector: 'app-rating-stars',
  templateUrl: './rating-stars.component.html',
  styleUrls: ['./rating-stars.component.scss'],
  standalone: true,
  imports: [MatIconModule, NgForOf],
})
export class RatingStarsComponent implements OnInit, OnChanges {
  /** L'identifiant du prestataire pour lequel afficher les notes */
  @Input() providerId: number = 0;

  /** Tableau des avis pour le prestataire */
  @Input() reviews: Review[] = [];

  /** La note moyenne calculée */
  public rating: number = 0;

  /** Le nombre total d'avis */
  public reviewsCount: number = 0;

  /** Tableau représentant les 5 positions d'étoiles (0-4) */
  stars = [0, 1, 2, 3, 4];

  /**
   * Crée une instance de RatingStarsComponent.
   * @param reviewService - Service pour gérer les opérations d'avis
   */
  constructor(private readonly reviewService: ReviewService) {}

  ngOnInit(): void {
    this.calculateRating();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['reviews'] || changes['providerId']) {
      this.calculateRating();
    }
  }

  /**
   * Calcule la note moyenne à partir du tableau d'avis.
   * Met la note à 0 si aucun avis n'est disponible.
   * La note est arrondie à 1 décimale.
   */
  private calculateRating(): void {
    this.reviewsCount = this.reviews.length;

    if (this.reviews.length > 0) {
      const totalRating = this.reviews.reduce((sum, review) => sum + review.note, 0);
      this.rating = Math.round((totalRating / this.reviews.length) * 10) / 10; // Arrondi à 1 décimale
      
    } else {
      this.rating = 0;
    }
  }

  /**
   * Détermine l'icône d'étoile appropriée à afficher pour une position donnée.
   * @param index - La position de l'étoile (0-4)
   * @returns Le nom de l'icône Material à afficher :
   *          - 'star' pour les étoiles pleines
   *          - 'star_half' pour les demi-étoiles
   *          - 'star_border' pour les étoiles vides
   */
  getStarIcon(index: number): string {
    if (index < Math.floor(this.rating)) {
      return 'star'; // Étoiles pleines
    } else if (index === Math.floor(this.rating) && this.rating % 1 !== 0) {
      return 'star_half'; // Demi-étoile
    } else {
      return 'star_border'; // Étoiles vides
    }
  }
}
