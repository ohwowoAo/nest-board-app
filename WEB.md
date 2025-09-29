# WaveBoard Web Application Documentation

## 개요

WaveBoard는 Next.js 14 기반의 게시판 웹 애플리케이션으로, App Router를 사용하여 구현되었습니다.

## 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI**: React + Tailwind CSS
- **State Management**: React Query (@tanstack/react-query)
- **Icons**: Lucide React
- **Authentication**: JWT (Cookie 기반)
- **Language**: Korean (한국어)

## 프로젝트 구조

```
src/
├── app/
│   ├── globals.css              # 전역 스타일 (다크모드 지원)
│   ├── layout.tsx              # 루트 레이아웃 (QueryProvider 래핑)
│   ├── page.tsx                # 메인 페이지 (로그인 리다이렉트)
│   ├── query-provider.tsx      # React Query 클라이언트 설정
│   ├── login/page.tsx          # 로그인 페이지
│   ├── signup/page.tsx         # 회원가입 페이지
│   └── boards/
│       ├── page.tsx            # 게시판 목록
│       ├── create/page.tsx     # 게시판 생성
│       ├── [id]/page.tsx       # 게시판 상세보기
│       └── [id]/edit/page.tsx  # 게시판 수정
├── components/
│   ├── BoardsList.tsx          # 게시판 목록 컴포넌트
│   ├── CreateBoardForm.tsx     # 게시판 생성 폼
│   └── ToggleSwitch.tsx        # 토글 스위치 컴포넌트
├── lib/
│   ├── fetcher.ts              # API 호출 래퍼 (토큰 자동 갱신)
│   └── queries.ts              # React Query hooks
├── types/
│   └── board.ts                # TypeScript 타입 정의
└── middleware.ts               # 라우트 보호 미들웨어
```

## 주요 페이지

### 1. 메인 페이지 (`/`)

- 로그인 페이지 컴포넌트를 직접 렌더링
- 자동으로 로그인 화면으로 이동

### 2. 로그인 페이지 (`/login`)

- **기능**: 사용자 인증
- **UI**: 그라데이션 배경의 모던한 로그인 폼
- **브랜딩**: "W" 로고와 "WaveBoard" 타이틀
- **유효성 검사**: 클라이언트 사이드 폼 검증
- **리다이렉트**: 로그인 성공 시 `/boards`로 이동

**주요 기능:**

- 아이디(이메일)/비밀번호 입력
- 로그인 상태 메시지 표시 (성공/실패)
- 회원가입 페이지 링크

### 3. 회원가입 페이지 (`/signup`)

- **기능**: 새 계정 생성
- **검증**: 아이디 4자 이상, 비밀번호 4자 이상
- **피드백**: 실시간 성공/에러 메시지
- **자동 리다이렉트**: 가입 성공 시 1.5초 후 로그인 페이지로 이동

### 4. 게시판 목록 페이지 (`/boards`)

- **인증 필요**: middleware.ts로 보호됨
- **서버 컴포넌트**: 쿠키 검증 후 리다이렉트 처리
- **기능**:
  - 전체 게시판 / 내 게시판 토글 (ToggleSwitch)
  - 새 게시판 생성 버튼 (+)
  - 프로필 메뉴 (User 아이콘, 드롭다운)
  - 게시판 카드 그리드 뷰 (반응형: sm:grid-cols-2)

**UI 구성:**

- 헤더: "보드" 제목 + 생성 버튼 + 토글 + 프로필 메뉴
- 카드 리스트: 제목, 설명, 상태 표시
- Private 게시판에는 Lock 아이콘 표시
- 빈 상태 메시지 (내글/전체 구분)

### 5. 게시판 생성 페이지 (`/boards/create`)

- **폼 필드**:
  - 제목 (필수, 최대 100자)
  - 내용 (선택, textarea 6줄)
  - 공개여부 (PUBLIC/PRIVATE 라디오 버튼)
- **액션**: 저장/취소 버튼
- **성공 시**: 생성된 게시판 상세 페이지로 이동

### 6. 게시판 상세보기 (`/boards/[id]`)

