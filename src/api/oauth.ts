import type { ClaudeCodeClient } from './client.js';
import type { UsageResponse, ProfileResponse } from './types.js';

export class OAuthApi {
  constructor(private readonly client: ClaudeCodeClient) {}

  async getUsage(): Promise<UsageResponse> {
    return this.client._request<UsageResponse>('/api/oauth/usage', {
      'anthropic-beta': 'oauth-2025-04-20',
    });
  }

  async getProfile(): Promise<ProfileResponse> {
    return this.client._request<ProfileResponse>('/api/oauth/profile');
  }
}
