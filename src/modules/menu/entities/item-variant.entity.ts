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

@Entity('item_variants')
@Index('idx_item_variants_tenant_id', ['tenantId'], { where: 'deleted_at IS NULL' })
@Index('idx_item_variants_menu_item_id', ['menuItemId'], { where: 'deleted_at IS NULL' })
export class ItemVariant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ name: 'menu_item_id', type: 'uuid' })
  menuItemId: string;

  @ManyToOne(() => MenuItem, (menuItem) => menuItem.variants, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'menu_item_id' })
  menuItem: MenuItem;

  @Column({ name: 'name_vi', length: 255 })
  nameVi: string;

  @Column({ name: 'name_en', length: 255, nullable: true })
  nameEn: string;

  @Column({ name: 'price_adjustment', type: 'decimal', precision: 10, scale: 2, default: 0 })
  priceAdjustment: number;

  @Column({ length: 100, nullable: true })
  sku: string;

  @Column({ name: 'track_inventory', default: false })
  trackInventory: boolean;

  @Column({ name: 'stock_quantity', type: 'int', nullable: true })
  stockQuantity: number;

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
