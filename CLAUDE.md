# CLAUDE.md

## Project Overview

NAR.GG — LCK 프로 경기 챔피언 조합 및 승률 분석 앱. Next.js 16 App Router 기반.

## Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19
- **UI**: Mantine 8 + Tailwind CSS 4 + Emotion
- **Data Fetching**: TanStack React Query 5 + Axios
- **Charts**: Recharts + Mantine Charts
- **Date**: dayjs
- **Icons**: Tabler Icons React
- **Styling Utils**: clsx + tailwind-merge
- **API Types**: openapi-typescript (자동 생성 → `src/shared/types/api.d.ts`)
- **Package Manager**: pnpm

### API 타입 생성

```bash
pnpm gen:api   # Swagger → src/shared/types/api.d.ts 자동 생성
```

## Commands

```bash
pnpm dev    # 개발 서버
pnpm build  # 프로덕션 빌드
pnpm lint   # ESLint
```

---

## Architecture — Feature-Sliced Design (FSD)

```
app/                          # Next.js 라우팅 (Server Component, prefetch)
src/
├── entities/[entity]/
│   ├── api/                  # API 함수 + endpoint + DTO
│   │   ├── [entity]-endpoint.ts
│   │   ├── [entity].api.ts
│   │   └── [entity].dto.ts   # API 응답 원형 타입 (readonly interface)
│   └── model/                # React Query 팩토리
│       ├── [entity].queries.ts
│       └── [entity].mutations.ts
├── pages/[page]/
│   ├── ui/                   # 페이지 UI 컴포넌트
│   ├── model/                # 페이지 전용 타입 변환 계층
│   │   ├── [page].view-model.ts  # DTO → 화면 표시용 타입
│   │   └── [page].mapper.ts      # DTO → ViewModel 변환 함수
│   ├── lib/                  # 페이지 전용 순수 유틸 함수
│   └── config/               # 페이지 전용 상수
└── shared/
    ├── config/               # env, query-client, mantine-theme
    ├── lib/                  # api-client, formatters, validators
    ├── types/                # 공통 TypeScript 타입
    └── ui/                   # 공통 UI 컴포넌트
```

### Path Aliases

| alias | 경로 |
|-------|------|
| `@/app/*` | `app/` |
| `@/pages/*` | `src/pages/` |
| `@/entities/*` | `src/entities/` |
| `@/shared/*` | `src/shared/` |

---

## Layer Dependency Rules

의존성은 단방향. 하위 레이어에서 상위 레이어 import 금지.

```
app → pages → entities → shared
```

| 레이어 | import 가능 범위 |
|--------|----------------|
| `app/` | pages, entities, shared |
| `pages/` | entities, shared |
| `entities/` | shared만 |
| `shared/` | 외부 라이브러리만 |

---

## Coding Conventions

### 폴더 네이밍
모든 폴더는 **hyphen-case** 사용. (`create-user`, `team-players`)

### 파일 네이밍

kebab-case를 사용하며, 역할을 나타내는 접미사를 붙인다.

| 역할 | 접미사 | 예시 |
|------|--------|------|
| API 응답 타입 | `.dto.ts` | `projects.dto.ts` |
| 화면 표시용 타입 | `.view-model.ts` | `project.view-model.ts` |
| DTO → ViewModel 변환 | `.mapper.ts` | `projects.mapper.ts` |
| React Query 쿼리 | `.queries.ts` | `projects.queries.ts` |
| useMutation 훅 | `.mutations.ts` | `projects.mutations.ts` |
| Zustand 스토어 | `.store.ts` | `use-like-projects.store.ts` |
| 엔드포인트 URL | `-endpoint.ts` | `projects-endpoint.ts` |
| CVA 스타일 정의 | `-variants.ts` | `badge-variants.ts` |

### 타입 정의

- `interface`: 컴포넌트 Props에 사용
- `type`: 유니온 타입, DTO, ViewModel 등에 사용

```typescript
// Props → interface
interface ProjectCardProps {
  data: ProjectCardViewModel;
  onLikeClick: (id: string, isCurrentlyLiked: boolean) => void;
}

// 유니온/복합 타입 → type
type ProjectBadge =
  | { key: "star-creator"; type: "image"; src: string; alt: string }
  | { key: "deadline"; type: "text"; label: string; variant?: "accent" };

// ViewModel = DTO 확장
type ProjectCardViewModel = ProjectDto & {
  creatorUrl: string;
  deadlineLabel: string;
};
```

### API & React Query
- API 요청 함수, DTO, queryOptions/mutations는 반드시 `entities/[entity]/api/` 에 구현
- queryOptions/mutations 팩토리는 `entities/[entity]/model/` 에 위치
- 컴포넌트 내부에서 fetch 로직 직접 작성 금지
- `queryOptions()` 팩토리 패턴 사용, query key 계층: `[entity, ...specifics]`
- 서버 사이드 prefetch는 `HydrationBoundary` + `getQueryClient()` 사용

엔드포인트는 객체 형태로 관리하고, 파라미터는 객체로 받는다.

```typescript
const prefix = { projects: "/projects" };

export const projectsApiEndPoint = {
  getProjects: () => `${prefix.projects}`,
  projectsLike: ({ id }: { id: string }) => `${prefix.projects}/${id}/like`,
};
```

API 함수는 파라미터를 객체로 받고 기본값을 지정한다.

```typescript
export const getProjects = async ({
  page = 1,
  limit = 10,
}: { page?: number; limit?: number } = {}) => {
  const response = await publicApi.get<ProjectsListDto>(
    projectsApiEndPoint.getProjects(),
    { params: { page, limit } },
  );
  return response.data;
};
```

