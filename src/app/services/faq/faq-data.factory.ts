import { FAQParticulierParcours, FAQPrestataireParcours, FAQParticulierItem, FAQPrestataireItem, FAQItem } from '../../models/FAQ';

/**
 * Interface pour les données FAQ brutes
 */
interface FAQDataItem {
  question: string;
  reponse: string;
  categorie: string;
}

/**
 * Interface pour les données FAQ par type d'utilisateur
 */
interface FAQUserTypeData {
  particulier: FAQDataItem[];
  prestataire: FAQDataItem[];
}

/**
 * Interface pour les données FAQ standard par type d'utilisateur
 */
interface FAQStandardData {
  particulier: FAQDataItem[];
  prestataire: FAQDataItem[];
  general: FAQDataItem[];
}

/**
 * Factory pour générer les données FAQ de manière programmatique
 * Élimine la duplication de code dans les services FAQ
 */
export class FAQDataFactory {

  /**
   * Données FAQ centralisées pour éviter la duplication
   */
  private static readonly FAQ_DATA: FAQUserTypeData = {
    particulier: [
      // 1. Inscription / Connexion
      {
        question: 'Comment créer mon compte ?',
        reponse: 'Pour créer un compte, cliquez sur le bouton « S\'inscrire » et remplissez le formulaire d\'inscription avec vos informations personnelles.',
        categorie: 'Inscription / Connexion'
      },
      {
        question: 'Que faire si je ne parviens pas à me connecter ?',
        reponse: 'Vérifiez votre identifiant et votre mot de passe. En cas d\'échec, utilisez la fonction « Mot de passe oublié » ou contactez le support.',
        categorie: 'Inscription / Connexion'
      },
      {
        question: 'Que se passe-t-il après la connexion ?',
        reponse: 'Une fois votre authentification réussie, vous aurez accès aux différentes fonctionnalités : recherche de prestations, messagerie, gestion du profil, etc.',
        categorie: 'Inscription / Connexion'
      },

      // 2. Consulter des prestations
      {
        question: 'Comment rechercher une prestation ?',
        reponse: 'Utilisez la barre de recherche pour saisir des mots-clés en lien avec le service recherché.',
        categorie: 'Consulter des prestations'
      },
      {
        question: 'Puis-je voir les informations du prestataire ?',
        reponse: 'Oui, en cliquant sur un prestataire, vous pouvez consulter son profil et voir les prestations qu\'il propose et les avis qui lui ont été laissé.',
        categorie: 'Consulter des prestations'
      },

      // 3. Réserver une prestation
      {
        question: 'Comment voir le détail d\'une prestation ?',
        reponse: 'En cliquant sur une prestation spécifique dans la liste ou sur le profil du prestataire, vous accédez à sa fiche détaillée.',
        categorie: 'Réserver une prestation'
      },
      {
        question: 'Comment réserver une prestation ?',
        reponse: 'Depuis la fiche de la prestation, cliquez sur le bouton « Réserver » et suivez les étapes indiquées.',
        categorie: 'Réserver une prestation'
      },
      {
        question: 'Comment savoir si ma réservation est confirmée ?',
        reponse: 'Une fois la réservation effectuée, vous recevez une notification de « Réservation validée ».',
        categorie: 'Réserver une prestation'
      },
      {
        question: 'Comment procéder au paiement ?',
        reponse: 'Après validation, suivez le processus de paiement sécurisé proposé pour régler la prestation.',
        categorie: 'Réserver une prestation'
      },

      // 4. Suivi de la prestation
      {
        question: 'Comment suivre l\'avancement de ma prestation ?',
        reponse: 'Depuis votre espace personnel, accédez à la section « Suivre la prestation » pour voir les mises à jour ou messages liés.',
        categorie: 'Suivi de la prestation'
      },
      {
        question: 'Puis-je évaluer la prestation après réalisation ?',
        reponse: 'Oui, après la réalisation du service, vous pourrez laisser une évaluation.',
        categorie: 'Suivi de la prestation'
      },
      {
        question: 'Comment valider mon avis ?',
        reponse: 'Une fois votre évaluation rédigée, cliquez sur « Valider mon avis » pour qu\'il soit pris en compte.',
        categorie: 'Suivi de la prestation'
      },

      // 5. Messagerie
      {
        question: 'Où consulter mes messages ?',
        reponse: 'Vous accédez à votre messagerie directement depuis votre tableau de bord.',
        categorie: 'Messagerie'
      },
      {
        question: 'Comment répondre à un message ?',
        reponse: 'Sélectionnez le message concerné et utilisez l\'option « Répondre ».',
        categorie: 'Messagerie'
      },
      {
        question: 'Puis-je envoyer un nouveau message à un prestataire ?',
        reponse: 'Oui, utilisez l\'option « Envoyer un message » depuis la messagerie ou directement depuis le profil du prestataire.',
        categorie: 'Messagerie'
      },
      {
        question: 'Puis-je retrouver l\'historique de mes échanges ?',
        reponse: 'Oui, l\'historique complet des messages avec chaque prestataire est accessible dans votre messagerie.',
        categorie: 'Messagerie'
      },

      // 6. Profil personnel
      {
        question: 'Comment consulter mon profil ?',
        reponse: 'Rendez-vous dans la section « Consulter mon profil » pour visualiser vos informations personnelles.',
        categorie: 'Profil personnel'
      },
      {
        question: 'Puis-je modifier mes informations ?',
        reponse: 'Oui, cliquez sur « Éditer » pour mettre à jour vos données personnelles.',
        categorie: 'Profil personnel'
      }
    ],

    prestataire: [
      // 1. Inscription / Connexion
      {
        question: 'Comment créer mon compte prestataire ?',
        reponse: 'Cliquez sur le bouton « S\'inscrire » et remplissez le formulaire spécifique aux prestataires.',
        categorie: 'Inscription / Connexion'
      },
      {
        question: 'Que faire si je rencontre un problème de connexion ?',
        reponse: 'Vérifiez vos identifiants. Si le problème persiste, utilisez la fonction « Mot de passe oublié » ou contactez le support.',
        categorie: 'Inscription / Connexion'
      },
      {
        question: 'Que se passe-t-il après la connexion ?',
        reponse: 'Une fois connecté (après authentification réussie), vous accédez à votre espace prestataire avec toutes les fonctionnalités liées à la gestion de vos services.',
        categorie: 'Inscription / Connexion'
      },

      // 2. Gestion des services
      {
        question: 'Comment consulter mon agenda ?',
        reponse: 'Depuis votre espace prestataire, accédez à la section « Consulter mon agenda » pour visualiser vos disponibilités et rendez-vous.',
        categorie: 'Gestion des services'
      },
      {
        question: 'Puis-je consulter les profils de mes clients ?',
        reponse: 'Oui, dans « Consulter un profil », vous accédez aux informations client.',
        categorie: 'Gestion des services'
      },
      {
        question: 'Comment consulter les détails d\'un client spécifique ?',
        reponse: 'En sélectionnant un client, accédez à « Consulter les détails client » pour voir ses informations.',
        categorie: 'Gestion des services'
      },
      {
        question: 'Puis-je contacter un client directement ?',
        reponse: 'Oui, via l\'option « Contacter » présente dans le profil du client.',
        categorie: 'Gestion des services'
      },
      {
        question: 'Comment voir l\'historique des réservations ?',
        reponse: 'Consultez la section « Consulter l\'historique des réservation » pour voir les réservations passées.',
        categorie: 'Gestion des services'
      },
      {
        question: 'Puis-je échanger des messages avec les clients ?',
        reponse: 'Oui, depuis la gestion des services vous pouvez : Envoyer un message, Répondre à un message, Consulter l\'historique des messages.',
        categorie: 'Gestion des services'
      },

      // 3. Création / Gestion des Services
      {
        question: 'Comment ajouter un nouveau service ?',
        reponse: 'Rendez-vous dans « Ajouter un service » et remplissez les informations demandées.',
        categorie: 'Création / Gestion des Services'
      },
      {
        question: 'Comment supprimer un service ?',
        reponse: 'Accédez à la liste de vos services et sélectionnez l\'option « Supprimer un service ».',
        categorie: 'Création / Gestion des Services'
      },

      // 4. Messagerie
      {
        question: 'Où consulter mes messages ?',
        reponse: 'Dans votre espace prestataire, accédez à la section « Consulter mes messages ».',
        categorie: 'Messagerie'
      },
      {
        question: 'Comment répondre à un message reçu ?',
        reponse: 'Ouvrez le message concerné et cliquez sur « Répondre à un message ».',
        categorie: 'Messagerie'
      },
      {
        question: 'Comment envoyer un nouveau message ?',
        reponse: 'Utilisez l\'option « Envoyer un message » depuis votre messagerie ou depuis un profil client.',
        categorie: 'Messagerie'
      },
      {
        question: 'Puis-je retrouver l\'historique de mes échanges ?',
        reponse: 'Oui, l\'intégralité de vos échanges est visible dans « Consulter l\'historique des messages ».',
        categorie: 'Messagerie'
      },

      // 5. Profil Prestataire
      {
        question: 'Comment consulter mon profil prestataire ?',
        reponse: 'Allez dans la section « Consulter mon profil ».',
        categorie: 'Profil Prestataire'
      },
      {
        question: 'Puis-je modifier mon profil ?',
        reponse: 'Oui, cliquez sur « Éditer » pour mettre à jour vos informations personnelles et professionnelles.',
        categorie: 'Profil Prestataire'
      }
    ]
  };

