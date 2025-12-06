// Re-export DTO types from @localstore/contracts for type consistency
export type {
  PublicMenuResponse,
  MenuCategoryDto,
  MenuItemDto,
  MenuStoreInfoDto,
  MenuCategoriesResponse,
  MenuItemDetailResponse,
  MenuItemModifierDto,
  MenuItemManagementDto,
  CreateMenuItemRequest,
  UpdateMenuItemRequest,
} from '@localstore/contracts';

export * from './public-menu.dto';
export * from './error-response.dto';
