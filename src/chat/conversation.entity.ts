import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ArkadionEntity } from '../entities/arkadion-entity.entity';
import { ChatMessage } from './chat-message.entity';

@Entity('conversations')
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  entityId: string;

  @ManyToOne(() => ArkadionEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'entityId' })
  entity: ArkadionEntity;

  @OneToMany(() => ChatMessage, (msg) => msg.conversation, { cascade: true })
  messages: ChatMessage[];

  @CreateDateColumn()
  createdAt: Date;
}
