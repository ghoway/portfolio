# Portfolio CMS (Open Source)

A full-stack portfolio starter built with Next.js App Router, Prisma, NextAuth credentials auth, and a built-in admin CMS.

This project is designed to be forked and customized for personal or client portfolios.

## Highlights

- Public portfolio pages (hero, about, projects, blog)
- Admin dashboard for content management
- Settings for site metadata, social links, email forwarding, and AI model
- User security settings (change password)
- Blog editor with markdown + AI helper flow
- Image upload support for admin content
- Reorder support for selected list-based content

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Prisma ORM
- PostgreSQL
- NextAuth v5 (credentials provider)

## Quick Start

### 1. Clone

```bash
git clone https://github.com/your-username/portfolio.git
cd portfolio
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Copy and edit the example env file:

```bash
cp .env.example .env
```

Required variables:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/portfolio"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="replace-with-a-long-random-string"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
OPENROUTER_API_KEY=""
```

Notes:

- `OPENROUTER_API_KEY` is optional unless you use AI features.
- Generate a secure `NEXTAUTH_SECRET` for any non-local environment.

### 4. Prepare database

```bash
pnpm db:push
pnpm db:seed
```

### 5. Run development server

```bash
pnpm dev
```

Open:

- Public app: `http://localhost:3000`
- Admin panel: `http://localhost:3000/admin`

## Seed Data

Seeder uses neutral placeholder data (John Doe, lorem ipsum, sample projects/posts).

Default seeded admin credentials:

- Email: `admin@example.com`
- Password: `change-me-123`

Override seed admin values with env vars if needed:

```env
SEED_ADMIN_NAME="John Doe"
SEED_ADMIN_EMAIL="admin@example.com"
SEED_ADMIN_PASSWORD="change-me-123"
```

## Available Scripts

- `pnpm dev` - start development server
- `pnpm build` - production build
- `pnpm start` - run production build
- `pnpm lint` - run ESLint
- `pnpm db:push` - push Prisma schema
- `pnpm db:seed` - run seed script
- `pnpm db:studio` - open Prisma Studio

## Project Structure

```text
app/
  admin/                 # Admin pages and admin layout
  api/                   # Route handlers
  blog/                  # Public blog routes
  projects/              # Public project routes
actions/                 # Server actions
components/              # Shared UI and feature components
lib/                     # Auth, Prisma, utilities
prisma/
  schema.prisma          # Database models
  seed.ts                # Seed script (generic sample data)
public/                  # Static assets/uploads
```

## Security Notes

- Change admin password immediately in non-demo deployments.
- Never commit `.env` files or production credentials.
- Use strong, unique secrets in production.
- Restrict file upload access and validate allowed formats in production hardening.

## Deploying

1. Set production env vars (`DATABASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, optional `OPENROUTER_API_KEY`).
2. Run database migrations or schema sync.
3. Build and start:

```bash
pnpm build
pnpm start
```

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes with clear messages
4. Open a pull request with context and screenshots (if UI changes)

## License

This project uses a custom non-commercial license.

- You may use, modify, and contribute to this project.
- You may not sell this project, or paid derivatives/templates based on it.

See [LICENSE](/LICENSE) for full terms.
