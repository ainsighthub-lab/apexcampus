import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MentorService {
  constructor(private readonly prisma: PrismaService) {}

  async createConversation(userId: string, lessonId: string, context?: Record<string, any>) {
    return this.prisma.mentorConversation.create({
      data: {
        userId,
        lessonId,
        context: context || undefined,
      },
    });
  }

  async sendMessage(conversationId: string, role: string, content: string) {
    const conversation = await this.prisma.mentorConversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return this.prisma.mentorMessage.create({
      data: {
        conversationId,
        role,
        content,
      },
    });
  }

  async getConversationMessages(conversationId: string) {
    const conversation = await this.prisma.mentorConversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return this.prisma.mentorMessage.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getUserConversations(userId: string) {
    return this.prisma.mentorConversation.findMany({
      where: { userId },
      include: {
        lesson: { select: { id: true, title: true } },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          select: { content: true, createdAt: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
