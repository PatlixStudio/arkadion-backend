import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { Readable } from 'node:stream';

@Injectable()
export class AudioService {
  private readonly logger = new Logger(AudioService.name);
  private readonly client: OpenAI;
  private readonly sttModel: string;
  private readonly ttsModel: string;
  private readonly ttsVoice: string;

  constructor(private readonly config: ConfigService) {
    const baseURL =
      this.config.get<string>('SPEACHES_BASE_URL') ??
      'http://localhost:8969/v1';
    this.client = new OpenAI({ baseURL, apiKey: 'speaches' });
    this.sttModel =
      this.config.get<string>('SPEACHES_STT_MODEL') ??
      'Systran/faster-whisper-small';
    this.ttsModel =
      this.config.get<string>('SPEACHES_TTS_MODEL') ??
      'speaches-ai/Kokoro-82M-v1.0-ONNX';
    this.ttsVoice =
      this.config.get<string>('SPEACHES_TTS_VOICE') ?? 'am_michael';
  }

  async transcribe(buffer: Buffer, mimeType = 'audio/webm'): Promise<string> {
    try {
      const arrayBuffer = buffer.buffer.slice(
        buffer.byteOffset,
        buffer.byteOffset + buffer.byteLength,
      ) as ArrayBuffer;
      const file = new File([arrayBuffer], 'recording.webm', {
        type: mimeType,
      });
      const response = await this.client.audio.transcriptions.create({
        file,
        model: this.sttModel,
      });
      return response.text ?? '';
    } catch (err) {
      this.logger.error(`STT failed: ${(err as Error).message}`);
      throw err;
    }
  }

  async synthesize(text: string, voice?: string): Promise<Buffer> {
    try {
      const response = await this.client.audio.speech.create({
        model: this.ttsModel,
        input: text,
        voice: voice ?? this.ttsVoice,
        response_format: 'mp3',
      });
      return Buffer.from(await response.arrayBuffer());
    } catch (err) {
      this.logger.error(`TTS failed: ${(err as Error).message}`);
      throw err;
    }
  }

  toReadable(buffer: Buffer): Readable {
    return Readable.from(buffer);
  }
}
