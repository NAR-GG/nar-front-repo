# NAR.GG

League of Legends 프로 경기 분석 애플리케이션입니다. LCK 프로 경기의 챔피언 조합, 1v1 매치업, 승률 통계를 분석합니다.

## Tech Stack

| Category        | Technology                           |
| --------------- | ------------------------------------ |
| Framework       | Next.js 16 (App Router)              |
| React           | 19.2.3                               |
| UI              | Mantine 8 + Tailwind CSS 4 + Emotion |
| State/Data      | TanStack React Query 5               |
| HTTP Client     | Axios                                |
| Date            | Day.js                               |
| Icons           | Tabler Icons React                   |
| Package Manager | pnpm                                 |

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Installation

```bash
# 의존성 설치
pnpm install

# 환경 변수 설정
cp .env.example .env.local
```

### Environment Variables

```env
NEXT_PUBLIC_API_URL=<Backend API URL>
```

### Development

```bash
pnpm dev      # 개발 서버 실행 (http://localhost:3000)
pnpm build    # 프로덕션 빌드
pnpm start    # 프로덕션 서버 실행
pnpm lint     # ESLint 실행
```

## Project Structure

Feature-Sliced Design (FSD) 아키텍처를 따릅니다.

```
app/                        # Next.js App Router (라우팅)
├── page.tsx                # 홈
├── champions-meta/         # 챔피언 메타 분석 페이지
└── youtube-stories/        # 유튜브 스토리 페이지

src/
├── entities/               # 비즈니스 엔티티 (도메인 모델)
│   ├── categories/         # 카테고리
│   ├── champions/          # 챔피언
│   ├── combinations/       # 챔피언 조합
│   ├── games/              # 게임/경기
│   ├── schedule/           # 일정
│   └── story/              # 스토리
│
├── pages/                  # 페이지 레벨 컴포넌트
│   ├── champions-meta/     # 챔피언 메타 분석 UI
│   └── youtube-stories/    # 유튜브 스토리 UI
│
└── shared/                 # 공유 유틸리티
    ├── config/             # 설정 (env, query-client, theme)
    ├── lib/                # 유틸리티 (api-client, formatters)
    ├── types/              # 공통 TypeScript 타입
    └── ui/                 # 공통 UI 컴포넌트
```

## Architecture

### Entity Structure

각 엔티티는 다음 구조를 따릅니다:

```
src/entities/[entity]/
├── api/
│   ├── [entity]-endpoint.ts   # API 엔드포인트 URL
│   └── [entity].api.ts        # API fetch 함수
└── model/
    ├── [entity].dto.ts        # TypeScript 인터페이스
    ├── [entity].queries.ts    # TanStack Query queryOptions
    └── [entity].mutations.ts  # TanStack Query mutations
```

### Path Aliases

```typescript
@/*           → root
@/app/*       → app/
@/shared/*    → src/shared/
@/entities/*  → src/entities/
@/pages/*     → src/pages/
```

## Features

- **챔피언 메타 분석**: 프로 경기 챔피언 조합 및 승률 분석
- **1v1 매치업**: 챔피언 간 상성 분석
- **유튜브 스토리**: 관련 유튜브 컨텐츠

## License

Private
