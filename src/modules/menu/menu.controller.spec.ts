import { Test, TestingModule } from '@nestjs/testing';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';

describe('MenuController', () => {
  let controller: MenuController;
  let service: MenuService;

  const mockTenantSlug = 'pho-hanoi-24';
  const mockTenantId = '550e8400-e29b-41d4-a716-446655440000';
  const mockCategorySlug = 'pho';
  const mockItemSlug = 'pho-bo-tai';

  const mockStoreInfo = {
    id: mockTenantId,
    businessName: 'Phở Hà Nội 24',
    businessType: 'restaurant',
    address: '123 Nguyễn Huệ',
    phone: '+84912345678',
    locale: 'vi-VN',
    currency: 'VND',
  };

  const mockPublicMenuResponse = {
    store: mockStoreInfo,
    categories: [],
    meta: {
      timestamp: new Date().toISOString(),
      tenantId: mockTenantId,
    },
  };

  const mockCategoriesResponse = {
    categories: [],
    meta: {
      timestamp: new Date().toISOString(),
      tenantId: mockTenantId,
      totalCategories: 0,
      totalItems: 0,
    },
  };

  const mockMenuItemResponse = {
    id: '550e8400-e29b-41d4-a716-446655440040',
    slug: mockItemSlug,
    name: 'Phở Bò Tái',
    nameEn: 'Rare Beef Pho',
    description: 'Phở bò tái mềm',
    descriptionEn: 'Rare beef pho',
    price: 75000,
    currency: 'VND',
    isFeatured: true,
    isSpicy: false,
    isVegetarian: false,
    isVegan: false,
    isAvailable: true,
    variants: [],
    addOns: [],
    images: [],
  };

  const mockCategoryItemsResponse = {
    store: mockStoreInfo,
    category: {
      id: '550e8400-e29b-41d4-a716-446655440030',
      slug: mockCategorySlug,
      name: 'Phở',
      nameEn: 'Pho',
      description: 'Các món phở truyền thống Việt Nam',
      displayOrder: 1,
    },
    items: [mockMenuItemResponse],
    totalItems: 1,
  };

  const mockMenuService = {
    getPublicMenu: jest.fn(),
    getCategories: jest.fn(),
    getMenuItemBySlug: jest.fn(),
    getCategoryItems: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenuController],
      providers: [
        {
          provide: MenuService,
          useValue: mockMenuService,
        },
      ],
    }).compile();

    controller = module.get<MenuController>(MenuController);
    service = module.get<MenuService>(MenuService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getPublicMenu', () => {
    it('should return public menu for valid tenant slug', async () => {
      mockMenuService.getPublicMenu.mockResolvedValue(mockPublicMenuResponse);

      const result = await controller.getPublicMenu(mockTenantSlug);

      expect(service.getPublicMenu).toHaveBeenCalledWith(mockTenantSlug);
      expect(result).toEqual(mockPublicMenuResponse);
    });
  });

  describe('getCategories', () => {
    it('should return categories for valid tenant slug', async () => {
      mockMenuService.getCategories.mockResolvedValue(mockCategoriesResponse);

      const result = await controller.getCategories(mockTenantSlug);

      expect(service.getCategories).toHaveBeenCalledWith(mockTenantSlug);
      expect(result).toEqual(mockCategoriesResponse);
    });
  });

  describe('getCategoryItems', () => {
    it('should return items for valid tenant slug and category slug', async () => {
      mockMenuService.getCategoryItems.mockResolvedValue(mockCategoryItemsResponse);

      const result = await controller.getCategoryItems(mockTenantSlug, mockCategorySlug);

      expect(service.getCategoryItems).toHaveBeenCalledWith(mockTenantSlug, mockCategorySlug);
      expect(result).toEqual(mockCategoryItemsResponse);
    });
  });

  describe('getMenuItem', () => {
    it('should return menu item for valid tenant, category, and item slugs', async () => {
      mockMenuService.getMenuItemBySlug.mockResolvedValue(mockMenuItemResponse);

      const result = await controller.getMenuItem(mockTenantSlug, mockCategorySlug, mockItemSlug);

      expect(service.getMenuItemBySlug).toHaveBeenCalledWith(
        mockTenantSlug,
        mockCategorySlug,
        mockItemSlug,
      );
      expect(result).toEqual(mockMenuItemResponse);
    });
  });
});
