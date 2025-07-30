import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Service } from '../../models/Service';
import { getServiceCategoryKey } from '../../mappers/serviceCategoryMapper';

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

    const categoryKey = getServiceCategoryKey(category);
    if (!categoryKey) {
      throw new Error(`Catégorie inconnue : ${category}`);
    }
    
    // Construction des paramètres de requête
    const params = new HttpParams()
      .set('category', categoryKey)
      .set('postalCode', postalCode)
      .set('date', date)
      .set('startTime', startTime)
      .set('endTime', endTime);

    // Récupération du token depuis le localStorage
    const token = localStorage.getItem('token') || 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2Iiwicm9sZSI6IkNMSUVOVCIsImlhdCI6MTc1Mzg2NDUzNCwiZXhwIjoxNzUzODY4MTM0fQ.52_35TpIPAoaS1cWmoS8QJNXNHmJNIEZFsHpgLKa-V8';
    
    // Configuration des headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<Service[]>(url, { params, headers });
  }
}
