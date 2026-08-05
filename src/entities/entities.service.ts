import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArkadionEntity } from './arkadion-entity.entity';

@Injectable()
export class EntitiesService {
  constructor(
    @InjectRepository(ArkadionEntity)
    private readonly repo: Repository<ArkadionEntity>,
  ) {}

  findAll(): Promise<ArkadionEntity[]> {
    return this.repo.find({ order: { category: 'ASC', name: 'ASC' } });
  }

  async findOne(id: string): Promise<ArkadionEntity> {
    const entity = await this.repo.findOneBy({ id });
    if (!entity) {
      throw new NotFoundException(`Entity ${id} not found`);
    }
    return entity;
  }

  async findCategories(): Promise<ArkadionEntity['category'][]> {
    const rows = await this.repo
      .createQueryBuilder('e')
      .select('DISTINCT e.category', 'category')
      .orderBy('category', 'ASC')
      .getRawMany();
    return rows.map((row: { category: string }) => row.category);
  }
}
