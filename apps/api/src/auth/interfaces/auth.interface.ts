import { User } from '@rag-brain/database';
import { TokenType } from '../constants/auth.constants';

export interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

export interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
  id_token: string;
}

export interface AuthSuccessResponse {
  message: string;
  user: User;
  accessToken: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  type: TokenType;
}
