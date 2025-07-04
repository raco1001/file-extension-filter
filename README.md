# Extension Filter

Vercel 운영 환경에 최적화된 Next.js + Hono.js (+ Supabase)파일 확장자 필터링 시스템입니다.

## 프로젝트 구조

```
├── app/
│   ├── api/                    # 분산된 API Routes
│   │   ├── extensions/
│   │   │   ├── route.ts       # GET /api/extensions
│   │   │   ├── fixed/route.ts # PUT /api/extensions/fixed
│   │   │   └── custom/route.ts # POST/DELETE /api/extensions/custom
│   │   └── health/route.ts    # GET /api/health
│   ├── extensions/
│   │   ├── page.tsx           # Server Component (메인 페이지)
│   │   ├── components/        # 클라이언트 컴포넌트들
│   │   └── actions.ts         # Server Actions
│   └── layout.tsx             # 루트 레이아웃
├── lib/
│   ├── hono/
│   │   ├── factory.ts         # Hono 앱 팩토리
│   │   └── validators.ts      # 검증 로직
│   ├── api/
│   │   ├── client.ts          # API 클라이언트
│   │   └── server.ts          # 서버 타입 정의
│   └── db/
│       ├── queries.ts         # 데이터베이스 쿼리
│       └── schema.ts          # DB 스키마
├── middleware.ts              # Edge 미들웨어
└── vercel.json               # Vercel 배포 설정
```

## 기술 스택

- **Frontend**: Next.js 14 (App Router), React Server Components
- **Backend**: Hono.js (Edge-optimized), Drizzle ORM
- **Database**: PostgreSQL
- **Runtime**: Node.js (API Routes), Edge (Middleware)
- **Deployment**: Vercel

## 시작하기

### 1. 환경 설정

```bash

npm install

---

.env 파일 형식

NEXT_PUBLIC_SUPABASE_URL=Supabase URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=Supabase Anon Key
DATABASE_URL="Supabase PostgreSQL URL"

DIRECT_URL="Supabse PostgreSQL Direct URL"

```

### 2. 개발 서버 실행

```bash
npm run dev
```

### 3. 빌드 및 배포

```bash

npm run build

```

## API 엔드포인트

### Extensions Management

- `GET /api/extensions` - 모든 확장자 조회
- `PUT /api/extensions/fixed` - 고정 확장자 업데이트
- `POST /api/extensions/custom` - 커스텀 확장자 생성
- `DELETE /api/extensions/custom` - 커스텀 확장자 삭제

### Health Check

- `GET /api/health` - 서버 상태 확인
