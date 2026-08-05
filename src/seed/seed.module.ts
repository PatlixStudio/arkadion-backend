import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArkadionEntity } from '../entities/arkadion-entity.entity';
import { SeedService } from './seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([ArkadionEntity])],
  providers: [SeedService],
})
export class SeedModule {}
