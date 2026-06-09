# ApexCampus 🎓

> AI-Powered Learning Platform — Master AI engineering, MLOps, and generative AI through hands-on projects with AI mentor guidance.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, Tailwind CSS v4, shadcn/ui |
| Backend | NestJS, Prisma ORM |
| Database | PostgreSQL 16 |
| Cache | Redis |
| Auth | NextAuth v5 + NestJS Passport JWT |
| AI | Claude API (Anthropic) |
| Container | Docker Compose |

## Features

- **AI-Powered Courses** — Video + project-based learning
- **AI Mentor Chat** — Context-aware AI mentor per lesson
- **Progress Tracking** — Course completion, XP, achievements
- **Verified Certificates** — Blockchain-verified, shareable on LinkedIn
- **4 Course Categories** — AI Engineering, MLOps, GenAI, AI Agents

## Quick Start

```bash
# Start infrastructure
docker compose up -d

# Install dependencies
pnpm install

# Run database migrations
pnpm --filter backend exec prisma migrate dev

# Start dev servers (frontend :3000, backend :4000)
pnpm dev
```

## Project Structure

```
apexcampus/
├── apps/
│   ├── frontend/     # Next.js 15 App Router
│   │   ├── app/      # RSC pages + layouts
│   │   ├── components/ # shadcn/ui + custom
│   │   └── lib/      # API client, auth, utils
│   └── backend/      # NestJS
│       ├── src/
│       │   ├── modules/ # Auth, Courses, Mentor...
│       │   ├── common/  # Guards, interceptors
│       │   └── prisma/  # Schema + migrations
│       └── test/
├── packages/         # Shared types (future)
├── docker-compose.yml
└── turbo.json
```

## Environment Variables

See `.env.example` in each app directory.

## License

MIT
