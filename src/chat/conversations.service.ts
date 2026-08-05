import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from './conversation.entity';
import { ChatMessage } from './chat-message.entity';
import { EntitiesService } from '../entities/entities.service';
import { LlmService, ChatTurn } from '../llm/llm.service';
import { AudioService } from '../audio/audio.service';

@Injectable()
export class ConversationsService {
  private readonly logger = new Logger(ConversationsService.name);

  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepo: Repository<Conversation>,
    @InjectRepository(ChatMessage)
    private readonly messageRepo: Repository<ChatMessage>,
    private readonly entitiesService: EntitiesService,
    private readonly llmService: LlmService,
    private readonly audioService: AudioService,
  ) {}

  async create(entityId: string): Promise<Conversation> {
    await this.entitiesService.findOne(entityId);
    const conversation = this.conversationRepo.create({ entityId });
    return this.conversationRepo.save(conversation);
  }

  findAll(): Promise<Conversation[]> {
    return this.conversationRepo.find({
      relations: { entity: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Conversation> {
    const conversation = await this.conversationRepo.findOne({
      where: { id },
      relations: { entity: true, messages: true },
    });
    if (!conversation) {
      throw new NotFoundException(`Conversation ${id} not found`);
    }
    return conversation;
  }

  async remove(id: string): Promise<void> {
    await this.conversationRepo.delete(id);
  }

  async sendMessage(
    conversationId: string,
    content: string,
  ): Promise<{ reply: string; audio: Buffer; conversationId: string }> {
    const conversation = await this.conversationRepo.findOne({
      where: { id: conversationId },
      relations: { entity: true, messages: true },
    });
    if (!conversation) {
      throw new NotFoundException(`Conversation ${conversationId} not found`);
    }

    await this.messageRepo.save(
      this.messageRepo.create({ conversationId, role: 'user', content }),
    );

    const history = conversation.messages ?? [];
    const turns: ChatTurn[] = [
      {
        role: 'system',
        content: conversation.entity.personaPrompt,
      },
      ...history.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      { role: 'user' as const, content },
    ];

    const reply = await this.llmService.chat(turns);
    await this.messageRepo.save(
      this.messageRepo.create({
        conversationId,
        role: 'assistant',
        content: reply,
      }),
    );

    const audio = await this.audioService.synthesize(
      reply,
      conversation.entity.voice,
    );

    return { reply, audio, conversationId };
  }
}
