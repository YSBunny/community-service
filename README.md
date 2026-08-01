# KTB4_Selina_Week10
카카오테크 부트캠프 4기 풀스택 10주차 과제

## 프로젝트 구조
```
community-service/
├── client/                              # React 프론트엔드
│   ├── src/
│   │   ├── api/                         # 백엔드 API 요청 함수
│   │   ├── assets/
│   │   │   └── images/                  # 이미지 리소스
│   │   ├── components/                  # 공통 UI 컴포넌트
│   │   ├── pages/                       # 페이지 컴포넌트
│   │   ├── styles/                      # 페이지 및 공통 스타일
│   │   ├── utils/                       # 공통 유틸리티 함수
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example                     # 환경 변수 예시
│   ├── eslint.config.js                 # ESLint 설정
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js                   # Vite 설정
│
├── server/                              # Spring Boot 백엔드
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/io/github/ysbunny/community/
│   │   │   │   ├── auth/
│   │   │   │   │   ├── controller/     # 인증 API
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── request/
│   │   │   │   │   │   └── response/
│   │   │   │   │   └── service/        # 로그인 및 로그아웃 처리
│   │   │   │   ├── comment/
│   │   │   │   │   ├── controller/
│   │   │   │   │   ├── domain/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── request/
│   │   │   │   │   │   └── response/
│   │   │   │   │   ├── repository/
│   │   │   │   │   └── service/
│   │   │   │   ├── global/
│   │   │   │   │   ├── config/         # 공통 애플리케이션 설정
│   │   │   │   │   ├── file/           # 파일 저장 및 조회 처리
│   │   │   │   │   └── security/       # Spring Security 및 JWT
│   │   │   │   ├── post/
│   │   │   │   │   ├── controller/
│   │   │   │   │   ├── domain/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── request/
│   │   │   │   │   │   └── response/
│   │   │   │   │   ├── repository/
│   │   │   │   │   └── service/
│   │   │   │   ├── user/
│   │   │   │   │   ├── controller/
│   │   │   │   │   ├── domain/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── request/
│   │   │   │   │   │   └── response/
│   │   │   │   │   ├── repository/
│   │   │   │   │   └── service/
│   │   │   │   └── CommunityServiceApplication.java
│   │   │   └── resources/
│   │   │       ├── static/
│   │   │       ├── templates/
│   │   │       └── application.yaml
│   │   └── test/
│   │       └── java/io/github/ysbunny/community/
│   │           ├── auth/
│   │           │   └── service/
│   │           ├── user/
│   │           │   ├── domain/
│   │           │   └── service/
│   │           └── CommunityServiceApplicationTests.java
│   ├── gradle/
│   ├── .gitattributes
│   ├── build.gradle
│   ├── gradlew
│   ├── gradlew.bat
│   └── settings.gradle
│
├── .gitignore
└── README.md
```
