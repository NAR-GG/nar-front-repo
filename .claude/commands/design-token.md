---
description: 현재 페이지/컴포넌트의 색상 사용이 디자인 토큰 규칙을 준수하는지 감사
argument-hint: <file-path> (선택, 없으면 현재 변경된 파일 대상)
---

$ARGUMENTS 파일(들)의 디자인 토큰 사용을 감사해줘.

## 체크리스트

1. **Primitive 색상 직접 사용** 찾기
   - `#[0-9a-fA-F]{3,8}` 패턴
   - `rgb(`, `rgba(` 직접 값
   - 예외: `var(--nar-*)` 에서 파생된 경우는 OK

2. **dark: 접두사 색상 override** 찾기
   - `dark:text-`, `dark:bg-`, `dark:border-` 등
   - 이건 시맨틱 토큰으로 교체 필요

3. **Mantine sx prop** 찾기
   - `sx={{` 패턴 → globals.css 전역 클래스로 이동 필요

4. **재사용 가능한 shared/ui 컴포넌트 미사용** 체크
   - 비슷한 UI가 shared/ui에 있는데 새로 만든 경우

## 출력 형식

문제 발견 시:
- 파일 경로 + 라인 번호
- 현재 코드
- 수정 제안 (어떤 시맨틱 토큰으로 교체할지)

문제 없으면: "토큰 규칙 준수 ✅" 출력
