import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Location } from './location.entity';
import { Menu } from './menu.entity';
import { Category } from './category.entity';
import { MenuItem } from './menu-item.entity';

@Entity('tenants')
@Index('idx_tenants_slug', ['slug'], { where: 'deleted_at IS NULL' })
@Index('idx_tenants_status', ['status'], { where: 'deleted_at IS NULL' })
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'business_name', length: 255 })
  businessName: string;

  @Column({ name: 'business_type', length: 100, nullable: true })
  businessType: string;

  @Column({ length: 100, unique: true })
  slug: string;

  @Column({ name: 'is_chain', default: false })
  isChain: boolean;

  @Column({ name: 'total_locations', default: 1 })
  totalLocations: number;

  @Column({ length: 50, nullable: true })
  phone: string;

  @Column({ length: 255, nullable: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ length: 100, nullable: true })
  city: string;

  @Column({ length: 100, nullable: true })
  province: string;

  @Column({ name: 'postal_code', length: 20, nullable: true })
  postalCode: string;

  @Column({ name: 'country_code', type: 'char', length: 2, default: 'VN' })
  countryCode: string;

  @Column({ length: 10, default: 'vi-VN' })
  locale: string;

  @Column({ length: 50, default: 'Asia/Ho_Chi_Minh' })
  timezone: string;

  @Column({ name: 'currency_code', type: 'char', length: 3, default: 'VND' })
  currencyCode: string;

  @Column({ length: 20, default: 'active' })
  status: string;

  @Column({ name: 'onboarding_completed_at', type: 'timestamp', nullable: true })
  onboardingCompletedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @OneToMany(() => Location, (location) => location.tenant)
  locations: Location[];

  @OneToMany(() => Menu, (menu) => menu.tenant)
  menus: Menu[];

  @OneToMany(() => Category, (category) => category.tenant)
  categories: Category[];

  @OneToMany(() => MenuItem, (menuItem) => menuItem.tenant)
  menuItems: MenuItem[];
}
