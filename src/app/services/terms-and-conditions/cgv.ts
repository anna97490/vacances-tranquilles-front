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
export const CGV_DATA: TermsContent = {
  title: "CONDITIONS GÉNÉRALES DE VENTE",
  date: "Juin 2025",
  sections: [
    {
      title: "Article 1 – Objet",
      content: [
        {
          text: "Les présentes Conditions Générales de Vente (CGV) ont pour objet de définir les modalités de réservation, paiement, annulation, facturation et gestion des litiges pour les prestations proposées sur la plateforme Vacances Tranquilles, accessible à l'adresse : https://vacancestranquilles.fr."
        }
      ]
    },
    {
      title: "Article 2 – Réservation et engagement contractuel",
      content: [
        {
          text: "Toute réservation d'une prestation via la plateforme implique l'acceptation pleine et entière des présentes CGV par le particulier."
        },
        {
          text: "La validation du paiement formalise le contrat entre le particulier et le prestataire."
        },
        {
          text: "La plateforme agit en tant qu'intermédiaire technique et n'est pas partie au contrat d'exécution de la prestation."
        }
      ]
    },
    {
      title: "Article 3 – Prix et modalités de paiement",
      content: [
        {
          text: "Les tarifs des prestations sont librement fixés par les prestataires."
        },
        {
          text: "Paiement en ligne :"
        },
        {
          text: "• Le règlement s'effectue via Stripe ou tout autre prestataire de paiement agréé."
        },
        {
          text: "• Les fonds sont bloqués par Stripe jusqu'à confirmation de la réalisation de la prestation."
        },
        {
          text: "• Une fois la prestation marquée comme « effectuée » (via statut validé ou justificatif photo), le paiement est débloqué au prestataire, déduction faite des commissions de la plateforme."
        },
        {
          text: "Paiement par CESU :"
        },
        {
          text: "• Le particulier s'engage à transmettre les titres CESU (physiques ou e-CESU) directement au prestataire."
        },
        {
          text: "• La plateforme ne gère pas ces flux, mais peut faciliter la déclaration et le suivi administratif."
        },
        {
          text: "• En cas d'annulation après transmission, le remboursement est traité hors plateforme, directement entre le particulier et le prestataire."
        },
        {
          text: "Commission plateforme : La plateforme perçoit une commission incluse dans le prix affiché au particulier."
        }
      ]
    },
    {
      title: "Article 4 – Facturation",
      content: [
        {
          text: "Factures automatiques générées pour chaque réservation payée via Stripe."
        },
        {
          text: "Les particuliers peuvent télécharger leurs justificatifs depuis leur espace personnel."
        },
        {
          text: "Les prestataires disposent d'un tableau de bord des revenus et peuvent télécharger leurs factures mensuelles consolidées."
        },
        {
          text: "Les documents sont conservés pendant 5 ans, conformément aux obligations comptables."
        }
      ]
    },
    {
      title: "Article 5 – Annulation et remboursement",
      content: [
        {
          text: "Le particulier peut annuler une prestation, sous réserve des délais suivants :"
        },
        {
          text: "• Plus de 96h avant la prestation : remboursement de 100%"
        },
        {
          text: "• Entre 96h et 48h avant la prestation : remboursement de 50%"
        },
        {
          text: "• Moins de 48h avant la prestation : aucun remboursement"
        },
        {
          text: "La plateforme transmet automatiquement la demande à Stripe pour traitement."
        },
        {
          text: "Les délais bancaires de remboursement varient de 5 à 10 jours ouvrés."
        },
        {
          text: "Cas CESU : Aucun remboursement possible après transmission des titres au prestataire."
        }
      ]
    },
    {
      title: "Article 6 – Retrait des fonds par le prestataire",
      content: [
        {
          text: "Le prestataire peut demander le virement de ses gains dès que la prestation est confirmée."
        },
        {
          text: "Modes de virement possibles : standard ou instantané via Stripe, sous réserve de validation des informations bancaires (RIB)."
        },
        {
          text: "En cas de paiement par CESU, le retrait se fait directement via le site officiel CESU, sans intervention de la plateforme."
        }
      ]
    },
    {
      title: "Article 7 – Modification ou remplacement",
      content: [
        {
          text: "Le particulier peut modifier une réservation tant que la prestation n'a pas été réalisée."
        },
        {
          text: "En cas d'annulation par le prestataire, un remplaçant peut être proposé par la plateforme."
        },
        {
          text: "Le particulier peut accepter ou refuser la substitution."
        }
      ]
    },
    {
      title: "Article 8 – Litiges et responsabilités",
      content: [
        {
          text: "En cas de litige entre utilisateurs :"
        },
        {
          text: "• La plateforme agit en tant que médiateur technique."
        },
        {
          text: "• Sa responsabilité est limitée à l'hébergement des contenus, à la mise en relation et au traitement des paiements."
        },
        {
          text: "• La plateforme ne saurait être tenue responsable de l'exécution, de la qualité ou du résultat des prestations réalisées par les prestataires."
        }
      ]
    },
    {
      title: "Article 9 – Suspension ou exclusion d'un utilisateur",
      content: [
        {
          text: "Tout comportement abusif, tel que :"
        },
        {
          text: "• Multiples annulations injustifiées"
        },
        {
          text: "• Fausses déclarations"
        },
        {
          text: "• Fraude liée au CESU"
        },
        {
          text: "• Non-respect des CGV ou CGU"
        },
        {
          text: "...peut entraîner :"
        },
        {
          text: "• La suspension temporaire ou définitive du compte"
        },
        {
          text: "• Le blocage des fonds ou la rétention des versements en cas de manquement grave"
        }
      ]
    },
    {
      title: "Article 10 – Données personnelles et conformité RGPD",
      content: [
        {
          text: "Les données personnelles collectées dans le cadre des transactions sont traitées conformément au RGPD (UE 2016/679)."
        },
        {
          text: "Elles sont nécessaires à la gestion des réservations, paiements, facturations et litiges."
        },
        {
          text: "Les utilisateurs disposent des droits suivants : accès, rectification, opposition, suppression, limitation, portabilité."
        },
        {
          text: "Pour exercer ces droits : support@vacancestranquilles.fr."
        },
        {
          text: "La plateforme met en œuvre des mesures de sécurité appropriées pour protéger les données."
        }
      ]
    },
    {
      title: "Article 11 – Révision des CGV",
      content: [
        {
          text: "La plateforme se réserve le droit de modifier les présentes CGV à tout moment."
        },
        {
          text: "Les utilisateurs seront informés par email ou via leur tableau de bord personnel."
        },
        {
          text: "Les nouvelles CGV seront considérées comme acceptées pour toute nouvelle réservation postérieure à leur publication."
        }
      ]
    }
  ]
};

// Pour garder la compatibilité avec l'ancien code
export const CGV = CGV_DATA;