import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { ServiceCategory } from '../../models/Service';
import { ServicesService } from '../../services/services/services.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-service-search',
  templateUrl: './service-search.component.html',
    styleUrls: ['./service-search.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatInputModule
  ]
})

/**
 * Composant de recherche de service.
 * Permet à l'utilisateur de sélectionner une date, un horaire, un code postal et un service.
 * Utilise Angular Material pour l'UI et applique des validations de base.
 */
export class ServiceSearchComponent {
  /** Liste des jours du mois sélectionné */
get days(): number[] {
  if (!this.selectedMonth || !this.selectedYear) {
    return [];
  }

  const monthIndex = this.months.indexOf(this.selectedMonth);
  if (monthIndex === -1) {
    return [];
  }

  const daysInMonth = new Date(this.selectedYear, monthIndex + 1, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => i + 1);
}

  /**
   * Vérifie si un jour donné est dans le passé
   */
  isDayInPast(day: number): boolean {
    if (!this.selectedMonth || !this.selectedYear) return false;
    
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();
    
    const monthIndex = this.months.indexOf(this.selectedMonth);
    
    // Si l'année est dans le passé
    if (this.selectedYear < currentYear) return true;
    
    // Si c'est l'année actuelle mais le mois est dans le passé
    if (this.selectedYear === currentYear && monthIndex < currentMonth) return true;
    
    // Si c'est le mois/année actuel, vérifier le jour
    if (this.selectedYear === currentYear && monthIndex === currentMonth) {
      return day < currentDay;
    }
    
    return false;
  }
  /** Liste des mois */
  months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  /** Liste des années disponibles */
  get years() {
    const currentYear = new Date().getFullYear();
    return [currentYear, currentYear + 1];
  }

