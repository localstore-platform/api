import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import {
  Tenant,
  Location,
  Menu,
  Category,
  MenuItem,
  ItemVariant,
  ItemAddOn,
  ItemImage,
} from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Tenant,
      Location,
      Menu,
      Category,
      MenuItem,
      ItemVariant,
      ItemAddOn,
      ItemImage,
    ]),
  ],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [MenuService],
})
export class MenuModule {}
