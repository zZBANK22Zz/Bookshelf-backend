import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Request,
  NotFoundException,
  ForbiddenException
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('books')
@UseGuards(JwtAuthGuard)
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  create(@Body() dto: CreateBookDto) {
    return this.booksService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Request() req) {
    const { role, userId } = req.user;
    return this.booksService.findAll(role, userId);
  }
  
  

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(Number(id));
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateBookDto,
    @Request() req,
  ) {
    const book = await this.booksService.findOne(Number(id));
    
    if (!book) {
      throw new NotFoundException('Book not found');
    }

    if (book.userId !== req.user.userId && req.user.role !== 'ADMIN') {
      throw new ForbiddenException('You can only edit your own book.');
    }

    return this.booksService.update(Number(id), dto);
  }
  
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksService.remove(Number(id));
  }
}
