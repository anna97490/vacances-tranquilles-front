import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Service, ServiceCategory } from '../../models/Service';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  private readonly baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

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
    const url = `${this.baseUrl}/services/search`;

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
    const token = localStorage.getItem('token') || 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2Iiwicm9sZSI6IkNMSUVOVCIsImlhdCI6MTc1NDE0MTI5OSwiZXhwIjoxNzU0MTQ0ODk5fQ.1nNAN_nisKhhNhMVgFPc1BlFAj7oUUcX1tSNYFgeIYk';
    
    // Configuration des headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<Service[]>(url, { params, headers });
  }
}
