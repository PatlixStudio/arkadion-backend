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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var LlmService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LlmService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const openai_1 = __importDefault(require("openai"));
let LlmService = LlmService_1 = class LlmService {
    config;
    logger = new common_1.Logger(LlmService_1.name);
    constructor(config) {
        this.config = config;
    }
    providerConfigs() {
        const providers = [];
        const groqKey = this.config.get('GROQ_API_KEY');
        const groqModel = this.config.get('GROQ_MODEL') ?? 'llama-3.3-70b-versatile';
        if (groqKey) {
            providers.push({
                name: 'groq',
                baseURL: 'https://api.groq.com/openai/v1',
                apiKey: groqKey,
                model: groqModel,
            });
        }
        const openRouterKey = this.config.get('OPENROUTER_API_KEY');
        const openRouterModel = this.config.get('OPENROUTER_MODEL') ??
            'meta-llama/llama-3.3-70b-instruct:free';
        if (openRouterKey) {
            providers.push({
                name: 'openrouter',
                baseURL: 'https://openrouter.ai/api/v1',
                apiKey: openRouterKey,
                model: openRouterModel,
            });
        }
        const ollamaBase = this.config.get('OLLAMA_BASE_URL') ?? 'http://localhost:11434/v1';
        const ollamaModel = this.config.get('OLLAMA_MODEL') ?? 'qwen2.5:7b';
        providers.push({
            name: 'ollama',
            baseURL: ollamaBase,
            apiKey: 'ollama',
            model: ollamaModel,
        });
        return providers;
    }
    async chat(messages, options) {
        const providers = this.providerConfigs();
        let lastError;
        for (const provider of providers) {
            try {
                this.logger.log(`Trying ${provider.name} (${provider.model})`);
                const client = new openai_1.default({
                    baseURL: provider.baseURL,
                    apiKey: provider.apiKey ?? 'sk-no-key',
                });
                const response = await client.chat.completions.create({
                    model: provider.model,
                    messages,
                    temperature: options?.temperature ?? 0.7,
                    max_tokens: options?.maxTokens ?? 1024,
                });
                const content = response.choices[0]?.message?.content;
                if (!content) {
                    throw new Error(`${provider.name} returned empty content`);
                }
                return content;
            }
            catch (err) {
                lastError = err;
                this.logger.warn(`${provider.name} failed: ${err.message}`);
            }
        }
        throw new Error(`All LLM providers failed. Last error: ${lastError?.message}`);
    }
};
exports.LlmService = LlmService;
exports.LlmService = LlmService = LlmService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], LlmService);
//# sourceMappingURL=llm.service.js.map