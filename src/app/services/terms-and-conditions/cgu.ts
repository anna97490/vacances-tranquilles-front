export interface TermsSection {
  title: string;
  content: string | string[];
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
        "Les présentes Conditions Générales d'Utilisation (CGU) définissent les modalités d'accès et d'utilisation de la plateforme Vacances Tranquilles, accessible via le site internet et ses interfaces mobiles.",
        "Elles régissent les relations entre la société éditrice (ci-après « la Plateforme ») et tout utilisateur particulier, prestataire ou administrateur (ci-après « l'Utilisateur »).",
        "L'inscription et l'utilisation de la plateforme impliquent l'acceptation pleine, entière et sans réserve des présentes CGU."
      ]
    },
    {
      title: "2. Accès à la plateforme",
      content: [
        "L'accès à la plateforme est réservé aux utilisateurs inscrits. Trois types de profils sont proposés :",
        "• Particulier : personne physique recherchant une prestation.",
        "• Prestataire : personne physique ou morale proposant des services.",
        "• Administrateur : rôle attribué par l'éditeur pour gérer les contenus et modérer la plateforme.",
        "Chaque utilisateur s'engage à fournir des informations exactes, complètes et actualisées lors de l'inscription."
      ]
    },
    {
      title: "3. Fonctionnalités proposées",
      content: [
        "Selon leur profil, les utilisateurs ont accès aux fonctionnalités suivantes :",
        "• Recherche et réservation de prestations géolocalisées",
        "• Paiement sécurisé via Stripe ou tout autre prestataire de paiement agréé",
        "• Messagerie interne",
        "• Espace personnel avec historique des actions",
        "• Ajout et gestion de services (pour les prestataires)",
        "• Système de notation et d'avis",
        "• Support client",
        "• Notifications par email",
        "• Gestion de statut de réservation",
        "• Outils de contestation et gestion des prestations"
      ]
    },
    {
      title: "4. Engagements de l'utilisateur",
      content: [
        "L'Utilisateur s'engage à :",
        "• Utiliser la Plateforme dans un cadre strictement légal et conforme à sa destination.",
        "• Ne pas publier de contenu illicite, injurieux, diffamatoire ou portant atteinte aux droits d'autrui.",
        "• Maintenir à jour ses informations personnelles et professionnelles.",
        "• Respecter les présentes CGU, ainsi que les éventuelles Conditions Générales de Vente (CGV) applicables."
      ]
    },
    {
      title: "5. Acceptation des CGU",
      content: [
        "Lors de l'inscription et avant toute activation de compte, l'utilisateur doit lire et accepter les présentes CGU, via une case à cocher obligatoire.",
        "Sans acceptation, aucun accès aux fonctionnalités de la plateforme ne sera autorisé."
      ]
    },
    {
      title: "6. Suspension ou suppression du compte",
      content: [
        "La Plateforme se réserve le droit de suspendre temporairement ou définitivement tout compte utilisateur :",
        "• En cas de comportement frauduleux ou non conforme aux CGU",
        "• En cas de non-respect répété des présentes conditions",
        "• Après signalement et vérification par l'administrateur",
        "• En cas de demande légale ou administrative"
      ]
    },
    {
      title: "7. Données personnelles et RGPD",
      content: [
        "7.1 Finalité du traitement",
        "Les données personnelles collectées via la Plateforme sont traitées dans le respect du Règlement Général sur la Protection des Données (RGPD - UE 2016/679), uniquement pour :",
        "• La gestion des comptes utilisateurs",
        "• La mise en relation entre particuliers et prestataires",
        "• Le suivi des prestations et des paiements",
        "• La gestion de la messagerie interne",
        "• L'envoi de notifications et d'informations liées au service",
        
        "7.2 Responsables du traitement",
        "Le responsable du traitement des données est la société éditrice de la Plateforme.",
        
        "7.3 Destinataires des données",
        "Les données peuvent être transmises aux prestataires techniques de la Plateforme (exemple : Stripe pour les paiements), dans la seule limite nécessaire à l'exécution des services.",
        
        "7.4 Droits des utilisateurs",
        "Conformément au RGPD, chaque utilisateur dispose des droits suivants sur ses données personnelles :",
        "• Droit d'accès",
        "• Droit de rectification",
        "• Droit d'opposition",
        "• Droit à l'effacement (droit à l'oubli)",
        "• Droit à la portabilité",
        "• Droit à la limitation du traitement",
        "Ces droits peuvent être exercés directement via l'espace personnel, ou sur demande écrite adressée au support à l'adresse ci-dessous.",
        
        "7.5 Conservation des données",
        "Les données personnelles sont conservées pendant la durée d'utilisation du service, puis supprimées ou anonymisées à l'issue des durées légales de conservation.",
        
        "7.6 Cookies et traceurs",
        "La Plateforme utilise des cookies strictement nécessaires au fonctionnement du site. L'utilisateur est informé et peut gérer ses préférences lors de sa première connexion.",
        
        "7.7 Sécurité",
        "La Plateforme met en œuvre des mesures de sécurité techniques et organisationnelles adaptées afin de protéger les données personnelles contre tout accès non autorisé, perte ou destruction."
      ]
    },
    {
      title: "8. Responsabilités",
      content: [
        "La Plateforme agit uniquement en qualité d'intermédiaire technique entre les particuliers et les prestataires.",
        "Elle ne saurait être tenue responsable :",
        "• Des litiges commerciaux entre utilisateurs",
        "• Des dommages résultant de l'exécution ou de l'absence d'exécution d'une prestation",
        "• De la qualité des prestations réalisées par les prestataires",
        "Sa responsabilité ne pourra être engagée qu'en cas de manquement avéré à ses obligations légales ou de modération."
      ]
    },
    {
      title: "9. Modification des CGU",
      content: [
        "La Plateforme se réserve le droit de modifier à tout moment les présentes CGU.",
        "Les utilisateurs seront informés par email ou notification interne.",
        "En cas de refus des nouvelles CGU, l'utilisateur pourra demander la suppression de son compte."
      ]
    },
    {
      title: "10. Contact",
      content: [
        "Pour toute question relative aux présentes CGU ou à l'exercice de vos droits RGPD :",
        "vacancestranquilles@outlook.fr"
      ]
    }
  ]
};

// Pour garder la compatibilité avec l'ancien code
export const CGU = CGU_DATA;