  /**
   * Données FAQ standard centralisées pour éviter la duplication
   */
  private static readonly FAQ_STANDARD_DATA: FAQStandardData = {
    particulier: [
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
    ],

    prestataire: [
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
    ],

    general: [
      {
        question: "Qu'est-ce que l'application Vacances Tranquilles ?",
        reponse: "Vacances Tranquilles est une plateforme qui met en relation des particuliers en vacances avec des professionnels de confiance, pour la réalisation de services à domicile pendant leur absence : ménage, jardinage, garde d'animaux, petits travaux, etc. L'objectif : partir l'esprit libre, tout en assurant l'entretien et la surveillance de son domicile.",
        categorie: "general"
      },
      {
        question: "Comment fonctionne la plateforme ?",
        reponse: "Le prestataire renseigne ses disponibilités, la liste des services qu'il souhaite proposer et définit un tarif horaire pour chacun. Le particulier lorsqu'il effectue une recherche se voit proposer une liste de prestataires qui correspondent à ses critères. Il peut consulter le profil de chacun et sélectionne le prestataire de son choix. Il effectue un paiement qui reste pour l'instant en attente. Le prestataire dispose de 24h pour valider la réservation. Une messagerie intégrée permet de communiquer et d'organiser la prestation. Après réalisation de la prestation, le prestataire doit envoyer 5 photos pour prouver que la prestation a bien été réalisée. Le paiement est sécurisé et ne sera libéré qu'une fois la mission validée.",
        categorie: "general"
      },
      {
        question: "Quels types de services sont proposés ?",
        reponse: "Nous proposons plusieurs catégories de services à domicile : Ménage et entretien (Ménage complet, Repassage, Nettoyage des vitres), Jardinage et bricolage (Tonte de pelouse, Taille de haies, Petits travaux électricité, plomberie…), Garde d'animaux, Gestion de domicile (Arrosage de plantes, Relevé du courrier, Réception de colis), Courses et livraisons (Récupération de commandes en drive ou supermarché).",
        categorie: "services"
      },
      {
        question: "L'application est-elle gratuite ?",
        reponse: "L'inscription est gratuite pour tous. Une commission de 20 % par réservation est retenue par Vacances Tranquilles. Cette commission est incluse dans le tarif affiché aux particuliers. Nous proposons 2 types d'abonnement premium à destination des prestataires : Plan Pro (9,99€/mois) : Réduction sur la commission, Plan Premium (19,99€/mois) : Réduction sur la commission et mise en avant.",
        categorie: "tarifs"
      },
      {
        question: "Que faire en cas de problème ou de litige ?",
        reponse: "Une assistance en ligne est disponible via chatbot 24h/24. En cas de besoin, un formulaire permet de transmettre un incident. L'équipe Vacances Tranquilles apporte une réponse sous 48h maximum. Un processus de médiation avec preuves (photos, messages, devis) est proposé en cas de litige.",
        categorie: "assistance"
      },
      {
        question: "Puis-je programmer des prestations récurrentes ?",
        reponse: "Oui. Vous pouvez définir une ou plusieurs dates.",
        categorie: "reservation"
      },
      {
        question: "Il y a-t-il des frais d'annulation ?",
        reponse: "> 96h : remboursement complet, Entre 48h et 96h avant : frais d'annulation 50% du montant de la commande, < 48h : frais d'annulation de 100% du montant de la commande.",
        categorie: "annulation"
      },
      {
        question: "Puis-je évaluer un utilisateur après la réalisation d'une prestation ?",
        reponse: "Oui. À la fin de chaque prestation, vous êtes invité à : Laisser une note (1 à 5 étoiles), Rédiger un commentaire. Ces avis seront visibles sur le profil de l'utilisateur. Cela permet d'avoir une idée de la personne à qui nous avons affaire.",
        categorie: "evaluation"
      }
    ]
  };

