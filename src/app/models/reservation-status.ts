export enum ReservationStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  CLOSED = 'CLOSED',
  CANCELLED = 'CANCELLED',
}

const STATUS_LABELS: Record<string, string> = {
  [ReservationStatus.PENDING]: 'En attente',
  [ReservationStatus.IN_PROGRESS]: 'En cours',
  [ReservationStatus.CLOSED]: 'Clôturée',
  [ReservationStatus.CANCELLED]: 'Annulée',
};

const STATUS_COLORS_LIST: Record<string, string> = {
  [ReservationStatus.PENDING]: '#f39c12',
  [ReservationStatus.IN_PROGRESS]: '#27ae60',
  [ReservationStatus.CLOSED]: '#3498db',
  [ReservationStatus.CANCELLED]: '#e74c3c',
};

export function mapStatusLabel(status: string): string {
  return STATUS_LABELS[status] ?? status;
}

export function mapStatusColor(status: string): string {
  return STATUS_COLORS_LIST[status] ?? '#95a5a6';
}


