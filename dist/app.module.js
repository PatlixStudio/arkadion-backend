"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const entities_module_1 = require("./entities/entities.module");
const seed_module_1 = require("./seed/seed.module");
const chat_module_1 = require("./chat/chat.module");
const llm_module_1 = require("./llm/llm.module");
const audio_module_1 = require("./audio/audio.module");
const arkadion_entity_entity_1 = require("./entities/arkadion-entity.entity");
const conversation_entity_1 = require("./chat/conversation.entity");
const chat_message_entity_1 = require("./chat/chat-message.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['.env.local', '.env'],
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    type: 'postgres',
                    host: config.get('DB_HOST', 'localhost'),
                    port: config.get('DB_PORT', 5432),
                    username: config.get('DB_USER', 'arkadion'),
                    password: config.get('DB_PASSWORD', 'arkadion'),
                    database: config.get('DB_NAME', 'arkadion'),
                    entities: [arkadion_entity_entity_1.ArkadionEntity, conversation_entity_1.Conversation, chat_message_entity_1.ChatMessage],
                    synchronize: true,
                    autoLoadEntities: true,
                }),
            }),
            entities_module_1.EntitiesModule,
            seed_module_1.SeedModule,
            chat_module_1.ChatModule,
            llm_module_1.LlmModule,
            audio_module_1.AudioModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map