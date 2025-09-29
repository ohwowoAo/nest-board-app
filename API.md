# WaveBoard API Documentation

---

## Base URL

```
/auth
/boards
```

---

## Auth API

### POST /auth/signup

- 회원가입
- Body:

```json
{
  "username": "user1",
  "password": "pass1234"
}
```

### POST /auth/signin

- 로그인, JWT 쿠키 발급

### POST /auth/refresh

- refreshToken으로 accessToken 재발급

### GET /auth/me

- 현재 로그인된 사용자 조회 (JWT 필요)

### POST /auth/logout

- 로그아웃 (쿠키 삭제)

---

## User Entity

- `id`, `username`, `password`
- OneToMany 관계: `User -> Board[]`

---

## Boards API

### GET /boards

- 전체 게시글 조회 (비회원은 불가)

### GET /boards/me

- 내가 쓴 게시글 목록 조회

### GET /boards/:id

- 게시글 ID로 조회

### POST /boards

- 게시글 생성
- Body:

```json
{
  "title": "제목",
  "description": "내용",
  "status": "PUBLIC" // 또는 "PRIVATE"
}
```

### PATCH /boards/:id

- 게시글 수정
- Body:

```json
{
  "title": "수정제목",
  "description": "수정내용",
  "status": "PRIVATE"
}
```

### DELETE /boards/:id

- 게시글 삭제

### PATCH /boards/:id/status

- 게시글 상태 변경
- Body:

```json
{
  "status": "PUBLIC"
}
```

---

## DTO 요약

### AuthCredentialDto

- `username`: string (4~20자)
- `password`: string (4~20자, 영문+숫자만)

### CreateBoardDto / UpdateBoardDto

- `title`: string
- `description`: string
- `status`: "PUBLIC" | "PRIVATE"

---

## 기술 스택

- NestJS, TypeORM, PostgreSQL
- Passport + JWT
- 쿠키 기반 인증 (HTTP-only)
- Bcrypt 비밀번호 해시
- 커스텀 데코레이터 및 파이프
