import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { ServiceCategory } from '../../services/interfaces/interfaceService'; // Titles are now in English

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
  get days() {
    const month = this.selectedMonth;
    const year = this.selectedYear || new Date().getFullYear();
    const monthIndex = this.months.indexOf(month ?? '');
    const daysInMonth = monthIndex >= 0 ? new Date(year, monthIndex + 1, 0).getDate() : 31;
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }
  /** Liste des mois */
  months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  /** Liste des années disponibles */
  years = [2025, 2026];
  /** Liste des horaires (heures pleines de 8h à 20h) */
  hours = Array.from({ length: 13 }, (_, i) => {
    const hour = 8 + i;
    return `${hour.toString().padStart(2, '0')}:00`;
  });
  /** Liste des services disponibles */
  services = Object.values(ServiceCategory);

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
  selectedService: string | undefined;
  /** Code postal saisi */
  postalCode: string = '';

  /**
   * Détermine si le code postal est valide (5 chiffres).
   */
  get isPostalCodeValid(): boolean {
    return /^[0-9]{5}$/.test(this.postalCode);
  }

  /**
   * Vérifie que l'heure de fin est après l'heure de début.
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
      this.isHourRangeValid
    );
  }

  /**
   * Action appelée lors du clic sur le bouton de recherche.
   * Affiche les valeurs sélectionnées dans la console (à remplacer par un appel API).
   */
  findProviders() {
    if (!this.isPostalCodeValid) {
      alert('Veuillez saisir un code postal valide.');
      return;
    }
    // TODO: Remplacer par l'appel API réel
    console.log('Recherche en cours...', {
      date: `${this.selectedDay}/${this.selectedMonth}/${this.selectedYear}`,
      startHour: this.selectedStartHour,
      endHour: this.selectedEndHour,
      postalCode: this.postalCode,
      service: this.selectedService
    });
  }
}