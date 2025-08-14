import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MessageComponent } from './message.component';
import { ConversationsService } from '../../services/conversation/conversations.service';
import { Message } from '../../models/Message';

describe('MessageComponent', () => {
  let component: MessageComponent;
  let fixture: ComponentFixture<MessageComponent>;
  let conversationsService: jasmine.SpyObj<ConversationsService>;
  let router: jasmine.SpyObj<Router>;
  let activatedRoute: jasmine.SpyObj<ActivatedRoute>;

  const mockMessages: Message[] = [
    new Message({
      id: 1,
      conversationId: 1,
      content: 'Hello',
      sentAt: new Date('2024-01-15T10:00:00Z'),
      senderName: 'John Doe',
      myName: 'Jane Smith',
      isRead: true
    }),
    new Message({
      id: 2,
      conversationId: 1,
      content: 'Hi there',
      sentAt: new Date('2024-01-15T10:05:00Z'),
      senderName: 'Jane Smith',
      myName: 'Jane Smith',
      isRead: false
    })
  ];

  beforeEach(async () => {
    const conversationsServiceSpy = jasmine.createSpyObj('ConversationsService', [
      'getConversationWithMessages',
      'sendMessage',
      'updateMessage',
      'getReservationByConversationId'
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      params: of({ id: '1' })
    });

    await TestBed.configureTestingModule({
      imports: [MessageComponent],
      providers: [
        { provide: ConversationsService, useValue: conversationsServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageComponent);
    component = fixture.componentInstance;
    conversationsService = TestBed.inject(ConversationsService) as jasmine.SpyObj<ConversationsService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    activatedRoute = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load messages and reservation status with valid conversation ID', () => {
      conversationsService.getConversationWithMessages.and.returnValue(of(mockMessages));
      conversationsService.getReservationByConversationId.and.returnValue(of({ id: 1, status: 'PENDING' }));

      component.ngOnInit();

      expect(component.conversationId).toBe(1);
      expect(conversationsService.getConversationWithMessages).toHaveBeenCalledWith(1);
      expect(conversationsService.getReservationByConversationId).toHaveBeenCalledWith(1);
    });

    it('should handle invalid conversation ID', () => {
      Object.defineProperty(activatedRoute, 'params', {
        value: of({ id: 'invalid' })
      });

      component.ngOnInit();

      expect(component.error).toBe('ID de conversation invalide');
      expect(component.showNoConversationsMessage).toBeTrue();
    });
  });

  describe('loadMessages', () => {
    it('should load messages successfully', () => {
      conversationsService.getConversationWithMessages.and.returnValue(of(mockMessages));

      component.loadMessages(1);

      expect(component.loading).toBeFalse();
      expect(conversationsService.getConversationWithMessages).toHaveBeenCalledWith(1);
    });

    it('should set user names from messages', () => {
      conversationsService.getConversationWithMessages.and.returnValue(of(mockMessages));

      component.loadMessages(1);

      expect(component.myName).toBe('Jane Smith');
      expect(component.otherUserName).toBe('John Doe');
    });

    it('should handle 404 error', () => {
      const error = { status: 404 };
      conversationsService.getConversationWithMessages.and.returnValue(throwError(() => error));

      component.loadMessages(1);

      expect(component.showNoConversationsMessage).toBeTrue();
      expect(component.error).toBeNull();
    });

    it('should handle other errors', () => {
      const error = { status: 500 };
      conversationsService.getConversationWithMessages.and.returnValue(throwError(() => error));

      component.loadMessages(1);

      expect(component.error).toBe('Impossible de charger les messages');
    });
  });

  describe('loadReservationStatus', () => {
    it('should load reservation status successfully', () => {
      conversationsService.getReservationByConversationId.and.returnValue(of({ id: 1, status: 'CLOSED' }));

      component.loadReservationStatus(1);

      expect(component.reservationStatus).toBe('CLOSED');
      expect(component.isReservationClosed).toBeTrue();
    });

    it('should handle error gracefully', () => {
      conversationsService.getReservationByConversationId.and.returnValue(throwError(() => 'Error'));

      component.loadReservationStatus(1);

      expect(component.reservationStatus).toBeNull();
    });
  });

  describe('sendMessage', () => {
    beforeEach(() => {
      component.conversationId = 1;
      component.newMessageContent = 'Test message';
      component.isReservationClosed = false;
    });

    it('should send message successfully', () => {
      const savedMessage = new Message({
        id: 3,
        conversationId: 1,
        content: 'Test message',
        sentAt: new Date()
      });
      conversationsService.sendMessage.and.returnValue(of(savedMessage));

      component.sendMessage();

      expect(conversationsService.sendMessage).toHaveBeenCalled();
      expect(component.messages.length).toBe(1);
      expect(component.newMessageContent).toBe('');
    });

    it('should not send message when conversation ID is missing', () => {
      component.conversationId = undefined;

      component.sendMessage();

      expect(component.error).toBe('Erreur : ID de conversation manquant');
      expect(conversationsService.sendMessage).not.toHaveBeenCalled();
    });

    it('should not send message when reservation is closed', () => {
      component.isReservationClosed = true;

      component.sendMessage();

      expect(component.error).toBe('Impossible d\'envoyer un message : la réservation est fermée');
      expect(conversationsService.sendMessage).not.toHaveBeenCalled();
    });

    it('should handle send error', () => {
      conversationsService.sendMessage.and.returnValue(throwError(() => 'Error'));

      component.sendMessage();

      expect(component.error).toBe('Impossible d\'envoyer le message');
    });
  });

  describe('onKeyPress', () => {
    it('should send message on Enter without Shift', () => {
      spyOn(component, 'sendMessage');
      const event = new KeyboardEvent('keypress', { key: 'Enter' });
      spyOn(event, 'preventDefault');

      component.onKeyPress(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(component.sendMessage).toHaveBeenCalled();
    });

    it('should not send message on Enter with Shift', () => {
      spyOn(component, 'sendMessage');
      const event = new KeyboardEvent('keypress', { key: 'Enter', shiftKey: true });
      spyOn(event, 'preventDefault');

      component.onKeyPress(event);

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(component.sendMessage).not.toHaveBeenCalled();
    });
  });

  describe('isMessageValid', () => {
    it('should return false for empty content', () => {
      expect(component.isMessageValid('')).toBeFalse();
      expect(component.isMessageValid('   ')).toBeFalse();
    });

    it('should return false for content with dangerous characters', () => {
      expect(component.isMessageValid('Hello<script>')).toBeFalse();
      expect(component.isMessageValid('Test{code}')).toBeFalse();
    });

    it('should return false for content with only numbers', () => {
      expect(component.isMessageValid('12345')).toBeFalse();
    });

    it('should return false for content with only punctuation', () => {
      expect(component.isMessageValid('...')).toBeFalse();
      expect(component.isMessageValid('!!!')).toBeFalse();
      expect(component.isMessageValid('???')).toBeFalse();
      expect(component.isMessageValid(':::')).toBeFalse();
      expect(component.isMessageValid(';;;')).toBeFalse();
      expect(component.isMessageValid('.,.,.')).toBeFalse();
      expect(component.isMessageValid('---')).toBeFalse();
    });

    it('should return true for content with allowed punctuation', () => {
      expect(component.isMessageValid('Hello!')).toBeTrue();
      expect(component.isMessageValid('Test?')).toBeTrue();
      expect(component.isMessageValid('Message:')).toBeTrue();
      expect(component.isMessageValid('Note;')).toBeTrue();
      expect(component.isMessageValid('It\'s working')).toBeTrue();
    });

    it('should return false for content too short', () => {
      expect(component.isMessageValid('a')).toBeFalse();
    });

    it('should return true for valid content', () => {
      expect(component.isMessageValid('Hello world')).toBeTrue();
      expect(component.isMessageValid('Test message 123')).toBeTrue();
    });
  });

  describe('getValidationErrorMessage', () => {
    it('should return null for empty content', () => {
      expect(component.getValidationErrorMessage('')).toBeNull();
    });

    it('should return error for dangerous characters', () => {
      const result = component.getValidationErrorMessage('Hello<script>');
      expect(result).toContain('caractères non autorisés');
    });

    it('should return error for only numbers', () => {
      const result = component.getValidationErrorMessage('12345');
      expect(result).toContain('uniquement de chiffres');
    });

    it('should return error for only punctuation', () => {
      const result = component.getValidationErrorMessage('...');
      expect(result).toContain('ponctuation et d\'espaces');
    });

    it('should return error for too short content', () => {
      const result = component.getValidationErrorMessage('a');
      expect(result).toContain('trop court');
    });
  });

  describe('goBack', () => {
    it('should navigate to messaging page', () => {
      component.goBack();

      expect(router.navigate).toHaveBeenCalledWith(['/messaging']);
    });
  });

  describe('shouldShowDateHeader', () => {
    beforeEach(() => {
      component.messages = mockMessages;
    });

    it('should return true for first message', () => {
      expect(component.shouldShowDateHeader(0)).toBeTrue();
    });

    it('should return true for different dates', () => {
      const message1 = new Message({
        sentAt: new Date('2024-01-15T10:00:00Z')
      });
      const message2 = new Message({
        sentAt: new Date('2024-01-16T10:00:00Z')
      });
      component.messages = [message1, message2];

      expect(component.shouldShowDateHeader(1)).toBeTrue();
    });

    it('should return false for same date', () => {
      const message1 = new Message({
        sentAt: new Date('2024-01-15T10:00:00Z')
      });
      const message2 = new Message({
        sentAt: new Date('2024-01-15T11:00:00Z')
      });
      component.messages = [message1, message2];

      expect(component.shouldShowDateHeader(1)).toBeFalse();
    });
  });

  describe('startEditing', () => {
    it('should set editing state', () => {
      const message = new Message({ id: 1, content: 'Test message' });

      component.startEditing(message);

      expect(component.editingMessageId).toBe(1);
      expect(component.editingContent).toBe('Test message');
    });
  });

  describe('cancelEditing', () => {
    it('should clear editing state', () => {
      component.editingMessageId = 1;
      component.editingContent = 'Test';

      component.cancelEditing();

      expect(component.editingMessageId).toBeNull();
      expect(component.editingContent).toBe('');
    });
  });

  describe('updateMessage', () => {
    beforeEach(() => {
      component.conversationId = 1;
      component.editingMessageId = 1;
      component.editingContent = 'Updated message';
    });

    it('should update message successfully', () => {
      const updatedMessage = new Message({
        id: 1,
        content: 'Updated message',
        sentAt: new Date()
      });
      conversationsService.updateMessage.and.returnValue(of(updatedMessage));

      component.updateMessage();

      expect(conversationsService.updateMessage).toHaveBeenCalledWith(1, jasmine.any(Object));
      expect(component.editingMessageId).toBeNull();
    });

    it('should handle missing message ID', () => {
      component.editingMessageId = null;

      component.updateMessage();

      expect(component.error).toBe('Erreur : ID de message manquant');
    });

    it('should handle empty content', () => {
      component.editingContent = '';

      component.updateMessage();

      expect(component.error).toBe('Le message ne peut pas être vide');
    });

    it('should handle update error', () => {
      conversationsService.updateMessage.and.returnValue(throwError(() => 'Error'));

      component.updateMessage();

      expect(component.error).toBe('Impossible de modifier le message');
    });
  });

  describe('onEditKeyPress', () => {
    it('should update message on Enter without Shift', () => {
      spyOn(component, 'updateMessage');
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      spyOn(event, 'preventDefault');

      component.onEditKeyPress(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(component.updateMessage).toHaveBeenCalled();
    });

    it('should cancel editing on Escape', () => {
      spyOn(component, 'cancelEditing');
      const event = new KeyboardEvent('keydown', { key: 'Escape' });

      component.onEditKeyPress(event);

      expect(component.cancelEditing).toHaveBeenCalled();
    });
  });

  describe('trackByMessageId', () => {
    it('should return message ID', () => {
      const message = new Message({ id: 1 });

      const result = component.trackByMessageId(0, message);

      expect(result).toBe(1);
    });

    it('should return index when no ID', () => {
      const message = new Message({});

      const result = component.trackByMessageId(5, message);

      expect(result).toBe(5);
    });
  });
});
