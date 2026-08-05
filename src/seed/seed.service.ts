import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArkadionEntity } from '../entities/arkadion-entity.entity';
import { ENTITY_SEEDS } from '../entities/seed-data';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(ArkadionEntity)
    private readonly repo: Repository<ArkadionEntity>,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const count = await this.repo.count();
    if (count > 0) {
      this.logger.log(`Entities already seeded (${count}). Skipping.`);
      return;
    }
    await this.repo.save(this.repo.create(ENTITY_SEEDS));
    this.logger.log(`Seeded ${ENTITY_SEEDS.length} entities`);
  }
}
