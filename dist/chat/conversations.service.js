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
var ConversationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const conversation_entity_1 = require("./conversation.entity");
const chat_message_entity_1 = require("./chat-message.entity");
const entities_service_1 = require("../entities/entities.service");
const llm_service_1 = require("../llm/llm.service");
const audio_service_1 = require("../audio/audio.service");
let ConversationsService = ConversationsService_1 = class ConversationsService {
    conversationRepo;
    messageRepo;
    entitiesService;
    llmService;
    audioService;
    logger = new common_1.Logger(ConversationsService_1.name);
    constructor(conversationRepo, messageRepo, entitiesService, llmService, audioService) {
        this.conversationRepo = conversationRepo;
        this.messageRepo = messageRepo;
        this.entitiesService = entitiesService;
        this.llmService = llmService;
        this.audioService = audioService;
    }
    async create(entityId) {
        await this.entitiesService.findOne(entityId);
        const conversation = this.conversationRepo.create({ entityId });
        return this.conversationRepo.save(conversation);
    }
    findAll() {
        return this.conversationRepo.find({
            relations: { entity: true },
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const conversation = await this.conversationRepo.findOne({
            where: { id },
            relations: { entity: true, messages: true },
        });
        if (!conversation) {
            throw new common_1.NotFoundException(`Conversation ${id} not found`);
        }
        return conversation;
    }
    async remove(id) {
        await this.conversationRepo.delete(id);
    }
    async sendMessage(conversationId, content) {
        const conversation = await this.conversationRepo.findOne({
            where: { id: conversationId },
            relations: { entity: true, messages: true },
        });
        if (!conversation) {
            throw new common_1.NotFoundException(`Conversation ${conversationId} not found`);
        }
        await this.messageRepo.save(this.messageRepo.create({ conversationId, role: 'user', content }));
        const history = conversation.messages ?? [];
        const turns = [
            {
                role: 'system',
                content: conversation.entity.personaPrompt,
            },
            ...history.map((m) => ({
                role: m.role,
                content: m.content,
            })),
            { role: 'user', content },
        ];
        const reply = await this.llmService.chat(turns);
        await this.messageRepo.save(this.messageRepo.create({
            conversationId,
            role: 'assistant',
            content: reply,
        }));
        const audio = await this.audioService.synthesize(reply, conversation.entity.voice);
        return { reply, audio, conversationId };
    }
};
exports.ConversationsService = ConversationsService;
exports.ConversationsService = ConversationsService = ConversationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(conversation_entity_1.Conversation)),
    __param(1, (0, typeorm_1.InjectRepository)(chat_message_entity_1.ChatMessage)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        entities_service_1.EntitiesService,
        llm_service_1.LlmService,
        audio_service_1.AudioService])
], ConversationsService);
//# sourceMappingURL=conversations.service.js.map