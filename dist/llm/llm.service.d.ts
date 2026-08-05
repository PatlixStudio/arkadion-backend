import { ConfigService } from '@nestjs/config';
export interface ChatTurn {
    role: 'system' | 'user' | 'assistant';
    content: string;
}
export declare class LlmService {
    private readonly config;
    private readonly logger;
    constructor(config: ConfigService);
    private providerConfigs;
    chat(messages: ChatTurn[], options?: {
        temperature?: number;
        maxTokens?: number;
    }): Promise<string>;
}
