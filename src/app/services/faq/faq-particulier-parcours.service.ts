import { Injectable } from '@angular/core';
import { FAQParticulierParcours } from '../../models/FAQ';

@Injectable({
  providedIn: 'root'
})
export class FAQParticulierParcoursService {

  private faqParticulierParcours: FAQParticulierParcours[] = [
    // 1. Inscription / Connexion
    {
      id: 'part-inscription-1',
      question: 'Comment créer mon compte ?',
      reponse: 'Pour créer un compte, cliquez sur le bouton « S\'inscrire » et remplissez le formulaire d\'inscription avec vos informations personnelles.',
      categorie: 'Inscription / Connexion',
      ordre: 1
    },
    {
      id: 'part-inscription-2',
      question: 'Que faire si je ne parviens pas à me connecter ?',
      reponse: 'Vérifiez votre identifiant et votre mot de passe. En cas d\'échec, utilisez la fonction « Mot de passe oublié » ou contactez le support.',
      categorie: 'Inscription / Connexion',
      ordre: 2
    },
    {
      id: 'part-inscription-3',
      question: 'Que se passe-t-il après la connexion ?',
      reponse: 'Une fois votre authentification réussie, vous aurez accès aux différentes fonctionnalités : recherche de prestations, messagerie, gestion du profil, etc.',
      categorie: 'Inscription / Connexion',
      ordre: 3
    },

    // 2. Consulter des prestations
    {
      id: 'part-consulter-1',
      question: 'Comment rechercher une prestation ?',
      reponse: 'Utilisez la barre de recherche pour saisir des mots-clés en lien avec le service recherché.',
      categorie: 'Consulter des prestations',
      ordre: 4
    },
    {
      id: 'part-consulter-2',
      question: 'Puis-je voir les informations du prestataire ?',
      reponse: 'Oui, en cliquant sur un prestataire, vous pouvez consulter son profil et voir les prestations qu\'il propose et les avis qui lui ont été laissé.',
      categorie: 'Consulter des prestations',
      ordre: 5
    },

    // 3. Réserver une prestation
    {
      id: 'part-reserver-1',
      question: 'Comment voir le détail d\'une prestation ?',
      reponse: 'En cliquant sur une prestation spécifique dans la liste ou sur le profil du prestataire, vous accédez à sa fiche détaillée.',
      categorie: 'Réserver une prestation',
      ordre: 6
    },
    {
      id: 'part-reserver-2',
      question: 'Comment réserver une prestation ?',
      reponse: 'Depuis la fiche de la prestation, cliquez sur le bouton « Réserver » et suivez les étapes indiquées.',
      categorie: 'Réserver une prestation',
      ordre: 7
    },
    {
      id: 'part-reserver-3',
      question: 'Comment savoir si ma réservation est confirmée ?',
      reponse: 'Une fois la réservation effectuée, vous recevez une notification de « Réservation validée ».',
      categorie: 'Réserver une prestation',
      ordre: 8
    },
    {
      id: 'part-reserver-4',
      question: 'Comment procéder au paiement ?',
      reponse: 'Après validation, suivez le processus de paiement sécurisé proposé pour régler la prestation.',
      categorie: 'Réserver une prestation',
      ordre: 9
    },

    // 4. Suivi de la prestation
    {
      id: 'part-suivi-1',
      question: 'Comment suivre l\'avancement de ma prestation ?',
      reponse: 'Depuis votre espace personnel, accédez à la section « Suivre la prestation » pour voir les mises à jour ou messages liés.',
      categorie: 'Suivi de la prestation',
      ordre: 10
    },
    {
      id: 'part-suivi-2',
      question: 'Puis-je évaluer la prestation après réalisation ?',
      reponse: 'Oui, après la réalisation du service, vous pourrez laisser une évaluation.',
      categorie: 'Suivi de la prestation',
      ordre: 11
    },
    {
      id: 'part-suivi-3',
      question: 'Comment valider mon avis ?',
      reponse: 'Une fois votre évaluation rédigée, cliquez sur « Valider mon avis » pour qu\'il soit pris en compte.',
      categorie: 'Suivi de la prestation',
      ordre: 12
    },

    // 5. Messagerie
    {
      id: 'part-messagerie-1',
      question: 'Où consulter mes messages ?',
      reponse: 'Vous accédez à votre messagerie directement depuis votre tableau de bord.',
      categorie: 'Messagerie',
      ordre: 13
    },
    {
      id: 'part-messagerie-2',
      question: 'Comment répondre à un message ?',
      reponse: 'Sélectionnez le message concerné et utilisez l\'option « Répondre ».',
      categorie: 'Messagerie',
      ordre: 14
    },
    {
      id: 'part-messagerie-3',
      question: 'Puis-je envoyer un nouveau message à un prestataire ?',
      reponse: 'Oui, utilisez l\'option « Envoyer un message » depuis la messagerie ou directement depuis le profil du prestataire.',
      categorie: 'Messagerie',
      ordre: 15
    },
    {
      id: 'part-messagerie-4',
      question: 'Puis-je retrouver l\'historique de mes échanges ?',
      reponse: 'Oui, l\'historique complet des messages avec chaque prestataire est accessible dans votre messagerie.',
      categorie: 'Messagerie',
      ordre: 16
    },

    // 6. Profil personnel
    {
      id: 'part-profil-1',
      question: 'Comment consulter mon profil ?',
      reponse: 'Rendez-vous dans la section « Consulter mon profil » pour visualiser vos informations personnelles.',
      categorie: 'Profil personnel',
      ordre: 17
    },
    {
      id: 'part-profil-2',
      question: 'Puis-je modifier mes informations ?',
      reponse: 'Oui, cliquez sur « Éditer » pour mettre à jour vos données personnelles.',
      categorie: 'Profil personnel',
      ordre: 18
    }
  ];

  constructor() { }

  /**
   * Récupère toutes les questions du parcours particulier
   */
  getAllQuestions(): FAQParticulierParcours[] {
    return this.faqParticulierParcours.sort((a, b) => a.ordre - b.ordre);
  }

  /**
   * Récupère les questions par catégorie
   */
  getQuestionsByCategory(categorie: string): FAQParticulierParcours[] {
    return this.faqParticulierParcours
      .filter(faq => faq.categorie === categorie)
      .sort((a, b) => a.ordre - b.ordre);
  }

  /**
   * Récupère toutes les catégories disponibles
   */
  getCategories(): string[] {
    return [...new Set(this.faqParticulierParcours.map(faq => faq.categorie))];
  }

  /**
   * Recherche dans les questions et réponses
   */
  searchQuestions(searchTerm: string): FAQParticulierParcours[] {
    const term = searchTerm.toLowerCase();
    return this.faqParticulierParcours.filter(faq => 
      faq.question.toLowerCase().includes(term) || 
      faq.reponse.toLowerCase().includes(term)
    );
  }

  /**
   * Récupère une question spécifique par ID
   */
  getQuestionById(id: string): FAQParticulierParcours | undefined {
    return this.faqParticulierParcours.find(faq => faq.id === id);
  }

  /**
   * Récupère le nombre total de questions
   */
  getTotalQuestions(): number {
    return this.faqParticulierParcours.length;
  }
}
