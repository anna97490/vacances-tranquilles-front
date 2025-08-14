import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ConversationComponent } from './conversation.component';
import { ConversationsService, ConversationSummaryDTO } from '../../services/conversation/conversations.service';

describe('ConversationComponent', () => {
  let component: ConversationComponent;
  let fixture: ComponentFixture<ConversationComponent>;
  let conversationsService: jasmine.SpyObj<ConversationsService>;
  let router: jasmine.SpyObj<Router>;

  const mockConversations: ConversationSummaryDTO[] = [
    {
      conversationId: 1,
      otherUserName: 'John Doe',
      serviceTitle: 'Nettoyage'
    },
    {
      conversationId: 2,
      otherUserName: 'Jane Smith',
      serviceTitle: 'Jardinage'
    }
  ];

  beforeEach(async () => {
    const conversationsServiceSpy = jasmine.createSpyObj('ConversationsService', ['getConversations']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ConversationComponent],
      providers: [
        { provide: ConversationsService, useValue: conversationsServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConversationComponent);
    component = fixture.componentInstance;
    conversationsService = TestBed.inject(ConversationsService) as jasmine.SpyObj<ConversationsService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load conversations on init', () => {
      conversationsService.getConversations.and.returnValue(of(mockConversations));

      component.ngOnInit();

      expect(conversationsService.getConversations).toHaveBeenCalled();
      expect(component.conversations).toEqual(mockConversations);
      expect(component.isLoading).toBeFalse();
    });
  });

  describe('loadConversations', () => {
    it('should load conversations successfully', () => {
      conversationsService.getConversations.and.returnValue(of(mockConversations));

      component.loadConversations();

      expect(component.isLoading).toBeFalse();
      expect(conversationsService.getConversations).toHaveBeenCalled();
    });

    it('should handle error when loading conversations', () => {
      const error = 'Erreur de chargement';
      conversationsService.getConversations.and.returnValue(throwError(() => error));

      component.loadConversations();

      expect(component.isLoading).toBeFalse();
    });
  });

  describe('openConversation', () => {
    it('should navigate to conversation when valid ID', () => {
      const conversationId = 1;

      component.openConversation(conversationId);

      expect(router.navigate).toHaveBeenCalledWith(['/messages', conversationId]);
    });

    it('should not navigate when invalid ID', () => {
      const invalidId = 0;

      component.openConversation(invalidId);

      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  describe('onCardKeydown', () => {
    it('should open conversation on Enter key', () => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      const conversationId = 1;
      spyOn(component, 'openConversation');
      spyOn(event, 'preventDefault');

      component.onCardKeydown(event, conversationId);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(component.openConversation).toHaveBeenCalledWith(conversationId);
    });

    it('should open conversation on Space key', () => {
      const event = new KeyboardEvent('keydown', { key: ' ' });
      const conversationId = 1;
      spyOn(component, 'openConversation');
      spyOn(event, 'preventDefault');

      component.onCardKeydown(event, conversationId);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(component.openConversation).toHaveBeenCalledWith(conversationId);
    });

    it('should not open conversation on other keys', () => {
      const event = new KeyboardEvent('keydown', { key: 'Tab' });
      const conversationId = 1;
      spyOn(component, 'openConversation');
      spyOn(event, 'preventDefault');

      component.onCardKeydown(event, conversationId);

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(component.openConversation).not.toHaveBeenCalled();
    });
  });



  describe('trackByConversationId', () => {
    it('should return conversation ID for tracking', () => {
      const conversation = mockConversations[0];
      const result = component.trackByConversationId(0, conversation);
      expect(result).toBe(conversation.conversationId);
    });
  });
});
