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

@Entity('locations')
@Index('idx_locations_tenant_id', ['tenantId', 'isActive'], { where: 'deleted_at IS NULL' })
@Index('idx_locations_slug', ['tenantId', 'slug'], { where: 'deleted_at IS NULL' })
export class Location {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.locations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ name: 'location_name', length: 255 })
  locationName: string;

  @Column({ name: 'location_code', length: 50, nullable: true })
  locationCode: string;

  @Column({ length: 100 })
  slug: string;

  @Column({ type: 'text' })
  address: string;

  @Column({ length: 100, nullable: true })
  city: string;

  @Column({ length: 100, nullable: true })
  district: string;

  @Column({ length: 100, nullable: true })
  ward: string;

  @Column({ length: 100, nullable: true })
  province: string;

  @Column({ name: 'postal_code', length: 20, nullable: true })
  postalCode: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number;

  @Column({ length: 50, nullable: true })
  phone: string;

  @Column({ name: 'manager_name', length: 255, nullable: true })
  managerName: string;

  @Column({ name: 'manager_phone', length: 50, nullable: true })
  managerPhone: string;

  @Column({ name: 'operating_hours', type: 'jsonb', nullable: true })
  operatingHours: Record<string, { open: string; close: string }>;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'is_primary', default: false })
  isPrimary: boolean;

  @Column({ name: 'opened_at', type: 'date', nullable: true })
  openedAt: Date;

  @Column({ name: 'closed_at', type: 'date', nullable: true })
  closedAt: Date;

  @Column({ name: 'display_order', default: 0 })
  displayOrder: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
