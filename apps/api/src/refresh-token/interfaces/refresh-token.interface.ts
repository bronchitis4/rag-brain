import { RefreshToken, User } from '@rag-brain/database';

export interface CreateRefreshTokenDto {
  token: string;
  userId: string;
  expiresAt: Date;
}

export type RefreshTokenWithUser = RefreshToken & { user: User };
