# 냐르륵 Backend

커뮤니티 서비스 **냐르륵**의 Spring Boot REST API 서버입니다.  
회원, 게시글, 댓글과 이미지 업로드 기능을 제공하며 Spring Security와 JWT로 인증·인가를 처리합니다.

## 주요 기능

- 회원가입, 로그인, 로그아웃
- JWT Access Token 발급 및 요청 인증
- 회원 정보 조회·수정, 비밀번호 변경, 회원 탈퇴
- 게시글 CRUD
- 댓글 CRUD
- 게시글·댓글 작성자 권한 검증
- 프로필 및 게시글 이미지 저장
- 요청 DTO 검증과 HTTP 상태 코드 기반 오류 응답

## 기술 스택

| 구분 | 기술 |
| --- | -- |
| Language | Java 21 |
| Framework | Spring Boot |
| Web | Spring Web MVC |
| Security | Spring Security, JWT |
| Persistence | Spring Data JPA |
| Database | H2 |
| Validation | Jakarta Bean Validation |
| Build | Gradle |

## 프로젝트 구조

```text
src/
├── main/
│   ├── java/.../community/
│   │   ├── auth/        # 로그인, JWT 인증
│   │   ├── user/        # 회원 도메인
│   │   ├── post/        # 게시글 도메인
│   │   ├── comment/     # 댓글 도메인
│   │   ├── file/        # 이미지 파일 처리
│   │   └── config/      # Security, CORS, Web 설정
│   └── resources/       # application 설정과 정적 리소스
└── test/                # 단위 및 통합 테스트
```

## 주요 API

| 도메인 | Method | 경로 | 설명 |
| --- | --- | --- | --- |
| 인증 | POST | `/api/auth/login` | 로그인 및 토큰 발급 |
| 인증 | POST | `/api/auth/logout` | 로그아웃 응답 처리 |
| 회원 | POST | `/api/users` | 회원가입 |
| 회원 | GET/PATCH/DELETE | `/api/users/{userId}` | 회원 조회·수정·탈퇴 |
| 게시글 | GET/POST | `/api/posts` | 목록 조회·작성 |
| 게시글 | GET/PATCH/DELETE | `/api/posts/{postId}` | 상세 조회·수정·삭제 |
| 댓글 | GET/POST | `/api/posts/{postId}/comments` | 댓글 목록·작성 |
| 댓글 | PATCH/DELETE | `/api/posts/{postId}/comments/{commentId}` | 댓글 수정·삭제 |

## 인증 흐름

1. 사용자가 이메일과 비밀번호로 로그인을 요청합니다.
2. 서버가 자격 증명을 검증하고 Access Token을 발급합니다.
3. 클라이언트는 인증이 필요한 요청에 `Authorization: Bearer {token}`을 보냅니다.
4. JWT 필터가 토큰의 유효성을 검증하고 `SecurityContext`에 인증 정보를 저장합니다.
5. URL 규칙 또는 메서드 권한 검사가 요청 허용 여부를 판단합니다.
6. 인증 정보가 유효하지 않으면 `401`, 인증되었지만 권한이 부족하면 `403`을 반환합니다.

현재 구조는 Refresh Token을 사용하지 않으므로 Access Token이 만료되면 다시 로그인해야 합니다.

## 설정 및 보안 주의 사항

- JWT Secret, DB 비밀번호, 운영 서버 주소를 저장소에 커밋하지 않습니다.
- `application.yml`에는 공유 가능한 기본값만 둡니다.
- 업로드 파일은 저장소 밖의 영속 스토리지 사용을 검토합니다.
- CORS는 실제 프론트엔드 Origin만 허용합니다.
- 비밀번호는 BCrypt와 같은 단방향 해시로 저장합니다.
- 클라이언트가 보낸 사용자 ID만 믿지 않고 인증 주체와 리소스 작성자를 서버에서 비교합니다.

## Git 커밋 대상

다음 파일은 저장소에 포함합니다.

- `build.gradle`, `settings.gradle`
- `gradlew`, `gradlew.bat`
- `gradle/wrapper/gradle-wrapper.jar`
- `gradle/wrapper/gradle-wrapper.properties`
- `src/`
- `.env.example` 또는 민감값이 제거된 설정 예시

`.gradle/`, `build/`, `.idea/`, `uploads/`, 비밀 설정 파일은 포함하지 않습니다.
