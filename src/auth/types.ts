export interface ClaudeOAuthCredentials {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  scopes: string[];
  subscriptionType: string;
  rateLimitTier: string;
}

export interface ClaudeCredentials {
  claudeAiOauth: ClaudeOAuthCredentials;
  organizationUuid: string;
}
