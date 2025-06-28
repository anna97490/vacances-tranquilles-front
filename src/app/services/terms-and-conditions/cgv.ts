/**
 * Conditions Générales de Vente (CGV) pour la plateforme Vacances Tranquilles
 * Ces conditions régissent les relations entre les utilisateurs particuliers et les prestataires de services via la plateforme.
 */
export interface TermsSection {
  title: string;
  content: string | string[];
}

/**
 * Interface représentant le contenu des Conditions Générales de Vente (CGV)
 * de la plateforme Vacances Tranquilles.
 */
export interface TermsContent {
  title: string;
  date: string;
  sections: TermsSection[];
}

/**
 * Contenu des Conditions Générales de Vente (CGV) de la plateforme Vacances Tranquilles.
 * Il s'agit d'un objet conforme à l'interface TermsContent, structuré en sections.
 */
export const CGV_DATA: TermsContent = {
  title: "CONDITIONS GÉNÉRALES DE VENTE",
  date: "Juin 2025",
  sections: [
    {
      title: "Article 1 – Objet",
      content: [
        "Les présentes Conditions Générales de Vente (CGV) ont pour objet de définir les modalités de réservation, paiement, annulation, facturation et gestion des litiges pour les prestations proposées sur la plateforme Vacances Tranquilles, accessible à l'adresse : https://vacancestranquilles.fr."
      ]
    },
    {
      title: "Article 2 – Réservation et engagement contractuel",
      content: [
        "Toute réservation d'une prestation via la plateforme implique l'acceptation pleine et entière des présentes CGV par le particulier.",
        "La validation du paiement formalise le contrat entre le particulier et le prestataire.",
        "La plateforme agit en tant qu'intermédiaire technique et n'est pas partie au contrat d'exécution de la prestation."
      ]
    },
    {
      title: "Article 3 – Prix et modalités de paiement",
      content: [
        "Les tarifs des prestations sont librement fixés par les prestataires.",
        "Paiement en ligne :",
        "• Le règlement s'effectue via Stripe ou tout autre prestataire de paiement agréé.",
        "• Les fonds sont bloqués par Stripe jusqu'à confirmation de la réalisation de la prestation.",
        "• Une fois la prestation marquée comme « effectuée » (via statut validé ou justificatif photo), le paiement est débloqué au prestataire, déduction faite des commissions de la plateforme.",
        "Paiement par CESU :",
        "• Le particulier s'engage à transmettre les titres CESU (physiques ou e-CESU) directement au prestataire.",
        "• La plateforme ne gère pas ces flux, mais peut faciliter la déclaration et le suivi administratif.",
        "• En cas d'annulation après transmission, le remboursement est traité hors plateforme, directement entre le particulier et le prestataire.",
        "Commission plateforme : La plateforme perçoit une commission incluse dans le prix affiché au particulier."
      ]
    },
    {
      title: "Article 4 – Facturation",
      content: [
        "Factures automatiques générées pour chaque réservation payée via Stripe.",
        "Les particuliers peuvent télécharger leurs justificatifs depuis leur espace personnel.",
        "Les prestataires disposent d'un tableau de bord des revenus et peuvent télécharger leurs factures mensuelles consolidées.",
        "Les documents sont conservés pendant 5 ans, conformément aux obligations comptables."
      ]
    },
    {
      title: "Article 5 – Annulation et remboursement",
      content: [
        "Le particulier peut annuler une prestation, sous réserve des délais suivants :",
        "• Plus de 96h avant la prestation : remboursement de 100%",
        "• Entre 96h et 48h avant la prestation : remboursement de 50%",
        "• Moins de 48h avant la prestation : aucun remboursement",
        "La plateforme transmet automatiquement la demande à Stripe pour traitement.",
        "Les délais bancaires de remboursement varient de 5 à 10 jours ouvrés.",
        "Cas CESU : Aucun remboursement possible après transmission des titres au prestataire."
      ]
    },
    {
      title: "Article 6 – Retrait des fonds par le prestataire",
      content: [
        "Le prestataire peut demander le virement de ses gains dès que la prestation est confirmée.",
        "Modes de virement possibles : standard ou instantané via Stripe, sous réserve de validation des informations bancaires (RIB).",
        "En cas de paiement par CESU, le retrait se fait directement via le site officiel CESU, sans intervention de la plateforme."
      ]
    },
    {
      title: "Article 7 – Modification ou remplacement",
      content: [
        "Le particulier peut modifier une réservation tant que la prestation n'a pas été réalisée.",
        "En cas d'annulation par le prestataire, un remplaçant peut être proposé par la plateforme.",
        "Le particulier peut accepter ou refuser la substitution."
      ]
    },
    {
      title: "Article 8 – Litiges et responsabilités",
      content: [
        "En cas de litige entre utilisateurs :",
        "• La plateforme agit en tant que médiateur technique.",
        "• Sa responsabilité est limitée à l'hébergement des contenus, à la mise en relation et au traitement des paiements.",
        "• La plateforme ne saurait être tenue responsable de l'exécution, de la qualité ou du résultat des prestations réalisées par les prestataires."
      ]
    },
    {
      title: "Article 9 – Suspension ou exclusion d'un utilisateur",
      content: [
        "Tout comportement abusif, tel que :",
        "• Multiples annulations injustifiées",
        "• Fausses déclarations",
        "• Fraude liée au CESU",
        "• Non-respect des CGV ou CGU",
        "...peut entraîner :",
        "• La suspension temporaire ou définitive du compte",
        "• Le blocage des fonds ou la rétention des versements en cas de manquement grave"
      ]
    },
    {
      title: "Article 10 – Données personnelles et conformité RGPD",
      content: [
        "Les données personnelles collectées dans le cadre des transactions sont traitées conformément au RGPD (UE 2016/679).",
        "Elles sont nécessaires à la gestion des réservations, paiements, facturations et litiges.",
        "Les utilisateurs disposent des droits suivants : accès, rectification, opposition, suppression, limitation, portabilité.",
        "Pour exercer ces droits : support@vacancestranquilles.fr.",
        "La plateforme met en œuvre des mesures de sécurité appropriées pour protéger les données."
      ]
    },
    {
      title: "Article 11 – Révision des CGV",
      content: [
        "La plateforme se réserve le droit de modifier les présentes CGV à tout moment.",
        "Les utilisateurs seront informés par email ou via leur tableau de bord personnel.",
        "Les nouvelles CGV seront considérées comme acceptées pour toute nouvelle réservation postérieure à leur publication."
      ]
    }
  ]
};

// Pour garder la compatibilité avec l'ancien code
export const CGV = CGV_DATA;