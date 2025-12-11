import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant, Category, MenuItem, ItemStatus } from './entities';
import {
  PublicMenuResponseDto,
  PublicMenuCategoriesResponseDto,
  PublicMenuCategoryDto,
  PublicMenuCategoryWithoutItemsDto,
  PublicMenuItemDto,
  PublicMenuStoreInfoDto,
  CategoryItemsResponseDto,
  CategoryInfoDto,
  MenuItemDetailResponseDto,
  MenuItemDetailDto,
} from './dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(MenuItem)
    private readonly menuItemRepository: Repository<MenuItem>,
  ) {}

  /**
   * Get public menu for a tenant
   * GET /api/v1/menu/:tenantSlug
   */
  async getPublicMenu(tenantSlug: string): Promise<PublicMenuResponseDto> {
    // Fetch tenant by slug
    const tenant = await this.tenantRepository.findOne({
      where: { slug: tenantSlug, status: 'active' },
    });

    if (!tenant) {
      throw new NotFoundException({
        code: 'TENANT_NOT_FOUND',
        message: 'Không tìm thấy cửa hàng',
        details: { tenantSlug },
      });
    }

    const tenantId = tenant.id;

    // Fetch categories with their items
    const categories = await this.categoryRepository.find({
      where: { tenantId, isActive: true },
      order: { displayOrder: 'ASC' },
    });

    // Fetch published menu items for this tenant
    const menuItems = await this.menuItemRepository.find({
      where: { tenantId, status: ItemStatus.PUBLISHED },
      relations: ['variants', 'addOns', 'images', 'category'],
      order: { displayOrder: 'ASC' },
    });

    // Group items by category
    const categoriesWithItems = this.groupItemsByCategory(categories, menuItems);

    // Calculate total items
    const totalItems = menuItems.length;

    return {
      store: this.mapTenantToStoreInfo(tenant),
      categories: categoriesWithItems,
      totalItems,
      currencyCode: tenant.currencyCode,
      lastUpdatedAt: new Date().toISOString(),
    };
  }

  /**
   * Get categories list for a tenant
   * GET /api/v1/menu/:tenantSlug/categories
   */
  async getCategories(tenantSlug: string): Promise<PublicMenuCategoriesResponseDto> {
    // Verify tenant exists by slug
    const tenant = await this.tenantRepository.findOne({
      where: { slug: tenantSlug, status: 'active' },
    });

    if (!tenant) {
      throw new NotFoundException({
        code: 'TENANT_NOT_FOUND',
        message: 'Không tìm thấy cửa hàng',
        details: { tenantSlug },
      });
    }

    const tenantId = tenant.id;

    // Fetch categories
    const categories = await this.categoryRepository.find({
      where: { tenantId, isActive: true },
      order: { displayOrder: 'ASC' },
    });

    // Map categories to DTO without items (per contracts)
    const categoriesWithoutItems: PublicMenuCategoryWithoutItemsDto[] = categories.map(
      (category) => ({
        id: category.id,
        slug: category.slug,
        name: category.nameVi,
        nameEn: category.nameEn || undefined,
        description: category.descriptionVi || undefined,
        displayOrder: category.displayOrder,
      }),
    );

    return {
      store: this.mapTenantToStoreInfo(tenant),
      categories: categoriesWithoutItems,
    };
  }

  /**
   * Get a single menu item by slug (SEO-friendly)
   * GET /api/v1/menu/:tenantSlug/:categorySlug/:itemSlug
   * Returns wrapped response per MenuItemDetailResponse from contracts v0.3.1
   */
  async getMenuItemBySlug(
    tenantSlug: string,
    categorySlug: string,
    itemSlug: string,
  ): Promise<MenuItemDetailResponseDto> {
    // Verify tenant exists by slug
    const tenant = await this.tenantRepository.findOne({
      where: { slug: tenantSlug, status: 'active' },
    });

    if (!tenant) {
      throw new NotFoundException({
        code: 'TENANT_NOT_FOUND',
        message: 'Không tìm thấy cửa hàng',
        details: { tenantSlug },
      });
    }

    // Verify category exists by slug
    const category = await this.categoryRepository.findOne({
      where: { slug: categorySlug, tenantId: tenant.id, isActive: true },
    });

    if (!category) {
      throw new NotFoundException({
        code: 'CATEGORY_NOT_FOUND',
        message: 'Không tìm thấy danh mục',
        details: { tenantSlug, categorySlug },
      });
    }

    // Find item by slug within the category
    const item = await this.menuItemRepository.findOne({
      where: {
        slug: itemSlug,
        tenantId: tenant.id,
        categoryId: category.id,
        status: ItemStatus.PUBLISHED,
      },
      relations: ['variants', 'addOns', 'images'],
    });

    if (!item) {
      throw new NotFoundException({
        code: 'ITEM_NOT_FOUND',
        message: 'Không tìm thấy sản phẩm',
        details: { tenantSlug, categorySlug, itemSlug },
      });
    }

    return {
      item: this.mapMenuItemToDetailDto(item),
      category: {
        id: category.id,
        name: category.nameVi,
      },
    };
  }

  /**
   * Get all items in a specific category
   * GET /api/v1/menu/:tenantSlug/:categorySlug
   */
  async getCategoryItems(
    tenantSlug: string,
    categorySlug: string,
  ): Promise<CategoryItemsResponseDto> {
    // Verify tenant exists by slug
    const tenant = await this.tenantRepository.findOne({
      where: { slug: tenantSlug, status: 'active' },
    });

    if (!tenant) {
      throw new NotFoundException({
        code: 'TENANT_NOT_FOUND',
        message: 'Không tìm thấy cửa hàng',
        details: { tenantSlug },
      });
    }

    // Verify category exists by slug and belongs to tenant
    const category = await this.categoryRepository.findOne({
      where: { slug: categorySlug, tenantId: tenant.id, isActive: true },
    });

    if (!category) {
      throw new NotFoundException({
        code: 'CATEGORY_NOT_FOUND',
        message: 'Không tìm thấy danh mục',
        details: { tenantSlug, categorySlug },
      });
    }

    // Fetch published menu items for this category
    const menuItems = await this.menuItemRepository.find({
      where: {
        tenantId: tenant.id,
        categoryId: category.id,
        status: ItemStatus.PUBLISHED,
      },
      relations: ['variants', 'addOns', 'images'],
      order: { displayOrder: 'ASC' },
    });

    return {
      store: this.mapTenantToStoreInfo(tenant),
      category: this.mapCategoryToInfo(category),
      items: menuItems.map((item) => this.mapMenuItemToDto(item)),
      totalItems: menuItems.length,
    };
  }

  /**
   * Map Category entity to CategoryInfoDto (without items)
   * Matches Omit<MenuCategoryDto, 'items'> from @localstore/contracts
   */
  private mapCategoryToInfo(category: Category): CategoryInfoDto {
    return {
      id: category.id,
      slug: category.slug,
      name: category.nameVi,
      nameEn: category.nameEn || undefined,
      description: category.descriptionVi || undefined,
      displayOrder: category.displayOrder,
    };
  }

  /**
   * Group menu items by their category
   */
  private groupItemsByCategory(
    categories: Category[],
    menuItems: MenuItem[],
  ): PublicMenuCategoryDto[] {
    return categories.map((category) => {
      const categoryItems = menuItems.filter((item) => item.categoryId === category.id);

      return {
        id: category.id,
        slug: category.slug,
        name: category.nameVi,
        nameEn: category.nameEn || undefined,
        description: category.descriptionVi || undefined,
        descriptionEn: category.descriptionEn || undefined,
        displayOrder: category.displayOrder,
        items: categoryItems.map((item) => this.mapMenuItemToDto(item)),
      };
    });
  }

  /**
   * Map Tenant entity to PublicMenuStoreInfoDto
   * Follows MenuStoreInfoDto from @localstore/contracts v0.3.0
   */
  private mapTenantToStoreInfo(tenant: Tenant): PublicMenuStoreInfoDto {
    return {
      id: tenant.id,
      name: tenant.businessName,
      slug: tenant.slug,
      logoUrl: tenant.logoUrl || null,
      primaryColor: tenant.primaryColor || null,
      businessType: tenant.businessType || null,
    };
  }

  /**
   * Map MenuItem entity to PublicMenuItemDto
   * Follows MenuItemDto from @localstore/contracts v0.3.0
   */
  private mapMenuItemToDto(item: MenuItem): PublicMenuItemDto {
    return {
      id: item.id,
      slug: item.slug,
      name: item.nameVi,
      nameEn: item.nameEn || null,
      description: item.descriptionVi || null,
      price: Number(item.basePrice),
      compareAtPrice: item.compareAtPrice ? Number(item.compareAtPrice) : null,
      currencyCode: item.currencyCode,
      imageUrl: item.thumbnailUrl || null,
      available: item.status === ItemStatus.PUBLISHED,
      isFeatured: item.isFeatured,
      isSpicy: item.isSpicy,
      isVegetarian: item.isVegetarian,
      isVegan: item.isVegan,
      displayOrder: item.displayOrder,
    };
  }

  /**
   * Map MenuItem entity to MenuItemDetailDto (extended with descriptionFull, images, variants, addOns)
   * Follows MenuItemDetailResponse.item from @localstore/contracts v0.3.1
   */
  private mapMenuItemToDetailDto(item: MenuItem): MenuItemDetailDto {
    return {
      // Base MenuItemDto fields
      id: item.id,
      slug: item.slug,
      name: item.nameVi,
      nameEn: item.nameEn || null,
      description: item.descriptionVi || null,
      price: Number(item.basePrice),
      compareAtPrice: item.compareAtPrice ? Number(item.compareAtPrice) : null,
      currencyCode: item.currencyCode,
      imageUrl: item.thumbnailUrl || null,
      available: item.status === ItemStatus.PUBLISHED,
      isFeatured: item.isFeatured,
      isSpicy: item.isSpicy,
      isVegetarian: item.isVegetarian,
      isVegan: item.isVegan,
      displayOrder: item.displayOrder,
      // Extended fields for detail view
      descriptionFull: item.descriptionVi || null,
      images: item.images?.map((img) => ({
        url: img.originalUrl,
        alt: img.altTextVi || null,
        isPrimary: img.isPrimary,
      })),
      variants: item.variants?.map((v) => ({
        id: v.id,
        name: v.nameVi,
        priceAdjustment: Number(v.priceAdjustment),
        available: v.isAvailable,
      })),
      addOns: item.addOns?.map((a) => ({
        id: a.id,
        name: a.nameVi,
        price: Number(a.price),
        isRequired: a.isRequired,
        available: a.isAvailable,
      })),
    };
  }
}
