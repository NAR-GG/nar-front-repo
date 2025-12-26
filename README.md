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

| 변수 | 설명 | 필수 |
|------|------|------|
| `NEXT_PUBLIC_API_URL` | Backend API 서버 URL | Yes |

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
