import { ConversationsService } from './conversations.service';
import { Conversation } from './conversation.entity';
export declare class ConversationsController {
    private readonly conversationsService;
    constructor(conversationsService: ConversationsService);
    create(body: {
        entityId: string;
    }): Promise<Conversation>;
    findAll(): Promise<Conversation[]>;
    findOne(id: string): Promise<Conversation>;
    remove(id: string): Promise<void>;
    sendMessage(id: string, body: {
        content: string;
    }): Promise<{
        reply: string;
        audio: Buffer;
        conversationId: string;
    }>;
}
