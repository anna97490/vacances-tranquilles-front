import { User, UserRole } from '../../services/interfaces/interfaceUser';

export const MOCK_USER: User = {
  idUser: 1,
  profilePicture: 'https://randomuser.me/api/portraits/men/32.jpg',
  firstName: 'Ashfak',
  lastName: 'Sayem',
  email: 'contact@servicepro.fr',
  password: '', // Jamais utilisé côté front pour l'affichage
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
};

export const LOGGED_USER: User = {
  idUser: 2,
  profilePicture: 'https://randomuser.me/api/portraits/women/44.jpg',
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
}; 