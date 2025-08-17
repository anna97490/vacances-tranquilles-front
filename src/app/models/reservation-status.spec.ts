import { ReservationStatus, mapStatusLabel, mapStatusColor } from './reservation-status';

describe('ReservationStatus', () => {
  describe('Enum values', () => {
    it('should have all expected status values', () => {
      const expectedStatuses = [
        'PENDING',
        'IN_PROGRESS',
        'CLOSED',
        'CANCELLED'
      ];

      const actualStatuses = Object.values(ReservationStatus);

      expect(actualStatuses).toEqual(jasmine.arrayContaining(expectedStatuses));
    });
  });

  describe('mapStatusLabel', () => {
    it('should map PENDING status correctly', () => {
      const result = mapStatusLabel(ReservationStatus.PENDING);
      expect(result).toBe('En attente');
    });

    it('should map IN_PROGRESS status correctly', () => {
      const result = mapStatusLabel(ReservationStatus.IN_PROGRESS);
      expect(result).toBe('En cours');
    });

    it('should map CLOSED status correctly', () => {
      const result = mapStatusLabel(ReservationStatus.CLOSED);
      expect(result).toBe('Clôturée');
    });

    it('should map CANCELLED status correctly', () => {
      const result = mapStatusLabel(ReservationStatus.CANCELLED);
      expect(result).toBe('Annulée');
    });

    it('should handle unknown status', () => {
      const result = mapStatusLabel('UNKNOWN_STATUS' as ReservationStatus);
      expect(result).toBe('UNKNOWN_STATUS');
    });

    it('should handle null and undefined', () => {
      expect(mapStatusLabel(null as any)).toBe(null as any);
      expect(mapStatusLabel(undefined as any)).toBe(undefined as any);
    });

    it('should handle case sensitivity', () => {
      const result = mapStatusLabel('pending' as any);
      expect(result).toBe('pending');
    });
  });

  describe('mapStatusColor', () => {
    it('should map PENDING status to correct color', () => {
      const result = mapStatusColor(ReservationStatus.PENDING);
      expect(result).toBe('#f39c12');
    });

    it('should map IN_PROGRESS status to correct color', () => {
      const result = mapStatusColor(ReservationStatus.IN_PROGRESS);
      expect(result).toBe('#27ae60');
    });

    it('should map CLOSED status to correct color', () => {
      const result = mapStatusColor(ReservationStatus.CLOSED);
      expect(result).toBe('#3498db');
    });

    it('should map CANCELLED status to correct color', () => {
      const result = mapStatusColor(ReservationStatus.CANCELLED);
      expect(result).toBe('#e74c3c');
    });

    it('should handle unknown status with default color', () => {
      const result = mapStatusColor('UNKNOWN_STATUS' as ReservationStatus);
      expect(result).toBe('#95a5a6');
    });

    it('should handle null and undefined', () => {
      expect(mapStatusColor(null as any)).toBe('#95a5a6');
      expect(mapStatusColor(undefined as any)).toBe('#95a5a6');
    });

    it('should handle case sensitivity', () => {
      const result = mapStatusColor('pending' as any);
      expect(result).toBe('#95a5a6');
    });
  });

  describe('Integration tests', () => {
    it('should map all status combinations correctly', () => {
      const statuses = Object.values(ReservationStatus);

      statuses.forEach(status => {
        const label = mapStatusLabel(status);
        const color = mapStatusColor(status);

        expect(label).toBeDefined();
        expect(color).toBeDefined();
        expect(typeof label).toBe('string');
        expect(typeof color).toBe('string');
        expect(color).toMatch(/^#[0-9a-fA-F]{6}$/);
      });
    });

    it('should handle mixed valid and invalid statuses', () => {
      const validStatuses = Object.values(ReservationStatus);
      const invalidStatuses = ['INVALID', 'TEST', 'RANDOM'];

      validStatuses.forEach(status => {
        expect(mapStatusLabel(status)).not.toBe(status);
        expect(mapStatusColor(status)).not.toBe('#95a5a6');
      });

      invalidStatuses.forEach(status => {
        expect(mapStatusLabel(status as any)).toBe(status);
        expect(mapStatusColor(status as any)).toBe('#95a5a6');
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle empty string', () => {
      expect(mapStatusLabel('' as any)).toBe('');
      expect(mapStatusColor('' as any)).toBe('#95a5a6');
    });

    it('should handle very long status strings', () => {
      const longStatus = 'VERY_LONG_STATUS_STRING_THAT_SHOULD_NOT_EXIST_IN_REALITY';
      expect(mapStatusLabel(longStatus as any)).toBe(longStatus);
      expect(mapStatusColor(longStatus as any)).toBe('#95a5a6');
    });

    it('should handle special characters in status', () => {
      const specialStatus = 'STATUS_WITH_SPECIAL_CHARS_!@#$%^&*()';
      expect(mapStatusLabel(specialStatus as any)).toBe(specialStatus);
      expect(mapStatusColor(specialStatus as any)).toBe('#95a5a6');
    });

    it('should handle status with spaces', () => {
      const statusWithSpaces = 'STATUS WITH SPACES';
      expect(mapStatusLabel(statusWithSpaces as any)).toBe(statusWithSpaces);
      expect(mapStatusColor(statusWithSpaces as any)).toBe('#95a5a6');
    });
  });
});