  /** Liste des horaires (heures pleines de 8h à 20h) */
  hours = Array.from({ length: 13 }, (_, i) => {
    const hour = 8 + i;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  /** Liste des heures de fin disponibles (filtrées selon l'heure de début) */
  get availableEndHours() {
    if (!this.selectedStartHour) {
      return this.hours;
    }
    
    // Convertit les heures "HH:mm" en minutes pour comparaison
    const toMinutes = (h: string) => {
      const [hour, min] = h.split(":").map(Number);
      return hour * 60 + min;
    };
    
    const startMinutes = toMinutes(this.selectedStartHour);
    
    // Retourne seulement les heures qui sont strictement supérieures à l'heure de début
    return this.hours.filter(hour => toMinutes(hour) > startMinutes);
  }
  
  /** Liste des services disponibles */
  services = Object.entries(ServiceCategory).map(([key, value]) => ({ key, value }));

  /** Jour sélectionné */
  selectedDay: number | undefined;
  /** Mois sélectionné */
  selectedMonth: string | undefined;
  /** Année sélectionnée */
  selectedYear: number | undefined;
  /** Heure de début sélectionnée */
  selectedStartHour: string | undefined;
  /** Heure de fin sélectionnée */
  selectedEndHour: string | undefined;
  /** Service sélectionné */
  selectedService: keyof typeof ServiceCategory | undefined;
  /** Code postal saisi */
  postalCode: string = '';

  /** Indicateur de chargement */
  isLoading = false;

  constructor(
    private servicesService: ServicesService,
    private router: Router
  ) {}

  /**
   * Détermine si le code postal est valide (5 chiffres).
   */
  get isPostalCodeValid(): boolean {
    return /^[0-9]{5}$/.test(this.postalCode);
  }

  /**
   * Vérifie que l'heure de fin est après l'heure de début.
   * Cette validation est maintenant redondante car nous filtrons les heures de fin,
   * mais elle reste pour la sécurité.
   */
  get isHourRangeValid(): boolean {
    if (!this.selectedStartHour || !this.selectedEndHour) return true;
    // Convertit les heures "HH:mm" en minutes pour comparaison
    const toMinutes = (h: string) => {
      const [hour, min] = h.split(":").map(Number);
      return hour * 60 + min;
    };
    return toMinutes(this.selectedEndHour) > toMinutes(this.selectedStartHour);
  }

  /**
   * Vérifie que la date sélectionnée n'est pas dans le passé.
   */
  get isDateValid(): boolean {
    if (!this.selectedDay || !this.selectedMonth || !this.selectedYear) return true;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Remet à minuit pour comparer seulement la date
    
    const selectedDate = new Date(this.selectedYear, this.months.indexOf(this.selectedMonth), this.selectedDay);
    
    return selectedDate >= today;
  }

  /**
   * Retourne true si tous les champs obligatoires sont remplis et valides.
   */
  isFormValid(): boolean {
    return !!(
      this.selectedDay &&
      this.selectedMonth &&
      this.selectedYear &&
      this.selectedStartHour &&
      this.selectedEndHour &&
      this.selectedService &&
      this.isPostalCodeValid &&
      this.isHourRangeValid &&
      this.isDateValid
    );
  }

  /**
   * Gère le changement d'heure de début et réinitialise l'heure de fin si nécessaire
   */
  onStartHourChange() {
    // Si l'heure de fin sélectionnée n'est plus disponible, la réinitialiser
    if (this.selectedEndHour && this.selectedStartHour) {
      const availableEndHours = this.availableEndHours;
      if (!availableEndHours.includes(this.selectedEndHour)) {
        this.selectedEndHour = undefined;
      }
    }
  }

  /**
   * Gère le changement de mois et réinitialise le jour si nécessaire
   */
  onMonthChange() {
    // Si le jour sélectionné n'est plus disponible, le réinitialiser
    if (this.selectedDay && this.selectedMonth && this.selectedYear) {
      const availableDays = this.days;
      if (!availableDays.includes(this.selectedDay)) {
        this.selectedDay = undefined;
      }
    }
  }

  /**
   * Gère le changement d'année et réinitialise le jour si nécessaire
   */
  onYearChange() {
    // Si le jour sélectionné n'est plus disponible, le réinitialiser
    if (this.selectedDay && this.selectedMonth && this.selectedYear) {
      const availableDays = this.days;
      if (!availableDays.includes(this.selectedDay)) {
        this.selectedDay = undefined;
      }
    }
  }

  /**
   * Convertit la date sélectionnée au format YYYY-MM-DD
   */
  private formatDate(): string {
    if (!this.selectedDay || !this.selectedMonth || !this.selectedYear) {
      throw new Error('Date incomplète');
    }
    
    const monthIndex = this.months.indexOf(this.selectedMonth);
    const month = (monthIndex + 1).toString().padStart(2, '0');
    const day = this.selectedDay.toString().padStart(2, '0');
    const year = this.selectedYear.toString();
    
    return `${year}-${month}-${day}`;
  }

  /**
   * Action appelée lors du clic sur le bouton de recherche.
   * Fait un appel API pour récupérer les services disponibles.
   */
  findProviders() {
    if (!this.isPostalCodeValid) {
      alert('Veuillez saisir un code postal valide.');
      return;
    }

    if (!this.isDateValid) {
      alert('La date sélectionnée ne peut pas être dans le passé.');
      return;
    }

    if (!this.isFormValid()) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    this.isLoading = true;

    try {
      const date = this.formatDate();
      const category = this.selectedService!;
      const postalCode = this.postalCode;
      const startTime = this.selectedStartHour!;
      const endTime = this.selectedEndHour!;

      this.servicesService.searchServices(category, postalCode, date, startTime, endTime)
        .subscribe({
          next: (services) => {

            // Stockage des résultats dans le localStorage pour les passer à la page suivante
            localStorage.setItem('searchResults', JSON.stringify(services));
            localStorage.setItem('searchCriteria', JSON.stringify({
              category,
              postalCode,
              date,
              startTime,
              endTime
            }));
            
            // Redirection vers la page des prestataires disponibles
            this.router.navigate(['/avalaible-providers']);
          },
          error: (error) => {
            console.error('Erreur lors de la recherche:', error);
            alert('Erreur lors de la recherche. Veuillez réessayer.');
          },
          complete: () => {
            this.isLoading = false;
          }
        });
        
    } catch (error) {
      console.error('Erreur lors du formatage de la date:', error);
      alert('Erreur lors du formatage de la date.');
      this.isLoading = false;
    }
  }
}