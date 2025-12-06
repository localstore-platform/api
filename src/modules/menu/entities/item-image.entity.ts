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

@Entity('item_images')
@Index('idx_item_images_tenant_id', ['tenantId'], { where: 'deleted_at IS NULL' })
@Index('idx_item_images_menu_item_id', ['menuItemId', 'displayOrder'], {
  where: 'deleted_at IS NULL',
})
export class ItemImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ name: 'menu_item_id', type: 'uuid' })
  menuItemId: string;

  @ManyToOne(() => MenuItem, (menuItem) => menuItem.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'menu_item_id' })
  menuItem: MenuItem;

  @Column({ name: 'original_url', type: 'text' })
  originalUrl: string;

  @Column({ name: 'thumbnail_url', type: 'text', nullable: true })
  thumbnailUrl: string;

  @Column({ name: 'medium_url', type: 'text', nullable: true })
  mediumUrl: string;

  @Column({ name: 'large_url', type: 'text', nullable: true })
  largeUrl: string;

  @Column({ name: 'alt_text_vi', type: 'text', nullable: true })
  altTextVi: string;

  @Column({ name: 'alt_text_en', type: 'text', nullable: true })
  altTextEn: string;

  @Column({ name: 'display_order', default: 0 })
  displayOrder: number;

  @Column({ name: 'is_primary', default: false })
  isPrimary: boolean;

  @Column({ name: 'file_size_bytes', type: 'bigint', nullable: true })
  fileSizeBytes: number;

  @Column({ name: 'width_px', type: 'int', nullable: true })
  widthPx: number;

  @Column({ name: 'height_px', type: 'int', nullable: true })
  heightPx: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