  /**
   * Génère les données FAQ pour les particuliers (parcours)
   */
  static generateParticulierFAQ(): FAQParticulierParcours[] {
    return this.generateFAQWithOrder<FAQParticulierParcours>(
      this.FAQ_DATA.particulier, 
      'part'
    );
  }

  /**
   * Génère les données FAQ pour les prestataires (parcours)
   */
  static generatePrestataireFAQ(): FAQPrestataireParcours[] {
    return this.generateFAQWithOrder<FAQPrestataireParcours>(
      this.FAQ_DATA.prestataire, 
      'presta'
    );
  }

  /**
   * Génère les données FAQ standard pour les particuliers
   */
  static generateParticulierStandardFAQ(): FAQParticulierItem[] {
    return this.FAQ_STANDARD_DATA.particulier.map(item => ({
      question: item.question,
      reponse: item.reponse,
      categorie: item.categorie
    }));
  }

  /**
   * Génère les données FAQ standard pour les prestataires
   */
  static generatePrestataireStandardFAQ(): FAQPrestataireItem[] {
    return this.FAQ_STANDARD_DATA.prestataire.map(item => ({
      question: item.question,
      reponse: item.reponse,
      categorie: item.categorie
    }));
  }

  /**
   * Génère les données FAQ standard pour les questions générales
   */
  static generateGeneralStandardFAQ(): FAQItem[] {
    return this.FAQ_STANDARD_DATA.general.map(item => ({
      question: item.question,
      reponse: item.reponse,
      categorie: item.categorie
    }));
  }

