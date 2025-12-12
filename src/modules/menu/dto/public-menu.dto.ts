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

  @ApiProperty({
    example: 'https://images.unsplash.com/photo-1576577445504-6af96477db52?w=800&q=80',
  })
  url: string;

  @ApiPropertyOptional({
    example: 'https://images.unsplash.com/photo-1576577445504-6af96477db52?w=400&q=80',
  })
  thumbnailUrl?: string;

  @ApiPropertyOptional({ example: 'Phở bò tái' })
  altText?: string;

  @ApiProperty({ example: true })
  isPrimary: boolean;
}

/**
 * DTO for individual menu item in public menu response
 * Implements MenuItemDto from @localstore/contracts v0.3.0
 * @see MenuItemDto in @localstore/contracts
 */
export class PublicMenuItemDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440004' })
  id: string;

  @ApiProperty({ example: 'pho-bo-tai', description: 'URL-friendly slug' })
  slug: string;

  @ApiProperty({ example: 'Phở bò tái' })
  name: string;

  @ApiPropertyOptional({ example: 'Rare Beef Pho' })
  nameEn?: string | null;

  @ApiPropertyOptional({ example: 'Phở bò tái mềm, nước dùng thanh ngọt' })
  description?: string | null;

  @ApiProperty({ example: 75000, description: 'Price in VND (integer)' })
  price: number;

  @ApiPropertyOptional({ example: 85000, description: 'Original price for showing discounts' })
  compareAtPrice?: number | null;

  @ApiProperty({ example: 'VND', description: 'Currency code' })
  currencyCode: string;

  @ApiPropertyOptional({
    example: 'https://images.unsplash.com/photo-1576577445504-6af96477db52?w=400&q=80',
    description: 'Main image URL',
  })
  imageUrl?: string | null;

  @ApiProperty({ example: true, description: 'Whether item is currently available' })
  available: boolean;

  @ApiPropertyOptional({ example: false, description: 'Featured item flag' })
  isFeatured?: boolean;

  @ApiPropertyOptional({ example: false, description: 'Spicy indicator' })
  isSpicy?: boolean;

  @ApiPropertyOptional({ example: false, description: 'Vegetarian indicator' })
  isVegetarian?: boolean;

  @ApiPropertyOptional({ example: false, description: 'Vegan indicator' })
  isVegan?: boolean;

  @ApiProperty({ example: 1, description: 'Display order within category' })
  displayOrder: number;
}

/**
 * DTO for category with items in public menu response
 * Implements MenuCategoryDto from @localstore/contracts
 * @see MenuCategoryDto in @localstore/contracts
 */
export class PublicMenuCategoryDto {
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

  @ApiProperty({ type: [PublicMenuItemDto] })
  items: PublicMenuItemDto[];
}

/**
 * DTO for tenant/store information in public menu response
 * Implements MenuStoreInfoDto from @localstore/contracts
 * @see MenuStoreInfoDto in @localstore/contracts v0.3.0
 */
export class PublicMenuStoreInfoDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'Phở Hà Nội 24', description: 'Store/business name' })
  name: string;

  @ApiProperty({ example: 'pho-hanoi-24', description: 'URL-friendly slug' })
  slug: string;

  @ApiPropertyOptional({
    example: 'https://images.unsplash.com/photo-1503764654157-72d979d9af2f?w=200&h=200&fit=crop',
  })
  logoUrl?: string | null;

  @ApiPropertyOptional({ example: '#E53935', description: 'Primary brand color (hex)' })
  primaryColor?: string | null;

  @ApiPropertyOptional({ example: 'restaurant' })
  businessType?: string | null;
}

/**
 * Main DTO for public menu response
 * GET /api/v1/menu/:tenantSlug
 * Implements PublicMenuResponse from @localstore/contracts v0.3.0
 * @see PublicMenuResponse in @localstore/contracts
 */
export class PublicMenuResponseDto {
  @ApiProperty({ type: PublicMenuStoreInfoDto })
  store: PublicMenuStoreInfoDto;

  @ApiProperty({ type: [PublicMenuCategoryDto] })
  categories: PublicMenuCategoryDto[];

  @ApiProperty({ example: 13, description: 'Total number of items across all categories' })
  totalItems: number;

  @ApiProperty({ example: 'VND', description: 'Currency code used for prices' })
  currencyCode: string;

  @ApiProperty({ example: '2025-12-06T12:00:00.000Z', description: 'Last updated timestamp' })
  lastUpdatedAt: string;
}

