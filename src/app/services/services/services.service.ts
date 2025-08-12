import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Service, ServiceCategory } from '../../models/Service';
import { EnvService } from '../env/env.service';
import { TokenValidatorService } from '../auth/token-validator.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  private readonly urlApi: string;

  constructor(
    private readonly http: HttpClient,
    private readonly envService: EnvService,
    private readonly tokenValidator: TokenValidatorService,
    private readonly router: Router
  ) {
    this.urlApi = this.envService.apiUrl;
  }

  /**
   * Recherche des services selon les critères fournis
   * @param category Catégorie du service
   * @param postalCode Code postal
   * @param date Date au format YYYY-MM-DD
   * @param startTime Heure de début au format HH:mm
   * @param endTime Heure de fin au format HH:mm
   * @returns Observable<Service[]> Liste des services correspondants
   */
  searchServices(
    category: string,
    postalCode: string,
    date: string,
    startTime: string,
    endTime: string
  ): Observable<Service[]> {
    // Vérifier la validité du token avant d'effectuer la requête
    if (!this.tokenValidator.isTokenValid()) {
      console.warn('Token invalide ou expiré, redirection vers la page de connexion');
      this.router.navigate(['/auth/login']);
      return throwError(() => new Error('Session expirée. Veuillez vous reconnecter.'));
    }

    const url = `${this.urlApi}/services/search`;

    // Vérification que la catégorie est valide
    if (!Object.keys(ServiceCategory).includes(category)) {
      throw new Error(`Catégorie inconnue : ${category}`);
    }
    
    // Construction des paramètres de requête
    const params = new HttpParams()
      .set('category', category)
      .set('postalCode', postalCode)
      .set('date', date)
      .set('startTime', startTime)
      .set('endTime', endTime);

    // Récupération du token depuis le localStorage
    const token = localStorage.getItem('token');
    
    // Configuration des headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<Service[]>(url, { params, headers });
  }
}
