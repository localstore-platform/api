import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// Type references from @localstore/contracts for documentation:
// - PublicMenuResponse, MenuCategoryDto, MenuItemDto, MenuStoreInfoDto
// - MenuCategoriesResponse, MenuItemDetailResponse
// These types are exported from ./index.ts for consumers

/**
 * DTO for item variant in public menu response
 * @see MenuItemDetailResponse.item.variants in @localstore/contracts
 */
export class MenuItemVariantDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  id: string;

  @ApiProperty({ example: 'Cỡ lớn' })
  name: string;

  @ApiPropertyOptional({ example: 'Large' })
  nameEn?: string;

  @ApiProperty({ example: 5000, description: 'Price adjustment in VND' })
  priceAdjustment: number;

  @ApiProperty({ example: true })
  isAvailable: boolean;
}

/**
 * DTO for item add-on in public menu response
 * @see MenuItemDetailResponse.item.add_ons in @localstore/contracts
 */
export class MenuItemAddOnDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440002' })
  id: string;

  @ApiProperty({ example: 'Thêm đá' })
  name: string;

  @ApiPropertyOptional({ example: 'Extra ice' })
  nameEn?: string;

  @ApiProperty({ example: 0, description: 'Additional price in VND' })
  price: number;

  @ApiProperty({ example: false })
  isRequired: boolean;

  @ApiProperty({ example: 1 })
  maxSelections: number;

  @ApiProperty({ example: true })
  isAvailable: boolean;
}

/**
 * DTO for item image in public menu response
 * @see MenuItemDetailResponse.item.images in @localstore/contracts
 */
export class MenuItemImageDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440003' })
  id: string;

  @ApiProperty({ example: 'https://cdn.localstore.vn/images/pho-bo.jpg' })
  url: string;

  @ApiPropertyOptional({ example: 'https://cdn.localstore.vn/images/pho-bo-thumb.jpg' })
  thumbnailUrl?: string;

  @ApiPropertyOptional({ example: 'Phở bò tái' })
  altText?: string;

  @ApiProperty({ example: true })
  isPrimary: boolean;
}

/**
 * DTO for individual menu item in public menu response
 * Implements MenuItemDto from @localstore/contracts with additional fields
 * @see MenuItemDto in @localstore/contracts
 */
export class PublicMenuItemDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440004' })
  id: string;

  @ApiProperty({ example: 'Phở bò tái' })
  name: string;

  @ApiPropertyOptional({ example: 'Rare Beef Pho' })
  nameEn?: string;

  @ApiPropertyOptional({ example: 'Phở bò tái mềm, nước dùng thanh ngọt' })
  description?: string;

  @ApiPropertyOptional({ example: 'Soft rare beef pho with light sweet broth' })
  descriptionEn?: string;

  @ApiProperty({ example: 75000, description: 'Base price in VND (integer)' })
  price: number;

  @ApiPropertyOptional({ example: 85000, description: 'Original price before discount' })
  compareAtPrice?: number;

  @ApiProperty({ example: 'VND' })
  currency: string;

  @ApiPropertyOptional({ example: 'https://cdn.localstore.vn/images/pho-bo-thumb.jpg' })
  thumbnailUrl?: string;

  @ApiProperty({ example: false })
  isFeatured: boolean;

  @ApiProperty({ example: false })
  isSpicy: boolean;

  @ApiProperty({ example: false })
  isVegetarian: boolean;

  @ApiProperty({ example: false })
  isVegan: boolean;

  @ApiProperty({ example: true })
  isAvailable: boolean;

  @ApiProperty({ type: [MenuItemVariantDto] })
  variants: MenuItemVariantDto[];

  @ApiProperty({ type: [MenuItemAddOnDto] })
  addOns: MenuItemAddOnDto[];

  @ApiProperty({ type: [MenuItemImageDto] })
  images: MenuItemImageDto[];
}

/**
 * DTO for category with items in public menu response
 * Implements MenuCategoryDto from @localstore/contracts
 * @see MenuCategoryDto in @localstore/contracts
 */
