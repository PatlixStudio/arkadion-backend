import { Server, Socket } from 'socket.io';
import { ConversationsService } from './conversations.service';
export declare class ChatGateway {
    private readonly conversationsService;
    private readonly logger;
    server: Server;
    constructor(conversationsService: ConversationsService);
    onMessage(socket: Socket, payload: {
        conversationId: string;
        content: string;
    }): Promise<void>;
}
