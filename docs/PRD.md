# PRD: claude-code-battery

## 개요

Claude Code의 내부 API를 래핑하는 TypeScript SDK + CLI 패키지.
Claude Code가 사용하는 비공식 API에 접근하기 위한 인증 레이어와 API 클라이언트를 제공한다.

## 1차 스코프

- **인증 레이어**: 디스크(macOS 키체인 / Windows·Linux 파일)에서 크레덴셜을 읽고 access token을 관리
- **사용량 조회 API**: 세션/주간 사용량 데이터 조회

향후 다른 API 엔드포인트를 점진적으로 확장한다.

## CLI 설계

### 실행 명령어

`ccb` (claude-code-battery 약자)

### 액션 매핑 규칙

API path를 CLI 액션으로 그대로 매핑한다.
- path segment → CLI 액션 (서브커맨드)
- path placeholder → 옵션/아규먼트

예시:
```
API: GET /organizations/{id}/usage
CLI: ccb organizations usage --org-id=xxx
```

### 출력 형식

- 기본: 사람이 읽기 좋은 포맷
- `--json`: 머신 리더블 JSON 출력

## 기술 스택

- TypeScript
- npm 패키지로 배포
- SDK (프로그래매틱 사용) + CLI (터미널 사용) 이중 인터페이스
