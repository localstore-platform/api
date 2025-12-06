import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Tenant } from './tenant.entity';
import { MenuItem } from './menu-item.entity';

@Entity('item_add_ons')
@Index('idx_item_add_ons_tenant_id', ['tenantId'], { where: 'deleted_at IS NULL' })
@Index('idx_item_add_ons_menu_item_id', ['menuItemId'], { where: 'deleted_at IS NULL' })
export class ItemAddOn {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ name: 'menu_item_id', type: 'uuid' })
  menuItemId: string;

  @ManyToOne(() => MenuItem, (menuItem) => menuItem.addOns, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'menu_item_id' })
  menuItem: MenuItem;

  @Column({ name: 'name_vi', length: 255 })
  nameVi: string;

  @Column({ name: 'name_en', length: 255, nullable: true })
  nameEn: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ name: 'is_required', default: false })
  isRequired: boolean;

  @Column({ name: 'max_selections', type: 'int', default: 1 })
  maxSelections: number;

  @Column({ name: 'display_order', default: 0 })
  displayOrder: number;

  @Column({ name: 'is_available', default: true })
  isAvailable: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
