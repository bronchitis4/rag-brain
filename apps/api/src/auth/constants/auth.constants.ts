export const AUTH_URLS = {
  GOOGLE_AUTH: 'https://accounts.google.com/o/oauth2/v2/auth',
  GOOGLE_TOKEN: 'https://oauth2.googleapis.com/token',
  GOOGLE_USER_INFO: 'https://www.googleapis.com/oauth2/v2/userinfo',
};

export const AUTH_ERRORS = {
  MISSING_CODE: 'Authorization code not provided',
  AUTH_FAILED: 'Authentication failed',
  TOKEN_EXCHANGE_FAILED: 'Failed to exchange code for token',
  USER_INFO_FAILED: 'Failed to fetch user info from Google',
  NO_EMAIL: 'Google user email not found',
};

export const AUTH_SCOPES = {
  PROFILE_AND_EMAIL: ['profile', 'email'].join(' '),
};
