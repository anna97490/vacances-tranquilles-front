import { Service } from '../../services/interfaces/interfaceService';

export const MOCK_SERVICES: Service[] = [
  {
    id: 1,
    title: 'Maintenance',
    description: 'Services de maintenance préventive et corrective',
    category: 'Maintenance',
    price: 50,
    imageUrl: 'https://cdn-icons-png.flaticon.com/512/1250/1250615.png'
  },
  {
    id: 2,
    title: 'Réparation',
    description: "Réparation d'équipements et installations",
    category: 'Réparation',
    price: 30,
    imageUrl: 'https://cdn-icons-png.flaticon.com/512/1828/1828919.png'
  },
  {
    id: 3,
    title: 'Installation',
    description: 'Installation et mise en service',
    category: 'Installation',
    price: 80,
    imageUrl: 'https://cdn-icons-png.flaticon.com/512/190/190411.png'
  }
]; 