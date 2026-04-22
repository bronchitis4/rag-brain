import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RefreshTokenRepository } from './refresh-token.repository';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import {
  REFRESH_TOKEN_ERRORS,
  REFRESH_TOKEN_EXPIRATION_DAYS,
  BCRYPT_SALT_ROUNDS,
  REFRESH_TOKEN_BYTES,
  TOKEN_DELIMITER,
  TOKEN_ID_INDEX,
  TOKEN_RAW_INDEX,
  HEX_ENCODING,
} from './constants/refresh-token.constants';

@Injectable()
export class RefreshTokenService {
  constructor(private readonly refreshTokenRepository: RefreshTokenRepository) {}

  async generateRefreshToken(userId: string): Promise<string> {
    const rawToken = randomBytes(REFRESH_TOKEN_BYTES).toString(HEX_ENCODING as BufferEncoding);
    const hashedToken = await bcrypt.hash(rawToken, BCRYPT_SALT_ROUNDS);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRATION_DAYS);

    const record = await this.refreshTokenRepository.create({
      token: hashedToken,
      userId,
      expiresAt,
    });

    return `${record.id}${TOKEN_DELIMITER}${rawToken}`;
  }

  async validateRefreshToken(tokenString: string) {
    const tokenParts = tokenString.split(TOKEN_DELIMITER);

    if (tokenParts.length !== 2) {
      throw new UnauthorizedException(REFRESH_TOKEN_ERRORS.MALFORMED);
    }

    const tokenId = tokenParts[TOKEN_ID_INDEX];
    const rawToken = tokenParts[TOKEN_RAW_INDEX];

    const refreshToken = await this.refreshTokenRepository.findById(tokenId);

    if (!refreshToken) {
      throw new UnauthorizedException(REFRESH_TOKEN_ERRORS.NOT_FOUND);
    }

    const isMatch = await bcrypt.compare(rawToken, refreshToken.token);

    if (!isMatch) {
      throw new UnauthorizedException(REFRESH_TOKEN_ERRORS.INVALID);
    }

    if (refreshToken.expiresAt < new Date()) {
      await this.refreshTokenRepository.deleteById(tokenId);
      throw new UnauthorizedException(REFRESH_TOKEN_ERRORS.EXPIRED);
    }

    return refreshToken;
  }

  async revokeRefreshToken(tokenString: string): Promise<void> {
    const tokenParts = tokenString.split(TOKEN_DELIMITER);

    if (tokenParts.length !== 2) {
      throw new UnauthorizedException(REFRESH_TOKEN_ERRORS.MALFORMED);
    }

    const tokenId = tokenParts[TOKEN_ID_INDEX];
    await this.refreshTokenRepository.deleteById(tokenId);
  }

  async revokeAllUserRefreshTokens(userId: string): Promise<void> {
    await this.refreshTokenRepository.deleteByUserId(userId);
  }
}
