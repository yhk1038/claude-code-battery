import { readKeychainCredentials } from './keychain.js';
import type { ClaudeCredentials } from './types.js';

export type { ClaudeCredentials, ClaudeOAuthCredentials } from './types.js';

export async function getCredentials(): Promise<ClaudeCredentials> {
  const platform = process.platform;

  if (platform === 'darwin') {
    return readKeychainCredentials();
  }

  // TODO: Windows / Linux 지원
  throw new Error(`Unsupported platform: ${platform}. Currently only macOS is supported.`);
}

export function getAccessToken(credentials: ClaudeCredentials): string {
  return credentials.claudeAiOauth.accessToken;
}

export function isTokenExpired(credentials: ClaudeCredentials): boolean {
  return Date.now() >= credentials.claudeAiOauth.expiresAt;
}
