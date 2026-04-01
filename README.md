# NAR.GG Frontend

League of Legends 프로 경기 분석 플랫폼입니다. LCK 프로 경기의 챔피언 조합, 1v1 매치업, 승률 통계를 분석합니다.

## 기술 스택

- **Next.js 16** - App Router 기반 React 프레임워크
- **React 19** - 최신 React 버전
- **TypeScript** - 타입 안전성을 위한 정적 타입 언어
- **TanStack Query** - 서버 상태 관리 및 데이터 페칭
- **Mantine 8** - React UI 컴포넌트 라이브러리
- **Tailwind CSS 4** - 유틸리티 우선 CSS 프레임워크
- **Emotion** - CSS-in-JS 스타일링
- **Axios** - HTTP 클라이언트
- **Day.js** - 날짜 유틸리티
- **Tabler Icons** - 아이콘 라이브러리
- **pnpm** - 패키지 매니저

## 시작하기

### 사전 요구사항

- Node.js 18+
- pnpm 8+

### 설치

```bash
pnpm install
```

### 환경 변수

```bash
cp .env.example .env.local
```

| 변수                  | 설명                 | 필수 |
| --------------------- | -------------------- | ---- |
| `NEXT_PUBLIC_API_URL` | Backend API 서버 URL | Yes  |

### 실행

```bash
pnpm dev
```

## 아키텍처

이 프로젝트는 **Feature-Sliced Design (FSD)** 아키텍처를 Next.js App Router에 맞게 변형하여 사용합니다.

### 레이어 계층

```
app (routing) > pages > entities > shared
```

- 상위 레이어는 하위 레이어를 import 할 수 있지만 역방향은 불가
- 같은 레이어의 다른 slice 간 import 금지
- `app/` 폴더는 Next.js 라우팅 전용, 실제 UI 로직은 `src/pages`에 위치

### 프로젝트 구조

```
app/                            # Next.js App Router (라우팅)
├── layout.tsx                  # 루트 레이아웃
├── providers.tsx               # 전역 Provider
├── champions-meta/             # 챔피언 메타 분석
├── pro-matches/                # 프로 경기
│   ├── list/
│   └── schedule/
└── youtube-stories/            # 유튜브 스토리

src/
├── entities/                   # 비즈니스 엔티티 (API, 타입, 쿼리)
│   ├── categories/
│   ├── champions/
│   ├── combinations/
│   ├── games/
│   ├── schedule/
│   └── story/
├── pages/                      # 페이지 레벨 컴포넌트 (FSD pages layer)
│   ├── champions-meta/
│   │   ├── model/              # 페이지 전용 타입
│   │   └── ui/                 # 페이지 UI 컴포넌트
│   └── youtube-stories/
└── shared/                     # 공유 유틸리티
    ├── config/                 # 환경 변수, 테마, Query Client
    ├── lib/                    # API 클라이언트, 유틸 함수
    ├── types/                  # 공통 타입
    └── ui/                     # 공통 UI 컴포넌트
```

### Segments 규칙

- `api/` - API 엔드포인트 및 호출 함수
- `model/` - 타입, 쿼리, 뮤테이션
- `ui/` - UI 컴포넌트

## 상태 관리 전략

1. **서버 데이터** → TanStack Query (queryOptions 팩토리 패턴)
2. **폼 상태** → useState + 컴포넌트 로컬 상태
3. **URL 상태** → useSearchParams (Next.js)
4. **로컬 상태** → useState

## API 클라이언트 설정

- `publicApi` 인스턴스를 `src/shared/lib/api-client.ts`에서 생성
- `NEXT_PUBLIC_API_URL` 환경 변수를 baseURL로 사용
- 각 entity에서 endpoint 상수와 API 함수 분리

## 배포

Vercel에 배포됩니다.

```bash
vercel --prod
```

**주의사항:**

- `pages/` 폴더에 `.gitkeep` 파일 필요 (App Router와 Pages Router 공존)
- 환경 변수는 Vercel 대시보드에서 설정

## 참고

자세한 코드 컨벤션과 기여 가이드는 [CONTRIBUTING.md](./CONTRIBUTING.md)를 참고하세요.

---

## AI 개발 워크플로우 (Claude Code)

이 프로젝트는 Claude Code + Figma MCP를 활용해 디자인-코드 연동과 보일러플레이트 생성을 자동화하고 있습니다.

### 사전 준비

