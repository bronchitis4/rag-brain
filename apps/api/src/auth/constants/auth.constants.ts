export const AUTH_URLS = {
  GOOGLE_AUTH: 'https://accounts.google.com/o/oauth2/v2/auth',
  GOOGLE_TOKEN: 'https://oauth2.googleapis.com/token',
  GOOGLE_USER_INFO: 'https://www.googleapis.com/oauth2/v2/userinfo',
  FRONTEND_DEFAULT: 'http://localhost:3000',
};

export const AUTH_ERRORS = {
  MISSING_CODE: 'Authorization code not provided',
  AUTH_FAILED: 'Authentication failed',
  TOKEN_EXCHANGE_FAILED: 'Failed to exchange code for token',
  USER_INFO_FAILED: 'Failed to fetch user info from Google',
  NO_EMAIL: 'Google user email not found',
  ACCESS_TOKEN_NOT_PROVIDED: 'Access token not provided',
  INVALID_TOKEN_TYPE: 'Invalid token type',
  ACCESS_TOKEN_INVALID: 'Access token is invalid or expired',
};

export const AUTH_MESSAGES = {
  TOKENS_REFRESHED: 'Tokens refreshed successfully',
  LOGGED_OUT: 'Logged out successfully',
};

export const AUTH_SCOPES = {
  PROFILE_AND_EMAIL: ['profile', 'email'].join(' '),
};

export const JWT_EXPIRATION_TIME = '1d';

export enum TokenType {
  ACCESS = 'ACCESS',
  REFRESH = 'REFRESH',
}
