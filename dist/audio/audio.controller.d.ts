import type { Response } from 'express';
import { AudioService } from './audio.service';
export declare class AudioController {
    private readonly audioService;
    constructor(audioService: AudioService);
    transcribe(body: {
        audio?: string;
        mimeType?: string;
    }): Promise<{
        text: string;
    }>;
    speech(body: {
        text: string;
        voice?: string;
    }, res: Response): Promise<void>;
}
