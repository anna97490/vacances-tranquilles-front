export interface TermsSection {
  title: string;
  content: { text: string }[];
}

export interface TermsContent {
  title: string;
  date: string;
  sections: TermsSection[];
}

// Exportez un objet concret qui correspond à l'interface TermsContent
export const CGU_DATA: TermsContent = {
  title: "CONDITIONS GÉNÉRALES D'UTILISATION",
  date: "Juin 2025",
  sections: [
    {
      title: "1. Objet",
      content: [
        {
          text: "Les présentes Conditions Générales d'Utilisation (CGU) définissent les modalités d'accès et d'utilisation de la plateforme Vacances Tranquilles, accessible via le site internet et ses interfaces mobiles."
        },
        {
          text: "Elles régissent les relations entre la société éditrice (ci-après « la Plateforme ») et tout utilisateur particulier, prestataire ou administrateur (ci-après « l'Utilisateur »)."
        },
        {
          text: "L'inscription et l'utilisation de la plateforme impliquent l'acceptation pleine, entière et sans réserve des présentes CGU."
        }
      ]
    },
    {
      title: "2. Accès à la plateforme",
      content: [
        {
          text:"L'accès à la plateforme est réservé aux utilisateurs inscrits. Trois types de profils sont proposés :"
        },
        {
          text:"• Particulier : personne physique recherchant une prestation."
        },
        {
          text:"• Prestataire : personne physique ou morale proposant des services."
        },
        {
          text:"• Administrateur : rôle attribué par l'éditeur pour gérer les contenus et modérer la plateforme."
        },
        {
          text:"Chaque utilisateur s'engage à fournir des informations exactes, complètes et actualisées lors de l'inscription."
        }
      ]
    },
    {
      title: "3. Fonctionnalités proposées",
      content: [
        {
          text:"Selon leur profil, les utilisateurs ont accès aux fonctionnalités suivantes :"
        },
        {
          text:"• Recherche et réservation de prestations géolocalisées"
        },
        {
          text:"• Paiement sécurisé via Stripe ou tout autre prestataire de paiement agréé"
        },
        {
          text:"• Messagerie interne"
        },
        {
          text:"• Espace personnel avec historique des actions"
        },
        {
          text:"• Ajout et gestion de services (pour les prestataires)"
        },
        {
          text:"• Système de notation et d'avis"
        },
        {
          text:"• Support client"
        },
        {
          text:"• Notifications par email"
        },
        {
          text:"• Gestion de statut de réservation"
        },
        {
          text:"• Outils de contestation et gestion des prestations"
        }
      ]
    },
    {
      title: "4. Engagements de l'utilisateur",
      content: [
        {
          text:"L'Utilisateur s'engage à :"
        },
        {
          text:"• Utiliser la Plateforme dans un cadre strictement légal et conforme à sa destination."
        },
        {
          text:"• Ne pas publier de contenu illicite, injurieux, diffamatoire ou portant atteinte aux droits d'autrui."
        },
        {
          text:"• Maintenir à jour ses informations personnelles et professionnelles."
        },
        {
          text:"• Respecter les présentes CGU, ainsi que les éventuelles Conditions Générales de Vente (CGV) applicables."
        }
      ]
    },
    {
      title: "5. Acceptation des CGU",
      content: [
        {
          text:"Lors de l'inscription et avant toute activation de compte, l'utilisateur doit lire et accepter les présentes CGU, via une case à cocher obligatoire."
        },
        {
          text:"Sans acceptation, aucun accès aux fonctionnalités de la plateforme ne sera autorisé."
        }
      ]
    },
    {
      title: "6. Suspension ou suppression du compte",
      content: [
        {
          text:"La Plateforme se réserve le droit de suspendre temporairement ou définitivement tout compte utilisateur :"
        },
        {
          text:"• En cas de comportement frauduleux ou non conforme aux CGU"
        },
        {
          text:"• En cas de non-respect répété des présentes conditions"
        },
        {
          text:"• Après signalement et vérification par l'administrateur"
        },
        {
          text:"• En cas de demande légale ou administrative"
        }
      ]
    },
    {
      title: "7. Données personnelles et RGPD",
      content: [
        {
          text:"7.1 Finalité du traitement"
        },
        {
          text:"Les données personnelles collectées via la Plateforme sont traitées dans le respect du Règlement Général sur la Protection des Données (RGPD - UE 2016/679), uniquement pour :"
        },
        {
          text:"• La gestion des comptes utilisateurs"
        },
        {
          text:"• La mise en relation entre particuliers et prestataires"
        },
        {
          text:"• Le suivi des prestations et des paiements"
        },
        {
          text:"• La gestion de la messagerie interne"
        },
        {
          text:"• L'envoi de notifications et d'informations liées au service"
        },
        {
          text:"7.2 Responsables du traitement"
        },
        {
          text:"Le responsable du traitement des données est la société éditrice de la Plateforme."
        },
        
        {
          text:"7.3 Destinataires des données"
        },
        {
          text:"Les données peuvent être transmises aux prestataires techniques de la Plateforme (exemple : Stripe pour les paiements), dans la seule limite nécessaire à l'exécution des services."
        },
        
        {
          text:"7.4 Droits des utilisateurs"
        },
        {
          text:"Conformément au RGPD, chaque utilisateur dispose des droits suivants sur ses données personnelles :"
        },
        {
          text:"• Droit d'accès"
        },
        {
          text:"• Droit de rectification"
        },
        {
          text:"• Droit d'opposition"
        },
        {
          text:"• Droit à l'effacement (droit à l'oubli)"
        },
        {
          text:"• Droit à la portabilité"
        },
        {
          text:"• Droit à la limitation du traitement"
        },
        {
          text:"Ces droits peuvent être exercés directement via l'espace personnel, ou sur demande écrite adressée au support à l'adresse ci-dessous."
        },
        {
          text:"7.5 Conservation des données"
        },
        {
          text:"Les données personnelles sont conservées pendant la durée d'utilisation du service, puis supprimées ou anonymisées à l'issue des durées légales de conservation."
        },
        
        {
          text:"7.6 Cookies et traceurs"
        },
        {
          text:"La Plateforme utilise des cookies strictement nécessaires au fonctionnement du site. L'utilisateur est informé et peut gérer ses préférences lors de sa première connexion."
        },
        
        {
          text:"7.7 Sécurité"
        },
        {
          text:"La Plateforme met en œuvre des mesures de sécurité techniques et organisationnelles adaptées afin de protéger les données personnelles contre tout accès non autorisé, perte ou destruction."
        }
      ]
    },
    {
      title: "8. Responsabilités",
      content: [
        {
          text:"La Plateforme agit uniquement en qualité d'intermédiaire technique entre les particuliers et les prestataires."
        },
        {
          text:"Elle ne saurait être tenue responsable :"
        },
        {
          text:"• Des litiges commerciaux entre utilisateurs"
        },
        {
          text:"• Des dommages résultant de l'exécution ou de l'absence d'exécution d'une prestation"
        },
        {
          text:"• De la qualité des prestations réalisées par les prestataires"
        },
        {
          text:"Sa responsabilité ne pourra être engagée qu'en cas de manquement avéré à ses obligations légales ou de modération."
        }
      ]
    },
    {
      title: "9. Modification des CGU",
      content: [
        {
          text:"La Plateforme se réserve le droit de modifier à tout moment les présentes CGU."
        },
        {
          text:"Les utilisateurs seront informés par email ou notification interne."
        },
        {
          text:"En cas de refus des nouvelles CGU, l'utilisateur pourra demander la suppression de son compte."
        }
      ]
    },
    {
      title: "10. Contact",
      content: [
        {
          text:"Pour toute question relative aux présentes CGU ou à l'exercice de vos droits RGPD :"
        },
        {
          text:"vacancestranquilles@outlook.fr"
        }
      ]
    }
  ]
};

// Pour garder la compatibilité avec l'ancien code
export const CGU = CGU_DATA;