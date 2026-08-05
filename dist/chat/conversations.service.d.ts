import { Repository } from 'typeorm';
import { Conversation } from './conversation.entity';
import { ChatMessage } from './chat-message.entity';
import { EntitiesService } from '../entities/entities.service';
import { LlmService } from '../llm/llm.service';
import { AudioService } from '../audio/audio.service';
export declare class ConversationsService {
    private readonly conversationRepo;
    private readonly messageRepo;
    private readonly entitiesService;
    private readonly llmService;
    private readonly audioService;
    private readonly logger;
    constructor(conversationRepo: Repository<Conversation>, messageRepo: Repository<ChatMessage>, entitiesService: EntitiesService, llmService: LlmService, audioService: AudioService);
    create(entityId: string): Promise<Conversation>;
    findAll(): Promise<Conversation[]>;
    findOne(id: string): Promise<Conversation>;
    remove(id: string): Promise<void>;
    sendMessage(conversationId: string, content: string): Promise<{
        reply: string;
        audio: Buffer;
        conversationId: string;
    }>;
}
