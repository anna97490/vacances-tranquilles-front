import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { FooterComponent } from '../../components/footer/footer.component';
import { ReviewService, ReviewCreateRequest } from '../../services/review/review.service';
import { ReservationService } from '../../services/reservation/reservation.service';

/**
 * Composant pour la création et l'envoi d'avis sur les prestataires.
 * Ce composant permet aux utilisateurs de noter et commenter les services
 * après une réservation terminée (statut CLOSED).
 */
@Component({
  selector: 'app-review',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    FooterComponent
  ],
  providers: [],
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {
  /** Tableau des étoiles disponibles pour la notation (1 à 5) */
  stars = [1, 2, 3, 4, 5];
  /** Note sélectionnée par l'utilisateur (0 à 5) */
  rating = 0;
  /** Commentaire saisi par l'utilisateur */
  feedback = '';
  /** Message d'erreur de validation du commentaire */
  feedbackError = '';

  /** Nom du prestataire à évaluer */
  providerName = 'Prestataire';
  /** Identifiant de la réservation associée à l'avis */
  reservationId = 0;
  /** Identifiant du prestataire à évaluer */
  providerId = 0;
  /** Identifiant du client qui évalue */
  clientId = 0;
  /** Identifiant de l'utilisateur actuel */
  currentUserId = 0;

  /**
   * Constructeur du composant ReviewComponent.
   * @param reviewService - Service pour la gestion des avis
   * @param reservationService - Service pour la gestion des réservations
   * @param route - Service pour accéder aux paramètres de route
   * @param router - Service pour la navigation
   */
  constructor(
    private reviewService: ReviewService,
    private reservationService: ReservationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadReservationData();
  }

  private loadReservationData(): void {
    // Vérifier d'abord si les informations sont dans le localStorage (venant de la page réservations)
    const reviewReservationId = localStorage.getItem('reviewReservationId');
    const reviewProviderId = localStorage.getItem('reviewProviderId');
    const reviewServiceName = localStorage.getItem('reviewServiceName');

    if (reviewReservationId && reviewProviderId) {
      this.reservationId = +reviewReservationId;
      this.providerId = +reviewProviderId;
      this.providerName = reviewServiceName || 'Prestataire';

      // Nettoyer le localStorage
      localStorage.removeItem('reviewReservationId');
      localStorage.removeItem('reviewProviderId');
      localStorage.removeItem('reviewServiceName');

      // Charger les détails de la réservation
      this.loadReservationDetails();
      return;
    }

    // Récupérer les paramètres de route ou query parameters
    this.route.params.subscribe(params => {
      const reservationId = params['reservationId'];
      if (reservationId) {
        this.reservationId = +reservationId;
        this.loadReservationDetails();
      }
    });

    // Si pas de paramètre dans l'URL, essayer les query parameters
    this.route.queryParams.subscribe(queryParams => {
      const reservationId = queryParams['reservationId'];
      if (reservationId && !this.reservationId) {
        this.reservationId = +reservationId;
        this.loadReservationDetails();
      }
    });

    // Si toujours pas d'ID, charger la première réservation fermée
    if (!this.reservationId) {
      this.loadFirstClosedReservation();
    }
  }

  /**
   * Charge les détails d'une réservation spécifique et vérifie son statut.
   * Redirige vers la page d'accueil si la réservation n'est pas fermée.
   * @private
   */
  private loadReservationDetails(): void {
    this.reservationService.getReservationById(this.reservationId).subscribe({
      next: (reservation) => {
        // Vérifier que la réservation est fermée
        if (reservation.status !== 'CLOSED') {
          alert('Vous ne pouvez noter que pour une réservation terminée (statut CLOSED).');
          this.router.navigate(['/home']);
          return;
        }

        // Le backend déterminera automatiquement qui noter
        // On affiche simplement les informations de la réservation
        this.providerName = reservation.providerName || 'Prestataire';
        this.providerId = reservation.providerId;
        this.clientId = reservation.clientId;
      },
      error: (err) => {
        alert('Erreur lors du chargement de la réservation.');
        this.router.navigate(['/home']);
      }
    });
  }

  /**
   * Charge la première réservation fermée disponible pour l'utilisateur.
   * Redirige vers la page d'accueil si aucune réservation fermée n'est trouvée.
   * @private
   */
  private loadFirstClosedReservation(): void {
    this.reservationService.getAllReservations().subscribe({
      next: (reservations) => {
        // Filtrer les réservations fermées
        const closedReservations = reservations.filter(r => r.status === 'CLOSED');

        if (closedReservations.length > 0) {
          const firstReservation = closedReservations[0];
          this.reservationId = firstReservation.id;
          this.providerName = firstReservation.providerName || 'Prestataire';
          this.providerId = firstReservation.providerId;
          this.clientId = firstReservation.clientId;
        } else {
          alert('Aucune réservation terminée trouvée.');
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        alert('Erreur lors du chargement des réservations.');
        this.router.navigate(['/home']);
      }
    });
  }

  /**
   * Définit la note sélectionnée par l'utilisateur.
   * @param value - La note à définir (1 à 5)
   */
  setRating(value: number) {
    this.rating = value;
  }

  /**
   * Gère la saisie de commentaire et valide le contenu en temps réel.
   * @param event - Événement de saisie contenant la valeur du champ
   */
  onFeedbackInput(event: any) {
    const input = event.target.value;
    this.feedback = input;

    // Validation en temps réel
    this.validateFeedback();
  }

  /**
   * Valide le contenu du commentaire selon les règles définies.
   * Vérifie les caractères interdits, les commentaires uniquement numériques,
   * et les commentaires uniquement de ponctuation.
   * @private
   */
  private validateFeedback() {
    // Effacer l'erreur précédente
    this.feedbackError = '';

    // Validation pour empêcher un commentaire constitué uniquement de chiffres
    if (this.feedback.trim().length > 0) {
      const onlyNumbers = /^[0-9\s]+$/;
      if (onlyNumbers.test(this.feedback.trim())) {
        this.feedbackError = 'Le commentaire ne peut pas être constitué uniquement de chiffres.';
        return;
      }

      // Validation pour empêcher un commentaire constitué uniquement de caractères de ponctuation
      const onlyPunctuation = /^[!.,;:?()\s]+$/;
      if (onlyPunctuation.test(this.feedback.trim())) {
        this.feedbackError = 'Le commentaire doit contenir du texte et ne peut pas être constitué uniquement de caractères de ponctuation.';
        return;
      }

      // Validation pour empêcher les caractères spéciaux (sauf apostrophe, deux-points et point-virgule)
      const specialChars = /[@#$%^&*()_+\-=\[\]{}"\\|<>\/~]/;
      if (specialChars.test(this.feedback)) {
        this.feedbackError = 'Le commentaire ne peut pas contenir de caractères spéciaux (apostrophe, deux-points et point-virgule autorisés).';
        return;
      }

      // Validation pour empêcher les caractères dangereux
      const dangerousChars = /[<>]/;
      if (dangerousChars.test(this.feedback)) {
        this.feedbackError = 'Le commentaire ne peut pas contenir les caractères < et >.';
        return;
      }
    }
  }

  /**
   * Envoie l'avis au serveur après validation complète des données.
   * Vérifie la note, le commentaire et les identifiants nécessaires.
   * Affiche des messages d'erreur appropriés en cas de problème.
   */
  sendFeedback() {
    if (this.rating === 0) {
      alert('Veuillez sélectionner une note avant d\'envoyer votre avis.');
      return;
    }

    if (this.feedback.trim().length === 0) {
      this.feedbackError = 'Veuillez saisir un commentaire avant d\'envoyer votre avis.';
      return;
    }

    // Validation du contenu du feedback - seulement les caractères dangereux
    const invalidChars = /[<>]/;
    if (invalidChars.test(this.feedback)) {
      this.feedbackError = 'Le commentaire ne peut pas contenir les caractères < et >.';
      return;
    }

    // Validation pour empêcher un commentaire constitué uniquement de chiffres
    const onlyNumbers = /^[0-9\s]+$/;
    if (onlyNumbers.test(this.feedback.trim())) {
      this.feedbackError = 'Le commentaire ne peut pas être constitué uniquement de chiffres.';
      return;
    }

    // Validation pour empêcher un commentaire constitué uniquement de caractères de ponctuation
    const onlyPunctuation = /^[!.,;:?()\s]+$/;
    if (onlyPunctuation.test(this.feedback.trim())) {
      this.feedbackError = 'Le commentaire doit contenir du texte et ne peut pas être constitué uniquement de caractères de ponctuation.';
      return;
    }

    // Validation pour empêcher les caractères spéciaux (sauf apostrophe, deux-points et point-virgule)
    const specialChars = /[@#$%^&*()_+\-=\[\]{}"\\|<>\/~]/;
    if (specialChars.test(this.feedback)) {
      this.feedbackError = 'Le commentaire ne peut pas contenir de caractères spéciaux (apostrophe, deux-points et point-virgule autorisés).';
      return;
    }

    // Vérifier que les IDs sont disponibles
    if (!this.reservationId || !this.providerId) {
      alert('Erreur : Impossible de récupérer les informations nécessaires. Veuillez réessayer.');
      return;
    }

    const reviewRequest: ReviewCreateRequest = {
      note: this.rating,
      commentaire: this.feedback,
      reservationId: this.reservationId,
      reviewerId: 0, // Le backend utilisera l'ID de l'utilisateur connecté
      reviewedId: 0  // Le backend déterminera automatiquement qui est évalué
    };

    this.reviewService.createReview(reviewRequest).subscribe({
      next: (response: any) => {
        alert('Merci pour votre avis !');
        this.router.navigate(['/home']);
      },
      error: (err: any) => {
        let errorMessage = 'Erreur lors de l\'envoi de l\'avis';

        if (err.error && err.error.message) {
          errorMessage += ': ' + err.error.message;
        } else if (err.message) {
          errorMessage += ': ' + err.message;
        }

        alert(errorMessage);
      }
    });
  }

  /**
   * Annule la création d'avis et réinitialise le formulaire.
   * Remet à zéro la note, le commentaire et les messages d'erreur.
   */
  cancel() {
    this.rating = 0;
    this.feedback = '';
    this.feedbackError = '';
  }

  /**
   * Gère la navigation au clavier pour les étoiles.
   * Permet d'utiliser les flèches gauche/droite pour naviguer entre les étoiles.
   * @param event - L'événement clavier
   * @param starValue - La valeur de l'étoile actuelle
   */
  onStarKeydown(event: KeyboardEvent, starValue: number): void {
    const currentIndex = starValue - 1;
    let newIndex = currentIndex;

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        newIndex = Math.max(0, currentIndex - 1);
        break;
      case 'ArrowRight':
        event.preventDefault();
        newIndex = Math.min(4, currentIndex + 1);
        break;
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        newIndex = 4;
        break;
      default:
        return;
    }

    if (newIndex !== currentIndex) {
      this.setRating(newIndex + 1);
      // Focus sur la nouvelle étoile
      const newStarElement = document.getElementById(`star-${newIndex + 1}`);
      if (newStarElement) {
        newStarElement.focus();
      }
    }
  }

  /**
   * Retourne l'ID des éléments ARIA pour décrire le champ feedback.
   * Utilisé pour lier les messages d'aide et d'erreur au champ textarea.
   * @returns Une chaîne contenant les IDs des éléments descriptifs
   */
  getFeedbackAriaDescribedBy(): string {
    const descriptions = ['feedback-help'];

    if (this.feedbackError) {
      descriptions.push('feedback-error');
    }

    return descriptions.join(' ');
  }

  /**
   * Retourne l'ID des éléments ARIA pour décrire le bouton d'envoi.
   * Utilisé pour expliquer pourquoi le bouton est désactivé.
   * @returns Une chaîne contenant les IDs des éléments descriptifs
   */
  getSendButtonAriaDescribedBy(): string {
    const descriptions = [];

    if (this.rating === 0) {
      descriptions.push('rating-error');
    }

    if (this.feedback.trim().length === 0) {
      descriptions.push('feedback-error');
    }

    return descriptions.join(' ');
  }
}
