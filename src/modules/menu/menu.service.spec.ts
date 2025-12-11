import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MenuService } from './menu.service';
import { Tenant } from './entities/tenant.entity';
import { Category } from './entities/category.entity';
import { MenuItem, ItemStatus } from './entities/menu-item.entity';
import { NotFoundException } from '@nestjs/common';

describe('MenuService', () => {
  let service: MenuService;

  const mockTenantSlug = 'pho-hanoi-24';
  const mockTenantId = '550e8400-e29b-41d4-a716-446655440000';

  const mockTenant = {
    id: mockTenantId,
    slug: mockTenantSlug,
    businessName: 'Phở Hà Nội 24',
    businessType: 'restaurant',
    address: '123 Nguyễn Huệ, Quận 1',
    phone: '+84912345678',
    locale: 'vi-VN',
    currencyCode: 'VND',
    logoUrl: 'https://cdn.localstore.vn/logos/pho-hanoi-24.png',
    primaryColor: '#E53935',
    status: 'active',
  };

  const mockCategorySlug = 'pho';
  const mockCategory = {
    id: '550e8400-e29b-41d4-a716-446655440030',
    slug: mockCategorySlug,
    nameVi: 'Phở',
    nameEn: 'Pho',
    displayOrder: 1,
    isActive: true,
    tenantId: mockTenantId,
  };

  const mockItemSlug = 'pho-bo-tai';
  const mockMenuItem = {
    id: '550e8400-e29b-41d4-a716-446655440040',
    slug: mockItemSlug,
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
    findOne: jest.fn(),
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
    it('should throw NotFoundException when tenant slug not found', async () => {
      mockTenantRepository.findOne.mockResolvedValue(null);

      await expect(service.getPublicMenu('invalid-slug')).rejects.toThrow(NotFoundException);
    });

    it('should return public menu when tenant slug exists', async () => {
      mockTenantRepository.findOne.mockResolvedValue(mockTenant);
      mockCategoryRepository.find.mockResolvedValue([mockCategory]);
      mockMenuItemRepository.find.mockResolvedValue([mockMenuItem]);

      const result = await service.getPublicMenu(mockTenantSlug);

      expect(result).toHaveProperty('store');
      expect(result).toHaveProperty('categories');
      expect(result).toHaveProperty('totalItems');
      expect(result).toHaveProperty('currencyCode', 'VND');
      expect(result).toHaveProperty('lastUpdatedAt');
      expect(result.store.name).toBe('Phở Hà Nội 24');
      expect(result.store.slug).toBe('pho-hanoi-24');
      expect(result.store.logoUrl).toBe('https://cdn.localstore.vn/logos/pho-hanoi-24.png');
      expect(result.store.primaryColor).toBe('#E53935');
      expect(result.categories).toHaveLength(1);
      expect(result.categories[0].name).toBe('Phở');
      expect(result.categories[0].slug).toBe('pho');
      expect(result.categories[0].items[0].slug).toBe('pho-bo-tai');
    });
  });

  describe('getCategories', () => {
    it('should throw NotFoundException when tenant slug not found', async () => {
      mockTenantRepository.findOne.mockResolvedValue(null);

      await expect(service.getCategories('invalid-slug')).rejects.toThrow(NotFoundException);
    });

    it('should return categories when tenant slug exists', async () => {
      mockTenantRepository.findOne.mockResolvedValue(mockTenant);
      mockCategoryRepository.find.mockResolvedValue([mockCategory]);
      mockMenuItemRepository.find.mockResolvedValue([mockMenuItem]);

      const result = await service.getCategories(mockTenantSlug);

      expect(result).toHaveProperty('store');
      expect(result).toHaveProperty('categories');
      expect(result.store.name).toBe('Phở Hà Nội 24');
      expect(result.categories).toHaveLength(1);
      expect(result.categories[0].name).toBe('Phở');
      expect(result.categories[0].slug).toBe('pho');
    });
  });

  describe('getMenuItemBySlug', () => {
    it('should throw NotFoundException when tenant slug not found', async () => {
      mockTenantRepository.findOne.mockResolvedValue(null);

      await expect(
        service.getMenuItemBySlug('invalid-slug', mockCategorySlug, mockItemSlug),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when category slug not found', async () => {
      mockTenantRepository.findOne.mockResolvedValue(mockTenant);
      mockCategoryRepository.findOne.mockResolvedValue(null);

      await expect(
        service.getMenuItemBySlug(mockTenantSlug, 'invalid-category', mockItemSlug),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when item slug not found', async () => {
      mockTenantRepository.findOne.mockResolvedValue(mockTenant);
      mockCategoryRepository.findOne.mockResolvedValue(mockCategory);
      mockMenuItemRepository.findOne.mockResolvedValue(null);

      await expect(
        service.getMenuItemBySlug(mockTenantSlug, mockCategorySlug, 'invalid-item'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should return menu item when found by slug', async () => {
      mockTenantRepository.findOne.mockResolvedValue(mockTenant);
      mockCategoryRepository.findOne.mockResolvedValue(mockCategory);
      mockMenuItemRepository.findOne.mockResolvedValue(mockMenuItem);

      const result = await service.getMenuItemBySlug(
        mockTenantSlug,
        mockCategorySlug,
        mockItemSlug,
      );

      expect(result).toHaveProperty('id', mockMenuItem.id);
      expect(result).toHaveProperty('slug', 'pho-bo-tai');
      expect(result).toHaveProperty('name', 'Phở Bò Tái');
      expect(result).toHaveProperty('price', 75000);
    });
  });

  describe('getCategoryItems', () => {
    it('should throw NotFoundException when tenant slug not found', async () => {
      mockTenantRepository.findOne.mockResolvedValue(null);

      await expect(service.getCategoryItems('invalid-slug', mockCategorySlug)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when category not found', async () => {
      mockTenantRepository.findOne.mockResolvedValue(mockTenant);
      mockCategoryRepository.findOne.mockResolvedValue(null);

      await expect(service.getCategoryItems(mockTenantSlug, 'invalid-slug')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return category items when found', async () => {
      mockTenantRepository.findOne.mockResolvedValue(mockTenant);
      mockCategoryRepository.findOne.mockResolvedValue(mockCategory);
      mockMenuItemRepository.find.mockResolvedValue([mockMenuItem]);

      const result = await service.getCategoryItems(mockTenantSlug, mockCategorySlug);

      expect(result).toHaveProperty('store');
      expect(result).toHaveProperty('category');
      expect(result).toHaveProperty('items');
      expect(result).toHaveProperty('totalItems', 1);
      expect(result.store.name).toBe('Phở Hà Nội 24');
      expect(result.store.slug).toBe('pho-hanoi-24');
      expect(result.category.name).toBe('Phở');
      expect(result.category.slug).toBe('pho');
      expect(result.items).toHaveLength(1);
      expect(result.items[0].name).toBe('Phở Bò Tái');
      expect(result.items[0].slug).toBe('pho-bo-tai');
      expect(result.items[0].currencyCode).toBe('VND');
      expect(result.items[0].available).toBe(true);
    });
  });
});
