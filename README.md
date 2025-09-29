# WaveBoard Web Application

WaveBoard는 **Next.js 14 App Router**를 기반으로 제작된 모던 게시판 웹 애플리케이션입니다.  
사용자 인증, 게시판 CRUD, 반응형 UI, 접근성, 성능 최적화까지 모두 갖춘 풀스택 프로젝트입니다.

---

## 주요 기술 스택

- **프레임워크**: Next.js 14 (App Router 기반)
- **언어**: TypeScript
- **UI**: React + Tailwind CSS
- **상태관리**: React Query (@tanstack/react-query)
- **인증**: JWT (HTTP-only Cookie)
- **스타일링**: Tailwind CSS (다크모드 지원)
- **아이콘**: Lucide React
- **언어**: 🇰🇷 한국어

---

## 프로젝트 구조 요약

```bash
src/
├── app/               # 페이지 및 라우팅
├── components/        # 재사용 UI 컴포넌트
├── lib/               # API, hooks, 유틸
├── types/             # 전역 타입 정의
└── middleware.ts      # 인증 미들웨어
```

---

## 핵심 기능

- 회원가입 / 로그인 / 로그아웃
- 게시글 생성 / 수정 / 삭제 / 보기
- 내 게시글 / 전체 게시글 토글
- 서버 인증 미들웨어 (`middleware.ts`)
- access token 자동 갱신 (`fetcher.ts`)
- 폼 유효성 검사 및 에러 피드백
- 클라이언트-서버 완전 분리 구조
- ARIA 지원 및 키보드 내비게이션

---

## 라우팅 구조

| 경로                | 설명          |
| ------------------- | ------------- |
| `/`                 | 로그인 페이지 |
| `/login`            | 로그인        |
| `/signup`           | 회원가입      |
| `/boards`           | 게시판 목록   |
| `/boards/create`    | 게시판 생성   |
| `/boards/[id]`      | 게시판 상세   |
| `/boards/[id]/edit` | 게시판 수정   |

---

## 개발 명령어

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
npm run start
```

---

## 배포 및 브라우저 지원

- **브라우저**: Chrome, Firefox, Edge, Safari, iOS/Android 최신
- **빌드 대상**: Node.js 18+
- **기능**: ES2020+ 사용

---

## 접근성 (A11y)

- ARIA 속성 적용
- 키보드 접근성 구현
- 포커스 관리 및 대비색 유지
- 토글 및 버튼 role/label 지정

---

## 인증 시스템

- JWT 기반 인증 (access/refresh)
- Cookie 저장 및 자동 갱신
- 인증된 라우트 보호
- 클라이언트 상태 유지

---

## 국제화 준비

- 기본 언어: `ko`
- 텍스트 분리 및 확장 가능 구조
- i18n 라우팅 확장 고려
