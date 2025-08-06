// Service pour la détection du type d'utilisateur
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserTypeDetectorService {

  /**
   * Détermine le type d'utilisateur à partir de l'URL
   */
  detectUserTypeFromUrl(): boolean {
    const path = window.location.pathname;
    return path.includes('prestataire');
  }

  /**
   * Détermine le type d'utilisateur à partir d'une chaîne
   * @param userTypeString La chaîne à analyser
   */
  detectUserTypeFromString(userTypeString: string | null | undefined): boolean {
    if (!userTypeString) {
      return false;
    }
    return userTypeString.toLowerCase().includes('prestataire');
  }

  /**
   * Récupère le titre du formulaire selon le type d'utilisateur
   * @param isPrestataire Si l'utilisateur est un prestataire
   */
  getFormTitle(isPrestataire: boolean): string {
    return isPrestataire ? 'Inscription Prestataire' : 'Inscription Particulier';
  }

  /**
   * Récupère le type d'utilisateur sous forme de chaîne
   * @param isPrestataire Si l'utilisateur est un prestataire
   */
  getUserTypeString(isPrestataire: boolean): string {
    return isPrestataire ? 'prestataire' : 'particulier';
  }
}