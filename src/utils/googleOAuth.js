import { OAuth2Client } from 'google-auth-library';

import { getEnvVar } from './getEnvVar.js';

const googleOAuth2Client = new OAuth2Client({
  clientId: getEnvVar('GOOGLE_CLIENT_ID'),
  clientSecret: getEnvVar('GOOGLE_CLIENT_SECRET'),
  redirectUri: getEnvVar('GOOGLE_REDIRECT_URI'),
});

export async function getOAuthURL() {
  return googleOAuth2Client.generateAuthUrl({
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  });
}

export async function validateCode(code) {
  const response = await googleOAuth2Client.getToken(code);

  return googleOAuth2Client.verifyIdToken({
    idToken: response.tokens.id_token,
  });
}
