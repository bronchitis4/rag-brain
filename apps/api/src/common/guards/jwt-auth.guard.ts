import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AUTH_ERRORS, TokenType } from '../../auth/constants/auth.constants';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException(AUTH_ERRORS.ACCESS_TOKEN_NOT_PROVIDED);
    }

    try {
      const payload = this.jwtService.verify(token);

      if (payload.type !== TokenType.ACCESS) {
        throw new UnauthorizedException(AUTH_ERRORS.INVALID_TOKEN_TYPE);
      }

      request['user'] = payload;
    } catch {
      throw new UnauthorizedException(AUTH_ERRORS.ACCESS_TOKEN_INVALID);
    }

    return true;
  }

  private extractToken(request: Request): string | null {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }
}
