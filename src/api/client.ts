import type { UsageResponse, ProfileResponse } from './types.js';

const BASE_URL = 'https://api.anthropic.com';

export class ClaudeCodeClient {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  private async request<T>(path: string, headers?: Record<string, string>): Promise<T> {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        ...headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API error ${response.status}: ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  }

  async getUsage(): Promise<UsageResponse> {
    return this.request<UsageResponse>('/api/oauth/usage', {
      'anthropic-beta': 'oauth-2025-04-20',
    });
  }

  async getProfile(): Promise<ProfileResponse> {
    return this.request<ProfileResponse>('/api/oauth/profile');
  }
}