- **동적 라우팅**: useParams로 ID 추출
- **권한 확인**: 작성자인 경우 수정/삭제 메뉴 표시
- **UI 요소**:
  - 뒤로가기 링크
  - 상태 배지 (PUBLIC/PRIVATE)
  - 제목 + Private 시 Lock 아이콘
  - 작성자 정보
  - 본문 내용 (whitespace-pre-wrap)
  - 게시판 ID 표시
  - 더보기 메뉴 (MoreVertical 아이콘)

### 7. 게시판 수정 페이지 (`/boards/[id]/edit`)

- **React Query**: useBoardById로 데이터 로드
- **폼 상태**: useEffect로 초기값 설정
- **실시간 업데이트**: useUpdateBoard 뮤테이션
- **UI**: 인라인 폼 에디터
- **성공 시**: 상세 페이지로 리다이렉트

## 주요 컴포넌트

### BoardsList.tsx

```typescript
// 주요 기능
- 게시판 목록 표시 (useState로 상태 관리)
- 전체/내글 필터링 (useMemo로 엔드포인트 계산)
- 로딩/에러 상태 관리
- AbortController로 요청 취소 처리
- 프로필 드롭다운 메뉴 (menuOpen 상태)
- 로그아웃 기능 (쿠키 삭제)
```

### CreateBoardForm.tsx

```typescript
// 주요 기능
- 게시판 생성 폼 (title, description, status)
- BoardStatus 타입 가드 함수
- 제출 상태 관리 (submitting)
- 에러 처리 및 표시
- 성공시 상세 페이지 리다이렉트
- router.refresh() 호출
```

### ToggleSwitch.tsx

```typescript
// 주요 기능
- 전체/내글 토글 스위치
- 접근성 지원 (role="switch", aria-checked)
- 키보드 네비게이션 (Enter, Space)
- 애니메이션 효과 (translate-x-5)
- 시각적 상태 표시 (색상 변화)
```

## 상태 관리

### React Query 설정

- QueryProvider로 앱 전체 래핑 (layout.tsx)
- 클라이언트 컴포넌트에서 QueryClient 인스턴스 생성

### 캐시 키 구조

```typescript
['boards'][('board', id)]['me']; // 전체 게시판 목록 // 특정 게시판 // 현재 사용자 정보
```

### 주요 쿼리 훅

- `useBoards()`: 게시판 목록 조회
- `useBoardById(id)`: 특정 게시판 조회 (enabled: !!id)
- `useMe()`: 현재 사용자 정보 (retry: false)
- `useUpdateBoard()`: 게시판 수정 (optimistic update)

## 인증 시스템

### 1. 미들웨어 보호 (middleware.ts)

```typescript
// 기능
- /boards/* 경로만 보호 (matcher 설정)
- access_token 쿠키 확인
- 미인증시 /login으로 리다이렉트
- redirectTo 파라미터로 원래 경로 보존
```

### 2. 자동 토큰 갱신 (fetcher.ts)

```typescript
// 플로우
1. 요청 시 access_token 쿠키에서 토큰 추출
2. Authorization 헤더에 Bearer 토큰 설정
3. 401 응답시 /api/auth/refresh 호출
4. 새 토큰으로 원래 요청 재시도
5. refresh 실패시 로그인 페이지로 이동
```

### 3. 로그아웃 처리

```typescript
// BoardsList.tsx의 handleLogout
1. /api/auth/logout 서버 호출
2. 쿠키 삭제 (access_token, refresh_token)
3. router.replace('/login')로 리다이렉트
```

## 스타일링 시스템

### Tailwind CSS 설정

```css
// globals.css
- CSS 변수 정의 (--background, --foreground)
- 다크모드 지원 (@media prefers-color-scheme)
- 커스텀 폰트 설정 (--font-geist-sans, --font-geist-mono)
- 기본 h1 스타일 정의
```

### 디자인 토큰

