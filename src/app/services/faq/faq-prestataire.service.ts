import { Injectable } from '@angular/core';
import { FAQPrestataireItem } from '../../models/FAQ';
import { BaseFAQService } from './base-faq.service';

@Injectable({
  providedIn: 'root'
})
export class FAQPrestataireService extends BaseFAQService<FAQPrestataireItem> {
  
  protected faqItems: FAQPrestataireItem[] = [
    {
      question: "Quelles conditions doivent être remplies pour proposer ses services ?",
      reponse: "Pour devenir prestataire, il faut : Avoir une entreprise, Avoir une assurance responsabilité civile professionnelle.",
      categorie: "conditions"
    },
    {
      question: "Quels documents un prestataire doit-il fournir pour s'inscrire ?",
      reponse: "Chaque professionnel doit fournir : Une pièce d'identité, Un numéro SIRET/SIREN, Une attestation d'assurance responsabilité civile professionnelle, Et compléter un profil détaillé. De plus, les utilisateurs notent l'utilisateur à la fin de chaque mission, assurant une sélection basée sur la qualité et la confiance.",
      categorie: "documents"
    },
    {
      question: "Comment créer mon compte prestataire ?",
      reponse: "Cliquez sur le bouton « S'inscrire » et remplissez le formulaire spécifique aux prestataires.",
      categorie: "inscription"
    },
    {
      question: "Que faire si je rencontre un problème de connexion ?",
      reponse: "Vérifiez vos identifiants. Si le problème persiste, utilisez la fonction « Mot de passe oublié » ou contactez le support.",
      categorie: "connexion"
    },
    {
      question: "Que se passe-t-il après la connexion ?",
      reponse: "Une fois connecté (après authentification réussie), vous accédez à votre espace prestataire avec toutes les fonctionnalités liées à la gestion de vos services.",
      categorie: "connexion"
    },
    {
      question: "Comment consulter mon agenda ?",
      reponse: "Depuis votre espace prestataire, accédez à la section « Consulter mon agenda » pour visualiser vos disponibilités et rendez-vous.",
      categorie: "agenda"
    },
    {
      question: "Puis-je consulter les profils de mes clients ?",
      reponse: "Oui, dans « Consulter un profil », vous accédez aux informations client.",
      categorie: "clients"
    },
    {
      question: "Comment consulter les détails d'un client spécifique ?",
      reponse: "En sélectionnant un client, accédez à « Consulter les détails client » pour voir ses informations.",
      categorie: "clients"
    },
    {
      question: "Puis-je contacter un client directement ?",
      reponse: "Oui, via l'option « Contacter » présente dans le profil du client.",
      categorie: "communication"
    },
    {
      question: "Comment voir l'historique des réservations ?",
      reponse: "Consultez la section « Consulter l'historique des réservation » pour voir les réservations passées.",
      categorie: "reservations"
    },
    {
      question: "Puis-je échanger des messages avec les clients ?",
      reponse: "Oui, depuis la gestion des services vous pouvez : Envoyer un message, Répondre à un message, Consulter l'historique des messages.",
      categorie: "communication"
    },
    {
      question: "Comment ajouter un nouveau service ?",
      reponse: "Rendez-vous dans « Ajouter un service » et remplissez les informations demandées.",
      categorie: "services"
    },
    {
      question: "Comment supprimer un service ?",
      reponse: "Accédez à la liste de vos services et sélectionnez l'option « Supprimer un service ».",
      categorie: "services"
    },
    {
      question: "Où consulter mes messages ?",
      reponse: "Dans votre espace prestataire, accédez à la section « Consulter mes messages ».",
      categorie: "messagerie"
    },
    {
      question: "Comment répondre à un message reçu ?",
      reponse: "Ouvrez le message concerné et cliquez sur « Répondre à un message ».",
      categorie: "messagerie"
    },
    {
      question: "Comment envoyer un nouveau message ?",
      reponse: "Utilisez l'option « Envoyer un message » depuis votre messagerie ou depuis un profil client.",
      categorie: "messagerie"
    },
    {
      question: "Puis-je retrouver l'historique de mes échanges ?",
      reponse: "Oui, l'intégralité de vos échanges est visible dans « Consulter l'historique des messages ».",
      categorie: "messagerie"
    },
    {
      question: "Comment consulter mon profil prestataire ?",
      reponse: "Allez dans la section « Consulter mon profil ».",
      categorie: "profil"
    },
    {
      question: "Puis-je modifier mon profil ?",
      reponse: "Oui, cliquez sur « Éditer » pour mettre à jour vos informations personnelles et professionnelles.",
      categorie: "profil"
    }
  ];

  constructor() {
    super();
  }

  /**
   * Récupère les questions FAQ par ordre de priorité
   */
  override getFAQByPriority(): FAQPrestataireItem[] {
    const priorityOrder = ['inscription', 'conditions', 'documents', 'connexion', 'agenda', 'clients', 'services', 'communication', 'messagerie', 'profil'];
    return super.getFAQByPriority(priorityOrder);
  }
}
