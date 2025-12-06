import { Test, TestingModule } from '@nestjs/testing';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';

describe('MenuController', () => {
  let controller: MenuController;
  let service: MenuService;

  const mockTenantId = '550e8400-e29b-41d4-a716-446655440000';
  const mockItemId = '550e8400-e29b-41d4-a716-446655440040';

  const mockPublicMenuResponse = {
    store: {
      id: mockTenantId,
      businessName: 'Phở Hà Nội 24',
      businessType: 'restaurant',
      address: '123 Nguyễn Huệ',
      phone: '+84912345678',
      locale: 'vi-VN',
      currency: 'VND',
    },
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
    id: mockItemId,
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

  const mockMenuService = {
    getPublicMenu: jest.fn(),
    getCategories: jest.fn(),
    getMenuItem: jest.fn(),
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
    it('should return public menu for valid tenant', async () => {
      mockMenuService.getPublicMenu.mockResolvedValue(mockPublicMenuResponse);

      const result = await controller.getPublicMenu(mockTenantId);

      expect(service.getPublicMenu).toHaveBeenCalledWith(mockTenantId);
      expect(result).toEqual(mockPublicMenuResponse);
    });
  });

  describe('getCategories', () => {
    it('should return categories for valid tenant', async () => {
      mockMenuService.getCategories.mockResolvedValue(mockCategoriesResponse);

      const result = await controller.getCategories(mockTenantId);

      expect(service.getCategories).toHaveBeenCalledWith(mockTenantId);
      expect(result).toEqual(mockCategoriesResponse);
    });
  });

  describe('getMenuItem', () => {
    it('should return menu item for valid tenant and item', async () => {
      mockMenuService.getMenuItem.mockResolvedValue(mockMenuItemResponse);

      const result = await controller.getMenuItem(mockTenantId, mockItemId);

      expect(service.getMenuItem).toHaveBeenCalledWith(mockTenantId, mockItemId);
      expect(result).toEqual(mockMenuItemResponse);
    });
  });
});
