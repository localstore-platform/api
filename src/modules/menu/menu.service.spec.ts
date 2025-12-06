import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MenuService } from './menu.service';
import { Tenant } from './entities/tenant.entity';
import { Category } from './entities/category.entity';
import { MenuItem, ItemStatus } from './entities/menu-item.entity';
import { NotFoundException } from '@nestjs/common';

describe('MenuService', () => {
  let service: MenuService;

  const mockTenantId = '550e8400-e29b-41d4-a716-446655440000';

  const mockTenant = {
    id: mockTenantId,
    businessName: 'Phở Hà Nội 24',
    businessType: 'restaurant',
    address: '123 Nguyễn Huệ, Quận 1',
    phone: '+84912345678',
    locale: 'vi-VN',
    currencyCode: 'VND',
    status: 'active',
  };

  const mockCategory = {
    id: '550e8400-e29b-41d4-a716-446655440030',
    nameVi: 'Phở',
    nameEn: 'Pho',
    displayOrder: 1,
    isActive: true,
    tenantId: mockTenantId,
  };

  const mockMenuItem = {
    id: '550e8400-e29b-41d4-a716-446655440040',
    nameVi: 'Phở Bò Tái',
    nameEn: 'Rare Beef Pho',
    descriptionVi: 'Phở bò tái mềm',
    descriptionEn: 'Rare beef pho',
    basePrice: 75000,
    currencyCode: 'VND',
    isFeatured: true,
    isSpicy: false,
    isVegetarian: false,
    isVegan: false,
    status: ItemStatus.PUBLISHED,
    categoryId: mockCategory.id,
    tenantId: mockTenantId,
    displayOrder: 1,
    variants: [],
    addOns: [],
    images: [],
  };

  const mockTenantRepository = {
    findOne: jest.fn(),
  };

  const mockCategoryRepository = {
    find: jest.fn(),
  };

  const mockMenuItemRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenuService,
        {
          provide: getRepositoryToken(Tenant),
          useValue: mockTenantRepository,
        },
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoryRepository,
        },
        {
          provide: getRepositoryToken(MenuItem),
          useValue: mockMenuItemRepository,
        },
      ],
    }).compile();

    service = module.get<MenuService>(MenuService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPublicMenu', () => {
    it('should throw NotFoundException when tenant not found', async () => {
      mockTenantRepository.findOne.mockResolvedValue(null);

      await expect(service.getPublicMenu('invalid-id')).rejects.toThrow(NotFoundException);
    });

    it('should return public menu when tenant exists', async () => {
      mockTenantRepository.findOne.mockResolvedValue(mockTenant);
      mockCategoryRepository.find.mockResolvedValue([mockCategory]);
      mockMenuItemRepository.find.mockResolvedValue([mockMenuItem]);

      const result = await service.getPublicMenu(mockTenantId);

      expect(result).toHaveProperty('store');
      expect(result).toHaveProperty('categories');
      expect(result).toHaveProperty('meta');
      expect(result.store.businessName).toBe('Phở Hà Nội 24');
      expect(result.categories).toHaveLength(1);
      expect(result.categories[0].name).toBe('Phở');
    });
  });

  describe('getCategories', () => {
    it('should throw NotFoundException when tenant not found', async () => {
      mockTenantRepository.findOne.mockResolvedValue(null);

      await expect(service.getCategories('invalid-id')).rejects.toThrow(NotFoundException);
    });

    it('should return categories when tenant exists', async () => {
      mockTenantRepository.findOne.mockResolvedValue(mockTenant);
      mockCategoryRepository.find.mockResolvedValue([mockCategory]);
      mockMenuItemRepository.find.mockResolvedValue([mockMenuItem]);

      const result = await service.getCategories(mockTenantId);

      expect(result).toHaveProperty('categories');
      expect(result).toHaveProperty('meta');
      expect(result.meta.totalCategories).toBe(1);
      expect(result.meta.totalItems).toBe(1);
    });
  });

  describe('getMenuItem', () => {
    it('should throw NotFoundException when item not found', async () => {
      mockMenuItemRepository.findOne.mockResolvedValue(null);

      await expect(service.getMenuItem(mockTenantId, 'invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return menu item when found', async () => {
      mockMenuItemRepository.findOne.mockResolvedValue(mockMenuItem);

      const result = await service.getMenuItem(mockTenantId, mockMenuItem.id);

      expect(result).toHaveProperty('id', mockMenuItem.id);
      expect(result).toHaveProperty('name', 'Phở Bò Tái');
      expect(result).toHaveProperty('price', 75000);
    });
  });
});
