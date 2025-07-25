import { Injectable } from '@angular/core';
import { HomeContent } from '../models/interfacesHome';

@Injectable({ providedIn: 'root' })
export class HomeContentService {
  getContent(): HomeContent {
    return {
      iconType: 'custom',
      mainIcon: 'assets/icons/beach_access_FFA101.svg',
      title: 'Vacances Tranquilles',
      subtitle: 'Votre partenaire de confiance pour des vacances sereines',
      introText: `Simplifiez la gestion de vos locations saisonnières et profitez de services de conciergerie de qualité. Notre plateforme connecte propriétaires et prestataires de services pour une expérience sans souci.`,
      btnPrestataire: 'Inscription Prestataires',
      btnParticulier: 'Inscription Particuliers',
      btnConnexion: 'Connexion',
      featuresTitle: 'Pourquoi Nous Choisir',
      features: [
        {
          iconType: 'custom',
          icon: 'assets/icons/field_FFA101.svg',
          title: 'Prestataires Vérifiés',
          desc: 'Tous nos prestataires sont soigneusement sélectionnés et vérifiés'
        },
        {
          iconType: 'custom',
          icon: 'assets/icons/calendar_FFA101.svg',
          title: 'Disponibilité 7j/7',
          desc: 'Une équipe disponible pour répondre à vos besoins'
        },
        {
          iconType: 'custom',
          icon: 'assets/icons/thumb_up_FFA101.svg',
          title: 'Satisfaction Garantie',
          desc: 'Votre satisfaction est notre priorité absolue'
        },
        {
          iconType: 'custom',
          icon: 'assets/icons/check_FFA101.svg',
          title: 'Service Personnalisé',
          desc: 'Des services adaptés à vos besoins spécifiques'
        }
      ]
    };
  }
} 