React Query `select`에서 DTO → ViewModel 변환을 수행한다.

```typescript
export const projectsQueries = {
  all: () => ["projects"] as const,
  listKey: () => [...projectsQueries.all(), "list"] as const,
  list: ({ limit = 10 } = {}) =>
    infiniteQueryOptions({
      queryKey: [...projectsQueries.listKey(), { limit }] as const,
      queryFn: ({ pageParam }) => getProjects({ page: pageParam, limit }),
      select: (data) => ({
        ...data,
        pages: data.pages.flatMap((page) =>
          page.contents.map(toProjectCardViewModel),
        ),
      }),
    }),
};
```

### DTO
- 위치: `entities/[entity]/api/[entity].dto.ts`
- 모든 DTO 필드는 `readonly` 로 선언 (서버 응답 그대로, 변환 금지)
- 신뢰할 수 없는 외부 API 응답에는 Zod 스키마로 런타임 검증 적용

### ViewModel & Mapper
- API DTO를 컴포넌트에서 직접 사용 금지 — ViewModel로 변환 후 사용
- 변환 함수 네이밍: `mapXxxToViewModel` (순수 함수)
- 위치: `pages/[page]/model/[page].view-model.ts`, `pages/[page]/model/[page].mapper.ts`
- entities 레이어에 ViewModel/Mapper 작성 금지 — 반드시 pages 레이어에만

### Presentation Adapter
- 컴포넌트 내부에서 포매팅/계산 로직 직접 작성 금지
- 표시용 변환은 `[page]/ui/[page]-adapter.ts` 순수 함수로 분리
- 포매터/검증 함수는 `shared/lib/` 에 위치

```ts
// ✅ adapter (순수 함수)
export function adaptTeamForView(vm: TeamViewModel) {
  return {
    displayWinRate: formatWinRate(vm.winRate),
    canShowDetail: vm.winRate > 0,
  }
}

// ✅ 컴포넌트는 adapter 결과만 렌더링
function TeamCard({ vm }: { vm: TeamViewModel }) {
  const view = adaptTeamForView(vm)
  return <div>{view.displayWinRate}</div>
}
```

### UI 스타일
- 스타일은 **Tailwind CSS 클래스**만 사용
- `style={{ }}` 인라인 스타일 금지
- `const xyzStyle: React.CSSProperties = { ... }` 스타일 객체 선언 금지
- CSS 변수 참조 시 `className="[var(--nar-*)]"` 형태로 작성

### 공용 컴포넌트 CSS 클래스
- 여러 컴포넌트에서 재사용되는 스타일은 반드시 `app/globals.css`에 `@utility`로 정의
- 컴포넌트 내부에서 스타일 객체 또는 인라인 스타일로 직접 구현 금지

```css
/* ✅ globals.css에 @utility로 정의 */
@utility nar-tag {
  @apply inline-flex items-center gap-2 px-2 py-2 rounded-lg ...;
}

@utility position-filter-btn {
  @apply flex items-center justify-center h-11 ...;
}
```

```tsx
/* ✅ 컴포넌트에서는 클래스만 사용 */
<div className="nar-tag">...</div>
<div className="position-filter-btn first:border-l first:rounded-l-md">...</div>

/* ❌ 금지 */
const tagStyle: React.CSSProperties = { display: "inline-flex", ... }
<div style={{ ...tagStyle }}>...</div>
```

### 컴포넌트 설계 (SRP)
- 하나의 컴포넌트는 단 하나의 책임만 가짐 — 변경 이유가 오직 하나여야 함
- 한 파일에 컴포넌트 두 개 이상 작성은 `React.memo` 리스트 아이템 분리에 한정
- 역할이 다르면 파일 분리
- `default export`는 페이지 컴포넌트에만 사용, 나머지는 named export
- `memo`는 리스트 아이템처럼 반복 렌더링되는 컴포넌트에만 적용
- 내부에서만 쓰는 서브 컴포넌트는 같은 파일에 선언하고 export하지 않음

```typescript
// 내부 서브 컴포넌트 (export 없음)
function ProjectLikeButton({ isLiked, onClick }: ProjectLikeButtonProps) {
  return <button ... />;
}

// 메인 컴포넌트 (memo + named export)
export const ProjectCard = memo(function ProjectCard({ data }: ProjectCardProps) {
  return <article ... />;
});
```

```tsx
// ❌ 데이터 조회 + 필터 + 렌더링을 한 컴포넌트에서 처리
// ✅ page → 데이터, list → 렌더링, list-item → memo 아이템으로 분리
function TeamListPage() {
  const { data } = useSuspenseQuery(...)
  return <TeamList items={data} />
}
function TeamList({ items }: { items: TeamViewModel[] }) {
  return <ul>{items.map(item => <TeamListItem key={item.id} item={item} />)}</ul>
}
const TeamListItem = memo(({ item }: { item: TeamViewModel }) => <li>{item.teamName}</li>)
```

### 조건문
- 삼항 연산자 금지 — 얼리 리턴 또는 `if/else` 사용

---

## Environment Variables

- `NEXT_PUBLIC_API_URL` — Backend API base URL

## Design System

Figma MCP 기반 2단계 워크플로우:

1. `/figma-sync <디자인 시스템 URL>` — 토큰 + 공용 컴포넌트 추출 → 프로젝트 반영 (최초 1회 또는 업데이트 시)
2. `/figma-page <페이지 URL>` — 연동된 디자인 시스템 기반으로 페이지 완전 구현

색상 토큰 원본: `app/globals.css` (`--nar-*` CSS 변수)
