import { ConfigService } from '@nestjs/config';
import { Readable } from 'node:stream';
export declare class AudioService {
    private readonly config;
    private readonly logger;
    private readonly client;
    private readonly sttModel;
    private readonly ttsModel;
    private readonly ttsVoice;
    constructor(config: ConfigService);
    transcribe(buffer: Buffer, mimeType?: string): Promise<string>;
    synthesize(text: string, voice?: string): Promise<Buffer>;
    toReadable(buffer: Buffer): Readable;
}
