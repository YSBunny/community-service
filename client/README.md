# 냐르륵 Frontend

고양이 감성과 보라색을 메인 콘셉트로 한 커뮤니티 서비스 **냐르륵**의 React 프론트엔드입니다.

기존 Vanilla JavaScript 기반 화면을 React의 컴포넌트와 상태 중심 구조로 마이그레이션했으며, Spring Boot REST API와 JWT 인증을 연동했습니다. 운영 환경에서는 React 정적 파일을 Nginx가 제공하고 `/api/**`, `/uploads/**` 요청을 Spring Boot로 전달합니다.

> 배포 주소: `http://43.200.106.173`  
> 현재 배포는 도메인과 HTTPS 없이 HTTP 80 포트를 사용합니다.

## 프로젝트에서 담당한 부분

- Vanilla JavaScript 화면을 React 컴포넌트 구조로 마이그레이션
- React Router를 이용한 페이지 라우팅
- Fetch API 공통 요청 모듈과 도메인별 API 모듈 분리
- JWT Access Token 저장 및 인증 요청 처리
- 게시글·댓글·회원 기능의 상태 및 UI 처리
- 이미지 미리보기와 `multipart/form-data` 업로드 처리
- Nginx를 이용한 SPA 정적 파일 서빙과 API 리버스 프록시 구성
- 멀티스테이지 Dockerfile을 이용한 프론트엔드 이미지 경량화

## 주요 기능

| 영역 | 기능 |
| --- | --- |
| 인증 | 회원가입, 로그인, 로그아웃, 인증 만료 시 로그인 페이지 이동 |
| 회원 | 프로필 조회·수정, 비밀번호 변경, 회원 탈퇴, 프로필 이미지 |
| 게시글 | 목록·상세 조회, 작성, 수정, 삭제, 이미지 업로드 |
| 댓글 | 목록 조회, 작성, 수정, 삭제 |
| 권한 UI | 작성자에게만 게시글·댓글 수정 및 삭제 버튼 노출 |
| 검증 | 이메일·비밀번호·닉네임·제목·내용 입력값 검증 |

프론트엔드의 버튼 숨김과 라우트 검사는 사용자 경험을 위한 처리입니다. 실제 수정·삭제 권한은 백엔드가 인증 사용자와 작성자를 비교해 다시 검증합니다.

## 기술 스택

| 구분 | 기술 |
| --- | --- |
| UI | React |
| Build | Vite, npm |
| Routing | React Router |
| HTTP | Fetch API |
| Style | CSS |
| Quality | ESLint |
| Web Server | Nginx |
| Container | Docker, 멀티스테이지 빌드 |
| Infrastructure | AWS EC2, Elastic IP |

## 화면 구성

| 경로 | 화면 | 역할 |
| --- | --- | --- |
| `/login` | 로그인 | 이메일·비밀번호 로그인 |
| `/signup` | 회원가입 | 계정 및 프로필 이미지 등록 |
| `/posts` | 게시글 목록 | 게시글 카드 목록 조회 |
| `/posts/:postId` | 게시글 상세 | 게시글·댓글 조회 및 작성자 기능 제공 |
| `/posts/new` | 게시글 작성 | 제목·내용·이미지 등록 |
| `/posts/:postId/edit` | 게시글 수정 | 기존 게시글 조회 후 작성자만 수정 |
| `/profile/edit` | 프로필 수정 | 닉네임·프로필 이미지 변경 |
| `/password/edit` | 비밀번호 수정 | 비밀번호 변경 |

## 프로젝트 구조

```text
src/
├── api/              # 공통 HTTP 요청 및 도메인별 API 함수
├── assets/           # 로고, 이미지 등 정적 자원
├── components/       # Header, ProfileMenu, PostCard 등 공통 컴포넌트
├── pages/            # 라우트 단위 페이지 컴포넌트
├── styles/           # 공통 및 페이지별 CSS
├── App.jsx           # 최상위 컴포넌트와 라우팅
└── main.jsx          # React 애플리케이션 진입점
```

## 인증 및 데이터 흐름

1. 로그인 성공 응답에서 JWT Access Token과 사용자 식별 정보를 저장합니다.
2. 인증이 필요한 요청에 `Authorization: Bearer {token}` 헤더를 추가합니다.
3. 공통 요청 함수가 응답 상태와 JSON 변환을 처리합니다.
4. 페이지 컴포넌트가 API 결과를 State에 반영하고 화면을 다시 렌더링합니다.
5. 토큰이 없거나 만료되어 `401 Unauthorized`가 반환되면 인증 정보를 지우고 로그인 페이지로 이동합니다.

현재는 Refresh Token을 사용하지 않으므로 Access Token이 만료되면 다시 로그인해야 합니다.

## 로컬 실행

### 요구 환경

- Node.js 20 이상 권장
- npm
- `http://localhost:8080`에서 실행 중인 백엔드

### 환경 변수

프로젝트 루트에 `.env`를 생성합니다.

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### 실행 명령

```bash
npm install
npm run dev
```

Vite의 기본 개발 서버 주소는 일반적으로 `http://localhost:5173`입니다.

### 검사 및 운영 빌드

```bash
npm run lint
npm run build
npm run preview
```

## Docker 멀티스테이지 빌드

프론트엔드 Dockerfile은 두 단계로 구성했습니다.

1. **build stage**: Node 이미지에서 의존성을 설치하고 React 운영 빌드 생성
2. **runtime stage**: 생성된 `dist/`만 Nginx 이미지로 복사해 정적 파일 제공

이 구조는 Node.js와 소스 전체를 운영 이미지에 포함하지 않아 이미지 크기와 불필요한 실행 요소를 줄입니다.

```bash
docker build -t nyareureuk-frontend .
docker run --rm -p 80:80 nyareureuk-frontend
```

## Nginx 구성

Nginx는 하나의 외부 진입점으로 동작합니다.

| 요청 | 처리 대상 |
| --- | --- |
| `/` | React 정적 파일 제공 |
| React 라우트 | `index.html`로 fallback하여 새로고침 404 방지 |
| `/api/**` | Spring Boot `backend:8080`으로 프록시 |
| `/uploads/**` | Spring Boot `backend:8080`으로 프록시 |

Docker Compose 환경에서는 브라우저가 백엔드 컨테이너에 직접 접근하지 않고 Nginx에 같은 Origin으로 요청합니다. 이에 따라 운영 환경에서 프론트엔드가 별도의 `:8080` 주소를 알 필요가 없습니다.

## 배포

이 프로젝트에서 다음 두 가지 배포 방식을 실습했습니다.

### 1. EC2 직접 배포

- Vite로 생성한 `dist/`를 EC2에 배치
- EC2에 설치한 Nginx가 React 정적 파일 제공
- `/api/**`, `/uploads/**`를 EC2에서 실행 중인 Spring Boot로 전달
- 사용자는 `http://43.200.106.173`의 80 포트로 접속

### 2. Docker Compose 배포

- React를 Node build stage와 Nginx runtime stage로 빌드
- Nginx가 React 파일 제공 및 Spring Boot 컨테이너로 프록시
- Compose 내부 네트워크의 서비스명 `backend`로 API 서버 접근
- 외부에는 HTTP 80 포트만 공개
