---
description: Figma MCP로 디자인 시스템(토큰 + 공용 컴포넌트)을 추출해 프로젝트에 반영. 디자인 시스템 최초 연동 또는 업데이트 시 사용.
---

## 사용법

**Figma 데스크탑 앱에서:**
1. 디자인 시스템 파일 열기
2. 색상 토큰 → Color Styles 가 정의된 프레임 선택
3. 이 커맨드 실행 → 토큰 반영
4. Component Playground 프레임 선택
5. 이 커맨드 다시 실행 → 컴포넌트 반영

**언제 쓰나?**
- 디자인 시스템을 처음 연동할 때
- 디자이너가 토큰/공용 컴포넌트를 업데이트했을 때

> ⚠️ 페이지 구현은 `/figma-page` 를 사용할 것

---

Figma 데스크탑 앱에서 선택된 레이어를 기준으로 디자인 시스템을 추출하고 프로젝트에 반영해줘.

## Step 1 — 선택된 레이어 파악

`get_variable_defs` 로 선택된 노드의 디자인 변수(토큰)를 읽어서 어떤 종류의 데이터인지 파악:
- 색상 변수가 많으면 → Step 2 (색상 토큰 반영) 진행
- 컴포넌트 구조가 많으면 → Step 3 (컴포넌트 반영) 진행
- 둘 다 있으면 → 순서대로 모두 진행

`get_design_context` 로 선택된 노드의 레이아웃/스타일 구조도 함께 파악.

## Step 2 — 색상 토큰 반영

추출한 변수를 `--nar-*` CSS 변수로 매핑:

1. 변수 이름 → `--nar-[name]` 형식으로 변환
2. 라이트/다크 모드 분리 여부 확인
3. `app/globals.css` 기존 토큰과 비교:
   - 추가된 토큰 → `:root`, `[data-mantine-color-scheme="light"]`, `[data-mantine-color-scheme="dark"]` 에 추가
   - 변경된 토큰 → 값 업데이트
   - 삭제된 토큰 → 자동 삭제 금지, 확인 요청

## Step 3 — 컴포넌트 반영

`get_design_context` 로 선택된 컴포넌트 스펙 파악:

1. Variants → TypeScript props 인터페이스로 변환
   ```ts
   // Figma Variants → TypeScript props
   { variant: ["primary","secondary"], size: ["sm","md","lg"], disabled: BOOLEAN }
   // ↓
   interface ButtonProps { variant: 'primary'|'secondary'; size: 'sm'|'md'|'lg'; disabled?: boolean }
   ```
2. Auto layout → Tailwind flex 클래스로 변환
3. 색상 → Step 2에서 연동한 `var(--nar-*)` 시맨틱 토큰으로 매핑
4. `src/shared/ui/` 에 동일 컴포넌트 있으면 → 스펙 비교 후 업데이트
5. 없으면 → `src/shared/ui/[component-name].tsx` 신규 생성

스타일 규칙:
- Tailwind CSS 클래스만 사용 (인라인 스타일 금지)
- `style={{ }}` 금지
- 색상 float값 직접 하드코딩 금지 (반드시 토큰으로 매핑)

## Step 4 — 완료 보고

```
[디자인 시스템 연동 완료]
- 추가된 토큰: N개
- 변경된 토큰: N개
- 신규 컴포넌트: [이름 목록]
- 업데이트된 컴포넌트: [이름 목록]
- 확인 필요 항목: [있으면 목록]
```

## 주의사항

- 토큰/컴포넌트 삭제는 반드시 확인 요청
- 기존 코드에서 사용 중인 토큰 이름 변경 금지
- 변경 전 스펙 요약 먼저 보여주고 승인 받은 후 반영
