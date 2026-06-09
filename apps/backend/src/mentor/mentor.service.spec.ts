import { Test, TestingModule } from '@nestjs/testing';
import { MentorService } from './mentor.service';
import { PrismaService } from '../prisma/prisma.service';

describe('MentorService', () => {
  let service: MentorService;
  let prisma: PrismaService;

  const mockPrisma = {
    mentorConversation: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    mentorMessage: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MentorService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<MentorService>(MentorService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createConversation', () => {
    it('should create a conversation linked to a lesson', async () => {
      mockPrisma.mentorConversation.create.mockResolvedValue({
        id: 'conv-1',
        userId: 'u1',
        lessonId: 'l1',
      });

      const result = await service.createConversation('u1', 'l1', { topic: 'help' });
      expect(result.id).toBe('conv-1');
      expect(mockPrisma.mentorConversation.create).toHaveBeenCalledWith({
        data: {
          userId: 'u1',
          lessonId: 'l1',
          context: { topic: 'help' },
        },
      });
    });
  });

  describe('sendMessage', () => {
    it('should add a message to a conversation', async () => {
      mockPrisma.mentorConversation.findUnique.mockResolvedValue({ id: 'conv-1' });
      mockPrisma.mentorMessage.create.mockResolvedValue({
        id: 'msg-1',
        role: 'user',
        content: 'Hello mentor',
        conversationId: 'conv-1',
      });

      const result = await service.sendMessage('conv-1', 'user', 'Hello mentor');
      expect(result.role).toBe('user');
      expect(result.content).toBe('Hello mentor');
    });

    it('should throw if conversation not found', async () => {
      mockPrisma.mentorConversation.findUnique.mockResolvedValue(null);
      await expect(service.sendMessage('conv-x', 'user', 'hi')).rejects.toThrow('Conversation not found');
    });
  });

  describe('getConversationMessages', () => {
    it('should return messages for a conversation', async () => {
      mockPrisma.mentorConversation.findUnique.mockResolvedValue({ id: 'conv-1' });
      mockPrisma.mentorMessage.findMany.mockResolvedValue([
        { id: 'm1', role: 'user', content: 'hi' },
        { id: 'm2', role: 'assistant', content: 'hello' },
      ]);

      const result = await service.getConversationMessages('conv-1');
      expect(result).toHaveLength(2);
    });
  });

  describe('getUserConversations', () => {
    it('should return conversations for a user', async () => {
      mockPrisma.mentorConversation.findMany.mockResolvedValue([
        { id: 'conv-1', lessonId: 'l1' },
      ]);

      const result = await service.getUserConversations('u1');
      expect(result).toHaveLength(1);
    });
  });
});
