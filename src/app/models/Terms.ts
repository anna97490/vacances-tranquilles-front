export class TermsSection {
  /** Titre de la section des conditions d'utilisation */
  title!: string;
  
  /** Contenu de la section sous forme de paragraphes */
  content!: { text: string }[];
}

export class TermsContent {
  /** Titre principal des conditions d'utilisation */
  title!: string;
  
  /** Date de dernière mise à jour des conditions */
  date!: string;
  
  /** Liste des sections des conditions d'utilisation */
  sections!: TermsSection[];
}