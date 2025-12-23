# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NAR.GG is a League of Legends pro match analysis application built with Next.js 16 and React 19. It analyzes LCK pro game champion combinations, 1v1 matchups, and win rate statistics.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **React**: 19.2.3
- **UI**: Mantine 8 + Tailwind CSS 4 + Emotion
- **State/Data**: TanStack React Query 5
- **HTTP Client**: Axios
- **Icons**: Tabler Icons React
- **Package Manager**: pnpm

## Commands

```bash
pnpm dev      # Start development server
pnpm build    # Production build
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

## Architecture (Feature-Sliced Design)

The project follows FSD architecture with modifications for Next.js App Router:

```
app/                    # Next.js App Router pages (routing layer)
src/
├── entities/           # Business entities (domain models)
│   └── [entity]/
│       ├── api/        # API functions + endpoints
│       └── model/      # DTOs, queries, mutations
├── pages/              # Page-level components (not Next.js pages)
│   └── [page]/
│       └── ui/         # Page UI components
└── shared/             # Shared utilities
    ├── config/         # App configuration (env, query-client, theme)
    ├── lib/            # Utilities (api-client, formatters)
    ├── types/          # Shared TypeScript types
    └── ui/             # Shared UI components
```

## Key Patterns

### Path Aliases (tsconfig.json)
- `@/*` → root
- `@/app/*` → app/
- `@/shared/*` → src/shared/
- `@/entities/*` → src/entities/
- `@/pages/*` → src/pages/

### Entity Structure Pattern
Each entity follows this structure:
```
src/entities/[entity]/
├── api/
│   ├── [entity]-endpoint.ts   # API endpoint URLs
│   └── [entity].api.ts        # API fetch functions
└── model/
    ├── [entity].dto.ts        # TypeScript interfaces
    ├── [entity].queries.ts    # TanStack Query queryOptions
    └── [entity].mutations.ts  # TanStack Query mutations (if needed)
```

### React Query Pattern
- Use `queryOptions()` factory pattern in `.queries.ts` files
- Server-side prefetching with `HydrationBoundary` in layout.tsx
- Query key hierarchy: `[entity, ...specifics]`

### API Client
- Single axios instance (`publicApi`) in `src/shared/lib/api-client.ts`
- Base URL from `NEXT_PUBLIC_API_URL` environment variable

### Provider Setup
- Providers wrapped in `app/providers.tsx` (client component)
- MantineProvider + QueryClientProvider
- Layout component wraps all pages

## Environment Variables

Required:
- `NEXT_PUBLIC_API_URL` - Backend API base URL
