# Atlas Textile — Wholesale Textile Sales Website

Full-stack B2B wholesale textile website with a multilingual storefront
(TR / EN / AR with RTL) and a JWT-protected admin panel.

## Stack

- **Client:** React + TypeScript + Vite, Tailwind CSS, React Router v6, i18next
- **Server:** Node.js + Express
- **Database:** Supabase (PostgreSQL) with Prisma ORM
- **Auth:** JWT (admin login)
- **Uploads:** Multer (product / banner images)

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
#    Edit .env and point DATABASE_URL at your Supabase database
#    (DIRECT_URL is used by Prisma migrations / db push)

# 3. Create the database schema + seed sample data
npm run db:setup        # runs `prisma db push` then the seed

# 4. Run both server (port 3001) and client (port 5173)
npm run dev
```

Open http://localhost:5173

Admin panel: http://localhost:5173/admin

| Email | Password |
| ----- | -------- |
| `admin@site.com` | `admin123` |

## Useful commands

- `npm run dev` — start server + client concurrently
- `npm run migrate` — `prisma migrate dev`
- `npm run seed` — seed categories, products, banners, pages, admin user
- `npm run build` — typecheck + production build of the client
- `npm run validate` — validate Prisma schema + TypeScript check

## Structure

```
textile-wholesale/
├── client/          # React frontend
│   └── src/
│       ├── components/   # Navbar, Footer, cards, icons
│       ├── pages/        # Public pages
│       ├── admin/        # Admin panel pages
│       └── locales/      # i18n dictionaries (tr/en/ar)
├── server/          # Express backend (routes, auth, uploads)
├── prisma/          # schema.prisma + seed.js
└── .env             # DATABASE_URL, DIRECT_URL, JWT_SECRET, PORT
```

## Notes

- Public uploads are served from `server/uploads` at `/uploads`.
- The seed writes placeholder SVGs that ship with the repo so the site is
  fully visual out of the box — replace them with real photography.
