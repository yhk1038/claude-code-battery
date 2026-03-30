# claude-code-battery

[English](README.en.md)

Claude Code의 내부 API를 래핑한 TypeScript SDK 및 CLI 패키지입니다. Claude Code 사용자의 API 사용량 및 계정 정보를 프로그래매틱하게 접근할 수 있습니다.

## 주의사항

- **비공식 API**: 이 패키지는 Claude Code 클라이언트의 비공식 내부 API를 사용합니다. Anthropic에서 공식으로 지원하지 않으므로 향후 변경될 수 있습니다.
- **Claude Code 로그인 필수**: 이 SDK를 사용하려면 로컬 환경에 Claude Code가 설치되어 있고 로그인되어 있어야 합니다.

## 설치

```bash
npm install claude-code-battery
```

Node.js 버전 20 이상이 필요합니다.

## 빠른 시작

### SDK 사용

```typescript
import { getCredentials, getAccessToken, ClaudeCodeClient } from 'claude-code-battery';

// 1. Claude Code 크레덴셜 읽기 (자동으로 플랫폼에 맞는 저장소에서 읽음)
const credentials = await getCredentials();

// 2. 접근 토큰 추출
const token = getAccessToken(credentials);

// 3. API 클라이언트 생성
const client = new ClaudeCodeClient(token);

// 4. 사용량 조회
const usage = await client.getUsage();
console.log(usage);

// 5. 프로필 정보 조회
const profile = await client.getProfile();
console.log(profile);
```

### CLI 사용

빌드 후 `ccb` 명령으로 사용할 수 있습니다.

```bash
# 빌드
npm run build

# 설치 (전역으로 사용하려면)
npm install -g .

# 사용량 조회
ccb oauth usage

# 프로필 조회
ccb oauth profile

# JSON 형식으로 출력
ccb oauth usage --json
```

## API 문서

### 인증 함수

#### `getCredentials(): Promise<ClaudeCredentials>`

Claude Code 저장소에서 크레덴셜을 읽습니다.

- **macOS**: Keychain에서 읽음
- **Windows/Linux**: `~/.claude/.credentials.json` 파일에서 읽음
- **커스터마이징**: `CLAUDE_CONFIG_DIR` 환경변수로 경로 지정 가능

```typescript
const credentials = await getCredentials();
```

#### `getAccessToken(credentials: ClaudeCredentials): string`

크레덴셜에서 접근 토큰을 추출합니다.

```typescript
const token = getAccessToken(credentials);
```

#### `isTokenExpired(credentials: ClaudeCredentials): boolean`

토큰이 만료되었는지 확인합니다.

```typescript
if (isTokenExpired(credentials)) {
  console.log('Token has expired');
}
```

### ClaudeCodeClient

API 호출을 위한 클라이언트 클래스입니다.

#### `constructor(accessToken: string)`

접근 토큰으로 클라이언트를 초기화합니다.

```typescript
const client = new ClaudeCodeClient(token);
```

#### `getUsage(): Promise<UsageResponse>`

사용량 정보를 조회합니다. 5시간, 7일 버킷별 이용률 정보를 반환합니다.

```typescript
const usage = await client.getUsage();
// {
//   five_hour: { utilization: 45, resets_at: '2024-01-01T12:00:00Z' },
//   seven_day: { utilization: 62, resets_at: '2024-01-08T00:00:00Z' },
//   seven_day_opus: { utilization: 30, resets_at: '2024-01-08T00:00:00Z' },
//   seven_day_sonnet: { utilization: 55, resets_at: '2024-01-08T00:00:00Z' },
//   extra_usage: { is_enabled: true, monthly_limit: 1000, ... }
// }
```

#### `getProfile(): Promise<ProfileResponse>`

계정 및 조직 프로필 정보를 조회합니다.

```typescript
const profile = await client.getProfile();
// {
//   account: {
//     uuid: '...',
//     display_name: 'John Doe',
//     email: 'john@example.com',
//     has_claude_pro: true,
//     ...
//   },
//   organization: {
//     name: 'My Org',
//     organization_type: 'free',
//     subscription_status: 'active',
//     ...
//   },
//   application: { ... }
// }
```

## 타입 정의

### UsageResponse

```typescript
interface UsageResponse {
  five_hour: UsageBucket | null;
  seven_day: UsageBucket | null;
  seven_day_oauth_apps: UsageBucket | null;
  seven_day_opus: UsageBucket | null;
  seven_day_sonnet: UsageBucket | null;
  seven_day_cowork: UsageBucket | null;
  extra_usage: ExtraUsage | null;
}
```

### UsageBucket

```typescript
interface UsageBucket {
  utilization: number;      // 0-100 %
  resets_at: string | null; // ISO 8601 형식의 리셋 시간
}
```

### ExtraUsage

```typescript
interface ExtraUsage {
  is_enabled: boolean;
  monthly_limit: number | null;
  used_credits: number | null;
  utilization: number | null;
}
```

### ProfileResponse

```typescript
interface ProfileResponse {
  account: AccountInfo;
  organization: OrganizationInfo;
  application: ApplicationInfo;
}
```

### AccountInfo

```typescript
interface AccountInfo {
  uuid: string;
  full_name: string;
  display_name: string;
  email: string;
  has_claude_max: boolean;
  has_claude_pro: boolean;
  created_at: string;
}
```

### OrganizationInfo

```typescript
interface OrganizationInfo {
  uuid: string;
  name: string;
  organization_type: string;
  billing_type: string;
  rate_limit_tier: string;
  has_extra_usage_enabled: boolean;
  subscription_status: string;
  subscription_created_at: string;
}
```

### ApplicationInfo

```typescript
interface ApplicationInfo {
  uuid: string;
  name: string;
  slug: string;
}
```

### ClaudeCredentials

```typescript
interface ClaudeCredentials {
  claudeAiOauth: ClaudeOAuthCredentials;
  organizationUuid: string;
}

interface ClaudeOAuthCredentials {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  scopes: string[];
  subscriptionType: string;
  rateLimitTier: string;
}
```

## CLI 명령어

### usage

사용량 제한 정보를 조회합니다.

```bash
ccb oauth usage

# 출력 예:
# Usage:
#   five hour: 45%
#   seven day: 62% (resets 2024-01-08T00:00:00)
#   seven day opus: 30% (resets 2024-01-08T00:00:00)
#   seven day sonnet: 55% (resets 2024-01-08T00:00:00)
#   extra usage: enabled
```

### profile

계정 및 조직 프로필을 조회합니다.

```bash
ccb oauth profile

# 출력 예:
# Profile:
#   name: John Doe
#   email: john@example.com
#   plan: free
#   org: My Organization
#   status: active
```

### 옵션

- `--json`: JSON 형식으로 출력
- `-h, --help`: 도움말 표시
- `-v, --version`: 버전 정보 표시

```bash
ccb oauth usage --json
ccb oauth profile --json
ccb --version
ccb --help
```

## 개발

### 설치

```bash
npm install
```

### 빌드

```bash
npm run build
```

TypeScript를 JavaScript로 컴파일합니다. 결과물은 `dist/` 디렉토리에 저장됩니다.

### Watch 모드

```bash
npm run dev
```

파일 변경을 감지하여 자동으로 컴파일합니다.

### 타입 검사

```bash
npm run lint
```

TypeScript 타입 검사를 실행합니다.

### 테스트

```bash
npm test
```

`dist/**/*.test.js` 파일을 실행합니다.

## 라이선스

MIT

## 작성자

yhk1038
