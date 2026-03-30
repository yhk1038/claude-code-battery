import { readKeychainCredentials } from './keychain.js';
import { readFileCredentials } from './file-store.js';
import type { ClaudeCredentials } from './types.js';

export type { ClaudeCredentials, ClaudeOAuthCredentials } from './types.js';

export async function getCredentials(): Promise<ClaudeCredentials> {
  const platform = process.platform;

  if (platform === 'darwin') {
    return readKeychainCredentials();
  }

  if (platform === 'win32' || platform === 'linux') {
    return readFileCredentials();
  }

  throw new Error(`Unsupported platform: ${platform}.`);
}

export function getAccessToken(credentials: ClaudeCredentials): string {
  return credentials.claudeAiOauth.accessToken;
}

export function isTokenExpired(credentials: ClaudeCredentials): boolean {
  return Date.now() >= credentials.claudeAiOauth.expiresAt;
}
