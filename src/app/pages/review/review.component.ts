import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { FooterComponent } from '../../components/footer/footer.component';
import { ReviewService, ReviewCreateRequest } from '../../services/review/review.service';
import { ReservationService } from '../../services/reservation/reservation.service';

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
  stars = [1, 2, 3, 4, 5];
  rating = 0;
  feedback = '';
  feedbackError = '';

  // Informations du prestataire
  providerName = 'Prestataire';
  reservationId = 0;
  providerId = 0;
  clientId = 0;
  currentUserId = 0;

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

        // Afficher un message informatif
        console.log('Réservation chargée:', {
          id: reservation.id,
          status: reservation.status,
          providerName: reservation.providerName,
          clientName: reservation.clientName
        });
      },
      error: (err) => {
        console.error('Erreur lors du chargement de la réservation:', err);
        alert('Erreur lors du chargement de la réservation.');
        this.router.navigate(['/home']);
      }
    });
  }

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
        console.error('Erreur lors du chargement des réservations:', err);
        alert('Erreur lors du chargement des réservations.');
        this.router.navigate(['/home']);
      }
    });
  }

  setRating(value: number) {
    this.rating = value;
  }

  onStarKeydown(event: KeyboardEvent, value: number) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.setRating(value);
    }
  }

  onFeedbackInput(event: any) {
    const input = event.target.value;
    this.feedback = input;

    // Validation en temps réel
    this.validateFeedback();
  }

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
        console.error('Erreur lors de l\'envoi de l\'avis:', err);
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

  cancel() {
    this.rating = 0;
    this.feedback = '';
    this.feedbackError = '';
  }
}
