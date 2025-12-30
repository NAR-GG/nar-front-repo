# Contributing Guide

NAR.GG 프로젝트의 코드 컨벤션과 아키텍처 가이드입니다.

## 컨벤션

### 네이밍

| 대상            | 규칙               | 예시                |
| --------------- | ------------------ | ------------------- |
| 폴더/파일       | `kebab-case`       | `champion-card.tsx` |
| 변수/함수       | `camelCase`        | `getChampionList`   |
| 컴포넌트        | `PascalCase`       | `ChampionCard`      |
| 타입/인터페이스 | `PascalCase`       | `ChampionData`      |
| 상수            | `UPPER_SNAKE_CASE` | `API_BASE_URL`      |

### 코드 스타일

- `any` 타입 사용 금지
- React Hook 의존성 배열 완전하게 작성
- 모든 함수는 **Arrow Function** 사용

```typescript
// ✅ Good
const getChampionList = async (): Promise<ChampionData[]> => {
  const response = await publicApi.get<ChampionData[]>(endpoint);
  return response.data;
};

// ❌ Bad
async function getChampionList(): Promise<ChampionData[]> {
  // ...
}
```

### Import 순서

```typescript
// 1. React/Next.js
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// 2. 외부 라이브러리
import { useQuery } from "@tanstack/react-query";
import { Button, Text } from "@mantine/core";

// 3. 내부 모듈 (@/ alias)
import { championsQueries } from "@/entities/champions/model/champions.queries";
import type { ChampionData } from "@/entities/champions/model/champions.dto";

// 4. 상대 경로
import { ChampionCard } from "./champion-card";
```

## Feature-Sliced Design (FSD)

### 레이어 계층

| 레이어      | 역할               | 예시                           |
| ----------- | ------------------ | ------------------------------ |
| `app/`      | Next.js 라우팅     | `app/champions-meta/page.tsx`  |
| `pages/`    | 페이지 UI 컴포넌트 | `src/pages/champions-meta/ui/` |
| `entities/` | 비즈니스 엔티티    | `src/entities/champions/`      |
| `shared/`   | 공유 유틸리티      | `src/shared/lib/api-client.ts` |

### 의존성 규칙

- 상위 레이어 → 하위 레이어 import **가능**
- 하위 레이어 → 상위 레이어 import **금지**
- 같은 레이어의 다른 slice 간 import **금지**

```typescript
// ✅ Good: pages → entities
import { championsQueries } from "@/entities/champions/model/champions.queries";

// ❌ Bad: entities → pages
import { ChampionCard } from "@/pages/champions-meta/ui/champion-card";
```

## API 작성 가이드

### Entity 구조

```
src/entities/[entity]/
├── api/
│   ├── [entity]-endpoint.ts    # API URL 상수
│   └── [entity].api.ts         # API 호출 함수
└── model/
    ├── [entity].dto.ts         # 타입 정의
    ├── [entity].queries.ts     # Query Factory
    └── [entity].mutations.ts   # Mutation Hook (선택)
```

### Endpoint 정의

```typescript
// src/entities/champions/api/champions-endpoint.ts
export const championsApiEndPoint = {
  getList: () => "/api/champions",
  getById: (id: number) => `/api/champions/${id}`,
};
```

### API 호출 함수

```typescript
// src/entities/champions/api/champions.api.ts
import { publicApi } from "@/shared/lib/api-client";
import { championsApiEndPoint } from "./champions-endpoint";
import type { ChampionData } from "../model/champions.dto";

export const getChampionList = async (): Promise<ChampionData[]> => {
  const response = await publicApi.get<ChampionData[]>(
    championsApiEndPoint.getList()
  );
  return response.data;
};
```

### Query Factory 패턴

```typescript
// src/entities/champions/model/champions.queries.ts
import { queryOptions } from "@tanstack/react-query";
import { getChampionList, getChampionById } from "../api/champions.api";

export const championsQueries = {
  all: () => ["champions"] as const,

  lists: () => [...championsQueries.all(), "list"] as const,
  list: () =>
    queryOptions({
      queryKey: championsQueries.lists(),
      queryFn: getChampionList,
    }),

  details: () => [...championsQueries.all(), "detail"] as const,
  detail: (id: number) =>
    queryOptions({
      queryKey: [...championsQueries.details(), id],
      queryFn: () => getChampionById(id),
    }),
};
```

### 컴포넌트에서 사용

```typescript
// src/pages/champions-meta/ui/champion-grid.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { championsQueries } from "@/entities/champions/model/champions.queries";

export const ChampionGrid = () => {
  const { data: champions = [], isLoading } = useQuery(championsQueries.list());

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      {champions.map((champion) => (
        <ChampionCard key={champion.id} champion={champion} />
      ))}
    </div>
  );
};
```

## UI 컴포넌트

### Mantine 우선 사용

```typescript
// ✅ Good: Mantine 컴포넌트 사용
import { Button, Stack, Text, Paper } from "@mantine/core";

<Paper p="md" withBorder>
  <Stack gap="md">
    <Text size="lg" fw={600}>
      제목
    </Text>
    <Button variant="filled">버튼</Button>
  </Stack>
</Paper>;
```

### Tailwind CSS 보조 사용

```typescript
// ✅ Good: 커스텀 레이아웃은 Tailwind
<div className="flex items-center justify-between gap-4 p-4">
  <MantineComponent />
</div>
```

### Props Interface 정의

```typescript
interface ChampionCardProps {
  champion: ChampionData;
  onSelect?: (id: number) => void;
  isSelected?: boolean;
}

export const ChampionCard = ({
  champion,
  onSelect,
  isSelected = false,
}: ChampionCardProps) => {
  return (
    <Paper
      onClick={() => onSelect?.(champion.id)}
      style={{ cursor: "pointer" }}
    >
      {/* ... */}
    </Paper>
  );
};
```

## Git 컨벤션

### 브랜치 네이밍

```
feature/[feature-name]    # 새로운 기능
fix/[bug-name]            # 버그 수정
refactor/[scope]          # 리팩토링
docs/[scope]              # 문서 수정
```

### 커밋 메시지

```
<type>(<scope>): <subject>
```

| Type       | 설명            |
| ---------- | --------------- |
| `feat`     | 새로운 기능     |
| `fix`      | 버그 수정       |
| `docs`     | 문서 수정       |
| `refactor` | 리팩토링        |
| `chore`    | 빌드, 설정 변경 |

```bash
feat(champions): add champion filter by position
fix(api): handle error response correctly
refactor(entities): simplify query patterns
```

## Pull Request

### PR 전 체크리스트

- [ ] `pnpm lint` 통과
- [ ] `pnpm build` 성공
- [ ] 타입 에러 없음
- [ ] 불필요한 `console.log` 제거

### PR 템플릿

> `.github/pull_request_template.md`에 템플릿이 설정되어 있어 PR 생성 시 자동으로 적용됩니다.

````markdown
## Summary

<!-- 변경 사항을 간단히 요약해주세요 -->

## Changes

## <!-- 구체적인 변경 내용을 적어주세요 -->

### 이슈 연결

PR에서 이슈를 자동으로 닫으려면 본문에 다음 키워드를 사용하세요:

```markdown
Closes #이슈번호
Fixes #이슈번호
Resolves #이슈번호
```
````

### PR 크기

- **Small PR 권장**: 200줄 이하
- 큰 기능은 여러 개의 작은 PR로 분리