/**
 * DTO for category without items
 * Used in MenuCategoriesResponse
 * @see MenuCategoriesResponse in @localstore/contracts v0.3.0
 */
export class PublicMenuCategoryWithoutItemsDto {
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

  @ApiProperty({ example: 1 })
  displayOrder: number;
}

/**
 * DTO for categories-only response
 * GET /api/v1/menu/:tenantSlug/categories
 * Implements MenuCategoriesResponse from @localstore/contracts v0.3.0
 * @see MenuCategoriesResponse in @localstore/contracts
 */
export class PublicMenuCategoriesResponseDto {
  @ApiProperty({ type: PublicMenuStoreInfoDto })
  store: PublicMenuStoreInfoDto;

  @ApiProperty({ type: [PublicMenuCategoryWithoutItemsDto] })
  categories: PublicMenuCategoryWithoutItemsDto[];
}

/**
 * DTO for category info without items
 * Used in CategoryItemsResponseDto
 * Matches Omit<MenuCategoryDto, 'items'> from @localstore/contracts
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

/**
 * DTO for image in item detail response
 * Matches MenuItemDetailResponse.item.images from @localstore/contracts v0.3.1
 */
export class ItemDetailImageDto {
  @ApiProperty({
    example: 'https://images.unsplash.com/photo-1576577445504-6af96477db52?w=800&q=80',
  })
  url: string;

  @ApiPropertyOptional({ example: 'Phở bò tái' })
  alt?: string | null;

  @ApiProperty({ example: true })
  isPrimary: boolean;
}

/**
 * DTO for variant in item detail response
 * Matches MenuItemDetailResponse.item.variants from @localstore/contracts v0.3.1
 */
export class ItemDetailVariantDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  id: string;

  @ApiProperty({ example: 'Cỡ lớn' })
  name: string;

  @ApiProperty({ example: 5000, description: 'Price adjustment in VND' })
  priceAdjustment: number;

  @ApiProperty({ example: true })
  available: boolean;
}

/**
 * DTO for add-on in item detail response
 * Matches MenuItemDetailResponse.item.addOns from @localstore/contracts v0.3.2
 */
export class ItemDetailAddOnDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440002' })
  id: string;

  @ApiProperty({ example: 'Thêm trứng' })
  name: string;

  @ApiPropertyOptional({ example: 'Extra Egg', description: 'English name for bilingual display' })
  nameEn?: string | null;

  @ApiPropertyOptional({
    example: 'https://lh3.googleusercontent.com/aida-public/...',
    description: 'Thumbnail image URL (48x48px)',
  })
  imageUrl?: string | null;

  @ApiProperty({ example: 5000, description: 'Additional price in VND' })
  price: number;

  @ApiProperty({ example: false })
  isRequired: boolean;

  @ApiProperty({ example: true })
  available: boolean;
}

/**
 * DTO for detailed menu item in item detail response
 * Extends MenuItemDto with descriptionFull, images, variants, addOns
 * Matches MenuItemDetailResponse.item from @localstore/contracts v0.3.1
 */
export class MenuItemDetailDto extends PublicMenuItemDto {
  @ApiPropertyOptional({
    example: 'Phở bò tái được làm từ thịt bò tươi ngon nhất, nước dùng ninh xương 24 tiếng.',
    description: 'Full detailed description',
  })
  descriptionFull?: string | null;

  @ApiPropertyOptional({ type: [ItemDetailImageDto], description: 'All item images' })
  images?: ItemDetailImageDto[];

  @ApiPropertyOptional({ type: [ItemDetailVariantDto], description: 'Available variants (sizes)' })
  variants?: ItemDetailVariantDto[];

  @ApiPropertyOptional({ type: [ItemDetailAddOnDto], description: 'Available add-ons' })
  addOns?: ItemDetailAddOnDto[];
}

/**
 * DTO for category info in item detail response
 * Simplified category info for context
 */
export class ItemDetailCategoryDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440005' })
  id: string;

  @ApiProperty({ example: 'Phở' })
  name: string;
}

/**
 * DTO for menu item detail response
 * GET /api/v1/menu/:tenantSlug/:categorySlug/:itemSlug
 * Implements MenuItemDetailResponse from @localstore/contracts v0.3.1
 * @see MenuItemDetailResponse in @localstore/contracts
 */
export class MenuItemDetailResponseDto {
  @ApiProperty({ type: MenuItemDetailDto, description: 'Item details' })
  item: MenuItemDetailDto;

  @ApiPropertyOptional({ type: ItemDetailCategoryDto, description: 'Category info' })
  category?: ItemDetailCategoryDto | null;
}