export class PublicMenuCategoryDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440005' })
  id: string;

  @ApiProperty({ example: 'Phở' })
  name: string;

  @ApiPropertyOptional({ example: 'Pho' })
  nameEn?: string;

  @ApiPropertyOptional({ example: 'Các món phở truyền thống Việt Nam' })
  description?: string;

  @ApiPropertyOptional({ example: 'Traditional Vietnamese pho dishes' })
  descriptionEn?: string;

  @ApiProperty({ example: 1 })
  displayOrder: number;

  @ApiProperty({ type: [PublicMenuItemDto] })
  items: PublicMenuItemDto[];
}

/**
 * DTO for tenant/store information in public menu response
 * Implements MenuStoreInfoDto from @localstore/contracts
 * @see MenuStoreInfoDto in @localstore/contracts
 */
export class PublicMenuStoreInfoDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'Phở Hà Nội 24' })
  businessName: string;

  @ApiPropertyOptional({ example: 'restaurant' })
  businessType?: string;

  @ApiPropertyOptional({ example: '123 Nguyễn Huệ, Q1, HCMC' })
  address?: string;

  @ApiPropertyOptional({ example: '+84912345678' })
  phone?: string;

  @ApiProperty({ example: 'vi-VN' })
  locale: string;

  @ApiProperty({ example: 'VND' })
  currency: string;
}

/**
 * Main DTO for public menu response
 * GET /api/v1/menu/:tenantId
 * Implements PublicMenuResponse from @localstore/contracts
 * @see PublicMenuResponse in @localstore/contracts
 */
export class PublicMenuResponseDto {
  @ApiProperty({ type: PublicMenuStoreInfoDto })
  store: PublicMenuStoreInfoDto;

  @ApiProperty({ type: [PublicMenuCategoryDto] })
  categories: PublicMenuCategoryDto[];

  @ApiProperty({
    type: 'object',
    properties: {
      timestamp: { type: 'string', example: '2025-12-06T12:00:00.000Z' },
      tenantId: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
    },
  })
  meta: {
    timestamp: string;
    tenantId: string;
  };
}

/**
 * DTO for categories-only response
 * GET /api/v1/menu/:tenantSlug/categories
 * Implements MenuCategoriesResponse from @localstore/contracts
 * @see MenuCategoriesResponse in @localstore/contracts
 */
export class PublicMenuCategoriesResponseDto {
  @ApiProperty({ type: [PublicMenuCategoryDto] })
  categories: PublicMenuCategoryDto[];

  @ApiProperty({
    type: 'object',
    properties: {
      timestamp: { type: 'string', example: '2025-12-06T12:00:00.000Z' },
      tenantId: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
      totalCategories: { type: 'number', example: 5 },
      totalItems: { type: 'number', example: 25 },
    },
  })
  meta: {
    timestamp: string;
    tenantId: string;
    totalCategories: number;
    totalItems: number;
  };
}

/**
 * DTO for category info without items
 * Used in CategoryItemsResponseDto
 */
export class CategoryInfoDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440005' })
  id: string;

  @ApiProperty({ example: 'pho', description: 'URL-friendly slug' })
  slug: string;

  @ApiProperty({ example: 'Phở' })
  name: string;

  @ApiPropertyOptional({ example: 'Pho' })
  nameEn?: string;

  @ApiPropertyOptional({ example: 'Các món phở truyền thống Việt Nam' })
  description?: string;

  @ApiPropertyOptional({ example: 'Traditional Vietnamese pho dishes' })
  descriptionEn?: string;

  @ApiProperty({ example: 1 })
  displayOrder: number;
}

/**
 * DTO for category items response
 * GET /api/v1/menu/:tenantSlug/categories/:categorySlug/items
 * Implements CategoryItemsResponse from @localstore/contracts
 * @see CategoryItemsResponse in @localstore/contracts
 */
export class CategoryItemsResponseDto {
  @ApiProperty({ type: PublicMenuStoreInfoDto })
  store: PublicMenuStoreInfoDto;

  @ApiProperty({ type: CategoryInfoDto })
  category: CategoryInfoDto;

  @ApiProperty({ type: [PublicMenuItemDto] })
  items: PublicMenuItemDto[];

  @ApiProperty({ example: 5, description: 'Total number of items in this category' })
  totalItems: number;
}
