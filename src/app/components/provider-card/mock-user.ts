import { User, UserRole } from '../../models/User';

export const MOCK_USER = new User({
  idUser: 1,
  firstName: 'Ashfak',
  lastName: 'Sayem',
  email: 'contact@servicepro.fr',
  password: '',
  role: UserRole.PROVIDER,
  phoneNumber: '+1 234 567 890',
  address: '12 rue de Paris',
  city: 'Paris, France',
  postalCode: 75001,
  siretSiren: '123 456 789 00012',
  companyName: 'ServicePro',
  rcNumber: 'RC123456789',
  kbisUrl: 'https://example.com/kbis.pdf',
  autoEntrepreneurAttestationUrl: 'https://example.com/attestation.pdf',
  insuranceCertificateUrl: 'https://example.com/assurance.pdf',
  description:'description succinte du prestataire vraiment très très très enrichissante. Il adore sa vie et les gens autour de lui'
});

export const LOGGED_USER = new User({
  idUser: 2,
  firstName: 'Claire',
  lastName: 'Durand',
  email: 'claire.durand@email.com',
  password: '',
  role: UserRole.ADMIN,
  phoneNumber: '+33 6 12 34 56 78',
  address: '24 avenue de Lyon',
  city: 'Lyon, France',
  postalCode: 69000,
  siretSiren: '',
  companyName: '',
  rcNumber: '',
  kbisUrl: '',
  autoEntrepreneurAttestationUrl: '',
  insuranceCertificateUrl: '',
  description: 'Cliente fidèle, passionnée de déco et de rénovation.'
});

export const MOCK_USER_2 = new User({
  idUser: 3,
  firstName: 'Marie',
  lastName: 'Dubois',
  email: 'marie.dubois@email.com',
  password: '',
  role: UserRole.PROVIDER,
  phoneNumber: '+33 7 12 34 56 78',
  address: '8 rue des Lilas',
  city: 'Bordeaux, France',
  postalCode: 33000,
  siretSiren: '987 654 321 00021',
  companyName: 'JardiBricole',
  rcNumber: 'RC987654321',
  kbisUrl: 'https://example.com/kbis2.pdf',
  autoEntrepreneurAttestationUrl: 'https://example.com/attestation2.pdf',
  insuranceCertificateUrl: 'https://example.com/assurance2.pdf',
  description: 'Prestataire passionnée par le jardinage et le bricolage, toujours souriante.'
});

export const MOCK_USER_3 = new User({
  idUser: 5,
  firstName: 'Ashfak',
  lastName: 'Sayem',
  email: 'contact@servicepro.fr',
  password: '',
  role: UserRole.PROVIDER,
  phoneNumber: '+1 234 567 890',
  address: '12 rue de Paris',
  city: 'Lyon, France',
  postalCode: 69000,
  siretSiren: '123 456 789 00012',
  companyName: 'ServicePro',
  rcNumber: 'RC123456789',
  kbisUrl: 'https://example.com/kbis.pdf',
  autoEntrepreneurAttestationUrl: 'https://example.com/attestation.pdf',
  insuranceCertificateUrl: 'https://example.com/assurance.pdf',
  description:'description succinte du prestataire vraiment très très très enrichissante. Il adore sa vie et les gens autour de lui'
});

/**
 * Tableau de prestataires mockés pour affichage.
 */
export const PROVIDERS_MOCK: User[] = [MOCK_USER, MOCK_USER_2, MOCK_USER_3]; 