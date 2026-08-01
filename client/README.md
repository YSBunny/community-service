# 냐르륵 Frontend

고양이 감성의 커뮤니티 서비스 **냐르륵**의 React 프론트엔드입니다.  
Vanilla JavaScript로 구현한 기존 화면을 React의 컴포넌트와 상태 중심 구조로 마이그레이션했습니다.

## 주요 기능

- 이메일 기반 회원가입 및 로그인
- JWT Access Token을 이용한 인증
- 회원 정보 및 비밀번호 수정
- 게시글 목록·상세 조회, 작성, 수정, 삭제
- 댓글 조회, 작성, 수정, 삭제
- 작성자에게만 수정·삭제 UI 노출
- 프로필 이미지 및 게시글 이미지 업로드
- 인증 만료 시 로그인 화면으로 이동

## 기술 스택

| 구분 | 기술 |
| --- | --- |
| UI | React |
| 빌드 도구 | Vite |
| 라우팅 | React Router |
| 서버 통신 | Fetch API |
| 스타일 | CSS |
| 코드 품질 | ESLint |

## 프로젝트 구조

```text
src/
├── api/              # HTTP 요청과 도메인별 API 함수
├── assets/           # 이미지, 아이콘 등 정적 파일
├── components/       # 여러 페이지에서 재사용하는 컴포넌트
├── pages/            # 라우트 단위 페이지 컴포넌트
├── styles/           # 공통 및 페이지별 스타일
├── App.jsx           # 라우팅과 최상위 화면 구성
└── main.jsx          # React 애플리케이션 진입점
```

## 인증 및 데이터 흐름

1. 로그인 성공 응답에서 Access Token과 사용자 식별 정보를 받습니다.
2. 인증이 필요한 요청의 `Authorization` 헤더에 `Bearer {token}`을 추가합니다.
3. API 모듈이 응답 상태와 JSON 변환을 공통 처리합니다.
4. 페이지 컴포넌트가 API 결과를 상태에 저장하고 화면을 다시 렌더링합니다.
5. 토큰이 없거나 만료되어 `401 Unauthorized`가 반환되면 인증 정보를 제거하고 로그인 페이지로 이동합니다.

## 백엔드 연동 시 확인 사항

- 백엔드 CORS 허용 Origin에 프론트엔드 주소가 포함되어야 합니다.
- `Content-Type: application/json`은 JSON 요청에만 직접 지정합니다.
- 이미지가 포함된 요청은 `FormData`를 사용하며 브라우저가 multipart boundary를 설정하도록 `Content-Type`을 직접 지정하지 않습니다.
- 프론트엔드의 API 경로와 백엔드 Controller 경로가 일치해야 합니다.

## Git 커밋 대상

다음 파일은 저장소에 포함합니다.

- `package.json`, `package-lock.json`
- `vite.config.js`, `eslint.config.js`
- `index.html`
- `src/`, `public/`
- `.env.example`

`node_modules/`, `dist/`, 실제 비밀값이 들어간 `.env`는 포함하지 않습니다.
