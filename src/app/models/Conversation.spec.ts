import { Conversation } from './Conversation';
import { Message } from './Message';
import { User, UserRole } from './User';

describe('Conversation', () => {
  let conversation: Conversation;
  let user1: User;
  let user2: User;
  let message1: Message;
  let message2: Message;
  let originalDateNow: () => number;

  beforeEach(() => {
    user1 = new User({
      idUser: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      role: UserRole.CLIENT
    });

    user2 = new User({
      idUser: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      role: UserRole.PROVIDER
    });

    message1 = new Message({
      id: 1,
      conversationId: 1,
      senderId: 1,
      content: 'Hello!',
      sentAt: new Date('2024-01-01T10:00:00Z'),
      isRead: true
    });

    message2 = new Message({
      id: 2,
      conversationId: 1,
      senderId: 2,
      content: 'Hi there!',
      sentAt: new Date('2024-01-02T10:05:00Z'),
      isRead: false
    });

    conversation = new Conversation({
      id: 1,
      user1: user1,
      user2: user2,
      createdAt: new Date('2024-01-01T09:00:00Z'),
      messages: [message1, message2]
    });

    originalDateNow = Date.now;
    spyOn(Date, 'now').and.returnValue(new Date('2024-01-02T12:00:00Z').getTime());
  });

  afterEach(() => {
    Date.now = originalDateNow;
  });

  it('should create an instance', () => {
    expect(conversation).toBeTruthy();
  });

  it('should initialize with partial data', () => {
    const testData = {
      id: 123,
      user1: user1,
      user2: user2,
      createdAt: new Date('2024-01-01T10:00:00Z')
    };

    conversation = new Conversation(testData);

    expect(conversation.id).toBe(123);
    expect(conversation.user1).toBe(user1);
    expect(conversation.user2).toBe(user2);
    expect(conversation.createdAt).toEqual(new Date('2024-01-01T10:00:00Z'));
  });

  it('should convert string dates to Date objects', () => {
    const testData: any = {
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-01-01T11:00:00Z'
    };

    conversation = new Conversation(testData);

    expect(conversation.createdAt).toBeInstanceOf(Date);
    expect(conversation.updatedAt).toBeInstanceOf(Date);
  });

  describe('getOtherParticipant', () => {
    it('should return user2 when current user is user1', () => {
      const otherUser = conversation.getOtherParticipant(1);
      expect(otherUser).toBe(user2);
    });

    it('should return user1 when current user is user2', () => {
      const otherUser = conversation.getOtherParticipant(2);
      expect(otherUser).toBe(user1);
    });
  });

  describe('isParticipant', () => {
    it('should return true for user1', () => {
      expect(conversation.isParticipant(1)).toBe(true);
    });

    it('should return true for user2', () => {
      expect(conversation.isParticipant(2)).toBe(true);
    });

    it('should return false for non-participant', () => {
      expect(conversation.isParticipant(999)).toBe(false);
    });
  });

  describe('getLastMessage', () => {
    it('should return the last message when messages exist', () => {
      const lastMessage = conversation.getLastMessage();
      expect(lastMessage).toBe(message2);
    });

    it('should return undefined when no messages exist', () => {
      conversation.messages = [];
      const lastMessage = conversation.getLastMessage();
      expect(lastMessage).toBeUndefined();
    });

    it('should return undefined when messages is undefined', () => {
      conversation.messages = undefined;
      const lastMessage = conversation.getLastMessage();
      expect(lastMessage).toBeUndefined();
    });
  });

  describe('getUnreadMessageCount', () => {
    it('should return correct count of unread messages', () => {
      const unreadCount = conversation.getUnreadMessageCount(1);
      expect(unreadCount).toBe(1);
    });

    it('should return 0 when all messages are read', () => {
      message2.isRead = true;
      const unreadCount = conversation.getUnreadMessageCount(1);
      expect(unreadCount).toBe(0);
    });

    it('should return 0 when no messages exist', () => {
      conversation.messages = [];
      const unreadCount = conversation.getUnreadMessageCount(1);
      expect(unreadCount).toBe(0);
    });

    it('should not count own messages as unread', () => {
      message1.isRead = false;
      const unreadCount = conversation.getUnreadMessageCount(1);
      expect(unreadCount).toBe(1);
    });
  });

  describe('getLastActivityFormatted', () => {
    it('should return formatted date from last message', () => {
      const formattedDate = conversation.getLastActivityFormatted();
      expect(formattedDate).toMatch(/^\d{2}:\d{2}$/);
    });

    it('should return formatted date from updatedAt when no messages', () => {
      conversation.messages = [];
      conversation.updatedAt = new Date('2024-01-01T10:00:00Z');

      const formattedDate = conversation.getLastActivityFormatted();
      expect(formattedDate).toBe('Hier');
    });

    it('should return empty string when no activity', () => {
      conversation.messages = [];
      conversation.updatedAt = undefined;

      const formattedDate = conversation.getLastActivityFormatted();
      expect(formattedDate).toBe('');
    });
  });

  describe('getLastMessagePreview', () => {
    it('should return full message when under 50 characters', () => {
      const preview = conversation.getLastMessagePreview();
      expect(preview).toBe('Hi there!');
    });

    it('should truncate long messages', () => {
      message2.content = 'This is a very long message that should be truncated because it exceeds the 50 character limit';
      const preview = conversation.getLastMessagePreview();
      expect(preview).toBe('This is a very long message that should be truncat...');
    });

    it('should return "Aucun message" when no messages exist', () => {
      conversation.messages = [];
      const preview = conversation.getLastMessagePreview();
      expect(preview).toBe('Aucun message');
    });

    it('should handle empty message content', () => {
      message2.content = '';
      const preview = conversation.getLastMessagePreview();
      expect(preview).toBe('Aucun message');
    });
  });
});
