import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/User';

@Injectable({
  providedIn: 'root'
})
export class UserInformationService {

  private readonly baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  /**
   * Récupère les informations d'un utilisateur par son ID
   * @param userId ID de l'utilisateur
   * @returns Observable<User> Les informations de l'utilisateur
   */
  getUserById(userId: number): Observable<User> {
    const url = `${this.baseUrl}/users/${userId}`;
    
    // Récupération du token depuis le localStorage
    const token = localStorage.getItem('token') || 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2Iiwicm9sZSI6IkNMSUVOVCIsImlhdCI6MTc1NDE0MTI5OSwiZXhwIjoxNzU0MTQ0ODk5fQ.1nNAN_nisKhhNhMVgFPc1BlFAj7oUUcX1tSNYFgeIYk';
    
    // Configuration des headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<User>(url, { headers });
  }

  /**
   * Récupère le profil de l'utilisateur authentifié
   * @returns Observable<User> Le profil de l'utilisateur
   */
  getUserProfile(): Observable<User> {
    const url = `${this.baseUrl}/users/profile`;
    
    // Récupération du token depuis le localStorage
    const token = localStorage.getItem('token') || 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2Iiwicm9sZSI6IkNMSUVOVCIsImlhdCI6MTc1NDE0MTI5OSwiZXhwIjoxNzU0MTQ0ODk5fQ.1nNAN_nisKhhNhMVgFPc1BlFAj7oUUcX1tSNYFgeIYk';
    
    // Configuration des headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<User>(url, { headers });
  }

  /**
   * Récupère plusieurs utilisateurs par leurs IDs
   * @param userIds Liste des IDs d'utilisateurs
   * @returns Observable<User[]> Les informations des utilisateurs
   */
  getUsersByIds(userIds: number[]): Observable<User[]> {
    const url = `${this.baseUrl}/users/batch`;
    
    // Récupération du token depuis le localStorage
    const token = localStorage.getItem('token') || 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2Iiwicm9sZSI6IkNMSUVOVCIsImlhdCI6MTc1NDE0MTI5OSwiZXhwIjoxNzU0MTQ0ODk5fQ.1nNAN_nisKhhNhMVgFPc1BlFAj7oUUcX1tSNYFgeIYk';
    
    // Configuration des headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<User[]>(url, { userIds }, { headers });
  }
} 