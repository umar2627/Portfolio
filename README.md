# Portfolio Website

A modern full-stack developer portfolio built with Next.js 14, TypeScript, Tailwind CSS, and Supabase.

## Quick Database Setup (one command)

**1. Add your database credentials to `.env.local`:**

```bash
SUPABASE_DB_PASSWORD=your_database_password
SUPABASE_DB_REGION=ap-southeast-2   # optional — auto-detected if omitted
```

Find the password at: **Supabase → Project Settings → Database → Database password**

> **Note:** Do not duplicate `SUPABASE_DB_PASSWORD` in the file. An empty second entry will override the real one.

**2. Run the setup command:**

```bash
npm run db:setup
```

This single command will:
- Create all tables (education, experience, projects, reviews, contact, admin_users, etc.)
- Set up RLS policies and storage buckets
- Seed sample portfolio data
- Seed your admin login credentials from `ADMIN_EMAIL` / `ADMIN_PASSWORD`

**3. Start the app:**

```bash
npm run dev
```

- Portfolio: http://localhost:3000
- Admin login: http://localhost:3000/admin/login

---

## Environment Variables

```bash
# Supabase (from Project Settings → API)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_BUCKET_NAME=portfolio-images

# Database password (from Project Settings → Database)
SUPABASE_DB_PASSWORD=

# NextAuth JWT — generate: openssl rand -base64 32
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000

# Admin login (seeded by npm run db:setup)
ADMIN_EMAIL=admin@portfolio.com
ADMIN_PASSWORD=YourSecurePassword
ADMIN_NAME=Admin

# Gmail SMTP (use App Password, not regular password)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your_gmail_app_password
CONTACT_EMAIL=your@gmail.com
```

---

## Available DB Commands

| Command | What it does |
|---------|-------------|
| `npm run db:setup` | **Create all tables + seed data + seed admin** (use this) |
| `npm run db:migrate` | Create tables only (no seed data) |
| `npm run seed:admin` | Update admin password only (requires tables to exist) |

---

## Features

- Dynamic content from Supabase (education, experience, projects, reviews)
- Dark / light theme toggle
- Admin dashboard with email/password login (JWT)
- Profile image, name, bio management from dashboard
- Contact form with Gmail SMTP notifications
- Reviews with admin approval workflow

## Admin Dashboard

Login at `/admin/login` with credentials from `.env.local`.

| Section | Features |
|---------|----------|
| Dashboard | Profile image, name, title, bio |
| Education | CRUD + drag-reorder |
| Experience | CRUD + tech stack tags |
| Projects | CRUD + image upload |
| Reviews | Approve/reject |
| Messages | Read contact submissions |

## License

MIT
