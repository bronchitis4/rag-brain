import {
  Controller,
  Get,
  Post,
  Query,
  Redirect,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { AUTH_URLS, AUTH_ERRORS, AUTH_MESSAGES, AUTH_SCOPES } from './constants/auth.constants';
import { REFRESH_TOKEN_EXPIRATION_DAYS } from '../refresh-token/constants/refresh-token.constants';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  private setRefreshTokenCookie(res: Response, token: string) {
    const isProduction = this.configService.get<string>('NODE_ENV') === 'production';
    res.cookie('refreshToken', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: REFRESH_TOKEN_EXPIRATION_DAYS * 24 * 60 * 60 * 1000,
    });
  }

  @Get('google')
  @Redirect()
  googleAuth() {
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    const redirectUri = this.configService.get<string>('GOOGLE_CALLBACK_URL');

    const url = `${AUTH_URLS.GOOGLE_AUTH}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${AUTH_SCOPES.PROFILE_AND_EMAIL}&access_type=offline`;

    return { url };
  }

  @Get('google/callback')
  async googleAuthCallback(@Query('code') code: string, @Res() res: Response) {
    if (!code) {
      return res.status(400).json({ error: AUTH_ERRORS.MISSING_CODE });
    }

    try {
      const { refreshToken } = await this.authService.handleGoogleCallback(code);

      this.setRefreshTokenCookie(res, refreshToken);

      const frontendUrl = this.configService.get<string>('FRONTEND_URL');
      return res.redirect(`${frontendUrl}/hello`);
    } catch (error) {
      console.error(error);
      const frontendUrl = this.configService.get<string>('FRONTEND_URL');
      return res.redirect(`${frontendUrl}?error=auth_failed`);
    }
  }

  @Post('refresh')
  async refreshTokens(@Req() req: Request, @Res() res: Response) {
    const oldRefreshToken = req.cookies?.refreshToken;

    if (!oldRefreshToken) {
      throw new UnauthorizedException(AUTH_ERRORS.MISSING_CODE);
    }

    try {
      const { accessToken, refreshToken } =
        await this.authService.refreshAccessToken(oldRefreshToken);

      this.setRefreshTokenCookie(res, refreshToken);

      return res.status(200).json({
        message: AUTH_MESSAGES.TOKENS_REFRESHED,
        accessToken,
      });
    } catch (error) {
      res.clearCookie('refreshToken');
      throw new UnauthorizedException(AUTH_ERRORS.AUTH_FAILED);
    }
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }

    res.clearCookie('refreshToken');
    return res.status(200).json({ message: AUTH_MESSAGES.LOGGED_OUT });
  }
}
