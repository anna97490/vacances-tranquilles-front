/**
 * Interface représentant une réservation
 */
export interface Reservation {
  id: number;
  status: string;
  reservationDate: string;
  comment?: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  customerId: number;
  providerId: number;
  serviceId: number;
  customer?: User;
  provider?: User;
  service?: Service;
}

/**
 * Interface représentant un utilisateur
 */
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: string;
  userRole: string;
}

/**
 * Interface représentant un service
 */
export interface Service {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  imageUrl?: string;
}

/**
 * Interface pour les filtres de réservation
 */
export interface ReservationFilters {
  search?: string;
  status?: string;
  sortBy?: 'date' | 'price' | 'status';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Interface pour la pagination
 */
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
} 