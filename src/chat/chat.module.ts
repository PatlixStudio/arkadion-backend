import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './conversation.entity';
import { ChatMessage } from './chat-message.entity';
import { ConversationsService } from './conversations.service';
import { ConversationsController } from './conversations.controller';
import { ChatGateway } from './chat.gateway';
import { EntitiesModule } from '../entities/entities.module';
import { LlmModule } from '../llm/llm.module';
import { AudioModule } from '../audio/audio.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation, ChatMessage]),
    EntitiesModule,
    LlmModule,
    AudioModule,
  ],
  controllers: [ConversationsController],
  providers: [ConversationsService, ChatGateway],
})
export class ChatModule {}
