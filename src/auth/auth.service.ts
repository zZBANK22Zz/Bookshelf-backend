import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(data: { email: string; name: string; password: string; role?: 'USER' | 'ADMIN' }) {
    // 🔍 Check ซ้ำก่อน
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
  
    if (existingUser) {
      throw new Error('This email is already registered.');
    }
  
    const hash = await bcrypt.hash(data.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hash,
        role: data.role || 'USER',
      },
    });
  
    const token = this.jwtService.sign({ userId: user.id, role: user.role });
    return { token };
  }
  

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({ userId: user.id, role: user.role });
    return { token };
  }
}
