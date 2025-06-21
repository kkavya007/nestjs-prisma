
import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UserService } from './user.service';
import { User as UserModel, Prisma } from '@prisma/client';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

 @Post()
@UseInterceptors(
  FileInterceptor('profile_image', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + extname(file.originalname));
      },
    }),
  }),
)
async createUser(
  @Body() body: any,
  @UploadedFile() file: Express.Multer.File,
): Promise<UserModel> {
  const parsedAddresses = body.addresses ? JSON.parse(body.addresses) : [];

  const data: Prisma.UserCreateInput = {
    mobile_number: body.mobile_number,
    role: body.role || 'user',
    first_name: body.first_name,
    last_name: body.last_name,
    email: body.email,
    gender: body.gender,
    age: body.age ? Number(body.age) : null,
    userName: body.userName,
    password: body.password,
    profile_image: file?.filename || null,
    addresses: parsedAddresses.length
      ? {
          create: parsedAddresses.map((addr: any) => ({
            address: addr.address,
            city: addr.city,
            district: addr.district,
            postalCode: addr.postalCode,
            landMark: addr.landMark,
            isDefault: addr.isDefault || false,
            isPrimary: addr.isPrimary || false,
          })),
        }
      : undefined,
  };

  return this.userService.createUser(data);
}

// @Get(':id')
// async getUserById(@Param('id') id: string): Promise<any> {
//   const user = await this.userService.user({ id: Number(id) });

//   if (!user) return null;

//   return {
//     ...user,
//     profile_image_url: user.profile_image
//       ? `http://localhost:3000/uploads/${user.profile_image}`
//       : null,
//   };
// }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<UserModel | null> {
    return this.userService.user({ id: Number(id) });
  }

  @Get()
  async getAllUsers(): Promise<UserModel[]> {
    return this.userService.users({});
  }

@Put(':id')
@UseInterceptors(
  FileInterceptor('profile_image', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + extname(file.originalname));
      },
    }),
  }),
)
async updateUser(
  @Param('id') id: string,
  @Body() body: any,
  @UploadedFile() file: Express.Multer.File,
): Promise<UserModel> {
  const parsedAddresses = body.addresses ? JSON.parse(body.addresses) : [];

  const data: Prisma.UserUpdateInput = {
    mobile_number: body.mobile_number,
    role: body.role,
    first_name: body.first_name,
    last_name: body.last_name,
    email: body.email,
    gender: body.gender,
    age: body.age ? Number(body.age) : undefined,
    userName: body.userName,
    password: body.password,
    ...(file && { profile_image: file.filename }),
    ...(parsedAddresses.length && {
      addresses: {
        deleteMany: {}, // Deletes all existing addresses for this user
        create: parsedAddresses.map((addr: any) => ({
          address: addr.address,
          city: addr.city,
          district: addr.district,
          postalCode: addr.postalCode,
          landMark: addr.landMark,
          isDefault: addr.isDefault || false,
          isPrimary: addr.isPrimary || false,
        })),
      },
    }),
  };

  return this.userService.updateUser({
    where: { id: Number(id) },
    data,
  });
}


  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<UserModel> {
    return this.userService.deleteUser({ id: Number(id) });
  }
}
