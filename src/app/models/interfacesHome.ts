export interface HomeFeature {
  iconType: 'material' | 'custom';
  icon: string;
  title: string;
  desc: string;
}

export interface HomeContent {
  iconType: 'material' | 'custom';
  mainIcon: string;
  title: string;
  subtitle: string;
  introText: string;
  btnPrestataire: string;
  btnParticulier: string;
  btnConnexion: string;
  featuresTitle: string;
  features: HomeFeature[];
}