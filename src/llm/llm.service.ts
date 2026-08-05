import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

export interface ChatTurn {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ProviderConfig {
  name: string;
  baseURL: string;
  apiKey?: string;
  model: string;
}

@Injectable()
export class LlmService {
  private readonly logger = new Logger(LlmService.name);

  constructor(private readonly config: ConfigService) {}

  private providerConfigs(): ProviderConfig[] {
    const providers: ProviderConfig[] = [];

    const groqKey = this.config.get<string>('GROQ_API_KEY');
    const groqModel =
      this.config.get<string>('GROQ_MODEL') ?? 'llama-3.3-70b-versatile';
    if (groqKey) {
      providers.push({
        name: 'groq',
        baseURL: 'https://api.groq.com/openai/v1',
        apiKey: groqKey,
        model: groqModel,
      });
    }

    const openRouterKey = this.config.get<string>('OPENROUTER_API_KEY');
    const openRouterModel =
      this.config.get<string>('OPENROUTER_MODEL') ??
      'meta-llama/llama-3.3-70b-instruct:free';
    if (openRouterKey) {
      providers.push({
        name: 'openrouter',
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey: openRouterKey,
        model: openRouterModel,
      });
    }

    const ollamaBase =
      this.config.get<string>('OLLAMA_BASE_URL') ?? 'http://localhost:11434/v1';
    const ollamaModel = this.config.get<string>('OLLAMA_MODEL') ?? 'qwen2.5:7b';
    providers.push({
      name: 'ollama',
      baseURL: ollamaBase,
      apiKey: 'ollama',
      model: ollamaModel,
    });

    return providers;
  }

  async chat(
    messages: ChatTurn[],
    options?: { temperature?: number; maxTokens?: number },
  ): Promise<string> {
    const providers = this.providerConfigs();
    let lastError: Error | undefined;

    for (const provider of providers) {
      try {
        this.logger.log(`Trying ${provider.name} (${provider.model})`);
        const client = new OpenAI({
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
      } catch (err) {
        lastError = err as Error;
        this.logger.warn(`${provider.name} failed: ${(err as Error).message}`);
      }
    }

    throw new Error(
      `All LLM providers failed. Last error: ${lastError?.message}`,
    );
  }
}
