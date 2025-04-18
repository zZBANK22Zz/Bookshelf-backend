import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateBookDto) {
    return this.prisma.book.create({ data });
  }

  async findAll(role: string, userId: number) {
    if (role === 'ADMIN') {
      return this.prisma.book.findMany({
        include: { user: true },
      });
    }
  
    // ✅ USER ได้แค่หนังสือของตัวเอง
    return this.prisma.book.findMany({
      where: { userId },
      include: { user: true },
    });
  }
  

  findOne(id: number) {
    return this.prisma.book.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  update(id: number, data: UpdateBookDto) {
    return this.prisma.book.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.book.delete({ where: { id } });
  }
}
