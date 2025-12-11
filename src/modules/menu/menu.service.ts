import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant, Category, MenuItem, ItemStatus } from './entities';
import {
  PublicMenuResponseDto,
  PublicMenuCategoriesResponseDto,
  PublicMenuCategoryDto,
  PublicMenuItemDto,
  PublicMenuStoreInfoDto,
  MenuItemVariantDto,
  MenuItemAddOnDto,
  MenuItemImageDto,
  CategoryItemsResponseDto,
  CategoryInfoDto,
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

    return {
      store: this.mapTenantToStoreInfo(tenant),
      categories: categoriesWithItems,
      meta: {
        timestamp: new Date().toISOString(),
        tenantId,
      },
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

    // Fetch published menu items for counting
    const menuItems = await this.menuItemRepository.find({
      where: { tenantId, status: ItemStatus.PUBLISHED },
      relations: ['variants', 'addOns', 'images', 'category'],
      order: { displayOrder: 'ASC' },
    });

    // Group items by category
    const categoriesWithItems = this.groupItemsByCategory(categories, menuItems);
    const totalItems = menuItems.length;

    return {
      categories: categoriesWithItems,
      meta: {
        timestamp: new Date().toISOString(),
        tenantId,
        totalCategories: categories.length,
        totalItems,
      },
    };
  }

  /**
   * Get a single menu item by slug (SEO-friendly)
   * GET /api/v1/menu/:tenantSlug/:categorySlug/:itemSlug
   */
  async getMenuItemBySlug(
    tenantSlug: string,
    categorySlug: string,
    itemSlug: string,
  ): Promise<PublicMenuItemDto> {
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

    return this.mapMenuItemToDto(item);
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
   */
  private mapCategoryToInfo(category: Category): CategoryInfoDto {
    return {
      id: category.id,
      slug: category.slug,
      name: category.nameVi,
      nameEn: category.nameEn || undefined,
      description: category.descriptionVi || undefined,
      descriptionEn: category.descriptionEn || undefined,
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
   */
  private mapTenantToStoreInfo(tenant: Tenant): PublicMenuStoreInfoDto {
    return {
      id: tenant.id,
      businessName: tenant.businessName,
      businessType: tenant.businessType || undefined,
      address: tenant.address || undefined,
      phone: tenant.phone || undefined,
      locale: tenant.locale,
      currency: tenant.currencyCode,
    };
  }

  /**
   * Map MenuItem entity to PublicMenuItemDto
   */
  private mapMenuItemToDto(item: MenuItem): PublicMenuItemDto {
    return {
      id: item.id,
      name: item.nameVi,
      nameEn: item.nameEn || undefined,
      description: item.descriptionVi || undefined,
      descriptionEn: item.descriptionEn || undefined,
      price: Number(item.basePrice),
      compareAtPrice: item.compareAtPrice ? Number(item.compareAtPrice) : undefined,
      currency: item.currencyCode,
      thumbnailUrl: item.thumbnailUrl || undefined,
      isFeatured: item.isFeatured,
      isSpicy: item.isSpicy,
      isVegetarian: item.isVegetarian,
      isVegan: item.isVegan,
      isAvailable: item.status === ItemStatus.PUBLISHED,
      variants: this.mapVariants(item.variants || []),
      addOns: this.mapAddOns(item.addOns || []),
      images: this.mapImages(item.images || []),
    };
  }

  /**
   * Map item variants to DTO
   */
  private mapVariants(variants: MenuItem['variants']): MenuItemVariantDto[] {
    if (!variants) return [];

    return variants
      .filter((v) => v.isAvailable)
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map((variant) => ({
        id: variant.id,
        name: variant.nameVi,
        nameEn: variant.nameEn || undefined,
        priceAdjustment: Number(variant.priceAdjustment),
        isAvailable: variant.isAvailable,
      }));
  }

  /**
   * Map item add-ons to DTO
   */
  private mapAddOns(addOns: MenuItem['addOns']): MenuItemAddOnDto[] {
    if (!addOns) return [];

    return addOns
      .filter((a) => a.isAvailable)
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map((addOn) => ({
        id: addOn.id,
        name: addOn.nameVi,
        nameEn: addOn.nameEn || undefined,
        price: Number(addOn.price),
        isRequired: addOn.isRequired,
        maxSelections: addOn.maxSelections,
        isAvailable: addOn.isAvailable,
      }));
  }

  /**
   * Map item images to DTO
   */
  private mapImages(images: MenuItem['images']): MenuItemImageDto[] {
    if (!images) return [];

    return images
      .sort((a, b) => {
        // Primary images first, then by display order
        if (a.isPrimary && !b.isPrimary) return -1;
        if (!a.isPrimary && b.isPrimary) return 1;
        return a.displayOrder - b.displayOrder;
      })
      .map((image) => ({
        id: image.id,
        url: image.originalUrl,
        thumbnailUrl: image.thumbnailUrl || undefined,
        altText: image.altTextVi || undefined,
        isPrimary: image.isPrimary,
      }));
  }
}
