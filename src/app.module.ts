import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // Add this
import { AppController } from '../src/app.controller.js';
import { AppService } from '../src/app.service.js';
import { PrismaModule } from '../src/prisma/prisma.module.js';
import { UsersModule } from '../src/users/users.module.js';
import { AuthModule } from '../src/auth/auth.module.js';
import { CategoryModule } from '../src/category/category.module.js';
import { SubcategoryModule } from '../src/subcategory/subcategory.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Add this as the FIRST import
    PrismaModule,
    UsersModule,
    AuthModule,
    CategoryModule,
    SubcategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
