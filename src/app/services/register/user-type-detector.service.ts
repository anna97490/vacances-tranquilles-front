// Service pour la détection du type d'utilisateur
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserTypeDetectorService {

  /**
   * Détermine le type d'utilisateur à partir de l'URL
   */
  detectUserTypeFromUrl(pathname?: string): boolean {
    const path = pathname || window.location.pathname;
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
   * Récupère le titre du formulaire pour un prestataire
   */
  getPrestataireFormTitle(): string {
    return 'Inscription Prestataire';
  }

  /**
   * Récupère le titre du formulaire pour un particulier
   */
  getParticulierFormTitle(): string {
    return 'Inscription Particulier';
  }

  /**
   * Récupère le type d'utilisateur sous forme de chaîne pour un prestataire
   */
  getPrestataireUserTypeString(): string {
    return 'prestataire';
  }

  /**
   * Récupère le type d'utilisateur sous forme de chaîne pour un particulier
   */
  getParticulierUserTypeString(): string {
    return 'particulier';
  }
}