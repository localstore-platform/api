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
import { ItemStatus } from '@localstore/contracts';
import { Tenant } from './tenant.entity';
import { Location } from './location.entity';
import { Category } from './category.entity';
import { ItemVariant } from './item-variant.entity';
import { ItemAddOn } from './item-add-on.entity';
import { ItemImage } from './item-image.entity';

// Re-export ItemStatus for backward compatibility
export { ItemStatus };

@Entity('menu_items')
@Index('idx_menu_items_tenant_id', ['tenantId', 'status', 'displayOrder'], {
  where: 'deleted_at IS NULL',
})
@Index('idx_menu_items_category_id', ['categoryId'], { where: 'deleted_at IS NULL' })
@Index('idx_menu_items_featured', ['tenantId'], {
  where: 'is_featured = true AND deleted_at IS NULL',
})
@Index('idx_menu_items_tenant_slug', ['tenantId', 'slug'], { where: 'deleted_at IS NULL' })
export class MenuItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.menuItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ name: 'location_id', type: 'uuid', nullable: true })
  locationId: string;

  @ManyToOne(() => Location, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'location_id' })
  location: Location;

  @Column({ name: 'category_id', type: 'uuid', nullable: true })
  categoryId: string;

  @ManyToOne(() => Category, (category) => category.menuItems, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ name: 'is_chain_wide', default: false })
  isChainWide: boolean;

  @Column({ length: 100 })
  slug: string;

  @Column({ name: 'name_vi', length: 255 })
  nameVi: string;

  @Column({ name: 'name_en', length: 255, nullable: true })
  nameEn: string;

  @Column({ name: 'description_vi', type: 'text', nullable: true })
  descriptionVi: string;

  @Column({ name: 'description_en', type: 'text', nullable: true })
  descriptionEn: string;

  @Column({ name: 'base_price', type: 'decimal', precision: 10, scale: 2 })
  basePrice: number;

  @Column({ name: 'compare_at_price', type: 'decimal', precision: 10, scale: 2, nullable: true })
  compareAtPrice: number;

  @Column({ name: 'currency_code', type: 'char', length: 3, default: 'VND' })
  currencyCode: string;

  @Column({ length: 100, nullable: true })
  sku: string;

  @Column({ name: 'track_inventory', default: false })
  trackInventory: boolean;

  @Column({ name: 'stock_quantity', type: 'int', nullable: true })
  stockQuantity: number;

  @Column({ name: 'low_stock_threshold', type: 'int', nullable: true })
  lowStockThreshold: number;

  @Column({ name: 'display_order', default: 0 })
  displayOrder: number;

  @Column({ name: 'thumbnail_url', type: 'text', nullable: true })
  thumbnailUrl: string;

  @Column({ name: 'is_featured', default: false })
  isFeatured: boolean;

  @Column({ name: 'is_spicy', default: false })
  isSpicy: boolean;

  @Column({ name: 'is_vegetarian', default: false })
  isVegetarian: boolean;

  @Column({ name: 'is_vegan', default: false })
  isVegan: boolean;

  @Column({
    type: 'enum',
    enum: ItemStatus,
    default: ItemStatus.DRAFT,
  })
  status: ItemStatus;

  @Column({ name: 'published_at', type: 'timestamp', nullable: true })
  publishedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @OneToMany(() => ItemVariant, (variant) => variant.menuItem)
  variants: ItemVariant[];

  @OneToMany(() => ItemAddOn, (addOn) => addOn.menuItem)
  addOns: ItemAddOn[];

  @OneToMany(() => ItemImage, (image) => image.menuItem)
  images: ItemImage[];
}
