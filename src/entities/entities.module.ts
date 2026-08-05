import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArkadionEntity } from './arkadion-entity.entity';
import { EntitiesService } from './entities.service';
import { EntitiesController } from './entities.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ArkadionEntity])],
  controllers: [EntitiesController],
  providers: [EntitiesService],
  exports: [EntitiesService, TypeOrmModule],
})
export class EntitiesModule {}
