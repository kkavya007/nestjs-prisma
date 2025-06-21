// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProductController } from './product/product.controller';
import { ProductModule } from './product/product.module';

@Module({
  imports: [PrismaModule, ProductModule],
  controllers: [AppController, UserController, ProductController],
  providers: [UserService, PrismaService],
})
export class AppModule {}
