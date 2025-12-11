import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { MenuService } from './menu.service';
import {
  PublicMenuResponseDto,
  PublicMenuCategoriesResponseDto,
  PublicMenuItemDto,
  ErrorResponseDto,
  CategoryItemsResponseDto,
} from './dto';

/**
 * Public Menu Controller
 *
 * Provides public endpoints for viewing menu data.
 * These endpoints do NOT require authentication.
 *
 * SEO-friendly URL structure:
 * - GET /api/v1/menu/:tenantSlug - Full menu with categories and items
 * - GET /api/v1/menu/:tenantSlug/categories - Categories list only
 * - GET /api/v1/menu/:tenantSlug/:categorySlug - Items in a specific category
 * - GET /api/v1/menu/:tenantSlug/:categorySlug/:itemSlug - Single item details
 *
 * Examples:
 * - /api/v1/menu/pho-hanoi-24 → Full menu
 * - /api/v1/menu/pho-hanoi-24/pho → All phở items
 * - /api/v1/menu/pho-hanoi-24/pho/pho-tai-vien → Phở tái viên details
 */
@ApiTags('menu')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  /**
   * Get public menu for a tenant
   * Returns full menu with store info, categories, and items
   */
  @Get(':tenantSlug')
  @ApiOperation({
    summary: 'Lấy thực đơn công khai của cửa hàng',
    description:
      'Trả về thực đơn đầy đủ với thông tin cửa hàng, danh mục và sản phẩm. Không yêu cầu xác thực.',
  })
  @ApiParam({
    name: 'tenantSlug',
    type: 'string',
    description: 'Slug URL của cửa hàng (ví dụ: pho-hanoi-24)',
    example: 'pho-hanoi-24',
  })
  @ApiResponse({
    status: 200,
    description: 'Thực đơn công khai',
    type: PublicMenuResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy cửa hàng',
    type: ErrorResponseDto,
  })
  async getPublicMenu(@Param('tenantSlug') tenantSlug: string): Promise<PublicMenuResponseDto> {
    return this.menuService.getPublicMenu(tenantSlug);
  }

  /**
   * Get categories list for a tenant
   * Returns all active categories with their items
   */
  @Get(':tenantSlug/categories')
  @ApiOperation({
    summary: 'Lấy danh sách danh mục của cửa hàng',
    description: 'Trả về danh sách các danh mục với sản phẩm. Không yêu cầu xác thực.',
  })
  @ApiParam({
    name: 'tenantSlug',
    type: 'string',
    description: 'Slug URL của cửa hàng (ví dụ: pho-hanoi-24)',
    example: 'pho-hanoi-24',
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách danh mục',
    type: PublicMenuCategoriesResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy cửa hàng',
    type: ErrorResponseDto,
  })
  async getCategories(
    @Param('tenantSlug') tenantSlug: string,
  ): Promise<PublicMenuCategoriesResponseDto> {
    return this.menuService.getCategories(tenantSlug);
  }

  /**
   * Get all items in a specific category
   * Returns items with store and category info
   */
  @Get(':tenantSlug/:categorySlug')
  @ApiOperation({
    summary: 'Lấy sản phẩm theo danh mục',
    description: 'Trả về danh sách sản phẩm trong một danh mục cụ thể. Không yêu cầu xác thực.',
  })
  @ApiParam({
    name: 'tenantSlug',
    type: 'string',
    description: 'Slug URL của cửa hàng (ví dụ: pho-hanoi-24)',
    example: 'pho-hanoi-24',
  })
  @ApiParam({
    name: 'categorySlug',
    type: 'string',
    description: 'Slug URL của danh mục (ví dụ: pho, bun, com)',
    example: 'pho',
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách sản phẩm trong danh mục',
    type: CategoryItemsResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy cửa hàng hoặc danh mục',
    type: ErrorResponseDto,
  })
  async getCategoryItems(
    @Param('tenantSlug') tenantSlug: string,
    @Param('categorySlug') categorySlug: string,
  ): Promise<CategoryItemsResponseDto> {
    return this.menuService.getCategoryItems(tenantSlug, categorySlug);
  }

  /**
   * Get a single menu item by slug
   * Returns detailed item information
   */
  @Get(':tenantSlug/:categorySlug/:itemSlug')
  @ApiOperation({
    summary: 'Lấy thông tin chi tiết sản phẩm',
    description: 'Trả về thông tin chi tiết của một sản phẩm. Không yêu cầu xác thực.',
  })
  @ApiParam({
    name: 'tenantSlug',
    type: 'string',
    description: 'Slug URL của cửa hàng (ví dụ: pho-hanoi-24)',
    example: 'pho-hanoi-24',
  })
  @ApiParam({
    name: 'categorySlug',
    type: 'string',
    description: 'Slug URL của danh mục (ví dụ: pho)',
    example: 'pho',
  })
  @ApiParam({
    name: 'itemSlug',
    type: 'string',
    description: 'Slug URL của sản phẩm (ví dụ: pho-tai-vien)',
    example: 'pho-tai-vien',
  })
  @ApiResponse({
    status: 200,
    description: 'Thông tin sản phẩm',
    type: PublicMenuItemDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy sản phẩm',
    type: ErrorResponseDto,
  })
  async getMenuItem(
    @Param('tenantSlug') tenantSlug: string,
    @Param('categorySlug') categorySlug: string,
    @Param('itemSlug') itemSlug: string,
  ): Promise<PublicMenuItemDto> {
    return this.menuService.getMenuItemBySlug(tenantSlug, categorySlug, itemSlug);
  }
}
