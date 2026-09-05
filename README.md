# ProjectSpark 🚀

**AI-powered platform that helps final-year students generate project ideas and build roadmaps.**

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
Copy `.env.local.example` (or create `.env.local`) and fill in your keys:

| Variable | Where to get it |
|---|---|
| `DATABASE_URL` | [Neon](https://neon.tech) — free serverless Postgres |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | [Firebase Console](https://console.firebase.google.com) → Project Settings → Your apps |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Console → Project Settings |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Console → Project Settings |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase Console → Project Settings |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase Console → Project Settings |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase Console → Project Settings |
| `FIREBASE_SERVICE_ACCOUNT_KEY` | Firebase Console → Project Settings → Service Accounts → Generate new private key |
| `GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com) — free tier |

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

### 5. Deploying

On Vercel, add every variable above under **Environment Variables** before deploying. After the first deploy, add your Vercel domain (e.g. `yourapp.vercel.app`) to **Firebase Console → Authentication → Settings → Authorized domains**, or sign-in will fail.

---

## Architecture