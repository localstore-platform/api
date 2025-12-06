import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { MenuService } from './menu.service';
import {
  PublicMenuResponseDto,
  PublicMenuCategoriesResponseDto,
  PublicMenuItemDto,
  ErrorResponseDto,
} from './dto';

/**
 * Public Menu Controller
 *
 * Provides public endpoints for viewing menu data.
 * These endpoints do NOT require authentication.
 *
 * Per Sprint 0.5 requirements:
 * - GET /api/v1/menu/:tenantId - Full menu with categories and items
 * - GET /api/v1/menu/:tenantId/categories - Categories list with items
 */
@ApiTags('menu')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  /**
   * Get public menu for a tenant
   * Returns full menu with store info, categories, and items
   */
  @Get(':tenantId')
  @ApiOperation({
    summary: 'Lấy thực đơn công khai của cửa hàng',
    description:
      'Trả về thực đơn đầy đủ với thông tin cửa hàng, danh mục và sản phẩm. Không yêu cầu xác thực.',
  })
  @ApiParam({
    name: 'tenantId',
    type: 'string',
    format: 'uuid',
    description: 'ID của cửa hàng (tenant)',
    example: '550e8400-e29b-41d4-a716-446655440000',
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
  async getPublicMenu(
    @Param('tenantId', ParseUUIDPipe) tenantId: string,
  ): Promise<PublicMenuResponseDto> {
    return this.menuService.getPublicMenu(tenantId);
  }

  /**
   * Get categories list for a tenant
   * Returns all active categories with their items
   */
  @Get(':tenantId/categories')
  @ApiOperation({
    summary: 'Lấy danh sách danh mục của cửa hàng',
    description: 'Trả về danh sách các danh mục với sản phẩm. Không yêu cầu xác thực.',
  })
  @ApiParam({
    name: 'tenantId',
    type: 'string',
    format: 'uuid',
    description: 'ID của cửa hàng (tenant)',
    example: '550e8400-e29b-41d4-a716-446655440000',
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
    @Param('tenantId', ParseUUIDPipe) tenantId: string,
  ): Promise<PublicMenuCategoriesResponseDto> {
    return this.menuService.getCategories(tenantId);
  }

  /**
   * Get a single menu item by ID
   * Returns detailed item information
   */
  @Get(':tenantId/items/:itemId')
  @ApiOperation({
    summary: 'Lấy thông tin chi tiết sản phẩm',
    description: 'Trả về thông tin chi tiết của một sản phẩm. Không yêu cầu xác thực.',
  })
  @ApiParam({
    name: 'tenantId',
    type: 'string',
    format: 'uuid',
    description: 'ID của cửa hàng (tenant)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiParam({
    name: 'itemId',
    type: 'string',
    format: 'uuid',
    description: 'ID của sản phẩm',
    example: '550e8400-e29b-41d4-a716-446655440001',
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
    @Param('tenantId', ParseUUIDPipe) tenantId: string,
    @Param('itemId', ParseUUIDPipe) itemId: string,
  ): Promise<PublicMenuItemDto> {
    return this.menuService.getMenuItem(tenantId, itemId);
  }
}
