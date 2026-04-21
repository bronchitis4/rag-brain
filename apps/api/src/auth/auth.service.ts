import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { JwtService } from '@nestjs/jwt';
import { AUTH_URLS, AUTH_ERRORS } from './constants/auth.constants';
import { GoogleUserInfo, GoogleTokenResponse, JwtPayload } from './interfaces/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly jwtService: JwtService,
  ) {}

  async handleGoogleCallback(code: string) {
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = this.configService.get<string>('GOOGLE_CLIENT_SECRET');
    const redirectUri = this.configService.get<string>('GOOGLE_CALLBACK_URL');

    const tokenResponse = await fetch(AUTH_URLS.GOOGLE_TOKEN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
        code,
      }),
    });

    if (!tokenResponse.ok) {
      throw new UnauthorizedException(AUTH_ERRORS.TOKEN_EXCHANGE_FAILED);
    }

    const tokenData: GoogleTokenResponse = await tokenResponse.json();
    const googleAccessToken = tokenData.access_token;

    const userResponse = await fetch(AUTH_URLS.GOOGLE_USER_INFO, {
      headers: {
        Authorization: `Bearer ${googleAccessToken}`,
      },
    });

    if (!userResponse.ok) {
      throw new UnauthorizedException(AUTH_ERRORS.USER_INFO_FAILED);
    }

    const googleUser: GoogleUserInfo = await userResponse.json();

    if (!googleUser.email) {
      throw new UnauthorizedException(AUTH_ERRORS.NO_EMAIL);
    }

    const user = await this.usersService.findOrCreate(googleUser.email, googleUser.name);

    const payload: JwtPayload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload);

    const refreshToken = await this.refreshTokenService.generateRefreshToken(user.id);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async refreshAccessToken(oldRefreshToken: string) {
    const validToken = await this.refreshTokenService.validateRefreshToken(oldRefreshToken);
    const user = validToken.user;

    const payload: JwtPayload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload);

    await this.refreshTokenService.revokeRefreshToken(oldRefreshToken);
    const newRefreshToken = await this.refreshTokenService.generateRefreshToken(user.id);

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }
}
