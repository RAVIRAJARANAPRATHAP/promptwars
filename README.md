# ProjectSpark 🚀

**AI-powered platform that helps final-year students generate project ideas and build roadmaps.**

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
Copy `.env.local` and fill in your keys:

| Variable | Where to get it |
|---|---|
| `DATABASE_URL` | [Neon](https://neon.tech) — free serverless Postgres |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | [Clerk Dashboard](https://dashboard.clerk.com) |
| `CLERK_SECRET_KEY` | [Clerk Dashboard](https://dashboard.clerk.com) |
| `ANTHROPIC_API_KEY` | [Anthropic Console](https://console.anthropic.com) |

> **Demo mode**: Leave `NEXT_PUBLIC_DEMO_MODE=true` in `.env.local` to run with mock AI responses — no API key needed.

### 3. Set up the database
```bash
npx prisma generate
npx prisma db push
```

### 4. Run locally
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Architecture

```
src/
  app/
    page.tsx              → Landing page
    onboard/page.tsx      → Multi-step intake form
    ideas/[sessionId]/    → AI-generated idea cards
    plan/[planId]/        → Full project roadmap
    dashboard/page.tsx    → Saved sessions & plans
    api/
      generate-ideas/     → Claude idea generation
      generate-plan/      → Claude roadmap generation
      sessions/           → Session CRUD
      plans/              → Plan CRUD
      sync-user/          → Clerk → Postgres user sync
  components/
    Navbar.tsx
  lib/
    prisma.ts             → Prisma client singleton
    prompts.ts            → Claude system prompts
    mock-data.ts          → Demo mode mock responses
```

## AI Prompts

Two separate Claude calls for better output quality:
1. **Idea Generator** — 6 tailored project ideas in strict JSON
2. **Roadmap Generator** — full build plan with tech stack, timeline, features, pitfalls

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + Tailwind CSS
- **Auth**: Clerk
- **Database**: PostgreSQL via Prisma ORM
- **AI**: Anthropic Claude API
- **Hosting**: Vercel + Neon
