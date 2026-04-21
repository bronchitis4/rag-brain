import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RefreshToken } from '@rag-brain/database';
import { CreateRefreshTokenDto, RefreshTokenWithUser } from './interfaces/refresh-token.interface';

@Injectable()
export class RefreshTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateRefreshTokenDto): Promise<RefreshToken> {
    return this.prisma.refreshToken.create({
      data,
    });
  }

  async findById(id: string): Promise<RefreshTokenWithUser | null> {
    return this.prisma.refreshToken.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  async findByToken(token: string): Promise<RefreshTokenWithUser | null> {
    return this.prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });
  }

  async deleteById(id: string): Promise<void> {
    await this.prisma.refreshToken.delete({
      where: { id },
    });
  }

  async deleteByToken(token: string): Promise<void> {
    await this.prisma.refreshToken.delete({
      where: { token },
    });
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }
}
