import { OnApplicationBootstrap } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ArkadionEntity } from '../entities/arkadion-entity.entity';
export declare class SeedService implements OnApplicationBootstrap {
    private readonly repo;
    private readonly logger;
    constructor(repo: Repository<ArkadionEntity>);
    onApplicationBootstrap(): Promise<void>;
}
