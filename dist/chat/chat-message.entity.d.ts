import { Conversation } from './conversation.entity';
export declare class ChatMessage {
    id: string;
    conversationId: string;
    conversation: Conversation;
    role: 'user' | 'assistant';
    content: string;
    createdAt: Date;
}