- **색상 팔레트**: gray-900, sky-500, slate-100, indigo-400
- **그라데이션**: `from-slate-100 via-slate-200 to-slate-300`
- **그림자**: shadow-lg, ring-1 ring-slate-200
- **라운드**: rounded-lg, rounded-xl, rounded-2xl
- **간격**: space-y-6, gap-3, px-4 py-3

### 반응형 디자인

- **브레이크포인트**: sm:grid-cols-2, max-w-3xl
- **컨테이너**: mx-auto w-full로 중앙 정렬
- **패딩**: px-4 py-10으로 모바일 대응

## 에러 처리 패턴

### 클라이언트 사이드

```typescript
// 일반적인 패턴
- 로딩 상태: useState(true)로 초기화
- 에러 상태: useState<string | null>(null)
- try-catch로 에러 캐치
- AbortController로 요청 취소
- 401 에러시 자동 로그인 리다이렉트
```

### 사용자 피드백

- **성공 메시지**: 녹색 텍스트 (text-green-600)
- **에러 메시지**: 빨간 배경 (bg-red-50, text-red-700)
- **로딩 상태**: "저장 중..." 텍스트 + disabled 버튼
- **빈 상태**: "아직 보드가 없어요" 메시지

## 접근성 (Accessibility)

### 구현된 기능

- **시맨틱 HTML**: header, main, form, fieldset 사용
- **ARIA 속성**: aria-label, aria-checked, aria-busy 설정
- **키보드 네비게이션**: onKeyDown 이벤트로 Enter/Space 처리
- **포커스 관리**: focus-visible:ring-2로 포커스 표시
- **스크린 리더**: role="switch"로 토글 스위치 식별

### 색상 접근성

- **대비율**: 충분한 명도 차이 유지
- **상태 표시**: 색상뿐만 아니라 아이콘/텍스트로도 상태 표현
- **다크모드**: prefers-color-scheme으로 자동 감지

## 성능 최적화

### Next.js App Router 활용

```typescript
// 서버 컴포넌트
- 게시판 목록 페이지에서 쿠키 검증
- cookies() 함수로 서버에서 인증 확인
- redirect() 함수로 서버사이드 리다이렉트

// 클라이언트 컴포넌트
- 'use client' 지시어로 명시적 선언
- 상호작용이 필요한 컴포넌트만 클라이언트로 처리
```

### React Query 최적화

```typescript
// 캐시 전략
- 자동 캐시 무효화 (invalidateQueries)
- 백그라운드 refetch
- 중복 요청 제거
- 로딩 상태 공유

// 메모리 관리
- enabled 옵션으로 불필요한 요청 방지
- retry 설정으로 실패 요청 최적화
```

### 코드 분할

```typescript
// 컴포넌트 분리
- 페이지별 독립적인 컴포넌트
- 재사용 가능한 UI 컴포넌트 분리
- lib 폴더로 유틸리티 함수 분리
```

## 배포 및 환경설정

### 빌드 설정

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
npm run start
```

### 브라우저 지원

- **모던 브라우저**: Chrome, Firefox, Safari, Edge 최신 버전
- **모바일**: iOS Safari, Chrome Mobile 지원
- **기능**: ES2020+ 문법 사용 (optional chaining, nullish coalescing)

## 타입 안정성

### TypeScript 설정

```typescript
// 주요 타입 정의
type BoardStatus = 'PUBLIC' | 'PRIVATE';
interface Board {
  id: number;
  title: string;
  description?: string;
  status: BoardStatus;
}

// 타입 가드 함수
const isBoardStatus = (v: string): v is BoardStatus => v === 'PUBLIC' || v === 'PRIVATE';
```

### 런타임 안전성

- JSON.parse() 에러 처리
- Array.isArray() 검증
- 옵셔널 체이닝 (?.) 활용
- null/undefined 체크

## 국제화 (i18n)

### 현재 상태

- **언어**: 한국어 고정
- **로케일**: ko 설정 (html lang="ko")
- **텍스트**: 하드코딩된 한국어 문자열

### 확장 가능성

- Next.js i18n 라우팅 지원 준비
- 텍스트 상수 분리로 다국어 대응 가능
- 날짜/시간 포매팅 locale 설정 가능
