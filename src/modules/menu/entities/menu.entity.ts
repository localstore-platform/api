import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { Tenant } from './tenant.entity';
import { Category } from './category.entity';

@Entity('menus')
@Index('idx_menus_tenant_id', ['tenantId', 'displayOrder'], { where: 'deleted_at IS NULL' })
export class Menu {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.menus, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ name: 'name_vi', length: 255 })
  nameVi: string;

  @Column({ name: 'name_en', length: 255, nullable: true })
  nameEn: string;

  @Column({ name: 'description_vi', type: 'text', nullable: true })
  descriptionVi: string;

  @Column({ name: 'description_en', type: 'text', nullable: true })
  descriptionEn: string;

  @Column({ name: 'display_order', default: 0 })
  displayOrder: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'available_days', type: 'smallint', array: true, nullable: true })
  availableDays: number[];

  @Column({ name: 'available_from', type: 'time', nullable: true })
  availableFrom: string;

  @Column({ name: 'available_until', type: 'time', nullable: true })
  availableUntil: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @OneToMany(() => Category, (category) => category.menu)
  categories: Category[];
}
