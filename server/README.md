# 냐르륵 Backend

커뮤니티 서비스 **냐르륵**의 Spring Boot REST API 서버입니다.

회원·게시글·댓글·이미지 업로드 API를 제공하며, Spring Security와 JWT Access Token으로 인증·인가를 처리합니다. 로컬 개발에서는 H2를 사용하고, 배포 환경에서는 Spring Profile을 분리해 MySQL을 사용합니다.

> API 진입 주소: `http://43.200.106.173/api`  
> 운영 환경에서는 Nginx를 통해 접근하며 Spring Boot의 8080 포트는 외부에 직접 공개하지 않습니다.

## 프로젝트에서 담당한 부분

- REST API와 계층형 구조(Controller-Service-Repository) 설계
- Spring Security와 JWT 기반 인증·인가 구현
- 회원·게시글·댓글 도메인 및 JPA 연관관계 구현
- DTO와 Bean Validation을 이용한 요청 검증
- 프로필·게시글 이미지 업로드 및 정적 리소스 제공
- H2와 MySQL 환경을 Spring Profile로 분리
- Gradle 빌드와 JRE 실행 환경을 분리한 멀티스테이지 Dockerfile 작성
- Docker Compose에서 MySQL 연결, 환경 변수 주입, 영속 Volume 구성

## 주요 기능

| 영역 | 기능 |
| --- | --- |
| 인증 | 로그인, 로그아웃, JWT Access Token 발급 및 검증 |
| 회원 | 회원가입, 조회, 프로필 수정, 비밀번호 변경, 회원 탈퇴 |
| 게시글 | 목록·상세 조회, 작성, 수정, 삭제, 이미지 업로드 |
| 댓글 | 목록 조회, 작성, 수정, 삭제 |
| 권한 | 인증 사용자와 작성자를 비교해 수정·삭제 권한 검증 |
| 공통 | DTO 검증, 예외 응답, CORS, 업로드 파일 매핑 |

## 기술 스택

| 구분 | 기술 |
| --- | --- |
| Language | Java 21 |
| Framework | Spring Boot |
| Web | Spring Web MVC |
| Security | Spring Security, JWT |
| Persistence | Spring Data JPA |
| Database | H2(local), MySQL(prod) |
| Validation | Jakarta Bean Validation |
| Build | Gradle, Gradle Wrapper |
| Container | Docker, Docker Compose, 멀티스테이지 빌드 |
| Infrastructure | AWS EC2, Nginx, Elastic IP |

## 프로젝트 구조

```text
src/
├── main/
│   ├── java/.../community/
│   │   ├── auth/        # 로그인, JWT 인증 필터와 토큰 처리
│   │   ├── user/        # 회원 도메인
│   │   ├── post/        # 게시글 도메인
│   │   ├── comment/     # 댓글 도메인
│   │   ├── file/        # 이미지 저장 및 조회
│   │   └── config/      # Security, CORS, Web 설정
│   └── resources/
│       ├── application.yml
│       ├── application-local.yml
│       └── application-prod.yml
└── test/                # 단위 및 통합 테스트
```

## 주요 API

| 도메인 | Method | 경로 | 설명 |
| --- | --- | --- | --- |
| 인증 | POST | `/api/auth/login` | 로그인 및 Access Token 발급 |
| 인증 | POST | `/api/auth/logout` | 로그아웃 응답 처리 |
| 회원 | POST | `/api/users` | 회원가입 |
| 회원 | GET | `/api/users/{userId}` | 회원 조회 |
| 회원 | PATCH | `/api/users/{userId}` | 프로필 수정 |
| 회원 | DELETE | `/api/users/{userId}` | 회원 탈퇴 |
| 게시글 | GET | `/api/posts` | 게시글 목록 조회 |
| 게시글 | POST | `/api/posts` | 게시글 작성 |
| 게시글 | GET | `/api/posts/{postId}` | 게시글 상세 조회 |
| 게시글 | PATCH | `/api/posts/{postId}` | 게시글 수정 |
| 게시글 | DELETE | `/api/posts/{postId}` | 게시글 삭제 |
| 댓글 | GET | `/api/posts/{postId}/comments` | 댓글 목록 조회 |
| 댓글 | POST | `/api/posts/{postId}/comments` | 댓글 작성 |
| 댓글 | PATCH | `/api/posts/{postId}/comments/{commentId}` | 댓글 수정 |
| 댓글 | DELETE | `/api/posts/{postId}/comments/{commentId}` | 댓글 삭제 |

## 인증 및 인가 흐름

