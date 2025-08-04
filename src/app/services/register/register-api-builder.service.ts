// Service pour la construction de l'API
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RegisterPayload, ApiConfig } from '../../models/Register';

@Injectable({
  providedIn: 'root'
})
export class RegisterApiBuilderService {

  /**
   * Construit la configuration API selon le type d'utilisateur
   * @param form Le formulaire avec les données
   * @param isPrestataire Si l'utilisateur est un prestataire
   * @param apiUrl L'URL de base de l'API
   */
  buildApiConfig(form: FormGroup, isPrestataire: boolean, apiUrl: string): ApiConfig {
    const basePayload: RegisterPayload = {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: form.value.email,
      password: form.value.userSecret, // Mappé depuis userSecret vers password pour l'API
      phoneNumber: form.value.phoneNumber,
      address: form.value.address,
      city: form.value.city,
      postalCode: form.value.postalCode
    };

    if (isPrestataire) {
      return {
        url: `${apiUrl}/auth/register/provider`,
        payload: {
          ...basePayload,
          companyName: form.value.companyName,
          siretSiren: form.value.siretSiren
        }
      };
    } else {
      return {
        url: `${apiUrl}/auth/register/client`,
        payload: basePayload
      };
    }
  }
}