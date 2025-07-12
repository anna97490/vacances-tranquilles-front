/**
 * Mock de services proposés pour affichage dans le profil utilisateur.
 * Peut être utilisé pour des tests ou du développement sans backend.
 *
 * @typedef {Object} Service
 * @property {string} icon - Nom de l'icône Material à afficher.
 * @property {string} title - Titre du service.
 * @property {string} description - Description courte du service.
 * @property {string} price - Prix ou mention (ex: 'Sur devis').
 * @property {string} priceColor - Couleur du prix ('accent' ou 'warn').
 */

/**
 * Liste mock de services proposés.
 * @type {Service[]}
 */
export const MOCK_SERVICES = [
  {
    icon: 'build',
    title: 'Maintenance',
    description: 'Services de maintenance préventive et corrective',
    price: 'À partir de 50€/h',
    priceColor: 'accent'
  },
  {
    icon: 'build',
    title: 'Réparation',
    description: "Réparation d'équipements et installations",
    price: 'Sur devis',
    priceColor: 'warn'
  },
  {
    icon: 'build',
    title: 'Installation',
    description: 'Installation et mise en service',
    price: 'À partir de 80€/h',
    priceColor: 'accent'
  },
    {
    icon: 'build',
    title: 'Maintenance',
    description: 'Services de maintenance préventive et corrective',
    price: 'À partir de 50€/h',
    priceColor: 'accent'
  },
  {
    icon: 'build',
    title: 'Réparation',
    description: "Réparation d'équipements et installations",
    price: 'Sur devis',
    priceColor: 'warn'
  },
  {
    icon: 'build',
    title: 'Installation',
    description: 'Installation et mise en service',
    price: 'À partir de 80€/h',
    priceColor: 'accent'
  },
  
  
]; 