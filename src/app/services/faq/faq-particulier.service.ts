import { Injectable } from '@angular/core';
import { FAQParticulierItem } from '../../models/FAQ';
import { BaseFAQService } from './base-faq.service';

@Injectable({
  providedIn: 'root'
})
export class FAQParticulierService extends BaseFAQService<FAQParticulierItem> {
  
  protected faqItems: FAQParticulierItem[] = [
    {
      question: "Comment créer mon compte ?",
      reponse: "Pour créer un compte, cliquez sur le bouton « S'inscrire » et remplissez le formulaire d'inscription avec vos informations personnelles.",
      categorie: "inscription"
    },
    {
      question: "Que faire si je ne parviens pas à me connecter ?",
      reponse: "Vérifiez votre identifiant et votre mot de passe. En cas d'échec, utilisez la fonction « Mot de passe oublié » ou contactez le support.",
      categorie: "connexion"
    },
    {
      question: "Que se passe-t-il après la connexion ?",
      reponse: "Une fois votre authentification réussie, vous aurez accès aux différentes fonctionnalités : recherche de prestations, messagerie, gestion du profil, etc.",
      categorie: "connexion"
    },
    {
      question: "Comment rechercher une prestation ?",
      reponse: "Utilisez la barre de recherche pour saisir des mots-clés en lien avec le service recherché.",
      categorie: "recherche"
    },
    {
      question: "Puis-je voir les informations du prestataire ?",
      reponse: "Oui, en cliquant sur un prestataire, vous pouvez consulter son profil et voir les prestations qu'il propose et les avis qui lui ont été laissé.",
      categorie: "prestataires"
    },
    {
      question: "Comment voir le détail d'une prestation ?",
      reponse: "En cliquant sur une prestation spécifique dans la liste ou sur le profil du prestataire, vous accédez à sa fiche détaillée.",
      categorie: "prestations"
    },
    {
      question: "Comment réserver une prestation ?",
      reponse: "Depuis la fiche de la prestation, cliquez sur le bouton « Réserver » et suivez les étapes indiquées.",
      categorie: "reservation"
    },
    {
      question: "Comment savoir si ma réservation est confirmée ?",
      reponse: "Une fois la réservation effectuée, vous recevez une notification de « Réservation validée ».",
      categorie: "reservation"
    },
    {
      question: "Comment procéder au paiement ?",
      reponse: "Après validation, suivez le processus de paiement sécurisé proposé pour régler la prestation.",
      categorie: "paiement"
    },
    {
      question: "Comment suivre l'avancement de ma prestation ?",
      reponse: "Depuis votre espace personnel, accédez à la section « Suivre la prestation » pour voir les mises à jour ou messages liés.",
      categorie: "suivi"
    },
    {
      question: "Puis-je évaluer la prestation après réalisation ?",
      reponse: "Oui, après la réalisation du service, vous pourrez laisser une évaluation.",
      categorie: "evaluation"
    },
    {
      question: "Comment valider mon avis ?",
      reponse: "Une fois votre évaluation rédigée, cliquez sur « Valider mon avis » pour qu'il soit pris en compte.",
      categorie: "evaluation"
    },
    {
      question: "Où consulter mes messages ?",
      reponse: "Vous accédez à votre messagerie directement depuis votre tableau de bord.",
      categorie: "messagerie"
    },
    {
      question: "Comment répondre à un message ?",
      reponse: "Sélectionnez le message concerné et utilisez l'option « Répondre ».",
      categorie: "messagerie"
    },
    {
      question: "Puis-je envoyer un nouveau message à un prestataire ?",
      reponse: "Oui, utilisez l'option « Envoyer un message » depuis la messagerie ou directement depuis le profil du prestataire.",
      categorie: "messagerie"
    },
    {
      question: "Puis-je retrouver l'historique de mes échanges ?",
      reponse: "Oui, l'historique complet des messages avec chaque prestataire est accessible dans votre messagerie.",
      categorie: "messagerie"
    },
    {
      question: "Comment consulter mon profil ?",
      reponse: "Rendez-vous dans la section « Consulter mon profil » pour visualiser vos informations personnelles.",
      categorie: "profil"
    },
    {
      question: "Puis-je modifier mes informations ?",
      reponse: "Oui, cliquez sur « Éditer » pour mettre à jour vos données personnelles.",
      categorie: "profil"
    },
    {
      question: "Les professionnels sont-ils vérifiés ?",
      reponse: "Oui. Chaque professionnel doit : Fournir une pièce d'identité, Un numéro SIRET/SIREN, Une attestation d'assurance responsabilité civile professionnelle, Et compléter un profil détaillé. De plus, les utilisateurs notent l'utilisateur à la fin de chaque mission, assurant une sélection basée sur la qualité et la confiance.",
      categorie: "securite"
    },
    {
      question: "Combien coûte une prestation ?",
      reponse: "Les particuliers paient une commission de 20 % lors de la réservation, incluse dans le tarif affiché. Les professionnels fixent le taux horaire de la prestation.",
      categorie: "tarifs"
    },
    {
      question: "Comment suivre l'avancement de ma prestation ?",
      reponse: "Les prestataires sont joignables jusqu'à la validation de la prestation via la messagerie. Les prestataires envoient des photos une fois le service terminé.",
      categorie: "suivi"
    },
    {
      question: "Je souhaite annuler ma réservation, comment faire ?",
      reponse: "La première chose à faire avant toute annulation, est bien sûr d'avertir le prestataire. Vous pouvez notamment lui envoyer un message via votre application ou espace client.",
      categorie: "annulation"
    },
    {
      question: "Il y a-t-il des frais d'annulation ?",
      reponse: "> 96h : remboursement complet, Entre 48h et 96h avant : frais d'annulation 50% du montant de la commande, < 48h : frais d'annulation de 100% du montant de la commande.",
      categorie: "annulation"
    },
    {
      question: "Puis-je évaluer un professionnel après sa mission ?",
      reponse: "Oui. À la fin de chaque prestation, vous êtes invité à : Laisser une note (1 à 5 étoiles), Rédiger un commentaire. Ces avis sont visibles sur le profil de l'utilisateur pour aider les futurs utilisateurs à faire leur choix.",
      categorie: "evaluation"
    }
  ];

  constructor() {
    super();
  }

  /**
   * Récupère les questions FAQ par ordre de priorité
   */
  getFAQByPriority(): FAQParticulierItem[] {
    const priorityOrder = ['inscription', 'connexion', 'recherche', 'prestataires', 'prestations', 'reservation', 'paiement', 'suivi', 'evaluation', 'messagerie', 'profil', 'securite', 'tarifs', 'annulation'];
    return this.faqItems.sort((a, b) => {
      const aIndex = priorityOrder.indexOf(a.categorie);
      const bIndex = priorityOrder.indexOf(b.categorie);
      return aIndex - bIndex;
    });
  }

  /**
   * Récupère les questions FAQ les plus fréquemment consultées
   */
  getMostFrequentFAQ(): FAQParticulierItem[] {
    const frequentCategories = ['inscription', 'recherche', 'reservation', 'paiement', 'annulation'];
    return this.faqItems.filter(item => frequentCategories.includes(item.categorie));
  }
}
