import { Injectable } from '@angular/core';
import { FAQItem } from '../../models/FAQ';
import { BaseFAQService } from './base-faq.service';

@Injectable({
  providedIn: 'root'
})
export class FAQGeneralService extends BaseFAQService<FAQItem> {
  
  protected faqItems: FAQItem[] = [
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
  ];

  constructor() {
    super();
  }
}
