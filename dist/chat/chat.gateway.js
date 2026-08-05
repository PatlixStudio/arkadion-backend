"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ChatGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const socket_io_1 = require("socket.io");
const conversations_service_1 = require("./conversations.service");
let ChatGateway = ChatGateway_1 = class ChatGateway {
    conversationsService;
    logger = new common_1.Logger(ChatGateway_1.name);
    server;
    constructor(conversationsService) {
        this.conversationsService = conversationsService;
    }
    async onMessage(socket, payload) {
        try {
            const { conversationId, content } = payload;
            socket.emit('thinking', { conversationId });
            const { reply, audio, conversationId: id, } = await this.conversationsService.sendMessage(conversationId, content);
            const audioB64 = audio.toString('base64');
            socket.emit('reply', { conversationId: id, reply, audio: audioB64 });
        }
        catch (err) {
            this.logger.error(`Chat message failed: ${err.message}`);
            socket.emit('error', { message: err.message });
        }
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('message'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "onMessage", null);
exports.ChatGateway = ChatGateway = ChatGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: { origin: '*', methods: ['GET', 'POST'] },
        namespace: '/chat',
    }),
    __metadata("design:paramtypes", [conversations_service_1.ConversationsService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map