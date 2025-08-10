export class HomeFeature {
  /** Type d'icône : Material Design ou icône personnalisée */
  iconType!: 'material' | 'custom';
  
  /** Nom de l'icône ou chemin vers l'icône personnalisée */
  icon!: string;
  
  /** Titre de la fonctionnalité */
  title!: string;
  
  /** Description de la fonctionnalité */
  desc!: string;
}

export class HomeContent {
  /** Type d'icône principale : Material Design ou icône personnalisée */
  iconType!: 'material' | 'custom';
  
  /** Icône principale de la page d'accueil */
  mainIcon!: string;
  
  /** Titre principal de la page d'accueil */
  title!: string;
  
  /** Sous-titre de la page d'accueil */
  subtitle!: string;
  
  /** Texte d'introduction */
  introText!: string;
  
  /** Texte du bouton pour les prestataires */
  btnPrestataire!: string;
  
  /** Texte du bouton pour les particuliers */
  btnParticulier!: string;
  
  /** Texte du bouton de connexion */
  btnConnexion!: string;
  
  /** Titre de la section des fonctionnalités */
  featuresTitle!: string;
  
  /** Liste des fonctionnalités à afficher */
  features!: HomeFeature[];
}