import { Message } from './Message';

describe('Message', () => {
  let message: Message;
  let originalDateNow: () => number;

  beforeEach(() => {
    message = new Message();
    originalDateNow = Date.now;
    spyOn(Date, 'now').and.returnValue(new Date('2024-01-02T12:00:00Z').getTime());
  });

  afterEach(() => {
    Date.now = originalDateNow;
  });

  it('should create an instance', () => {
    expect(message).toBeTruthy();
  });

  it('should initialize with partial data', () => {
    const testData = {
      id: 1,
      conversationId: 123,
      content: 'Test message',
      sentAt: new Date('2024-01-01T10:00:00Z')
    };

    message = new Message(testData);

    expect(message.id).toBe(1);
    expect(message.conversationId).toBe(123);
    expect(message.content).toBe('Test message');
    expect(message.sentAt).toEqual(new Date('2024-01-01T10:00:00Z'));
  });

  it('should convert string date to Date object', () => {
    const testData: any = {
      sentAt: '2024-01-01T10:00:00Z'
    };

    message = new Message(testData);

    expect(message.sentAt).toBeInstanceOf(Date);
    expect(message.sentAt.getTime()).toBe(new Date('2024-01-01T10:00:00Z').getTime());
  });

  describe('isFromCurrentUser', () => {
    it('should return true when message is from current user', () => {
      message.senderId = 123;
      const currentUserId = 123;

      expect(message.isFromCurrentUser(currentUserId)).toBe(true);
    });

    it('should return false when message is not from current user', () => {
      message.senderId = 123;
      const currentUserId = 456;

      expect(message.isFromCurrentUser(currentUserId)).toBe(false);
    });

    it('should return false when senderId is undefined', () => {
      const currentUserId = 123;

      expect(message.isFromCurrentUser(currentUserId)).toBe(false);
    });
  });

  describe('getFormattedDate', () => {
    it('should return empty string when sentAt is not set', () => {
      expect(message.getFormattedDate()).toBe('');
    });

    it('should return time for messages from today', () => {
      message.sentAt = new Date('2024-01-02T10:30:00Z');

      const result = message.getFormattedDate();
      expect(result).toMatch(/^\d{2}:\d{2}$/);
    });

    it('should return "Hier" for messages from yesterday', () => {
      message.sentAt = new Date('2024-01-01T10:30:00Z');

      const result = message.getFormattedDate();
      expect(result).toBe('Hier');
    });

    it('should return full date for older messages', () => {
      message.sentAt = new Date('2023-12-30T10:30:00Z');

      const result = message.getFormattedDate();
      expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    });

    it('should handle string date input', () => {
      message = new Message({ sentAt: '2024-01-02T10:30:00Z' } as any);

      const result = message.getFormattedDate();
      expect(result).toMatch(/^\d{2}:\d{2}$/);
    });
  });
});
