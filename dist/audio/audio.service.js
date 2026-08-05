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
var AudioService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const openai_1 = __importDefault(require("openai"));
const node_stream_1 = require("node:stream");
let AudioService = AudioService_1 = class AudioService {
    config;
    logger = new common_1.Logger(AudioService_1.name);
    client;
    sttModel;
    ttsModel;
    ttsVoice;
    constructor(config) {
        this.config = config;
        const baseURL = this.config.get('SPEACHES_BASE_URL') ??
            'http://localhost:8969/v1';
        this.client = new openai_1.default({ baseURL, apiKey: 'speaches' });
        this.sttModel =
            this.config.get('SPEACHES_STT_MODEL') ??
                'Systran/faster-whisper-small';
        this.ttsModel =
            this.config.get('SPEACHES_TTS_MODEL') ??
                'speaches-ai/Kokoro-82M-v1.0-ONNX';
        this.ttsVoice =
            this.config.get('SPEACHES_TTS_VOICE') ?? 'am_michael';
    }
    async transcribe(buffer, mimeType = 'audio/webm') {
        try {
            const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
            const file = new File([arrayBuffer], 'recording.webm', {
                type: mimeType,
            });
            const response = await this.client.audio.transcriptions.create({
                file,
                model: this.sttModel,
            });
            return response.text ?? '';
        }
        catch (err) {
            this.logger.error(`STT failed: ${err.message}`);
            throw err;
        }
    }
    async synthesize(text, voice) {
        try {
            const response = await this.client.audio.speech.create({
                model: this.ttsModel,
                input: text,
                voice: voice ?? this.ttsVoice,
                response_format: 'mp3',
            });
            return Buffer.from(await response.arrayBuffer());
        }
        catch (err) {
            this.logger.error(`TTS failed: ${err.message}`);
            throw err;
        }
    }
    toReadable(buffer) {
        return node_stream_1.Readable.from(buffer);
    }
};
exports.AudioService = AudioService;
exports.AudioService = AudioService = AudioService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AudioService);
//# sourceMappingURL=audio.service.js.map