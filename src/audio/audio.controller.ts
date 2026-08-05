import {
  BadRequestException,
  Controller,
  Header,
  Post,
  Body,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { AudioService } from './audio.service';

@Controller('api/audio')
export class AudioController {
  constructor(private readonly audioService: AudioService) {}

  @Post('transcriptions')
  async transcribe(
    @Body() body: { audio?: string; mimeType?: string },
  ): Promise<{ text: string }> {
    if (!body.audio) {
      throw new BadRequestException('Missing base64 audio payload');
    }
    const buffer = Buffer.from(body.audio, 'base64');
    const text = await this.audioService.transcribe(buffer, body.mimeType);
    return { text };
  }

  @Post('speech')
  @Header('Content-Type', 'audio/mpeg')
  @Header('Cache-Control', 'no-cache')
  async speech(
    @Body() body: { text: string; voice?: string },
    @Res() res: Response,
  ) {
    if (!body.text) {
      throw new BadRequestException('Missing text');
    }
    const audio = await this.audioService.synthesize(body.text, body.voice);
    res.send(audio);
  }
}
