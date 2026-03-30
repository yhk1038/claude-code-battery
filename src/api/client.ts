import { OAuthApi } from './oauth.js';
import { getCredentials, getAccessToken } from '../auth/index.js';

const BASE_URL = 'https://api.anthropic.com';

export class ClaudeCodeClient {
  private accessToken?: string;
  private _oauth?: OAuthApi;

  constructor(accessToken?: string) {
    this.accessToken = accessToken;
  }

  get oauth(): OAuthApi {
    return this._oauth ??= new OAuthApi(this);
  }

  private async resolveToken(): Promise<string> {
    if (!this.accessToken) {
      const credentials = await getCredentials();
      this.accessToken = getAccessToken(credentials);
    }
    return this.accessToken;
  }

  async _request<T>(path: string, headers?: Record<string, string>): Promise<T> {
    const token = await this.resolveToken();
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        ...headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API error ${response.status}: ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  }
}