1. [Claude Code](https://claude.ai/code) 설치
2. Figma Personal Access Token 발급
   - Figma → 프로필 → Settings → Security → Personal access tokens
3. `~/.claude/settings.json` 에 MCP 설정 추가

```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["-y", "figma-developer-mcp", "--figma-api-key", "YOUR_TOKEN", "--stdio"]
    }
  }
}
```

---

### 커맨드 목록

| 커맨드 | 용도 |
|--------|------|
| `/figma-sync` | Figma 디자인 시스템 → 토큰 + 공용 컴포넌트 프로젝트 반영 |
| `/figma-draft` | Figma 디자인 → 순수 UI 레퍼런스 컴포넌트(temp.tsx) 생성 |
| `/figma-apply` | temp.tsx 기준으로 실제 컴포넌트 디자인 리팩터링 |
| `/sync-entity` | Swagger(openapi.json) → entity 파일 자동 생성/업데이트 |
| `/new-entity` | FSD entity 보일러플레이트 생성 |
| `/new-feature` | FSD feature 보일러플레이트 생성 (ViewModel + Mapper 포함) |
| `/new-page` | FSD page 컴포넌트 + App Router 라우트 생성 |
| `/design-token` | 파일의 디자인 토큰 규칙 위반 감사 |

---

### `/figma-sync` — 디자인 시스템 연동

Figma 디자인 시스템 파일에서 색상 토큰과 공용 컴포넌트를 추출해 프로젝트에 반영합니다.

**언제 사용?** 디자인 시스템 최초 연동 시, 또는 디자이너가 토큰/컴포넌트를 업데이트했을 때

```
/figma-sync <Figma 디자인 시스템 파일 URL>
```

**결과물** `app/globals.css` 토큰 반영 / `src/shared/ui/` 공용 컴포넌트 생성·업데이트

---

### `/figma-draft` — 디자인 레퍼런스 생성

Figma 디자인을 읽어 **기능 없는 순수 UI** 레퍼런스 컴포넌트를 생성합니다.
event handler·state 없이 디자인만 1:1로 구현합니다.

```
/figma-draft <구현할 프레임 URL>
```

**결과물** `src/pages/[page]/ui/temp.tsx`

---

### `/figma-apply` — 디자인 적용

`/figma-draft`로 생성된 temp.tsx를 기준으로 실제 컴포넌트에 디자인을 적용합니다.
기능·상태·이벤트는 건드리지 않고 스타일·레이아웃만 교체합니다.

```
/figma-apply TARGET=<실제 컴포넌트 경로> BASE=<temp.tsx 경로>
```

**결과물** `TARGET` 컴포넌트 디자인 리팩터링

---

### `/sync-entity` — API 타입 동기화

`openapi.json`을 읽어 FSD entity 파일(endpoint, api, dto, queries)을 자동 생성하거나 업데이트합니다.

**언제 사용?** 백엔드 API가 추가/변경됐을 때

```bash
pnpm gen:api          # 먼저 openapi.json 갱신
/sync-entity          # 전체 entity 동기화
/sync-entity players  # 특정 entity만 동기화
```

**결과물** `src/entities/[entity]/api/` / `src/entities/[entity]/model/`

---

### `/new-entity` — Entity 생성

FSD entity 보일러플레이트를 수동으로 생성합니다.

```
/new-entity <entity-name>
```

**결과물** `src/entities/[entity]/api/` / `src/entities/[entity]/model/` / `index.ts`

---

### `/new-feature` — Feature 생성

FSD feature 보일러플레이트를 생성합니다. ViewModel + Mapper 패턴이 포함됩니다.

```
/new-feature <feature-name>
```

**결과물** `src/features/[feature]/ui/` / `src/features/[feature]/model/` / `index.ts`

---

### `/new-page` — Page 생성

FSD page 컴포넌트와 Next.js App Router 라우트를 생성합니다.

```
/new-page <page-name>
```

**결과물** `app/[route]/page.tsx` / `src/pages/[page]/ui/[page]-page.tsx`

---

### `/design-token` — 토큰 규칙 감사

파일의 색상 사용이 디자인 토큰 규칙을 준수하는지 검사합니다.

**언제 사용?** PR 전 코드 리뷰, 또는 토큰 규칙 위반이 의심될 때

```
/design-token <파일 경로>   # 특정 파일
/design-token               # 현재 변경된 파일 전체
```

**체크 항목** primitive 색상 하드코딩 / `dark:` 접두사 사용 / Mantine `sx` prop / 공용 컴포넌트 미사용

---

### 전체 워크플로우

```
백엔드 API 추가/변경
        ↓
pnpm gen:api → /sync-entity     ← entity 파일 자동 생성

디자이너 Figma 업데이트
        ↓
/figma-sync <디자인 시스템 URL>  ← 토큰 + 공용 컴포넌트 반영
        ↓
/figma-page <페이지 URL>         ← 페이지 구현
        ↓
/design-token                    ← 토큰 규칙 최종 검사
```
