import { EntitiesService } from './entities.service';
import { ArkadionEntity } from './arkadion-entity.entity';
export declare class EntitiesController {
    private readonly entitiesService;
    constructor(entitiesService: EntitiesService);
    findAll(): Promise<ArkadionEntity[]>;
    findCategories(): Promise<ArkadionEntity['category'][]>;
    findOne(id: string): Promise<ArkadionEntity>;
}
