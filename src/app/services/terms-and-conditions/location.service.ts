import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  /**
   * Retourne le chemin d'accès courant (pathname) du navigateur.
   * @returns {string} Le pathname courant
   */
  getPathname(): string {
    return window.location.pathname;
  }
} 