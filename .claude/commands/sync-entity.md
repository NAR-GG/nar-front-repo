---
description: openapi.json을 읽어 FSD entity 파일을 자동 생성/업데이트
argument-hint: [entity-name] (생략 시 전체 동기화, 지정 시 해당 entity만)
---

`openapi.json`(프로젝트 루트)을 읽어서 FSD 아키텍처에 맞게 `src/entities/` 하위 파일을 생성하거나 업데이트해줘.

## 작업 순서

1. 프로젝트 루트의 `openapi.json` 읽기
2. `$ARGUMENTS`가 있으면 해당 tag/entity만, 없으면 전체 tags 처리
3. 각 tag별로 아래 파일 생성 또는 업데이트
4. 기존 파일이 있으면 **diff 확인 후 변경 사항만 수정** (전체 덮어쓰기 금지)
5. 작업 완료 후 변경/생성된 파일 목록 요약 출력

## 생성할 파일 구조

```
src/entities/{entity}/
├── api/
│   ├── {entity}-endpoint.ts   ← API URL 생성 함수
│   └── {entity}.api.ts        ← publicApi 호출 함수
└── model/
    ├── {entity}.dto.ts        ← openapi schemas → TypeScript interface
    └── {entity}.queries.ts    ← TanStack Query queryOptions
    └── {entity}.mutations.ts  ← POST/PUT/DELETE가 있을 때만 생성
```

## openapi.json 파싱 규칙

- `tags` 배열 → entity 이름 (camelCase 변환, 예: "Player Cards" → "playerCards")
- `paths` → 각 tag에 속한 endpoint URL과 method 추출
- `components.schemas` → 해당 entity에서 사용하는 schema만 dto.ts에 포함
- GET 요청 → queries.ts에 queryOptions으로 추가
- POST/PUT/PATCH/DELETE → mutations.ts에 추가
- query parameter → endpoint.ts에 Params interface로 정의

## 코드 생성 규칙

**endpoint.ts 패턴:**
```ts
const {ENTITY}_PREFIX = { {entity}: '/{path}' };

export interface {Entity}Params { /* query params */ }

export const {entity}ApiEndPoint = {
  get{Entity}: (params?: {Entity}Params) => { /* URLSearchParams 빌더 */ },
};
```

**api.ts 패턴:**
```ts
import { publicApi } from '@/shared/lib/api-client';
import { {entity}ApiEndPoint, type {Entity}Params } from './{entity}-endpoint';
import type { {Entity}Dto } from '../model/{entity}.dto';

export const get{Entity} = async (params?: {Entity}Params) => {
  const response = await publicApi.get<{Entity}Dto>({entity}ApiEndPoint.get{Entity}(params));
  return response.data;
};
```

**dto.ts 패턴:**
- openapi schema의 `properties` → TypeScript interface로 변환
- `$ref` → 해당 interface 타입으로 교체
- `required` 배열에 없는 필드 → `?` optional 처리
- `type: integer/number` → `number`, `type: boolean` → `boolean`, `type: array` → `Type[]`

**queries.ts 패턴:**
```ts
import { queryOptions } from '@tanstack/react-query';
import { get{Entity} } from '../api/{entity}.api';
import type { {Entity}Params } from '../api/{entity}-endpoint';

export const {entity}Queries = {
  all: () => ['{entity}'] as const,
  lists: () => [...{entity}Queries.all(), 'list'] as const,
  list: (params?: {Entity}Params) => queryOptions({
    queryKey: [...{entity}Queries.lists(), params] as const,
    queryFn: () => get{Entity}(params),
  }),
};
```

## FSD 아키텍처 규칙

- 레이어 import 방향: `app` → `pages` → `features` → `entities` → `shared` (단방향)
- 하위 레이어는 상위 레이어를 import 할 수 없음 (예: `entities`에서 `pages` import 금지)
- 같은 레이어의 slice 간 import 금지 (예: `entities/players`에서 `entities/teams` import 금지)
- `entities` 레이어에서 사용 가능한 segment: `ui`, `api`, `model`, `lib`, `config` 만 허용
- `src/` 폴더에 레이어 외 별도 파일 생성 금지

## 주의사항

- 기존 파일이 있으면 반드시 먼저 Read 후 변경점만 Edit (Write로 전체 덮어쓰기 금지)
- 파일 내 주석 금지
- primitive 색상 직접 사용 금지 (해당 없음 — entity 파일은 UI 없음)
- `src/shared/lib/api-client`의 `publicApi` 사용 (직접 axios import 금지)
- 기존 파일과 openapi 스펙을 비교해서 다음 중 하나라도 해당하면 반드시 파일 수정:
  - 새 endpoint가 추가된 경우
  - 기존 endpoint의 response/request schema에 새 필드가 추가된 경우
  - 기존 interface에 없는 새 schema($ref)가 참조된 경우
- openapi에서 삭제된 endpoint나 필드가 있어도 기존 파일에서 **자동 삭제하지 말고** 언냐에게 확인 요청
