# 리서치: Claude Code 크레덴셜 구조

## macOS

키체인(Keychain)에 저장됨.

- **서비스명**: `Claude Code-credentials`
- **계정명**: OS 유저네임 (예: `yonghyun`)
- **조회 명령**: `security find-generic-password -s "Claude Code-credentials" -a "<username>" -w`

### 크레덴셜 JSON 구조

```json
{
  "claudeAiOauth": {
    "accessToken": "sk-ant-oat01-...",
    "refreshToken": "sk-ant-ort01-...",
    "expiresAt": 1774870148778,
    "scopes": [
      "user:file_upload",
      "user:inference",
      "user:mcp_servers",
      "user:profile",
      "user:sessions:claude_code"
    ],
    "subscriptionType": "max",
    "rateLimitTier": "default_claude_max_5x"
  },
  "organizationUuid": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}
```

### 필드 설명

| 필드 | 설명 |
|------|------|
| `accessToken` | `sk-ant-oat01-` 접두사. API 요청 Bearer 토큰 |
| `refreshToken` | `sk-ant-ort01-` 접두사. 토큰 갱신용 |
| `expiresAt` | Unix timestamp (밀리초). 만료 시각 |
| `scopes` | 부여된 권한 목록 |
| `subscriptionType` | 구독 플랜 (예: `max`) |
| `rateLimitTier` | rate limit 등급 |
| `organizationUuid` | 소속 조직 UUID |

## Windows / Linux

(TODO: 추후 리서치 필요. 특정 파일 경로에 저장될 것으로 예상)

## 참고: 키체인 관련 항목

키체인에는 Claude 관련 항목이 두 개 존재:

1. `Claude Safe Storage` — Claude 데스크톱 앱(Electron)용. 본 프로젝트와 무관.
2. `Claude Code-credentials` — Claude Code용. **이것을 사용**.
