import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { Conversation } from './conversation.entity';

@Controller('api/conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Post()
  create(@Body() body: { entityId: string }): Promise<Conversation> {
    return this.conversationsService.create(body.entityId);
  }

  @Get()
  findAll(): Promise<Conversation[]> {
    return this.conversationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Conversation> {
    return this.conversationsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.conversationsService.remove(id);
  }

  @Post(':id/messages')
  sendMessage(
    @Param('id') id: string,
    @Body() body: { content: string },
  ): Promise<{ reply: string; audio: Buffer; conversationId: string }> {
    return this.conversationsService.sendMessage(id, body.content);
  }
}
