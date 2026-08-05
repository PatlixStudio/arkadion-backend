import { ArkadionEntity } from '../entities/arkadion-entity.entity';
import { ChatMessage } from './chat-message.entity';
export declare class Conversation {
    id: string;
    entityId: string;
    entity: ArkadionEntity;
    messages: ChatMessage[];
    createdAt: Date;
}
