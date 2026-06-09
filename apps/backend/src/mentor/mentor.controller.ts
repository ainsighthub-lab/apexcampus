import { Controller, Get, Post, Body, Param, Req, UseGuards } from '@nestjs/common';
import { MentorService } from './mentor.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/v1/mentor')
@UseGuards(JwtAuthGuard)
export class MentorController {
  constructor(private readonly mentorService: MentorService) {}

  @Post('conversations')
  createConversation(
    @Req() req: any,
    @Body() body: { lessonId: string; context?: Record<string, any> },
  ) {
    return this.mentorService.createConversation(req.user.id, body.lessonId, body.context);
  }

  @Post('conversations/:id/messages')
  sendMessage(
    @Param('id') id: string,
    @Body() body: { content: string },
  ) {
    return this.mentorService.sendMessage(id, 'user', body.content);
  }

  @Get('conversations/:id/messages')
  getMessages(@Param('id') id: string) {
    return this.mentorService.getConversationMessages(id);
  }

  @Get('conversations')
  getUserConversations(@Req() req: any) {
    return this.mentorService.getUserConversations(req.user.id);
  }
}
