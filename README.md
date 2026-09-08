# Portfolio Project

# Getting Started

## Development

1. Copy `.env.template` to `.env.local`
2. Replace environment variables in `.env.local`
3. Start the local stack

```bash
cp .env.template .env.local
make stack/up
```

To skip `db_admin`:

```bash
STACK_WITH_DB_ADMIN=0 make stack/up
```

## Environment Files and Stages

- Source of truth for deploy values: **Vercel Project Environment Variables**.
- Versioned templates: `.env.template`, `.env.production.template`, `.env.vercel.example`.
- Local-only files (ignored): `.env.local`, `.env.vercel`, `.env.production`.

For full stage alignment, see `docs/deployment/environment-stages.md`.

### Optional: Portless local URLs

If you want stable named localhost URLs instead of fixed ports:

```bash
npm install -g portless
npm run proxy:portless:https
npm run dev:portless
```

This project will run as `https://portfolio.localhost` when the proxy is active.

## Setup Admin DB

1. Grab database IP Address
2. Go to [DB Admin Page](`http://localhost:${DB_ADMIN_PORT}`) and sigin with `DB_ADMIN` credentials
3. Register a new server called `portfolio`
4. Set _Connection/Hostname/address_ with container DataBase IP Address

```bash
make grab-db-ip-address
```

5. Set _Connection/Username_ with `DB_USER` and _Connection/Password_ with `DB_PASSWORD`
6. Save

   > You should see the new `portfolio` server with a new `DB_NAME` database.

## About ORM Prisma commands

1. Run seeds to [create local database](http://localhost:3000/api/seed)

```
npx prisma init
npx prisma migrate dev
npx prisma generate
```

# Sources

- [How to create a docker-compose setup with PostgreSQL and pgAdmin4](https://www.youtube.com/watch?v=qECVC6t_2mU)
