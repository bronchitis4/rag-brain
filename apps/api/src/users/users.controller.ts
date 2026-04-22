import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Request } from 'express';
import { UsersService } from './users.service';
import { JwtPayload } from '../auth/interfaces/auth.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() req: Request) {
    const payload = req.user as JwtPayload;
    const user = await this.usersService.findById(payload.sub);

    return {
      name: user?.name,
      email: user?.email,
    };
  }
}
