import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // Add this
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import { CategoryModule } from './category/category.module.js';
import { SubcategoryModule } from './subcategory/subcategory.module.js';
import { ProductModule } from './product/product.module.js';
import { ProductVariantModule } from './product-variant/product-variant.module.js';
import { SkuModule } from './sku/sku.module.js';
import { ProductAttributeModule } from './product-attribute/product-attribute.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Add this as the FIRST import
    PrismaModule,
    UsersModule,
    AuthModule,
    CategoryModule,
    SubcategoryModule,
    ProductModule,
    ProductVariantModule,
    SkuModule,
    ProductAttributeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
