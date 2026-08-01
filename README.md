# 냐르륵

**냐르륵**은 고양이 감성을 담은 커뮤니티 서비스입니다.  
기존 Vanilla JavaScript 프론트엔드를 React로 마이그레이션하고, Spring Boot REST API와 JWT 인증을 연동해 구현했습니다.

이 저장소는 프론트엔드와 백엔드를 함께 관리하는 통합 저장소입니다.

## 프로젝트 목표

- React 컴포넌트와 상태 기반 UI 설계 경험
- REST API를 기준으로 프론트엔드와 백엔드의 책임 분리
- Spring Security와 JWT 인증·인가 흐름 이해
- JPA 연관관계와 트랜잭션을 활용한 커뮤니티 도메인 구현
- 검증, 오류 처리, 파일 업로드 등 실제 서비스에 필요한 기본 품질 확보

## 주요 기능

| 영역 | 기능 |
| --- | --- |
| 인증 | 회원가입, 로그인, 로그아웃, JWT 인증 |
| 회원 | 회원 정보 조회·수정, 비밀번호 변경, 회원 탈퇴, 프로필 이미지 |
| 게시글 | 목록·상세 조회, 작성, 수정, 삭제, 이미지 업로드 |
| 댓글 | 목록 조회, 작성, 수정, 삭제 |
| 권한 | 게시글과 댓글 작성자만 수정·삭제 가능 |
| 공통 | 입력값 검증, 오류 처리, 인증 만료 처리 |

## 기술 스택

### Frontend

- React
- Vite
- React Router
- Fetch API
- CSS
- ESLint

### Backend

- Java 21
- Spring Boot
- Spring Web MVC
- Spring Security
- JWT
- Spring Data JPA
- H2
- Gradle

## 저장소 구조

```text
community-service/
├── client/                 # React 프론트엔드
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   └── styles/
│   ├── package.json
│   └── vite.config.js
├── server/                # Spring Boot 백엔드
│   ├── gradle/
│   ├── src/
│   │   ├── main/
│   │   └── test/
│   ├── build.gradle
│   ├── gradlew
│   └── settings.gradle
├── .gitignore
└── README.md
```

## 실행 방법

### 1. 저장소 복제

```bash
git clone <repository-url>
cd community-service
```

### 2. 백엔드 설정 및 실행

민감한 데이터베이스 정보와 JWT Secret은 Git에 포함하지 않는 로컬 설정 또는 환경 변수로 관리합니다.

```bash
cd server
export SPRING_PROFILES_ACTIVE=local
./gradlew bootRun
```

Windows에서는 `gradlew.bat bootRun`을 사용합니다. 기본 서버 주소는 `http://localhost:8080`입니다.

### 3. 프론트엔드 설정 및 실행

새 터미널에서 실행합니다.

```bash
cd client-react
npm install
npm run dev
```

`client-react/.env` 예시:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

기본 프론트엔드 주소는 일반적으로 `http://localhost:5173`입니다.

## 전체 요청 흐름

1. 사용자가 React 화면에서 기능을 실행합니다.
2. API 모듈이 Spring Boot 서버에 HTTP 요청을 보냅니다.
3. 인증이 필요한 요청에는 JWT Access Token을 포함합니다.
4. Controller가 요청을 받고 Service가 비즈니스 규칙과 권한을 검사합니다.
5. Repository가 데이터베이스와 통신합니다.
6. 응답 DTO가 JSON으로 반환되고 React 상태가 갱신됩니다.

## API 요약

| 도메인 | 기본 경로 | 기능 |
| --- | --- | --- |
| 인증 | `/api/auth` | 로그인, 로그아웃 |
| 회원 | `/api/users` | 가입, 조회, 수정, 탈퇴 |
| 게시글 | `/api/posts` | 목록, 상세, 작성, 수정, 삭제 |
| 댓글 | `/api/posts/{postId}/comments` | 목록, 작성, 수정, 삭제 |

자세한 요청·응답 형식은 백엔드 API 문서 또는 각 Controller와 DTO를 기준으로 확인합니다.

## 인증 및 권한 처리

- 로그인 성공 시 서버가 JWT Access Token을 발급합니다.
- 프론트엔드는 인증 요청에 `Authorization: Bearer {token}`을 추가합니다.
- 백엔드는 토큰 검증 후 인증 객체를 생성합니다.
- 게시글과 댓글의 수정·삭제 권한은 서버에서 인증 사용자와 작성자를 비교해 판단합니다.
- 프론트엔드의 버튼 숨김은 사용자 경험을 위한 처리이며 실제 보안은 백엔드가 담당합니다.
- Refresh Token을 사용하지 않으므로 Access Token이 만료되면 다시 로그인합니다.

## 환경 변수와 민감 정보

저장소에 커밋하지 않는 항목:

- 데이터베이스 사용자명과 비밀번호
- JWT Secret
- 운영 서버의 비공개 설정
- 로컬 `.env`
- 사용자가 업로드한 실제 파일

대신 키 이름과 예시값만 포함한 `.env.example` 또는 설정 예시 파일을 커밋합니다.

## 빌드 및 테스트

Frontend:

```bash
cd client-react
npm run lint
npm run build
```

Backend:

```bash
cd server
./gradlew test
./gradlew clean build
```
