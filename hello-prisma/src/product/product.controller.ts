import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProductService } from './product.service';
import { Prisma } from '@prisma/client';

const generateFilename = (req, file, cb) => {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  cb(null, uniqueSuffix + extname(file.originalname));
};

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [{ name: 'images', maxCount: 5 }],
      {
        storage: diskStorage({
          destination: './uploads/products',
          filename: generateFilename,
        }),
      }
    )
  )
  async createProduct(
    @Body() body: any,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
  ) {
    const parsedAttributes = body.attributes ? JSON.parse(body.attributes) : [];
    const parsedQuantities = body.quantityOptions ? JSON.parse(body.quantityOptions) : [];

    const imageFilenames = files.images?.map(file => file.filename).join(',') || '';

    const data: Prisma.ProductCreateInput = {
      name: body.name,
      category: body.category,
      base_price: parseFloat(body.base_price),
      available_stock: parseInt(body.available_stock),
      published: body.published !== 'false',
      images: imageFilenames,
      attributes: parsedAttributes,
      quantityOptions: parsedQuantities,
    };

    return this.productService.createProduct(data);
  }

  @Get()
  async getAllProducts() {
    return this.productService.getAllProducts();
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return this.productService.getProductById(Number(id));
  }

 @Put(':id')
@UseInterceptors(
  FileFieldsInterceptor(
    [{ name: 'images', maxCount: 5 }],
    {
      storage: diskStorage({
        destination: './uploads/products',
        filename: generateFilename,
      }),
    }
  )
)
async updateProduct(
  @Param('id') id: string,
  @Body() body: any,
  @UploadedFiles() files: { images?: Express.Multer.File[] }
) {
  const parsedAttributes = body.attributes
    ? JSON.parse(body.attributes)
    : null;

  const parsedQuantities = body.quantityOptions
    ? JSON.parse(body.quantityOptions)
    : null;

  const imageFilenames = files?.images?.map(file => file.filename).join(',') || '';

  const data: Prisma.ProductUpdateInput = {
    name: body.name,
    category: body.category,
    base_price: body.base_price ? parseFloat(body.base_price) : undefined,
    available_stock: body.available_stock ? parseInt(body.available_stock) : undefined,
    published: body.published !== undefined ? body.published !== 'false' : undefined,
    images: imageFilenames || undefined,
    ...(parsedAttributes && { attributes: parsedAttributes }),
    ...(parsedQuantities && { quantityOptions: parsedQuantities }),
  };

  return this.productService.updateProduct(Number(id), data);
}


  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProduct(Number(id));
  }
}
