import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EntitiesModule } from './entities/entities.module';
import { SeedModule } from './seed/seed.module';
import { ChatModule } from './chat/chat.module';
import { LlmModule } from './llm/llm.module';
import { AudioModule } from './audio/audio.module';
import { ArkadionEntity } from './entities/arkadion-entity.entity';
import { Conversation } from './chat/conversation.entity';
import { ChatMessage } from './chat/chat-message.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres' as const,
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USER', 'arkadion'),
        password: config.get<string>('DB_PASSWORD', 'arkadion'),
        database: config.get<string>('DB_NAME', 'arkadion'),
        entities: [ArkadionEntity, Conversation, ChatMessage],
        synchronize: true,
        autoLoadEntities: true,
      }),
    }),
    EntitiesModule,
    SeedModule,
    ChatModule,
    LlmModule,
    AudioModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
