import { Repository } from 'typeorm';
import { ArkadionEntity } from './arkadion-entity.entity';
export declare class EntitiesService {
    private readonly repo;
    constructor(repo: Repository<ArkadionEntity>);
    findAll(): Promise<ArkadionEntity[]>;
    findOne(id: string): Promise<ArkadionEntity>;
    findCategories(): Promise<ArkadionEntity['category'][]>;
}
