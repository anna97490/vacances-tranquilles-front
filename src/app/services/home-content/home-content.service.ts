import { Injectable } from '@angular/core';
import { HomeContent } from '../../models/Home';

@Injectable({ providedIn: 'root' })
export class HomeContentService {
  getContent(): HomeContent {
    return {
      iconType: 'custom',
      mainIcon: 'assets/icons/beach_access_FFA101.svg',
      title: 'Vacances Tranquilles',
      subtitle: 'Confiez votre maison, partez l’esprit tranquille',
      introText: "Trouvez des professionnels de confiance pour veiller sur votre logement et assurer tous vos services à domicile pendant vos vacances.",
      btnPrestataire: 'Je suis prestataire',
      btnParticulier: 'Je suis particulier',
      btnConnexion: 'Connexion',
      featuresTitle: 'Pourquoi nous choisir',
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