  /**
   * Méthode générique pour générer les FAQ avec ordre et ID
   */
  private static generateFAQWithOrder<T extends { id: string; ordre: number; question: string; reponse: string; categorie: string }>(
    faqData: FAQDataItem[], 
    prefix: string
  ): T[] {
    let ordre = 1;
    const result: T[] = [];

    for (const item of faqData) {
      const categorieKey = this.getCategorieKey(item.categorie);
      const id = `${prefix}-${categorieKey}-${ordre}`;
      
      result.push({
        ...item,
        id,
        ordre
      } as T);
      
      ordre++;
    }

    return result;
  }

  /**
   * Génère une clé pour la catégorie (utilisée dans l'ID)
   */
  private static getCategorieKey(categorie: string): string {
    const categorieMap: { [key: string]: string } = {
      'Inscription / Connexion': 'inscription',
      'Consulter des prestations': 'consulter',
      'Réserver une prestation': 'reserver',
      'Suivi de la prestation': 'suivi',
      'Messagerie': 'messagerie',
      'Profil personnel': 'profil',
      'Gestion des services': 'gestion',
      'Création / Gestion des Services': 'creation',
      'Profil Prestataire': 'profil'
    };

    return categorieMap[categorie] || categorie.toLowerCase().replace(/\s+/g, '-');
  }
}
