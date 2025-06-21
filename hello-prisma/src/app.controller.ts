import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { UsersService } from './user.service';
import {
  User as UserModel,
  Prisma,
} from '@prisma/client';

@Controller()
export class AppController {
  constructor(
    private readonly userService: UsersService,
  ) {}

  // ===== USER ROUTES =====

  @Get('user/:id')
  async getUserById(@Param('id') id: string): Promise<UserModel | null> {
    return this.userService.user({ id: Number(id) });
  }

  @Get('users')
  async getAllUsers(): Promise<UserModel[]> {
    return this.userService.users({});
  }

  @Post('user')
  async createUser(
    @Body() userData: Prisma.UserCreateInput,
  ): Promise<UserModel> {
    return this.userService.createUser(userData);
  }

  @Put('user/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() data: Prisma.UserUpdateInput,
  ): Promise<UserModel> {
    return this.userService.updateUser({
      where: { id: Number(id) },
      data,
    });
  }

  @Delete('user/:id')
  async deleteUser(@Param('id') id: string): Promise<UserModel> {
    return this.userService.deleteUser({ id: Number(id) });
  }
}
