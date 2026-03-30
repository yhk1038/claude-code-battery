import { OAuthApi } from './oauth.js';

const BASE_URL = 'https://api.anthropic.com';

export class ClaudeCodeClient {
  private readonly accessToken: string;
  private _oauth?: OAuthApi;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  get oauth(): OAuthApi {
    return this._oauth ??= new OAuthApi(this);
  }

  async _request<T>(path: string, headers?: Record<string, string>): Promise<T> {
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
}
