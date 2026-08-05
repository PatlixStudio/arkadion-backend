import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('entities')
export class ArkadionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ unique: true })
  name: string;

  @Index()
  @Column()
  category: string;

  @Column({ default: '' })
  epithet: string;

  @Column({ type: 'text', default: '' })
  description: string;

  @Column({ type: 'text', default: '' })
  personaPrompt: string;

  @Column({ default: '' })
  voice: string;

  @Column({ default: '' })
  accentColor: string;

  @Column({ default: '' })
  modelAsset: string;

  @Column({ default: '' })
  emoji: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
