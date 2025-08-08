import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// Modifiez ces imports pour importer des objets et non des types
import { CGU_DATA } from './../../services/terms-and-conditions/cgu';
import { CGV_DATA } from './../../services/terms-and-conditions/cgv';
import { LocationService } from './../../services/terms-and-conditions/location.service';
import { TermsContent } from './../../models/Terms';

@Component({
  selector: 'app-terms-and-conditions',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './terms-and-conditions.component.html',
  styleUrl: './terms-and-conditions.component.scss'
})
export class TermsAndConditionsComponent {
  // Si le chemin d'accès d'url est /cgu, on affiche les CGU
  isCGU: boolean = false;
  // Si le chemin d'accès d'url est /cgv, on affiche les CGV
  isCGV: boolean = false;

  constructor(private readonly locationService: LocationService) {
    const path = this.locationService.getPathname();
    if (path.includes('cgu')) {
      this.isCGU = true;
    } else if (path.includes('cgv')) {
      this.isCGV = true;
    }
  }
  get cguContent(): TermsContent {
    // Utiliser l'objet importé avec la structure TermsContent
    return CGU_DATA;
  }
  get cgvContent(): TermsContent {
    // Utiliser l'objet importé avec la structure TermsContent
    return CGV_DATA;
  }
  // Méthode pour afficher le contenu des CGU ou CGV
  getContent(): TermsContent {
    if (this.isCGU) {
      return this.cguContent;
    } else if (this.isCGV) {
      return this.cgvContent;
    }
    // Retourner un objet vide mais avec la structure attendue
    return { title: '', date: '', sections: [] };
  }
  // Ajouter cette méthode à votre classe TermsAndConditionsComponent
  isArray(content: string | string[]): boolean {
    return Array.isArray(content);
  }
  // Méthode pour vérifier si on affiche les CGU
  isShowingCGU(): boolean {
    return this.isCGU;
  }
  // Méthode pour vérifier si on affiche les CGV
  isShowingCGV(): boolean {
    return this.isCGV;
  }
}