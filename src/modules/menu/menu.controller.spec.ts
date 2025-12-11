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
    name: 'Phở Hà Nội 24',
    slug: mockTenantSlug,
    logoUrl: 'https://cdn.localstore.vn/logos/pho-hanoi-24.png',
    primaryColor: '#E53935',
    businessType: 'restaurant',
  };

  const mockPublicMenuResponse = {
    store: mockStoreInfo,
    categories: [],
    totalItems: 0,
    currencyCode: 'VND',
    lastUpdatedAt: new Date().toISOString(),
  };

  const mockCategoriesResponse = {
    store: mockStoreInfo,
    categories: [],
  };

  const mockMenuItemResponse = {
    id: '550e8400-e29b-41d4-a716-446655440040',
    name: 'Phở Bò Tái',
    nameEn: 'Rare Beef Pho',
    description: 'Phở bò tái mềm',
    price: 75000,
    compareAtPrice: null,
    currencyCode: 'VND',
    imageUrl: null,
    available: true,
    isFeatured: true,
    isSpicy: false,
    isVegetarian: false,
    isVegan: false,
    displayOrder: 1,
  };

  const mockCategoryItemsResponse = {
    store: mockStoreInfo,
    category: {
      id: '550e8400-e29b-41d4-a716-446655440030',
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
