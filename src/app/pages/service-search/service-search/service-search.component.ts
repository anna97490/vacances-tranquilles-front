import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-service-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  templateUrl: './service-search.component.html',
  styleUrl: './service-search.component.scss'
})
export class ServiceSearchComponent {

  get days() {
    const month = this.selectedMonth;
    const year = this.selectedYear || new Date().getFullYear();
    const monthIndex = this.months.indexOf(month ?? '');
    const daysInMonth = monthIndex >= 0 ? new Date(year, monthIndex + 1, 0).getDate() : 31;
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }
  months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  years = [2025, 2026];
  hours = Array.from({ length: 25 }, (_, i) => {
  const hour = 8 + Math.floor(i / 2);
  const minutes = i % 2 === 0 ? '00' : '30';
  return `${hour.toString().padStart(2, '0')}:${minutes}`;
});
  services = ['Service 1', 'Service 2', 'Service 3'];

  selectedDay: number | undefined;
  selectedMonth: string | undefined;
  selectedYear: number | undefined;
  selectedHour: string | undefined;
  selectedService: string | undefined;

  findProviders() {
    console.log('Recherche en cours...');
  }
}