1. 사용자가 이메일과 비밀번호로 로그인을 요청합니다.
2. 서버가 비밀번호를 검증한 뒤 JWT Access Token을 발급합니다.
3. 클라이언트는 인증 요청에 `Authorization: Bearer {token}`을 포함합니다.
4. JWT 필터가 토큰을 검증하고 `SecurityContext`에 인증 객체를 저장합니다.
5. Spring Security URL 규칙과 서비스의 작성자 검증이 접근 가능 여부를 판단합니다.
6. 유효한 인증이 없으면 `401 Unauthorized`, 인증되었지만 권한이 부족하면 `403 Forbidden`을 반환합니다.

Refresh Token은 사용하지 않습니다. Access Token이 만료되면 사용자가 다시 로그인해야 합니다.

## 실행 환경 분리

| Profile | Database | 용도 |
| --- | --- | --- |
| `local` | H2 | 로컬 개발 및 기능 확인 |
| `prod` | MySQL | 배포 및 Docker Compose 환경 |

- `application.yml`: 공통 설정
- `application-local.yml`: H2 연결 설정
- `application-prod.yml`: 환경 변수 기반 MySQL·JWT·업로드 경로 설정

## 로컬 실행

### 요구 환경

- JDK 21
- 저장소에 포함된 Gradle Wrapper

### macOS/Linux

```bash
SPRING_PROFILES_ACTIVE=local ./gradlew bootRun
```

### Windows PowerShell

```powershell
$env:SPRING_PROFILES_ACTIVE="local"
./gradlew.bat bootRun
```

기본 API 주소는 `http://localhost:8080/api`이며, H2 Console 사용 여부와 경로는 실제 설정 파일을 기준으로 합니다.

### 테스트 및 빌드

```bash
./gradlew test
./gradlew clean build
```

빌드 결과는 `build/libs/`에 생성됩니다.

## 운영 환경 변수

Docker Compose 또는 EC2 운영 환경에서 다음 값을 주입합니다.

```env
SPRING_PROFILES_ACTIVE=prod
SPRING_DATASOURCE_URL=jdbc:mysql://db:3306/community_service
SPRING_DATASOURCE_USERNAME=<DB_USERNAME>
SPRING_DATASOURCE_PASSWORD=<DB_PASSWORD>
JWT_SECRET=<SUFFICIENTLY_LONG_RANDOM_SECRET>
FILE_UPLOAD_DIR=/app/uploads
```

## Docker 멀티스테이지 빌드

백엔드 Dockerfile은 다음 두 단계로 구성했습니다.

1. **build stage**: JDK/Gradle 환경에서 실행 가능한 JAR 생성
2. **runtime stage**: JRE 이미지에 JAR만 복사해 Spring Boot 실행

빌드 도구와 소스 전체를 최종 이미지에서 제외해 운영 이미지의 크기와 공격 표면을 줄입니다.

```bash
docker build -t nyareureuk-backend .
```

## Docker Compose 연동

| 항목 | 구성 |
| --- | --- |
| Backend service | `backend`, 내부 포트 8080 |
| Database service | `db`, MySQL 8.4, 내부 포트 3306 |
| DB volume | `mysql-data:/var/lib/mysql` |
| Upload volume | `upload-data:/app/uploads` |
| Spring profile | `prod` |

Spring Boot는 Compose 네트워크에서 호스트명이 아닌 서비스명 `db`로 MySQL에 연결합니다. 8080과 3306은 컨테이너 내부 통신에 사용하고 외부에는 직접 공개하지 않습니다.

## Nginx 연동

외부 요청은 Nginx의 HTTP 80 포트로만 들어옵니다.

- `/api/**` → Spring Boot `backend:8080`
- `/uploads/**` → Spring Boot `backend:8080`
- 그 외 요청 → React 정적 파일

이 구조는 API 서버와 DB를 인터넷에 직접 노출하지 않고, 프론트엔드와 API를 같은 Origin으로 제공합니다.

## 보안 및 운영 설정

- JWT Secret, DB 계정, 비밀번호를 저장소에 커밋하지 않습니다.
- 비밀번호는 단방향 해시로 저장합니다.
- 클라이언트가 전송한 사용자 ID만 신뢰하지 않고 인증 주체와 리소스 작성자를 비교합니다.
- 운영 CORS는 실제 프론트엔드 Origin만 허용합니다.
- 업로드 파일과 MySQL 데이터는 Named Volume으로 영속화합니다.
- EC2 보안 그룹은 서비스에 필요한 포트만 허용합니다. 현재 애플리케이션 진입 포트는 HTTP 80입니다.
