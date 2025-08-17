import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CGU_DATA } from './../../services/terms-and-conditions/cgu';
import { CGV_DATA } from './../../services/terms-and-conditions/cgv';
import { LocationService } from './../../services/terms-and-conditions/location.service';
import { TermsContent } from './../../models/Terms';

/**
 * Composant pour afficher les conditions générales d'utilisation (CGU) et de vente (CGV).
 * Ce composant détecte automatiquement le type de conditions à afficher
 * en fonction du chemin d'URL et affiche le contenu approprié.
 */
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
  /** Indicateur si le chemin d'URL contient 'cgu' pour afficher les CGU */
  isCGU: boolean = false;
  /** Indicateur si le chemin d'URL contient 'cgv' pour afficher les CGV */
  isCGV: boolean = false;

  /**
   * Constructeur du composant TermsAndConditionsComponent.
   * Analyse le chemin d'URL pour déterminer quel type de conditions afficher.
   * @param locationService - Service pour récupérer le chemin d'URL actuel
   */
  constructor(private readonly locationService: LocationService) {
    const path = this.locationService.getPathname();
    if (path.includes('cgu')) {
      this.isCGU = true;
    } else if (path.includes('cgv')) {
      this.isCGV = true;
    }
  }

  /**
   * Getter pour récupérer le contenu des Conditions Générales d'Utilisation.
   * @returns Le contenu des CGU avec la structure TermsContent
   */
  get cguContent(): TermsContent {
    // Utiliser l'objet importé avec la structure TermsContent
    return CGU_DATA;
  }

  /**
   * Getter pour récupérer le contenu des Conditions Générales de Vente.
   * @returns Le contenu des CGV avec la structure TermsContent
   */
  get cgvContent(): TermsContent {
    // Utiliser l'objet importé avec la structure TermsContent
    return CGV_DATA;
  }

  /**
   * Vérifie si le composant doit afficher les Conditions Générales d'Utilisation.
   * @returns true si les CGU doivent être affichées, false sinon
   */
  isShowingCGU(): boolean {
    return this.isCGU;
  }

  /**
   * Vérifie si le composant doit afficher les Conditions Générales de Vente.
   * @returns true si les CGV doivent être affichées, false sinon
   */
  isShowingCGV(): boolean {
    return this.isCGV;
  }
}
