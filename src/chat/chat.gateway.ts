import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ConversationsService } from './conversations.service';

@WebSocketGateway({
  cors: { origin: '*', methods: ['GET', 'POST'] },
  namespace: '/chat',
})
export class ChatGateway {
  private readonly logger = new Logger(ChatGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(private readonly conversationsService: ConversationsService) {}

  @SubscribeMessage('message')
  async onMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: { conversationId: string; content: string },
  ) {
    try {
      const { conversationId, content } = payload;
      socket.emit('thinking', { conversationId });
      const {
        reply,
        audio,
        conversationId: id,
      } = await this.conversationsService.sendMessage(conversationId, content);
      const audioB64 = audio.toString('base64');
      socket.emit('reply', { conversationId: id, reply, audio: audioB64 });
    } catch (err) {
      this.logger.error(`Chat message failed: ${(err as Error).message}`);
      socket.emit('error', { message: (err as Error).message });
    }
  }
}
