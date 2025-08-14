import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ConversationsService, ConversationSummaryDTO, ReservationResponseDTO } from './conversations.service';
import { EnvService } from '../env/env.service';
import { Message } from '../../models/Message';

describe('ConversationsService', () => {
  let service: ConversationsService;
  let httpMock: HttpTestingController;
  let envServiceMock: jasmine.SpyObj<EnvService>;

  const mockApiUrl = 'http://localhost:8080/api';

  beforeEach(() => {
    envServiceMock = jasmine.createSpyObj<EnvService>('EnvService', [], {
      apiUrl: mockApiUrl
    });

    TestBed.configureTestingModule({
      providers: [
        ConversationsService,
        { provide: EnvService, useValue: envServiceMock },
        provideHttpClient(withFetch()),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(ConversationsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getConversationWithMessages', () => {
    it('should fetch messages and convert them to Message models', () => {
      const conversationId = 1;
      const mockMessages = [
        {
          id: 1,
          senderName: 'John Doe',
          myName: 'Jane Smith',
          content: 'Hello',
          sentAt: new Date('2024-01-15T10:00:00'),
          isRead: true
        },
        {
          id: 2,
          senderName: 'Jane Smith',
          myName: 'John Doe',
          content: 'Hi there',
          sentAt: new Date('2024-01-15T10:05:00'),
          isRead: false
        }
      ];

      service.getConversationWithMessages(conversationId).subscribe(messages => {
        expect(messages.length).toBe(2);
        expect(messages[0]).toBeInstanceOf(Message);
        expect(messages[0].id).toBe(1);
        expect(messages[0].content).toBe('Hello');
        expect(messages[0].senderName).toBe('John Doe');
        expect(messages[1].id).toBe(2);
        expect(messages[1].content).toBe('Hi there');
        expect(messages[1].senderName).toBe('Jane Smith');
      });

      const req = httpMock.expectOne(`${mockApiUrl}/messages/conversation/${conversationId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockMessages);
    });

    it('should handle empty messages array', () => {
      const conversationId = 1;

      service.getConversationWithMessages(conversationId).subscribe(messages => {
        expect(messages.length).toBe(0);
      });

      const req = httpMock.expectOne(`${mockApiUrl}/messages/conversation/${conversationId}`);
      req.flush([]);
    });
  });

  describe('sendMessage', () => {
    it('should send message and return Message model', () => {
      const messageData = {
        conversationId: 1,
        content: 'New message',
        sentAt: new Date('2024-01-15T10:00:00')
      };

      const mockResponse = {
        id: 3,
        conversationId: 1,
        senderId: 1,
        content: 'New message',
        sentAt: new Date('2024-01-15T10:00:00')
      };

      service.sendMessage(messageData).subscribe(message => {
        expect(message).toBeInstanceOf(Message);
        expect(message.id).toBe(3);
        expect(message.content).toBe('New message');
        expect(message.conversationId).toBe(1);
      });

      const req = httpMock.expectOne(`${mockApiUrl}/messages`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(messageData);
      req.flush(mockResponse);
    });
  });

  describe('updateMessage', () => {
    it('should update message and return updated Message model', () => {
      const messageId = 1;
      const messageData = {
        conversationId: 1,
        content: 'Updated message',
        sentAt: new Date('2024-01-15T10:00:00')
      };

      const mockResponse = {
        id: 1,
        conversationId: 1,
        senderId: 1,
        content: 'Updated message',
        sentAt: new Date('2024-01-15T10:00:00')
      };

      service.updateMessage(messageId, messageData).subscribe(message => {
        expect(message).toBeInstanceOf(Message);
        expect(message.id).toBe(1);
        expect(message.content).toBe('Updated message');
      });

      const req = httpMock.expectOne(`${mockApiUrl}/messages/${messageId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(messageData);
      req.flush(mockResponse);
    });
  });

  describe('createConversation', () => {
    it('should create conversation and return ConversationDTO', () => {
      const reservationId = 1;
      const mockResponse = {
        id: 1,
        user1Id: 1,
        user2Id: 2,
        createdAt: '2024-01-15T10:00:00'
      };

      service.createConversation(reservationId).subscribe(conversation => {
        expect(conversation.id).toBe(1);
        expect(conversation.user1Id).toBe(1);
        expect(conversation.user2Id).toBe(2);
        expect(conversation.createdAt).toBe('2024-01-15T10:00:00');
      });

      const req = httpMock.expectOne(`${mockApiUrl}/conversations`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ reservationId });
      req.flush(mockResponse);
    });
  });

  describe('getConversations', () => {
    it('should fetch conversations list', () => {
      const mockConversations: ConversationSummaryDTO[] = [
        {
          conversationId: 1,
          otherUserName: 'John Doe',
          serviceTitle: 'Service 1'
        },
        {
          conversationId: 2,
          otherUserName: 'Jane Smith',
          serviceTitle: 'Service 2'
        }
      ];

      service.getConversations().subscribe(conversations => {
        expect(conversations.length).toBe(2);
        expect(conversations[0].conversationId).toBe(1);
        expect(conversations[0].otherUserName).toBe('John Doe');
        expect(conversations[1].conversationId).toBe(2);
        expect(conversations[1].otherUserName).toBe('Jane Smith');
      });

      const req = httpMock.expectOne(`${mockApiUrl}/conversations`);
      expect(req.request.method).toBe('GET');
      req.flush(mockConversations);
    });

    it('should handle empty conversations list', () => {
      service.getConversations().subscribe(conversations => {
        expect(conversations.length).toBe(0);
      });

      const req = httpMock.expectOne(`${mockApiUrl}/conversations`);
      req.flush([]);
    });
  });

  describe('getReservationByConversationId', () => {
    it('should fetch reservation by conversation ID', () => {
      const conversationId = 1;
      const mockReservation: ReservationResponseDTO = {
        id: 1,
        status: 'PENDING'
      };

      service.getReservationByConversationId(conversationId).subscribe(reservation => {
        expect(reservation.id).toBe(1);
        expect(reservation.status).toBe('PENDING');
      });

      const req = httpMock.expectOne(`${mockApiUrl}/conversations/${conversationId}/reservation`);
      expect(req.request.method).toBe('GET');
      req.flush(mockReservation);
    });
  });

  describe('error handling', () => {
    it('should handle HTTP errors in getConversationWithMessages', () => {
      const conversationId = 1;

      service.getConversationWithMessages(conversationId).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${mockApiUrl}/messages/conversation/${conversationId}`);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });

    it('should handle HTTP errors in sendMessage', () => {
      const messageData = {
        conversationId: 1,
        content: 'Test message',
        sentAt: new Date()
      };

      service.sendMessage(messageData).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(`${mockApiUrl}/messages`);
      req.flush('Bad request', { status: 400, statusText: 'Bad Request' });
    });
  });
});
