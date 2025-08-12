import { Injectable } from '@angular/core';
import { FAQPrestataireParcours } from '../../models/FAQ';
import { BaseFAQParcoursService } from './base-faq-parcours.service';

@Injectable({
  providedIn: 'root'
})
export class FAQPrestataireParcoursService extends BaseFAQParcoursService<FAQPrestataireParcours> {

  protected faqItems: FAQPrestataireParcours[] = [
    // 1. Inscription / Connexion
    {
      id: 'presta-inscription-1',
      question: 'Comment créer mon compte prestataire ?',
      reponse: 'Cliquez sur le bouton « S\'inscrire » et remplissez le formulaire spécifique aux prestataires.',
      categorie: 'Inscription / Connexion',
      ordre: 1
    },
    {
      id: 'presta-inscription-2',
      question: 'Que faire si je rencontre un problème de connexion ?',
      reponse: 'Vérifiez vos identifiants. Si le problème persiste, utilisez la fonction « Mot de passe oublié » ou contactez le support.',
      categorie: 'Inscription / Connexion',
      ordre: 2
    },
    {
      id: 'presta-inscription-3',
      question: 'Que se passe-t-il après la connexion ?',
      reponse: 'Une fois connecté (après authentification réussie), vous accédez à votre espace prestataire avec toutes les fonctionnalités liées à la gestion de vos services.',
      categorie: 'Inscription / Connexion',
      ordre: 3
    },

    // 2. Gestion des services
    {
      id: 'presta-gestion-1',
      question: 'Comment consulter mon agenda ?',
      reponse: 'Depuis votre espace prestataire, accédez à la section « Consulter mon agenda » pour visualiser vos disponibilités et rendez-vous.',
      categorie: 'Gestion des services',
      ordre: 4
    },
    {
      id: 'presta-gestion-2',
      question: 'Puis-je consulter les profils de mes clients ?',
      reponse: 'Oui, dans « Consulter un profil », vous accédez aux informations client.',
      categorie: 'Gestion des services',
      ordre: 5
    },
    {
      id: 'presta-gestion-3',
      question: 'Comment consulter les détails d\'un client spécifique ?',
      reponse: 'En sélectionnant un client, accédez à « Consulter les détails client » pour voir ses informations.',
      categorie: 'Gestion des services',
      ordre: 6
    },
    {
      id: 'presta-gestion-4',
      question: 'Puis-je contacter un client directement ?',
      reponse: 'Oui, via l\'option « Contacter » présente dans le profil du client.',
      categorie: 'Gestion des services',
      ordre: 7
    },
    {
      id: 'presta-gestion-5',
      question: 'Comment voir l\'historique des réservations ?',
      reponse: 'Consultez la section « Consulter l\'historique des réservation » pour voir les réservations passées.',
      categorie: 'Gestion des services',
      ordre: 8
    },
    {
      id: 'presta-gestion-6',
      question: 'Puis-je échanger des messages avec les clients ?',
      reponse: 'Oui, depuis la gestion des services vous pouvez : Envoyer un message, Répondre à un message, Consulter l\'historique des messages.',
      categorie: 'Gestion des services',
      ordre: 9
    },

    // 3. Création / Gestion des Services
    {
      id: 'presta-creation-1',
      question: 'Comment ajouter un nouveau service ?',
      reponse: 'Rendez-vous dans « Ajouter un service » et remplissez les informations demandées.',
      categorie: 'Création / Gestion des Services',
      ordre: 10
    },
    {
      id: 'presta-creation-2',
      question: 'Comment supprimer un service ?',
      reponse: 'Accédez à la liste de vos services et sélectionnez l\'option « Supprimer un service ».',
      categorie: 'Création / Gestion des Services',
      ordre: 11
    },

    // 4. Messagerie
    {
      id: 'presta-messagerie-1',
      question: 'Où consulter mes messages ?',
      reponse: 'Dans votre espace prestataire, accédez à la section « Consulter mes messages ».',
      categorie: 'Messagerie',
      ordre: 12
    },
    {
      id: 'presta-messagerie-2',
      question: 'Comment répondre à un message reçu ?',
      reponse: 'Ouvrez le message concerné et cliquez sur « Répondre à un message ».',
      categorie: 'Messagerie',
      ordre: 13
    },
    {
      id: 'presta-messagerie-3',
      question: 'Comment envoyer un nouveau message ?',
      reponse: 'Utilisez l\'option « Envoyer un message » depuis votre messagerie ou depuis un profil client.',
      categorie: 'Messagerie',
      ordre: 14
    },
    {
      id: 'presta-messagerie-4',
      question: 'Puis-je retrouver l\'historique de mes échanges ?',
      reponse: 'Oui, l\'intégralité de vos échanges est visible dans « Consulter l\'historique des messages ».',
      categorie: 'Messagerie',
      ordre: 15
    },

    // 5. Profil Prestataire
    {
      id: 'presta-profil-1',
      question: 'Comment consulter mon profil prestataire ?',
      reponse: 'Allez dans la section « Consulter mon profil ».',
      categorie: 'Profil Prestataire',
      ordre: 16
    },
    {
      id: 'presta-profil-2',
      question: 'Puis-je modifier mon profil ?',
      reponse: 'Oui, cliquez sur « Éditer » pour mettre à jour vos informations personnelles et professionnelles.',
      categorie: 'Profil Prestataire',
      ordre: 17
    }
  ];

  constructor() {
    super();
  }
}
