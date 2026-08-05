import { Controller, Get, Param } from '@nestjs/common';
import { EntitiesService } from './entities.service';
import { ArkadionEntity } from './arkadion-entity.entity';

@Controller('api/entities')
export class EntitiesController {
  constructor(private readonly entitiesService: EntitiesService) {}

  @Get()
  findAll(): Promise<ArkadionEntity[]> {
    return this.entitiesService.findAll();
  }

  @Get('categories')
  findCategories(): Promise<ArkadionEntity['category'][]> {
    return this.entitiesService.findCategories();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ArkadionEntity> {
    return this.entitiesService.findOne(id);
  }
}
