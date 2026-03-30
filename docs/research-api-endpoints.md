# 리서치: Claude Code API 엔드포인트

## 베이스 URL

`https://api.anthropic.com`

## 인증 헤더

```
Authorization: Bearer <accessToken>
```

accessToken은 키체인의 `claudeAiOauth.accessToken` 값 (sk-ant-oat01-... 형태).

---

## 1. Usage API

사용량 조회.

- **Method**: `GET`
- **Path**: `/api/oauth/usage`
- **추가 헤더**: `anthropic-beta: oauth-2025-04-20`

### 응답 예시

```json
{
  "five_hour": {
    "utilization": 10.0,
    "resets_at": "2026-03-30T06:00:00.180500+00:00"
  },
  "seven_day": {
    "utilization": 2.0,
    "resets_at": "2026-04-05T03:00:01.180517+00:00"
  },
  "seven_day_oauth_apps": null,
  "seven_day_opus": null,
  "seven_day_sonnet": {
    "utilization": 0.0,
    "resets_at": null
  },
  "seven_day_cowork": null,
  "iguana_necktie": null,
  "extra_usage": {
    "is_enabled": false,
    "monthly_limit": null,
    "used_credits": null,
    "utilization": null
  }
}
```

### 응답 필드

| 필드 | 타입 | 설명 |
|------|------|------|
| `five_hour` | `UsageBucket \| null` | 5시간 세션 사용량 |
| `seven_day` | `UsageBucket \| null` | 7일 주간 사용량 |
| `seven_day_oauth_apps` | `UsageBucket \| null` | OAuth 앱 주간 사용량 |
| `seven_day_opus` | `UsageBucket \| null` | Opus 모델 주간 사용량 |
| `seven_day_sonnet` | `UsageBucket \| null` | Sonnet 모델 주간 사용량 |
| `seven_day_cowork` | `UsageBucket \| null` | Cowork 주간 사용량 |
| `iguana_necktie` | `unknown \| null` | 용도 불명 (내부 필드 추정) |
| `extra_usage` | `ExtraUsage \| null` | 추가 사용량 (유료 초과분) |

**UsageBucket:**
| 필드 | 타입 | 설명 |
|------|------|------|
| `utilization` | `number` | 사용률 (0-100) |
| `resets_at` | `string \| null` | 리셋 시각 (ISO 8601) |

**ExtraUsage:**
| 필드 | 타입 | 설명 |
|------|------|------|
| `is_enabled` | `boolean` | 추가 사용량 활성화 여부 |
| `monthly_limit` | `number \| null` | 월간 한도 |
| `used_credits` | `number \| null` | 사용 크레딧 |
| `utilization` | `number \| null` | 사용률 |

### Rate Limit

429 응답 시 `Retry-After` 헤더 (초 단위) 참고. 기본 대기 60초.

---

## 2. Profile API

계정 및 조직 정보 조회.

- **Method**: `GET`
- **Path**: `/api/oauth/profile`

### 응답 예시

```json
{
  "account": {
    "uuid": "...",
    "full_name": "김용현",
    "display_name": "김용현",
    "email": "fred@01republic.io",
    "has_claude_max": true,
    "has_claude_pro": false,
    "created_at": "2025-03-27T02:36:31.823640Z"
  },
  "organization": {
    "uuid": "...",
    "name": "fred@01republic.io's Organization",
    "organization_type": "claude_max",
    "billing_type": "stripe_subscription",
    "rate_limit_tier": "default_claude_max_5x",
    "has_extra_usage_enabled": false,
    "subscription_status": "active",
    "subscription_created_at": "2025-11-09T17:01:19.659671Z"
  },
  "application": {
    "uuid": "...",
    "name": "Claude Code",
    "slug": "claude-code"
  }
}
```

---

## 참고: jetbrains 프로젝트 코드

`/Users/yonghyun/Projects/yhk1038/claude-code-gui-jetbrains` 프로젝트에서 참조한 파일:

- `backend/src/core/handlers/getUsage.ts` — Usage API 호출 로직 (캐싱, rate limit 처리 포함)
- `backend/src/core/handlers/getAccount.ts` — Profile API 호출 로직
- `backend/src/core/features/getClaudeCredentials.ts` — 크레덴셜 읽기 (settings.json의 env에서 읽는 방식)
- `webview/src/types/usage.ts` — UsageResponse 타입 정의
